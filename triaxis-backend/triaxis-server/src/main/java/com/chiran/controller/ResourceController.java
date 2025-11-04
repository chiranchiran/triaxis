package com.chiran.controller;

import com.chiran.dto.ResourceCategorySecondaryDTO;
import com.chiran.dto.ResourceDTO;
import com.chiran.dto.ResourceSearchDTO;
import com.chiran.result.PageResult;
import com.chiran.result.Result;
import com.chiran.service.ResourceService;
import com.chiran.service.ResourceTypesService;
import com.chiran.bo.CategoryBO;
import com.chiran.vo.ResourceSearchVO;
import com.chiran.vo.ResourceVO;
import com.chiran.vo.ResourcesTypesVO;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * <p>
 * 前端控制器
 * </p>
 *
 * @author chiran
 * @since 2025-10-07
 */
@Slf4j
@RestController
@RequestMapping("/api/resources")
public class ResourceController {
    @Autowired
    private ResourceService resourceService;
    @Autowired
    private ResourceTypesService resourceTypesService;

    /**
     * 获取所有分类
     *
     * @return
     */
    @GetMapping("/types")
    public Result<ResourcesTypesVO> getTypes() {
        log.debug("获取资源所有分类");
        ResourcesTypesVO types = resourceTypesService.getTypes();
        return Result.success(types);
    }

    /**
     * 获取二级分类
     */
    @GetMapping("/categories")
    public Result<List<CategoryBO>> getCategories( ResourceCategorySecondaryDTO categoryDTO) {
        log.debug("获取资源二级分类");
        List<CategoryBO> category = resourceTypesService.getCategorySecondary(categoryDTO.getSubjectId(), categoryDTO.getParentId());
        return Result.success(category);
    }

    /**
     * 查询资源
     */
    @GetMapping("/search")
    public Result<PageResult> getResources(ResourceSearchDTO resourceSearchDTO,HttpServletRequest request) {
        resourceSearchDTO.setUserId((Integer)request.getAttribute("userId"));
        log.debug("搜索资源，参数是{}", resourceSearchDTO);
        PageResult<ResourceVO> pageResult = resourceService.getResources(resourceSearchDTO);
        return Result.success(pageResult);
    }

    /**
     * 查看某个资源
     */
    @GetMapping("/{id}")
    public Result<ResourceVO> getResource(@PathVariable Integer id, HttpServletRequest request) {
       log.debug("查看资源，id是{}",id);
        ResourceVO resource = resourceService.getResourceDetail(id,(Integer)request.getAttribute("userId"));
        return Result.success(resource);
    }

    /**
     * 上传资源
     */
    @PostMapping
    public Result addResource(@RequestBody ResourceDTO resourceDTO, HttpServletRequest request) {
        log.debug("上传资源");
        resourceDTO.setUserId((Integer)request.getAttribute("userId"));
        Boolean success = resourceService.addResource(resourceDTO);
        return Result.success();
    }

    /**
     * 修改资源
     */
    @PutMapping
    public Result updateResource(@RequestBody ResourceDTO resourceDTO, HttpServletRequest request) {
        log.debug("修改资源，是{}",resourceDTO);
        resourceDTO.setUserId((Integer)request.getAttribute("userId"));
        resourceDTO.setRole((Integer)request.getAttribute("role"));
        Boolean flag = resourceService.updateResource(resourceDTO);
        return Result.success();
    }

    /**
     * 删除某个资源
     */
    @DeleteMapping("/{id}")
    public Result removeResource(@PathVariable Integer id, HttpServletRequest request) {
        log.debug("删除某个资源，id是{}",id);
        Integer userId = (Integer)request.getAttribute("userId");
        Integer role = (Integer)request.getAttribute("role");
        Boolean flag = resourceService.removeResource(id,userId,role);
        return Result.success();
    }

    /**
     * 批量删除资源
     */
    @DeleteMapping("/batch")
    public Result removeResources(@RequestBody List<Integer> ids, HttpServletRequest request) {
        log.debug("删除某些资源，id是{}",ids);
        Integer userId = (Integer)request.getAttribute("userId");
        Integer role = (Integer)request.getAttribute("role");
        Boolean success = resourceService.removeResources(ids,userId,role);
        return Result.success();
    }

}
