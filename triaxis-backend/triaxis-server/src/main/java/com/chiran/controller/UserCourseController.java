package com.chiran.controller;

import com.chiran.dto.CourseSearchDTO;
import com.chiran.result.PageResult;
import com.chiran.result.Result;
import com.chiran.service.CourseService;
import com.chiran.service.UserFavoriteService;
import com.chiran.vo.CourseVO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user/courses")
@RequiredArgsConstructor
public class UserCourseController {
    @Autowired
    private CourseService courseService;
    @Autowired
    private UserFavoriteService userFavoriteService;
    /**
     * 获取我上传的课程
     */
    @GetMapping("/uploaded")
    public Result<PageResult<CourseVO>> getMyUploadedCourses(
            Integer id,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        CourseSearchDTO searchDTO = new CourseSearchDTO();
        // 这里需要扩展CourseSearchDTO，添加userId字段
        searchDTO.setId(id);
        searchDTO.setPage(page);
        searchDTO.setPageSize(pageSize);

        PageResult<CourseVO> result = courseService.searchCourses(searchDTO);
        return Result.success(result);
    }

    /**
     * 获取我收藏的课程
     */
    @GetMapping("/favorites")
    public Result<PageResult<CourseVO>> getMyFavoriteCourses(
            Integer id,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        PageResult<CourseVO> result = userFavoriteService.getFavoriteCourses(id, page, pageSize);
        return Result.success(result);
    }
}