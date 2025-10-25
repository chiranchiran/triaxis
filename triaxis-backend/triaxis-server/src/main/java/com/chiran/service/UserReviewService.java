package com.chiran.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.chiran.dto.ReviewSearchDTO;
import com.chiran.entity.UserReview;
import com.chiran.result.PageResult;
import com.chiran.vo.ReviewSearchVO;

public interface UserReviewService  extends IService<UserReview> {
    PageResult<ReviewSearchVO> getReviews(ReviewSearchDTO reviewSearchDTO);


    PageResult<ReviewSearchVO> getReviewReplies(ReviewSearchDTO reviewSearchDTO);
}
