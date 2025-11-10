package com.chiran.controller;

import com.chiran.JwtUtil;
import com.chiran.entity.UserChat;
import com.chiran.result.Result;
import com.chiran.service.CourseService;
import com.chiran.service.ResourceService;
import com.chiran.service.UserService;
import com.chiran.vo.*;
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
   public Result loginAuto(@RequestHeader("Authorization") String token, @RequestHeader("Refresh-Token") String refresh,HttpServletRequest request) {
       String userId = request.getAttribute("userId").toString();
       log.info("用户登出，id是{}", userId);
       if (token != null) {
           String tokenId = jwtUtil.parseAccessToken(token).get("tokenId", String.class);
           jwtUtil.removeAllTokens(userId, tokenId);
           return Result.success();
       }
       if (refresh != null) {
           String tokenId = jwtUtil.parseRefreshToken(refresh).get("tokenId", String.class);
           jwtUtil.removeAllTokens(userId, tokenId);
           return Result.success();
       }
       jwtUtil.removeAllUserTokens(userId);
       return Result.success();
   }
   /**
    * 获取当前用户信息
    */
   @GetMapping("/profile")
   public Result<UserProfileVO> getUserProfile(HttpServletRequest request) {
       Integer id = (Integer)request.getAttribute("userId");
       UserProfileVO user = userService.getUserProfile(id);
       return Result.success(user);
   }
    @GetMapping("/detail")
    public Result<UserDetailVO> getUserDetail(HttpServletRequest request) {
        Integer id = (Integer)request.getAttribute("userId");
        UserDetailVO user = userService.getUserDetail(id);
        return Result.success(user);
    }
    @GetMapping("/settings")
    public Result<UserMySettingsVO> getUserSettings(HttpServletRequest request) {
        Integer id = (Integer)request.getAttribute("userId");
        UserMySettingsVO user = userService.getUserSettings(id);
        return Result.success(user);
    }
    @GetMapping("/points")
    public Result<UserMyPointsVO> getUserPoints(HttpServletRequest request) {
        Integer id = (Integer)request.getAttribute("userId");
        UserMyPointsVO user = userService.getUserPoints(id);
        return Result.success(user);
    }
    @GetMapping("/vip")
    public Result<UserMyVipVO> getUserVip(HttpServletRequest request) {
        Integer id = (Integer)request.getAttribute("userId");
        UserMyVipVO user = userService.getUserVip(id);
        return Result.success(user);
    }
    @GetMapping("/messages/like")
    public Result<UserMessageVO> getUserMessagesLike(HttpServletRequest request) {
        Integer id = (Integer)request.getAttribute("userId");
        UserMessageVO user = userService.getUserMessages(id,1);
        return Result.success(user);
    }
    @GetMapping("/messages/collect")
    public Result<UserMessageVO> getUserMessagesCollect(HttpServletRequest request) {
        Integer id = (Integer)request.getAttribute("userId");
        UserMessageVO user = userService.getUserMessages(id,2);
        return Result.success(user);
    }      @GetMapping("/messages/review")
    public Result<UserMessageVO> getUserMessagesReview(HttpServletRequest request) {
        Integer id = (Integer)request.getAttribute("userId");
        UserMessageVO user = userService.getUserMessages(id,3);
        return Result.success(user);
    }
    @GetMapping("/messages/system")
    public Result<UserMessageVO> getUserMessagesSystem(HttpServletRequest request) {
        Integer id = (Integer)request.getAttribute("userId");
        UserMessageVO user = userService.getUserMessages(id,4);
        return Result.success(user);
    }

    @GetMapping("/chats")
    public Result<UserChatVO> getUserChats(HttpServletRequest request) {
        Integer id = (Integer)request.getAttribute("userId");
        UserChatVO user = userService.getUserChats(id);
        return Result.success(user);
    }
    @GetMapping("/chat/{id}")
    public Result<List<UserChat>> getUserChat(HttpServletRequest request) {
        Integer userId = (Integer)request.getAttribute("userId");
        List<UserChat> user = userService.getUserChat(useId,id);
        return Result.success(user);
    }
   // /**
   //  * 更新用户信息
   //  */
   // @PutMapping("/info")
   // public Result<Boolean> updateProfile(@RequestBody UserUpdateDTO dto) {
   //     Boolean success = userService.updateUserProfile(dto.getId(), dto);
   //     return Result.success(success);
   // }
   //
   // /**
   //  * 获取用户统计信息
   //  */
   // @GetMapping("/stats")
   // public Result<UserStatsVO> getUserStats(Integer id) {
   //     UserStatsVO stats = userService.getUserStats(id);
   //     return Result.success(stats);
   // }
   //
   // /**
   //  * 获取会员信息
   //  */
   // @GetMapping("/membership")
   // public Result<MembershipVO> getMembershipInfo(Integer id) {
   //     MembershipVO membership = userService.getMembershipInfo(id);
   //     return Result.success(membership);
   // }
   //
   // /**
   //  * 获取积分信息
   //  */
   // @GetMapping("/points")
   // public Result<PointsVO> getPointsInfo(Integer id) {
   //     PointsVO points = userService.getPointsInfo(id);
   //     return Result.success(points);
   // }
}
