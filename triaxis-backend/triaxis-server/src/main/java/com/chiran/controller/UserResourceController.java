package com.chiran.controller;

import com.chiran.dto.CourseSearchDTO;
import com.chiran.dto.ResourceSearchDTO;
import com.chiran.result.PageResult;
import com.chiran.result.Result;
import com.chiran.service.ResourceService;
import com.chiran.service.UserFavoriteService;
import com.chiran.vo.ResourceVO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

//@RestController
@RequestMapping("/user/resources")
@RequiredArgsConstructor
public class UserResourceController {
    @Autowired
    private ResourceService resourceService;
    @Autowired
    private UserFavoriteService userFavoriteService;

    /**
     * 获取我上传的资源
     */
    @GetMapping("/uploaded")
    public Result<PageResult<ResourceVO>> getMyUploadedResources(
            Integer id,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        ResourceSearchDTO searchDTO = new ResourceSearchDTO();
        // 这里需要扩展CourseSearchDTO，添加userId字段
//        searchDTO.setId(id);
//        searchDTO.setPage(page);
//        searchDTO.setPageSize(pageSize);

        PageResult<ResourceVO> result = resourceService.getResources(searchDTO);
        return Result.success(result);
    }

    /**
     * 获取我收藏的资源
     */
    @GetMapping("/favorites")
    public Result<PageResult<ResourceVO>> getMyFavoriteResources(
            Integer id,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        PageResult<ResourceVO> result = userFavoriteService.getFavoriteResources(id, page, pageSize);
        return Result.success(result);
    }
}