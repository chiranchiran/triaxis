package com.chiran.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.chiran.dto.ResourceDTO;
import com.chiran.dto.ResourceSearchDTO;
import com.chiran.entity.ResourceSoftware;
import com.chiran.entity.Resource;
import com.chiran.entity.User;
import com.chiran.exception.BusinessException;
import com.chiran.mapper.*;
import com.chiran.result.PageResult;
import com.chiran.service.ResourceSoftwareService;
import com.chiran.service.ResourceService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.chiran.vo.ResourceVO;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

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
    private ResourceSoftwareService resourceSoftwareService;

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
    public ResourceVO getResourceDetail(Integer id) {
        Resource resource = this.getById(id);
        if (resource == null || resource.getDeleted() == 1) {
            throw new BusinessException(14000,"资源不存在或已被删除");
        }

        // 增加查看次数
        this.lambdaUpdate()
                .set(Resource::getViewCount, resource.getViewCount() + 1)
                .eq(Resource::getId, id)
                .update();

        return convertToVO(resource);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Boolean addResource(ResourceDTO dto) {
        // 转换为Entity
        Resource resource = convertToEntity(dto);

        // 设置默认值
        resource.setDownloadCount(0);
        resource.setViewCount(0);
        resource.setAverageRating(BigDecimal.ZERO);
        resource.setDeleted(0);
        resource.setCreatedAt(new Date());
        resource.setUpdatedAt(new Date());

        // 保存资源
        boolean saved = this.save(resource);
        if (!saved) {
            return false;
        }

        // 保存关联的软件工具
        if (dto.getToolIds() != null && !dto.getToolIds().isEmpty()) {
            saveResourceSoftware(resource.getId(), dto.getToolIds());
        }

        return true;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Boolean updateResource(ResourceDTO dto) {
        if (dto.getId() == null) {
            throw new BusinessException(14000,"资源ID不能为空");
        }

        // 检查资源是否存在
        Resource existing = this.getById(dto.getId());
        if (existing == null || existing.getDeleted() == 1) {
            throw new BusinessException(14000,"资源不存在或已被删除");
        }

        // 转换为Entity
        Resource resource = convertToEntity(dto);
        resource.setUpdatedAt(new Date());

        // 更新资源
        boolean updated = this.updateById(resource);
        if (!updated) {
            return false;
        }

        // 更新关联的软件工具
        if (dto.getToolIds() != null) {
            // 删除原有关联
            resourceSoftwareService.lambdaUpdate()
                    .eq(ResourceSoftware::getResourceId, dto.getId())
                    .remove();

            // 保存新的关联
            if (!dto.getToolIds().isEmpty()) {
                saveResourceSoftware(dto.getId(), dto.getToolIds());
            }
        }

        return true;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Boolean removeResource(Integer id) {
        // 软删除
        return this.lambdaUpdate()
                .set(Resource::getDeleted, 1)
                .set(Resource::getUpdatedAt, new Date())
                .eq(Resource::getId, id)
                .eq(Resource::getDeleted, 0)
                .update();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Boolean removeResources(List<Integer> ids) {
        if (ids == null || ids.isEmpty()) {
            return true;
        }
        // 批量软删除
        return this.lambdaUpdate()
                .set(Resource::getDeleted, 1)
                .set(Resource::getUpdatedAt, new Date())
                .in(Resource::getId, ids)
                .eq(Resource::getDeleted, 0)
                .update();
    }

    /**
     * 保存资源与软件的关联关系
     */
    private void saveResourceSoftware(Integer resourceId, List<Integer> toolIds) {
        List<ResourceSoftware> relations = toolIds.stream()
                .map(toolId -> {
                    ResourceSoftware relation = new ResourceSoftware();
                    relation.setResourceId(resourceId);
                    relation.setSoftwareId(toolId);
                    relation.setCreatedAt(new Date());
                    return relation;
                })
                .collect(Collectors.toList());

        resourceSoftwareService.saveBatch(relations);
    }

    /**
     * 转换为VO对象
     */
    private ResourceVO convertToVO(Resource resource) {
        ResourceVO vo = new ResourceVO();
        BeanUtils.copyProperties(resource, vo);

        // 查询关联的软件工具ID
        List<Integer> toolIds = resourceSoftwareService.lambdaQuery()
                .select(ResourceSoftware::getSoftwareId)
                .eq(ResourceSoftware::getResourceId, resource.getId())
                .list()
                .stream()
                .map(ResourceSoftware::getSoftwareId)
                .collect(Collectors.toList());
        vo.setToolIds(toolIds);

        return vo;
    }

    /**
     * DTO转换为Entity
     */
    private Resource convertToEntity(ResourceDTO dto) {
        Resource resource = new Resource();
        BeanUtils.copyProperties(dto, resource);
        return resource;
    }
}
