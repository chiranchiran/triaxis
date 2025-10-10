package com.chiran.mapper;

import com.chiran.dto.CourseReviewDTO;
import com.chiran.entity.CourseReview;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.chiran.result.PageResult;
import com.chiran.vo.CourseReviewVO;
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
public interface CourseReviewMapper extends BaseMapper<CourseReview> {

}
