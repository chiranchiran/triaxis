package com.chiran.mapper;

import com.chiran.vo.CategoryVO;
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
public interface ResourceTypesMapper {
    List<CategoryVO> getSubjectLists();
    List<CategoryVO> getToolLists();
    List<CategoryVO> getRightLists();
    List<CategoryVO> getCategoryFirstLists();
    List<CategoryVO> getCategorySecondLists(Integer subjectId, Integer parentId);
}
