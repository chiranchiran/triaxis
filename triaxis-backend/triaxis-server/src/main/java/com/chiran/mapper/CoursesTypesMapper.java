package com.chiran.mapper;

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
public interface CoursesTypesMapper {
    List<CategoryBO> getCategoryLists();
}
