package com.chiran.service;

import com.chiran.dto.CourseReviewDTO;
import com.chiran.entity.CourseReview;
import com.baomidou.mybatisplus.extension.service.IService;
import com.chiran.result.PageResult;
import com.chiran.vo.CourseReviewVO;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author chiran
 * @since 2025-10-07
 */
public interface CourseReviewService extends IService<CourseReview> {
    /**
     * 获取课程评价列表
     */
    PageResult<CourseReviewVO> getCourseReviews(Integer courseId, Integer page, Integer pageSize);

    /**
     * 添加课程评价
     */
    Boolean addReview(CourseReviewDTO dto, Integer userId);

    /**
     * 删除评价
     */
    Boolean removeReview(Long reviewId, Integer userId);

    /**
     * 点赞/取消点赞评价
     */
    Boolean toggleLikeReview(Long reviewId, Integer userId);
}
