package com.chiran.mapper;

import com.chiran.entity.Tool;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.chiran.bo.CategoryBO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
 * <p>
 *  Mapper 接口
 * </p>
 *
 * @author chiran
 * @since 2025-10-07
 */
@Mapper
public interface ToolMapper extends BaseMapper<Tool> {

    List<CategoryBO> getLists();
}
