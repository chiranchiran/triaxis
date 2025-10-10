package com.chiran.controller;

import com.chiran.dto.CourseDTO;
import com.chiran.dto.CourseSearchDTO;
import com.chiran.result.PageResult;
import com.chiran.result.Result;
import com.chiran.service.CourseService;
import com.chiran.service.CoursesTypesService;
import com.chiran.vo.CourseVO;
import com.chiran.vo.CoursesTypesVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * <p>
 *  前端控制器
 * </p>
 *
 * @author chiran
 * @since 2025-10-07
 */
@Slf4j
@RestController
@RequestMapping("/api/courses")
public class CourseController {
    @Autowired
    private CourseService courseService;
    @Autowired
    private CoursesTypesService coursesTypesService;

    /**
     * 获取所有分类
     *
     * @return
     */
    @GetMapping("/types")
    public Result<CoursesTypesVO> getTypes() {
        log.debug("获取资源所有分类");
        CoursesTypesVO types = coursesTypesService.getTypes();
        return Result.success(types);
    }
    /**
     * 查看某个课程
     */
    @GetMapping("/{id}")
    public Result<CourseVO> getCourse(@PathVariable Integer id) {
        CourseVO course = courseService.getCourseDetail(id);
        return Result.success(course);
    }

    /**
     * 上传课程
     */
    @PostMapping
    public Result<Boolean> addCourse(@RequestBody CourseDTO dto) {
        Boolean success = courseService.addCourse(dto);
        return Result.success(success);
    }

    /**
     * 修改课程
     */
    @PutMapping
    public Result<Boolean> updateCourse(@RequestBody CourseDTO dto) {
        Boolean success = courseService.updateCourse(dto);
        return Result.success(success);
    }

    /**
     * 删除某个课程
     */
    @DeleteMapping("/{id}")
    public Result<Boolean> removeCourse(@PathVariable Integer id) {
        Boolean success = courseService.removeCourse(id);
        return Result.success(success);
    }

    /**
     * 批量删除课程
     */
    @DeleteMapping("/batch")
    public Result<Boolean> removeCourses(@RequestBody List<Integer> ids) {
        Boolean success = courseService.removeCourses(ids);
        return Result.success(success);
    }

    /**
     * 分页查询课程（搜索）
     */
    @PostMapping("/search")
    public Result<PageResult<CourseVO>> searchCourses(@RequestBody CourseSearchDTO dto) {
        PageResult<CourseVO> result = courseService.searchCourses(dto);
        return Result.success(result);
    }

    /**
     * 点赞/取消点赞课程
     */
    @PostMapping("/{id}/like")
    public Result<Boolean> likeCourse(@PathVariable Integer id, @RequestParam Integer userId) {
        Boolean success = courseService.toggleLikeCourse(id, userId);
        return Result.success(success);
    }
}
