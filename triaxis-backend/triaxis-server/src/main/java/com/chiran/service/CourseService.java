package com.chiran.service;

import com.chiran.dto.CourseDTO;
import com.chiran.dto.CourseSearchDTO;
import com.chiran.entity.Course;
import com.baomidou.mybatisplus.extension.service.IService;
import com.chiran.result.PageResult;
import com.chiran.vo.CourseVO;

import java.util.List;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author chiran
 * @since 2025-10-07
 */
public interface CourseService extends IService<Course> {
    /**
     * 分页查询课程
     */
    PageResult<CourseVO> searchCourses(CourseSearchDTO dto);

    /**
     * 根据ID获取课程详情
     */
    CourseVO getCourseDetail(Integer id);

    /**
     * 新增课程
     */
    Boolean addCourse(CourseDTO dto);

    /**
     * 修改课程
     */
    Boolean updateCourse(CourseDTO dto);

    /**
     * 删除课程（软删除）
     */
    Boolean removeCourse(Integer id);

    /**
     * 批量删除课程
     */
    Boolean removeCourses(List<Integer> ids);

    /**
     * 增加课程浏览量
     */
    void increaseViewCount(Integer courseId);

    /**
     * 点赞/取消点赞课程
     */
    Boolean toggleLikeCourse(Integer courseId, Integer userId);
}
