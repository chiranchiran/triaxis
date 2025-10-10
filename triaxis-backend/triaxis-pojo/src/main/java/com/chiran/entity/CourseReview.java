package com.chiran.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Date;

import lombok.Getter;
import lombok.Setter;

/**
 * <p>
 * 
 * </p>
 *
 * @author chiran
 * @since 2025-10-07
 */
@Getter
@Setter
@TableName("course_reviews")
public class CourseReview implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    @TableField("course_id")
    private Integer courseId;

    @TableField("user_id")
    private Integer userId;

    /**
     * 评分1-5
     */
    @TableField("rating")
    private Integer rating;

    /**
     * 评价标题
     */
    @TableField("title")
    private String title;

    /**
     * 评价内容
     */
    @TableField("content")
    private String content;

    /**
     * 是否审核通过
     */
    @TableField("is_approved")
    private Boolean isApproved;

    /**
     * 是否匿名评价
     */
    @TableField("is_anonymous")
    private Boolean isAnonymous;

    /**
     * 评价点赞数
     */
    @TableField("like_count")
    private Integer likeCount;

    @TableField("created_at")
    private Date createdAt;

    @TableField("updated_at")
    private Date updatedAt;
}
