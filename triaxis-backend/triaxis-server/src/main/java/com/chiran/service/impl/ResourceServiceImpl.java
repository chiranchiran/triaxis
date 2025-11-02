package com.chiran.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.chiran.bo.CategoryBO;
import com.chiran.bo.ResourceCategoryBO;
import com.chiran.bo.ResourceSearchBO;
import com.chiran.bo.UploadFileBO;
import com.chiran.dto.ResourceDTO;
import com.chiran.dto.ResourceSearchDTO;
import com.chiran.entity.*;
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
    private  UserTagService userTagService;
    @Autowired
    private TagMapper tagMapper;
    @Autowired
    private ResourceCategoryMapper resourceCategoryMapper;
    @Autowired
    private ResourcePathMapper resourcePathMapper;
    @Autowired
    private ResourceToolMapper resourceToolMapper;

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
        if (resource == null || resource.getDeleted() == 1) {
            throw ExceptionUtil.create(14001);
        }

        // 增加查看次数
        this.lambdaUpdate()
                .set(Resource::getViewCount, resource.getViewCount() + 1)
                .eq(Resource::getId, id)
                .update();

        ResourceSearchBO resourceSearchBO = new ResourceSearchBO();
        BeanUtils.copyProperties(resource, resourceSearchBO);
//查询相关的的缩略图
        LambdaQueryWrapper<ResourceImage> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.select(ResourceImage::getId, ResourceImage::getPath).eq(ResourceImage::getResourceId, id).orderByAsc(ResourceImage::getCreateTime);
        List<ResourceImage> list = resourceImageMapper.selectList(queryWrapper);
        List<CategoryBO> images = BeanUtil.copyList(list, CategoryBO::new);
        //查询分类信息

        ResourceCategoryBO resourceCategoryBO = resourceTypesService.selectAllCategories(id);
        resourceCategoryBO.setRight(resource.getRight());
        resourceCategoryBO.setSubject(resourceTypesService.getSubjectName(resource.getSubjectId()));
        resourceCategoryBO.setTools(resourceTypesService.getTools(resource.getId()));

        ResourceVO resourceVO = ResourceVO.builder()
                .resourceDetail(resourceSearchBO)
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
        //修改文件大小
        Long size =0L;
        for(UploadFileBO uploadFileBO:dto.getFiles()){
            size+=uploadFileBO.getSize();
        }
        dto.setSize(size);
        Resource resource = new Resource();
        BeanUtils.copyProperties(dto, resource);
        this.save(resource);
        Integer resourceId = resource.getId();
        //插入tag标签分类和关系
        for (String s:dto.getTags()){
            Tag tag = new Tag();
            tag.setName(s);
            tag.setCreateBy(dto.getUserId());
            tagMapper.insert(tag);
            Integer tagId = tag.getId();
            UserTag userTag = new UserTag();
            userTag.setTagId(tagId);
            userTag.setUserId(dto.getUserId());
            userTag.setTargetType(1);
            userTag.setTargetId(resourceId);
            userTagService.save(userTag);
        }
        //插入资源和分类的关系
        for(Integer id:dto.getCategoryIds()){
            ResourceCategory resourceCategory = new ResourceCategory();
            resourceCategory.setCategoryId(id);
            resourceCategory.setResourceId(resourceId);
            resourceCategoryMapper.insert(resourceCategory);
        }
        //插入文件路径的关系
        for (UploadFileBO uploadFileBO:dto.getFiles()){
            ResourcePath resourcePath = new ResourcePath();
            resourcePath.setResourceId(resourceId);
            resourcePath.setSize(uploadFileBO.getSize());
            resourcePath.setType(uploadFileBO.getType());
            resourcePath.setName(uploadFileBO.getName());
            resourcePath.setPath(uploadFileBO.getPath());
            resourcePathMapper.insert(resourcePath);
        }

        //插入文件预览图的关系
        for (UploadFileBO uploadFileBO:dto.getImages()){
            ResourceImage resourceImage = new ResourceImage();
            resourceImage.setResourceId(resourceId);
            resourceImage.setSize(uploadFileBO.getSize());
            resourceImage.setType(uploadFileBO.getType());
            resourceImage.setName(uploadFileBO.getName());
            resourceImage.setPath(uploadFileBO.getPath());
            resourceImageMapper.insert(resourceImage);
        }
        //插入资源和工具的关系
        for (Integer id:dto.getToolIds()){
            ResourceTool resourceTool = new ResourceTool();
            resourceTool.setResourceId(resourceId);
            resourceTool.setToolId(id);
            resourceToolMapper.insert(resourceTool);
        }
        return true;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Boolean updateResource(ResourceDTO dto) {
//        if (dto.getId() == null) {
//            throw new BusinessException(14000, "资源ID不能为空");
//        }
//
//        // 检查资源是否存在
//        Resource existing = this.getById(dto.getId());
//        if (existing == null || existing.getDeleted() == 1) {
//            throw new BusinessException(14000, "资源不存在或已被删除");
//        }
//
//        // 转换为Entity
//        Resource resource = convertToEntity(dto);
//        resource.setUpdatedAt(new Date());
//
//        // 更新资源
//        boolean updated = this.updateById(resource);
//        if (!updated) {
//            return false;
//        }
//
//        // 更新关联的软件工具
//        if (dto.getToolIds() != null) {
//            // 删除原有关联
//            resourceToolService.lambdaUpdate()
//                    .eq(ResourceTool::getResourceId, dto.getId())
//                    .remove();
//
//            // 保存新的关联
//            if (!dto.getToolIds().isEmpty()) {
//                saveResourceSoftware(dto.getId(), dto.getToolIds());
//            }
//        }

        return true;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Boolean removeResource(Integer id, Integer userId) {
        return false;
    }

    @Override
    public Boolean removeResources(List<Integer> ids, Integer userId) {
        return null;
    }
    // 软删除
//        return this.lambdaUpdate()
//                .set(Resource::getDeleted, 1)
//                .set(Resource::getUpdatedAt, new Date())
//                .eq(Resource::getId, id)
//                .eq(Resource::getDeleted, 0)
//                .update();
//    }
//
//    @Override
//    @Transactional(rollbackFor = Exception.class)
//    public Boolean removeResources(List<Integer> ids) {
//        if (ids == null || ids.isEmpty()) {
//            return true;
//        }
//        // 批量软删除
//        return this.lambdaUpdate()
//                .set(Resource::getDeleted, 1)
//                .set(Resource::getUpdatedAt, new Date())
//                .in(Resource::getId, ids)
//                .eq(Resource::getDeleted, 0)
//                .update();
//    }
//    }
//    /**
//     * 保存资源与软件的关联关系
//     */
//    private void saveResourceSoftware(Integer resourceId, List<Integer> toolIds) {
//        List<ResourceTool> relations = toolIds.stream()
//                .map(toolId -> {
//                    ResourceTool relation = new ResourceTool();
//                    relation.setResourceId(resourceId);
//                    relation.setSoftwareId(toolId);
//                    relation.setCreatedAt(new Date());
//                    return relation;
//                })
//                .collect(Collectors.toList());
//
//        resourceToolService.saveBatch(relations);
//    }
//
//    /**
//     * 转换为VO对象
//     */
//    private ResourceVO convertToVO(Resource resource) {
//        ResourceVO vo = new ResourceVO();
//        BeanUtils.copyProperties(resource, vo);
//
//        // 查询关联的软件工具ID
//        List<Integer> toolIds = resourceToolService.lambdaQuery()
//                .select(ResourceTool::getSoftwareId)
//                .eq(ResourceTool::getResourceId, resource.getId())
//                .list()
//                .stream()
//                .map(ResourceTool::getSoftwareId)
//                .collect(Collectors.toList());
//        vo.setToolIds(toolIds);
//
//        return vo;
//    }
//
//    /**
//     * DTO转换为Entity
//     */
//    private Resource convertToEntity(ResourceDTO dto) {
//        Resource resource = new Resource();
//        BeanUtils.copyProperties(dto, resource);
//        return resource;
//    }
}
