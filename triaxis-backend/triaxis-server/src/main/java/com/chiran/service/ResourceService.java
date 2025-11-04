package com.chiran.service;

import com.chiran.dto.ResourceDTO;
import com.chiran.dto.ResourceSearchDTO;
import com.chiran.entity.Resource;
import com.baomidou.mybatisplus.extension.service.IService;
import com.chiran.result.PageResult;
import com.chiran.vo.ResourceSearchVO;
import com.chiran.vo.ResourceVO;

import java.util.List;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author chiran
 * @since 2025-10-07
 */
public interface ResourceService extends IService<Resource> {

    PageResult<ResourceVO> getResources(ResourceSearchDTO resourceSearchDTO);
    /**
     * 根据ID获取资源详情
     */
    ResourceVO getResourceDetail(Integer id,Integer userId);

    /**
     * 新增资源
     */
    Boolean addResource(ResourceDTO dto);

    /**
     * 修改资源
     */
    Boolean updateResource(ResourceDTO dto);

    /**
     * 删除资源（软删除）
     */
    Boolean removeResource(Integer id,Integer userId,Integer role);

    /**
     * 批量删除资源
     */
    Boolean removeResources(List<Integer> ids,Integer userId,Integer role);

}
