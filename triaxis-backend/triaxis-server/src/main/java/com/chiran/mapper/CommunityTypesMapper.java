package com.chiran.mapper;

import com.chiran.bo.CategoryBO;
import com.chiran.bo.PostCategoryBO;
import com.chiran.bo.ResourceCategoryBO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

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
public interface CommunityTypesMapper {
    List<CategoryBO> getTopicLists();

}
