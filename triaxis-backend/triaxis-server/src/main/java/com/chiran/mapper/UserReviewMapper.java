package com.chiran.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.chiran.dto.ReviewSearchDTO;
import com.chiran.entity.UserLike;
import com.chiran.entity.UserReview;
import com.chiran.vo.ReviewSearchVO;
import com.chiran.vo.UserMessageVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * <p>
 *  Mapper 接口
 * </p>
 *
 * @author chiran
 * @since 2025-10-07
 */
@Mapper
public interface UserReviewMapper extends BaseMapper<UserReview> {
    List<ReviewSearchVO> getReviews(ReviewSearchDTO reviewSearchDTO);

    List<ReviewSearchVO> getReviewReplies(ReviewSearchDTO reviewSearchDTO);

    Page<UserMessageVO> selectResources(Page<UserMessageVO> page, @Param("id")Integer id);
}
