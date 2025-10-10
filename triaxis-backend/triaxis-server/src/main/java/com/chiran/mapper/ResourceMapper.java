package com.chiran.mapper;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.chiran.dto.ResourceSearchDTO;
import com.chiran.entity.Resource;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.chiran.vo.ResourceVO;
import org.apache.ibatis.annotations.Mapper;

/**
 * <p>
 *  Mapper 接口
 * </p>
 *
 * @author chiran
 * @since 2025-10-07
 */
@Mapper
public interface ResourceMapper extends BaseMapper<Resource> {

    IPage<ResourceVO> searchResources(Page<ResourceVO> page, ResourceSearchDTO dto);
}
