package com.chiran.controller;

import com.chiran.JwtUtil;
import com.chiran.dto.ChatSendDTO;
import com.chiran.dto.MessageDTO;
import com.chiran.entity.UserChat;
import com.chiran.result.PageResult;
import com.chiran.result.Result;
import com.chiran.service.*;
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
    @Autowired
    private UserChatService userChatService;

    /**
     * 用户用id登出
     */
    @PostMapping("/logout/{id}")
    public Result loginAuto(@PathVariable String id, @RequestHeader("Authorization") String token, HttpServletRequest request) {
        String userId = request.getAttribute("userId").toString();
        log.info("用户登出，id是{}", userId);
        if (token != null) {
            String tokenId = jwtUtil.parseAccessToken(token).get("tokenId", String.class);
            jwtUtil.removeAllTokens(userId, tokenId);
            return Result.success();
        }
        jwtUtil.removeAllUserTokens(id);
        return Result.success();
    }

    /**
     * 获取当前用户信息
     */
    @GetMapping("/profile")
    public Result<UserProfileVO> getUserProfile(HttpServletRequest request) {
        Integer id = (Integer) request.getAttribute("userId");
        UserProfileVO user = userService.getUserProfile(id);
        return Result.success(user);
    }

    @GetMapping("/detail")
    public Result<UserDetailVO> getUserDetail(HttpServletRequest request) {
        Integer id = (Integer) request.getAttribute("userId");
        UserDetailVO user = userService.getUserDetail(id);
        return Result.success(user);
    }

    @GetMapping("/settings")
    public Result<UserMySettingsVO> getUserSettings(HttpServletRequest request) {
        Integer id = (Integer) request.getAttribute("userId");
        UserMySettingsVO user = userService.getUserSettings(id);
        return Result.success(user);
    }

    @GetMapping("/points")
    public Result<UserMyPointsVO> getUserPoints(HttpServletRequest request) {
        Integer id = (Integer) request.getAttribute("userId");
        UserMyPointsVO user = userService.getUserPoints(id);
        return Result.success(user);
    }

    @GetMapping("/vip")
    public Result<UserMyVipVO> getUserVip(HttpServletRequest request) {
        Integer id = (Integer) request.getAttribute("userId");
        UserMyVipVO user = userService.getUserVip(id);
        return Result.success(user);
    }
    // @GetMapping("/messages/count")
    // public Result<UserMessageCountVO>  getUserMessagesCount(HttpServletRequest request) {
    //     Integer id = (Integer) request.getAttribute("userId");
    //     PageResult<UserMessageVO> like = userService.getUserMessages(id, 1);
    //     PageResult<UserMessageVO>  collect = userService.getUserMessages(id, 2);
    //     PageResult<UserMessageVO>  review = userService.getUserMessages(id, 3);
    //     PageResult<UserChat>  system = userChatService.getMessageSystem(id);
    //     PageResult<UserChatVO> chats = userChatService.getUserChats(id);
    //
    //     long likeCount = like.getTotal();
    //     long collectCount = collect.getTotal();
    //     long reviewCount = review.getTotal();
    //     long systemCount = system.getTotal();
    //     long chatCount = 0;
    //     for (UserChatVO i:chats.getRecords()){
    //         chatCount+=i.getUnread();
    //     }
    //
    //     long counts = likeCount + collectCount + reviewCount + systemCount + chatCount;
    //
    //     UserMessageCountVO user = UserMessageCountVO.builder().like((int)likeCount).collect((int)collectCount).system((int)systemCount).chat((int)chatCount).review((int) reviewCount).total((int)counts).build();
    //     return Result.success(user);
    // }
    @GetMapping("/messages/like")
    public Result<PageResult>  getUserMessagesLike(HttpServletRequest request, MessageDTO messageDTO) {
        Integer id = (Integer) request.getAttribute("userId");
        messageDTO.setId(id);
        PageResult<UserMessageVO> like = userService.getUserMessages(messageDTO, 1);
        return Result.success(like);
    }

    @GetMapping("/messages/collect")
    public Result<PageResult> getUserMessagesCollect(HttpServletRequest request, MessageDTO messageDTO) {
        Integer id = (Integer) request.getAttribute("userId");
        messageDTO.setId(id);
        PageResult<UserMessageVO>  collect = userService.getUserMessages(messageDTO, 2);
        return Result.success(collect);
    }

    @GetMapping("/messages/review")
    public Result<PageResult>  getUserMessagesReview(HttpServletRequest request, MessageDTO messageDTO) {
        Integer id = (Integer) request.getAttribute("userId");
        messageDTO.setId(id);
        PageResult<UserMessageVO>  review = userService.getUserMessages(messageDTO, 3);
        return Result.success(review);
    }

    @GetMapping("/messages/system")
    public Result<PageResult>  getUserMessagesSystem(HttpServletRequest request, MessageDTO messageDTO) {
        Integer id = (Integer) request.getAttribute("userId");
        messageDTO.setId(id);
        PageResult<UserChat>  system = userChatService.getMessageSystem(messageDTO);
        return Result.success(system);
    }

    // @GetMapping("/chats")
    // public Result<PageResult> getUserChats(HttpServletRequest request) {
    //     Integer id = (Integer) request.getAttribute("userId");
    //     PageResult<UserChatVO> chats = userChatService.getUserChats(id);
    //     return Result.success(chats);
    // }
    //
    // @GetMapping("/chat/{id}")
    // public Result<PageResult> getUserChat(HttpServletRequest request,@PathVariable Integer id) {
    //     log.debug("查看用户聊天记录",id);
    //     Integer userId = (Integer) request.getAttribute("userId");
    //     PageResult<UserChat> chat = userChatService.getUserChat(id,userId);
    //     return Result.success(chat);
    // }
    @PostMapping("/chat")
    public Result addUserChat(HttpServletRequest request, @RequestBody ChatSendDTO chatSendDTO) {
        log.debug("增加用户聊天记录");
        Integer userId = (Integer) request.getAttribute("userId");
        chatSendDTO.setSenderId(userId);
        userChatService.addUserChat(chatSendDTO);
        return Result.success();
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
