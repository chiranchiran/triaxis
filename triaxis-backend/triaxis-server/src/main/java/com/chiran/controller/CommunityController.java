package com.chiran.controller;

import com.chiran.bo.CategoryBO;
import com.chiran.bo.PostSearchBO;
import com.chiran.dto.CommunityBountyDTO;
import com.chiran.dto.CommunitySearchDTO;
import com.chiran.dto.CommunitySquareDTO;
import com.chiran.result.PageResult;
import com.chiran.result.Result;

import com.chiran.service.CommunityTypesService;
import com.chiran.service.PostService;
import com.chiran.vo.CommunityHotVO;
import com.chiran.vo.CommunitySearchVO;
import com.chiran.vo.CommunityTypesVO;

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
@RequestMapping("/api/community")
public class CommunityController {

    @Autowired
    private CommunityTypesService communityTypesService;
    @Autowired
    private PostService postService;

    /**
     * 获取所有分类
     *
     * @return
     */
    @GetMapping("/types")
    public Result<CommunityTypesVO> getTypes() {
        log.debug("获取帖子所有分类");
        CommunityTypesVO types = communityTypesService.getTypes();
        return Result.success(types);
    }


    /**
     * 查询帖子
     */
    @GetMapping("/search")
    public Result<CommunitySearchVO> getPosts(CommunitySearchDTO communitySearchDTO, HttpServletRequest request) {
        communitySearchDTO.setUserId((Integer) request.getAttribute("userId"));
        log.debug("搜索帖子，参数是{}", communitySearchDTO);
        CommunitySearchVO communitySearchVO = postService.getPosts(communitySearchDTO);
        return Result.success(communitySearchVO);
    }
    /**
     * 查询热门榜单
     */
    @GetMapping("/hot")
    public Result<List<CommunityHotVO>> getHot() {
        log.debug("获取热门榜单");
        List<CommunityHotVO> list = postService.getHot();
        return Result.success(list);
    }
    /**
     * 查询帖子广场
     */
    @GetMapping("/posts")
    public Result<List<PostSearchBO>> getSquare(CommunitySquareDTO communitySquareDTO, HttpServletRequest request) {
        communitySquareDTO.setUserId((Integer) request.getAttribute("userId"));
        log.debug("获取广场");
        List<PostSearchBO> list = postService.getSquare(communitySquareDTO);
        return Result.success(list);
    }
    /**
     * 查询悬赏贴
     */
    @GetMapping("/posts/bounty")
    public Result<PageResult<PostSearchBO>> getBounty(CommunityBountyDTO communityBountyDTO, HttpServletRequest request) {
        communityBountyDTO.setUserId((Integer) request.getAttribute("userId"));
        log.debug("获取悬赏贴，参数是{}", communityBountyDTO);
        PageResult<PostSearchBO> result = postService.getBounty(communityBountyDTO);
        return Result.success(result);
    }
    /**
     * 查询普通贴
     */
    @GetMapping("/posts/normal")
    public Result<PageResult<PostSearchBO>> getNormal(CommunityBountyDTO communityBountyDTO, HttpServletRequest request) {
        communityBountyDTO.setUserId((Integer) request.getAttribute("userId"));
        log.debug("获取普通贴，参数是{}", communityBountyDTO);
        PageResult<PostSearchBO> result = postService.getNormal(communityBountyDTO);
        return Result.success(result);
    }

//    /**
//     * 查看某个资源
//     */
//    @GetMapping("/{id}")
//    public Result<CommunityVO> getCommunity(@PathVariable Integer id, HttpServletRequest request) {
//       log.debug("查看资源，id是{}",id);
//        CommunityVO community = communityService.getCommunityDetail(id,(Integer)request.getAttribute("userId"));
//        return Result.success(community);
//    }
//
//    /**
//     * 上传资源
//     */
//    @PostMapping
//    public Result addCommunity(@RequestBody CommunityDTO communityDTO, HttpServletRequest request) {
//        log.debug("上传资源");
//        communityDTO.setUserId((Integer)request.getAttribute("userId"));
//        Boolean success = communityService.addCommunity(communityDTO);
//        return Result.success();
//    }
//
//    /**
//     * 修改资源
//     */
//    @PutMapping
//    public Result updateCommunity(@RequestBody CommunityDTO communityDTO, HttpServletRequest request) {
//        log.debug("修改资源，是{}",communityDTO);
//        communityDTO.setUserId((Integer)request.getAttribute("userId"));
//        communityDTO.setRole((Integer)request.getAttribute("role"));
//        Boolean flag = communityService.updateCommunity(communityDTO);
//        return Result.success();
//    }
//
//    /**
//     * 删除某个资源
//     */
//    @DeleteMapping("/{id}")
//    public Result removeCommunity(@PathVariable Integer id, HttpServletRequest request) {
//        log.debug("删除某个资源，id是{}",id);
//        Integer userId = (Integer)request.getAttribute("userId");
//        Integer role = (Integer)request.getAttribute("role");
//        Boolean flag = communityService.removeCommunity(id,userId,role);
//        return Result.success();
//    }
//
//    /**
//     * 批量删除资源
//     */
//    @DeleteMapping("/batch")
//    public Result removeCommunitys(@RequestBody List<Integer> ids, HttpServletRequest request) {
//        log.debug("删除某些资源，id是{}",ids);
//        Integer userId = (Integer)request.getAttribute("userId");
//        Integer role = (Integer)request.getAttribute("role");
//        Boolean success = communityService.removeCommunitys(ids,userId,role);
//        return Result.success();
//    }

}
