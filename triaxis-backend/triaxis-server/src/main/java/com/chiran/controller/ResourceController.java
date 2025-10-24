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
    @PostMapping("/categories")
    public Result<List<CategoryBO>> getCategories(@RequestBody ResourceCategorySecondaryDTO categoryDTO) {
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
    public Result<Boolean> addResource(@RequestBody ResourceDTO dto) {
        log.debug("上传资源，是{}",dto);
        Boolean success = resourceService.addResource(dto);
        return Result.success(success);
    }

    /**
     * 修改资源
     */
    @PutMapping
    public Result<Boolean> updateResource(@RequestBody ResourceDTO dto) {
        log.debug("修改资源，是{}",dto);
        Boolean flag = resourceService.updateResource(dto);
        return Result.success(flag);
    }

    /**
     * 删除某个资源
     */
    @DeleteMapping("/{id}")
    public Result<Boolean> removeResource(@PathVariable Integer id) {
        log.debug("删除某个资源，id是{}",id);
        Boolean flag = resourceService.removeResource(id);
        return Result.success(flag);
    }

    /**
     * 批量删除资源
     */
    @DeleteMapping("/batch")
    public Result<Boolean> removeResources(@RequestBody List<Integer> ids) {
        log.debug("删除某个资源，id是{}",ids);
        Boolean success = resourceService.removeResources(ids);
        return Result.success(success);
    }

}
