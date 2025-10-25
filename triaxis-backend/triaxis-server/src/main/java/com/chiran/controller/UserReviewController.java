package com.chiran.controller;

import com.chiran.dto.ReviewSearchDTO;
import com.chiran.result.PageResult;
import com.chiran.result.Result;
import com.chiran.service.UserReviewService;
import com.chiran.vo.ReviewSearchVO;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class UserReviewController {
    @Autowired
    private UserReviewService userReviewService;

    /**
     * 查询评论
     */
    @GetMapping
    public Result<PageResult> getReviews(HttpServletRequest request, ReviewSearchDTO reviewSearchDTO) {
        log.debug("查询评论，参数是{}",reviewSearchDTO);
        reviewSearchDTO.setUserId((Integer)request.getAttribute("userId"));
        PageResult<ReviewSearchVO> pageResult = userReviewService.getReviews(reviewSearchDTO);
        return Result.success(pageResult);
    }

    /**
     * 查看评论的回复
     */
    @GetMapping("/replies")
    public Result<PageResult> getReviewReplies(HttpServletRequest request, ReviewSearchDTO reviewSearchDTO ) {
        log.debug("查询评论的回复，参数是{}}", reviewSearchDTO);
        reviewSearchDTO.setUserId((Integer)request.getAttribute("userId"));
        PageResult<ReviewSearchVO> pageResult = userReviewService.getReviewReplies(reviewSearchDTO);
        return Result.success(pageResult);
    }

}
