package com.chiran.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.support.SFunction;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.chiran.dto.ReviewSearchDTO;
import com.chiran.entity.UserReview;
import com.chiran.mapper.UserReviewMapper;
import com.chiran.result.PageResult;
import com.chiran.service.UserReviewService;
import com.chiran.vo.ReviewSearchVO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

/**
 * <p>
 *  服务实现类
 * </p>
 *
 * @author chiran
 * @since 2025-10-07
 */
@Service
@RequiredArgsConstructor
public class UserReviewServiceImpl extends ServiceImpl<UserReviewMapper, UserReview> implements UserReviewService {
@Autowired
UserReviewMapper userReviewMapper;

    @Override
    public PageResult<ReviewSearchVO> getReviews(ReviewSearchDTO reviewSearchDTO) {
        List<ReviewSearchVO> list = userReviewMapper.getReviews(reviewSearchDTO);
        return new PageResult<>((long)list.size(),list);
    }

    @Override
    public PageResult<ReviewSearchVO> getReviewReplies( ReviewSearchDTO reviewSearchDTO) {
        List<ReviewSearchVO> list = userReviewMapper.getReviewReplies(reviewSearchDTO);
        return new PageResult<>((long)list.size(),list);
    }
}