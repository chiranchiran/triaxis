package com.chiran.controller;

import com.chiran.JwtUtil;
import com.chiran.dto.CourseSearchDTO;
import com.chiran.dto.ResourceSearchDTO;
import com.chiran.dto.UserUpdateDTO;
import com.chiran.result.PageResult;
import com.chiran.result.Result;
import com.chiran.service.CourseService;
import com.chiran.service.ResourceService;
import com.chiran.service.UserService;
import com.chiran.vo.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private UserService userService;
    @Autowired
    private ResourceService resourceService;
    @Autowired
    private CourseService courseService;

    /**
     * 用户用id登出
     */
    @PostMapping("/logout")
    public Result loginAuto(@RequestHeader("Authorization") String token, @RequestHeader("Refresh-Token") String refresh, String id) {
        log.info("用户登出，id是{}", id);
        token = jwtUtil.getTokenFromHeader(token);
        if (token != null) {
            String tokenId = jwtUtil.parseAccessToken(token).get("tokenId", String.class);
            jwtUtil.removeAllTokens(id, tokenId);
            return Result.success();
        }
        if (refresh != null) {
            String tokenId = jwtUtil.parseRefreshToken(refresh).get("tokenId", String.class);
            jwtUtil.removeAllTokens(id, tokenId);
            return Result.success();
        }
        jwtUtil.removeAllUserTokens(id);
        return Result.success();
    }
    /**
     * 获取当前用户信息
     */
    @GetMapping("/info")
    public Result<UserVO> getCurrentUser(Integer id) {
        UserVO user = userService.getUserDetail(id);
        return Result.success(user);
    }

    /**
     * 更新用户信息
     */
    @PutMapping("/info")
    public Result<Boolean> updateProfile(@RequestBody UserUpdateDTO dto) {
        Boolean success = userService.updateUserProfile(dto.getId(), dto);
        return Result.success(success);
    }

    /**
     * 获取用户统计信息
     */
    @GetMapping("/stats")
    public Result<UserStatsVO> getUserStats(Integer id) {
        UserStatsVO stats = userService.getUserStats(id);
        return Result.success(stats);
    }

    /**
     * 获取会员信息
     */
    @GetMapping("/membership")
    public Result<MembershipVO> getMembershipInfo(Integer id) {
        MembershipVO membership = userService.getMembershipInfo(id);
        return Result.success(membership);
    }

    /**
     * 获取积分信息
     */
    @GetMapping("/points")
    public Result<PointsVO> getPointsInfo(Integer id) {
        PointsVO points = userService.getPointsInfo(id);
        return Result.success(points);
    }
}
