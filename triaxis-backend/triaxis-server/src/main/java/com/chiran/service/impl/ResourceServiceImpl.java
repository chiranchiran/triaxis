package com.chiran.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.chiran.bo.CategoryBO;
import com.chiran.bo.ResourceCategoryBO;
import com.chiran.bo.ResourceSearchBO;
import com.chiran.bo.UploadFileBO;
import com.chiran.dto.ResourceDTO;
import com.chiran.dto.ResourceSearchDTO;
import com.chiran.entity.*;
import com.chiran.exception.BusinessException;
import com.chiran.mapper.*;
import com.chiran.result.PageResult;
import com.chiran.service.*;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.chiran.utils.BeanUtil;
import com.chiran.utils.ExceptionUtil;
import com.chiran.vo.ResourceVO;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * <p>
 * 服务实现类
 * </p>
 *
 * @author chiran
 * @since 2025-10-07
 */
@Service
public class ResourceServiceImpl extends ServiceImpl<ResourceMapper, Resource> implements ResourceService {
    @Autowired
    private ResourceMapper resourceMapper;
    @Autowired
    private ResourceTypesService resourceTypesService;
    @Autowired
    private UserActionService userActionService;
    @Autowired
    private UserService userService;
    @Autowired
    private ResourceImageMapper resourceImageMapper;
    @Autowired
    private UserTagService userTagService;
    @Autowired
    private TagMapper tagMapper;
    @Autowired
    private ResourceCategoryService resourceCategoryService;
    @Autowired
    private ResourcePathService resourcePathService;
    @Autowired
    private ResourceImageService resourceImageService;
    @Autowired
    private ResourceToolService resourceToolService;

    @Override
    public PageResult<ResourceVO> getResources(ResourceSearchDTO dto) {
        if (dto.getPage() == null || dto.getPage() <= 0) {
            dto.setPage(1);
        }
        if (dto.getPageSize() == null || dto.getPageSize() <= 0) {
            dto.setPageSize(10);
        }

        // 创建分页对象
        Page<ResourceVO> page = new Page<>(dto.getPage(), dto.getPageSize());

        // 执行查询
        IPage<ResourceVO> result = resourceMapper.searchResources(page, dto);

        // 转换为自定义分页结果
        return new PageResult<>(result.getTotal(), result.getRecords());
    }

    @Override
    public ResourceVO getResourceDetail(Integer id, Integer userId) {
        Resource resource = this.getById(id);
        if (resource == null) {
            throw ExceptionUtil.create(14001);
        }

        // 增加查看次数
        this.lambdaUpdate()
                .set(Resource::getViewCount, resource.getViewCount() + 1)
                .eq(Resource::getId, id)
                .update();

        ResourceSearchBO resourceSearchBO = new ResourceSearchBO();
        BeanUtils.copyProperties(resource, resourceSearchBO);
        // 查询相关的的缩略图
        LambdaQueryWrapper<ResourceImage> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.select(ResourceImage::getId, ResourceImage::getPath).eq(ResourceImage::getResourceId, id).orderByAsc(ResourceImage::getCreateTime);
        List<ResourceImage> list = resourceImageMapper.selectList(queryWrapper);
        List<CategoryBO> images = BeanUtil.copyList(list, CategoryBO::new);
        // 查询分类信息

        ResourceCategoryBO resourceCategoryBO = resourceTypesService.selectAllCategories(id);
        resourceCategoryBO.setRight(resource.getRight());
        resourceCategoryBO.setSubject(resourceTypesService.getSubjectName(resource.getSubjectId()));
        resourceCategoryBO.setTools(resourceTypesService.getTools(resource.getId()));

        ResourceVO resourceVO = ResourceVO.builder()
                .detail(resourceSearchBO)
                .uploader(userService.selectUploader(resource.getUserId()))
                .userActions(userActionService.checkAllAction(userId, id, 1))
                .images(images)
                .tags(userTagService.selectTags(id, 1))
                .category(resourceCategoryBO)
                .build();


        return resourceVO;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Boolean addResource(ResourceDTO dto) {
        // 修改文件大小
        getSize(dto);
        Resource resource = new Resource();
        BeanUtils.copyProperties(dto, resource);
        resource.setId(null);
        this.save(resource);
        Integer resourceId = resource.getId();
        // 插入tag标签分类和关系
        addTags(dto, resourceId, 1);
        // 插入资源和分类的关系
        addCategories(dto, resourceId);
        // 插入文件路径的关系
        addPaths(dto, resourceId);
        // 插入文件预览图的关系
        addImages(dto, resourceId);
        // 插入资源和工具的关系
        addTools(dto, resourceId);
        return true;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Boolean updateResource(ResourceDTO dto) {
        Integer resourceId = dto.getId();
        // 检查权限和资源存在
        check(resourceId, dto.getUserId(), dto.getRole());
        // 检查文件变化
        dto.setSize(null);
        if (dto.getFiles() != null) {
            getSize(dto);
        }
        Resource resource = new Resource();
        BeanUtils.copyProperties(dto, resource);
        // 更新资源
        this.updateById(resource);
        // 更新关联的tag
        if (dto.getTags() != null) {
            // 删除旧的关联
            userTagService.lambdaUpdate()
                    .eq(UserTag::getTagId, resourceId)
                    .eq(UserTag::getTargetType, 1)
                    .remove();
            if (!dto.getTags().isEmpty()) {
                // 插入tag标签分类和关系
                addTags(dto, resourceId, 1);
            }
        }
        // 更新资源分类关系
        if (dto.getCategoryIds() != null) {
            // 删除旧的关联
            resourceCategoryService.lambdaUpdate()
                    .eq(ResourceCategory::getResourceId, resourceId)
                    .remove();
            if (!dto.getCategoryIds().isEmpty()) {
                // 插入资源和分类的关系
                addCategories(dto, resourceId);
            }
        }
        // 更新文件路径的关系
        if (dto.getFiles() != null) {
            // 删除旧的关联
            resourcePathService.lambdaUpdate()
                    .eq(ResourcePath::getResourceId, resourceId)
                    .remove();
            if (!dto.getCategoryIds().isEmpty()) {
                // 插入文件路径的关系
                addPaths(dto, resourceId);
            }
        }
        // 更新文件预览图的关系
        if (dto.getImages() != null) {
            resourceImageService.lambdaUpdate()
                    .eq(ResourceImage::getResourceId, resourceId)
                    .remove();
            if (!dto.getCategoryIds().isEmpty()) {
                // 插入文件预览图的关系
                addImages(dto, resourceId);
            }
        }
        // 更新资源和工具的关系
        if (dto.getToolIds() != null) {
            resourceToolService.lambdaUpdate()
                    .eq(ResourceTool::getResourceId, resourceId)
                    .remove();
            if (!dto.getCategoryIds().isEmpty()) {
                // 插入资源和工具的关系
                addTools(dto, resourceId);
            }
        }
        return true;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Boolean removeResource(Integer id, Integer userId, Integer role) {
        // 检查权限和资源存在
        check(id, userId, role);
        // 删除
        this.removeById(id);
        removeRelation(id);
        return true;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Boolean removeResources(List<Integer> ids, Integer userId, Integer role) {
        if (ids == null || ids.isEmpty()) {
            return true;
        }
        for (Integer id : ids) {
            check(id, userId, role);
            // 删除
            this.removeById(id);
            removeRelation(id);
        }
        return true;
    }

    private void addTags(ResourceDTO dto, Integer resourceId, Integer type) {
        List<UserTag> userTagList = new ArrayList();
        for (String s : dto.getTags()) {
            Tag tag = new Tag();
            tag.setName(s);
            tag.setCreateBy(dto.getUserId());
            tagMapper.insert(tag);
            Integer tagId = tag.getId();
            UserTag userTag = new UserTag();
            userTag.setTagId(tagId);
            userTag.setUserId(dto.getUserId());
            userTag.setTargetType(type);
            userTag.setTargetId(resourceId);
            userTagList.add(userTag);
        }
        userTagService.saveBatch(userTagList);
    }

    private void addCategories(ResourceDTO dto, Integer resourceId) {
        List<ResourceCategory> resourceCategoryList = new ArrayList();
        for (Integer id : dto.getCategoryIds()) {
            ResourceCategory resourceCategory = new ResourceCategory();
            resourceCategory.setCategoryId(id);
            resourceCategory.setResourceId(resourceId);
            resourceCategoryList.add(resourceCategory);
        }
        resourceCategoryService.saveBatch(resourceCategoryList);
    }

    private void addPaths(ResourceDTO dto, Integer resourceId) {
        List<ResourcePath> resourcePathList = new ArrayList();
        for (UploadFileBO uploadFileBO : dto.getFiles()) {
            ResourcePath resourcePath = new ResourcePath();
            resourcePath.setResourceId(resourceId);
            resourcePath.setSize(uploadFileBO.getSize());
            resourcePath.setType(uploadFileBO.getType());
            resourcePath.setName(uploadFileBO.getName());
            resourcePath.setPath(uploadFileBO.getPath());
            resourcePathList.add(resourcePath);
        }
        resourcePathService.saveBatch(resourcePathList);
    }

    private void addImages(ResourceDTO dto, Integer resourceId) {
        List<ResourceImage> resourceImageList = new ArrayList();
        for (UploadFileBO uploadFileBO : dto.getImages()) {
            ResourceImage resourceImage = new ResourceImage();
            resourceImage.setResourceId(resourceId);
            resourceImage.setSize(uploadFileBO.getSize());
            resourceImage.setType(uploadFileBO.getType());
            resourceImage.setName(uploadFileBO.getName());
            resourceImage.setPath(uploadFileBO.getPath());
            resourceImageList.add(resourceImage);
        }
        resourceImageService.saveBatch(resourceImageList);
    }

    private void addTools(ResourceDTO dto, Integer resourceId) {
        List<ResourceTool> resourceToolList = new ArrayList();
        for (Integer id : dto.getToolIds()) {
            ResourceTool resourceTool = new ResourceTool();
            resourceTool.setResourceId(resourceId);
            resourceTool.setToolId(id);
            resourceToolList.add(resourceTool);
        }
        resourceToolService.saveBatch(resourceToolList);
    }

    private void getSize(ResourceDTO dto) {
        Long size = 0L;
        for (UploadFileBO uploadFileBO : dto.getFiles()) {
            size += uploadFileBO.getSize();
        }
        dto.setSize(size);
    }

    private void check(Integer id, Integer userId, Integer role) {
        // id不能为空
        if (id == null) {
            throw ExceptionUtil.create(15000, "资源ID不能为空");
        }
        // 检查资源是否存在
        Resource exist = this.getById(id);
        if (exist == null || exist.getDeleted() == 1) {
            throw ExceptionUtil.create(15001, "资源不存在或已被删除");
        }
        // 校验权限
        if (exist.getUserId() != userId && role == 0) {
            throw ExceptionUtil.create(11002, "权限不足,无法删除");
        }
    }

    private void removeRelation(Integer id) {
        // 删除旧的关联
        userTagService.lambdaUpdate()
                .eq(UserTag::getTagId, id)
                .eq(UserTag::getTargetType, 1)
                .remove();

        // 删除旧的关联
        resourceCategoryService.lambdaUpdate()
                .eq(ResourceCategory::getResourceId, id)
                .remove();

        resourcePathService.lambdaUpdate()
                .eq(ResourcePath::getResourceId, id)
                .remove();

        resourceImageService.lambdaUpdate()
                .eq(ResourceImage::getResourceId, id)
                .remove();

        resourceToolService.lambdaUpdate()
                .eq(ResourceTool::getResourceId, id)
                .remove();
    }
}
