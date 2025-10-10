package com.chiran.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.chiran.dto.CourseDTO;
import com.chiran.dto.CourseSearchDTO;
import com.chiran.entity.Course;
import com.chiran.exception.BusinessException;
import com.chiran.mapper.CourseMapper;
import com.chiran.result.PageResult;
import com.chiran.service.CourseService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.chiran.vo.CourseVO;
import io.micrometer.common.util.StringUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
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
public class CourseServiceImpl extends ServiceImpl<CourseMapper, Course> implements CourseService {
    @Override
    public PageResult<CourseVO> searchCourses(CourseSearchDTO dto) {
        // 设置默认分页参数
        if (dto.getPage() == null || dto.getPage() <= 0) {
            dto.setPage(1);
        }
        if (dto.getPageSize() == null || dto.getPageSize() <= 0) {
            dto.setPageSize(10);
        }

        // 构建查询条件
        LambdaQueryWrapper<Course> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Course::getDeleted, 0);
        wrapper.eq(Course::getStatus, 3); // 只查询已发布的课程

        // 单个条件查询
        if (dto.getRightId() != null) {
            wrapper.eq(Course::getRightId, dto.getRightId());
        }
        if (dto.getFieldId() != null) {
            wrapper.eq(Course::getFieldId, dto.getFieldId());
        }
        if (dto.getDifficultyLevel() != null) {
            wrapper.eq(Course::getDifficultyLevel, dto.getDifficultyLevel());
        }

        // 多类型查询 - categoryId
        if (dto.getCategoryId() != null && !dto.getCategoryId().isEmpty()) {
            wrapper.in(Course::getCategoryId, dto.getCategoryId());
        }

        // 时长范围查询
        if (dto.getMinDuration() != null) {
            wrapper.ge(Course::getTotalDuration, dto.getMinDuration());
        }
        if (dto.getMaxDuration() != null) {
            wrapper.le(Course::getTotalDuration, dto.getMaxDuration());
        }

        // 模糊搜索
        if (StringUtils.isNotBlank(dto.getSearch())) {
            wrapper.and(w -> w.like(Course::getTitle, dto.getSearch())
                    .or()
                    .like(Course::getSubtitle, dto.getSearch())
                    .or()
                    .like(Course::getDescription, dto.getSearch()));
        }

        // 排序
        wrapper.orderByDesc(Course::getIsFeatured); // 推荐课程排前面

        switch (dto.getOrderBy() != null ? dto.getOrderBy() : 0) {
            case 0: // 时间倒序
                wrapper.orderByDesc(Course::getCreatedAt);
                break;
            case 1: // 热度(浏览量)
                wrapper.orderByDesc(Course::getViewCount);
                break;
            case 2: // 评分
                wrapper.orderByDesc(Course::getAverageRating);
                break;
            case 3: // 收藏量
                wrapper.orderByDesc(Course::getFavoriteCount);
                break;
            case 4: // 综合排序
                wrapper.orderByDesc(Course::getViewCount,
                        Course::getAverageRating,
                        Course::getFavoriteCount);
                break;
            default:
                wrapper.orderByDesc(Course::getCreatedAt);
        }

        // 执行分页查询
        Page<Course> page = new Page<>(dto.getPage(), dto.getPageSize());
        Page<Course> coursePage = this.page(page, wrapper);

        // 转换为VO
        List<CourseVO> voList = coursePage.getRecords().stream()
                .map(this::convertToVO)
                .collect(Collectors.toList());

        // 构建返回结果
        return new PageResult<>(coursePage.getTotal(), voList);
    }

    @Override
    public CourseVO getCourseDetail(Integer id) {
        Course course = this.getById(id);
        if (course == null || course.getDeleted() == 1) {
            throw new BusinessException(14000, "课程不存在或已被删除");
        }

        // 增加查看次数
        increaseViewCount(id);

        return convertToVO(course);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Boolean addCourse(CourseDTO dto) {
        // 转换为Entity
        Course course = convertToEntity(dto);

        // 设置默认值
        course.setViewCount(0);
        course.setLikeCount(0);
        course.setFavoriteCount(0);
        course.setAverageRating(BigDecimal.ZERO);
        course.setReviewCount(0);
        course.setDeleted(0);
        course.setCreatedAt(new Date());
        course.setUpdatedAt(new Date());

        // 如果是发布状态，设置发布时间
        if (course.getStatus() == 3) {
            course.setPublishedAt(new Date());
        }

        return this.save(course);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Boolean updateCourse(CourseDTO dto) {
        if (dto.getId() == null) {
            throw new BusinessException(14000, "课程ID不能为空");
        }

        // 检查课程是否存在
        Course existing = this.getById(dto.getId());
        if (existing == null || existing.getDeleted() == 1) {
            throw new BusinessException(14000, "课程不存在或已被删除");
        }

        // 转换为Entity
        Course course = convertToEntity(dto);
        course.setUpdatedAt(new Date());

        // 如果状态从未发布变为已发布，设置发布时间
        if (existing.getStatus() != 3 && course.getStatus() == 3) {
            course.setPublishedAt(new Date());
        }

        return this.updateById(course);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Boolean removeCourse(Integer id) {
        // 检查课程是否存在
        Course existing = this.getById(id);
        if (existing == null || existing.getDeleted() == 1) {
            throw new BusinessException(14000, "课程不存在或已被删除");
        }

        // 软删除
        return this.lambdaUpdate()
                .set(Course::getDeleted, 1)
                .set(Course::getUpdatedAt, new Date())
                .eq(Course::getId, id)
                .update();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Boolean removeCourses(List<Integer> ids) {
        if (ids == null || ids.isEmpty()) {
            return true;
        }

        // 检查所有课程是否存在且未被删除
        List<Course> courses = this.listByIds(ids);
        if (courses.size() != ids.size()) {
            throw new BusinessException(14000, "部分课程不存在");
        }

        boolean allNotDeleted = courses.stream().allMatch(course -> course.getDeleted() == 0);
        if (!allNotDeleted) {
            throw new BusinessException(14000, "部分课程已被删除");
        }

        // 批量软删除
        return this.lambdaUpdate()
                .set(Course::getDeleted, 1)
                .set(Course::getUpdatedAt, new Date())
                .in(Course::getId, ids)
                .update();
    }

    @Override
    public void increaseViewCount(Integer courseId) {
        this.lambdaUpdate()
                .setSql("view_count = view_count + 1")
                .eq(Course::getId, courseId)
                .update();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Boolean toggleLikeCourse(Integer courseId, Integer userId) {
        // 这里需要实现课程点赞的逻辑
        // 由于没有课程点赞表，这里只是示例
        // 实际开发中需要创建 course_likes 表

        Course course = this.getById(courseId);
        if (course == null || course.getDeleted() == 1) {
            throw new BusinessException(14000, "课程不存在或已被删除");
        }

        // 示例逻辑：这里简单实现点赞/取消点赞
        // 实际应该查询点赞表判断是否已点赞
        boolean isLiked = false; // 从数据库查询

        if (isLiked) {
            // 取消点赞
            this.lambdaUpdate()
                    .setSql("like_count = like_count - 1")
                    .eq(Course::getId, courseId)
                    .gt(Course::getLikeCount, 0)
                    .update();
        } else {
            // 点赞
            this.lambdaUpdate()
                    .setSql("like_count = like_count + 1")
                    .eq(Course::getId, courseId)
                    .update();
        }

        return true;
    }

    /**
     * 转换为VO对象
     */
    private CourseVO convertToVO(Course course) {
        CourseVO vo = new CourseVO();
        BeanUtils.copyProperties(course, vo);
        // 这里可以设置其他业务字段，如用户是否购买等
        return vo;
    }

    /**
     * DTO转换为Entity
     */
    private Course convertToEntity(CourseDTO dto) {
        Course course = new Course();
        BeanUtils.copyProperties(dto, course);
        return course;
    }
}
