package com.chiran.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.chiran.dto.CourseReviewDTO;
import com.chiran.entity.Course;
import com.chiran.entity.CourseReview;
import com.chiran.exception.BusinessException;
import com.chiran.mapper.CourseReviewMapper;
import com.chiran.result.PageResult;
import com.chiran.service.CourseReviewService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.chiran.service.CourseService;
import com.chiran.vo.CourseReviewVO;
import lombok.RequiredArgsConstructor;
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
 *  服务实现类
 * </p>
 *
 * @author chiran
 * @since 2025-10-07
 */
@Service
@RequiredArgsConstructor
public class CourseReviewServiceImpl extends ServiceImpl<CourseReviewMapper, CourseReview> implements CourseReviewService {
@Autowired
    private CourseService courseService;
    @Override
    public PageResult<CourseReviewVO> getCourseReviews(Integer courseId, Integer page, Integer pageSize) {
        // 检查课程是否存在
        Course course = courseService.getById(courseId);
        if (course == null || course.getDeleted() == 1) {
            throw new BusinessException(14000, "课程不存在或已被删除");
        }

        // 设置分页参数
        if (page == null || page <= 0) page = 1;
        if (pageSize == null || pageSize <= 0) pageSize = 10;

        // 构建查询条件
        LambdaQueryWrapper<CourseReview> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(CourseReview::getCourseId, courseId);
        wrapper.eq(CourseReview::getIsApproved, true); // 只查询审核通过的评价
        wrapper.orderByDesc(CourseReview::getLikeCount, CourseReview::getCreatedAt);

        // 执行分页查询
        Page<CourseReview> pageObj = new Page<>(page, pageSize);
        Page<CourseReview> reviewPage = this.page(pageObj, wrapper);

        // 转换为VO
        List<CourseReviewVO> voList = reviewPage.getRecords().stream()
                .map(this::convertReviewToVO)
                .collect(Collectors.toList());

        return new PageResult(reviewPage.getTotal(), voList);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Boolean addReview(CourseReviewDTO dto, Integer userId) {
        // 检查课程是否存在
        Course course = courseService.getById(dto.getCourseId());
        if (course == null || course.getDeleted() == 1) {
            throw new BusinessException(14000, "课程不存在或已被删除");
        }

        // 检查是否已经评价过
        Long existingCount = this.lambdaQuery()
                .eq(CourseReview::getCourseId, dto.getCourseId())
                .eq(CourseReview::getUserId, userId)
                .count();
        if (existingCount > 0) {
            throw new BusinessException(14000, "您已经评价过该课程");
        }

        // 创建评价
        CourseReview review = new CourseReview();
        review.setCourseId(dto.getCourseId());
        review.setUserId(userId);
        review.setRating(dto.getRating());
        review.setTitle(dto.getTitle());
        review.setContent(dto.getContent());
        review.setIsAnonymous(dto.getIsAnonymous() != null ? dto.getIsAnonymous() : false);
        review.setIsApproved(false); // 默认需要审核
        review.setLikeCount(0);
        review.setCreatedAt(new Date());
        review.setUpdatedAt(new Date());

        boolean saved = this.save(review);
        if (!saved) {
            return false;
        }

        // 更新课程的评分统计（这里可以异步处理）
        updateCourseRating(dto.getCourseId());

        return true;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Boolean removeReview(Long reviewId, Integer userId) {
        CourseReview review = this.getById(reviewId);
        if (review == null) {
            throw new BusinessException(14000, "评价不存在");
        }

        // 检查权限：只能删除自己的评价
        if (!review.getUserId().equals(userId)) {
            throw new BusinessException(14000, "无权删除此评价");
        }

        boolean removed = this.removeById(reviewId);
        if (removed) {
            // 更新课程的评分统计
            updateCourseRating(review.getCourseId());
        }

        return removed;
    }

    @Override
    public Boolean toggleLikeReview(Long reviewId, Integer userId) {
        // 这里需要实现评价点赞的逻辑
        // 需要查询 course_review_likes 表

        CourseReview review = this.getById(reviewId);
        if (review == null) {
            throw new BusinessException(14000, "评价不存在");
        }

        // 示例逻辑：这里简单实现点赞/取消点赞
        // 实际应该查询评价点赞表判断是否已点赞
        boolean isLiked = false; // 从数据库查询

        if (isLiked) {
            // 取消点赞
            this.lambdaUpdate()
                    .setSql("like_count = like_count - 1")
                    .eq(CourseReview::getId, reviewId)
                    .gt(CourseReview::getLikeCount, 0)
                    .update();
        } else {
            // 点赞
            this.lambdaUpdate()
                    .setSql("like_count = like_count + 1")
                    .eq(CourseReview::getId, reviewId)
                    .update();
        }

        return true;
    }

    /**
     * 更新课程的评分统计
     */
    private void updateCourseRating(Integer courseId) {
        // 计算平均分
        List<CourseReview> reviews = this.lambdaQuery()
                .eq(CourseReview::getCourseId, courseId)
                .eq(CourseReview::getIsApproved, true)
                .list();

        if (!reviews.isEmpty()) {
            double avgRating = reviews.stream()
                    .mapToInt(CourseReview::getRating)
                    .average()
                    .orElse(0.0);

            // 更新课程评分
            courseService.lambdaUpdate()
                    .set(Course::getAverageRating, BigDecimal.valueOf(avgRating))
                    .set(Course::getReviewCount, reviews.size())
                    .eq(Course::getId, courseId)
                    .update();
        }
    }

    /**
     * 转换评价为VO
     */
    private CourseReviewVO convertReviewToVO(CourseReview review) {
        CourseReviewVO vo = new CourseReviewVO();
        BeanUtils.copyProperties(review, vo);
        // 这里可以设置用户信息等
        return vo;
    }
}
