package com.chiran.controller;

import com.chiran.dto.CourseReviewDTO;
import com.chiran.result.PageResult;
import com.chiran.result.Result;
import com.chiran.service.CourseReviewService;
import com.chiran.vo.CourseReviewVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * <p>
 *  前端控制器
 * </p>
 *
 * @author chiran
 * @since 2025-10-07
 */
@RestController
@RequestMapping("/api/courses/{courseId}/reviews")
public class CourseReviewController {
    @Autowired
    CourseReviewService courseReviewService;

    /**
     * 获取课程评价列表
     */
    @GetMapping
    public Result<PageResult<CourseReviewVO>> getReviews(
            @PathVariable Integer courseId,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        PageResult<CourseReviewVO> result = courseReviewService.getCourseReviews(courseId, page, pageSize);
        return Result.success(result);
    }

    /**
     * 添加课程评价
     */
    @PostMapping
    public Result<Boolean> addReview(
            @PathVariable Integer courseId,
            @RequestBody CourseReviewDTO dto,
            @RequestParam Integer userId) {
        dto.setCourseId(courseId);
        Boolean success = courseReviewService.addReview(dto, userId);
        return Result.success(success);
    }

    /**
     * 删除评价
     */
    @DeleteMapping("/{reviewId}")
    public Result<Boolean> removeReview(
            @PathVariable Integer courseId,
            @PathVariable Long reviewId,
            @RequestParam Integer userId) {
        Boolean success = courseReviewService.removeReview(reviewId, userId);
        return Result.success(success);
    }

    /**
     * 点赞/取消点赞评价
     */
    @PostMapping("/{reviewId}/like")
    public Result<Boolean> likeReview(
            @PathVariable Integer courseId,
            @PathVariable Long reviewId,
            @RequestParam Integer userId) {
        Boolean success = courseReviewService.toggleLikeReview(reviewId, userId);
        return Result.success(success);
    }
}
