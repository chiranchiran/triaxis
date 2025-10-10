package com.chiran.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;
import java.math.BigDecimal;
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
@TableName("courses")
public class Course implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;

    /**
     * 课程标题
     */
    @TableField("title")
    private String title;

    /**
     * 课程副标题
     */
    @TableField("subtitle")
    private String subtitle;

    /**
     * 课程描述
     */
    @TableField("description")
    private String description;

    /**
     * 课程封面图
     */
    @TableField("cover_image")
    private String coverImage;

    /**
     * 视频
     */
    @TableField("intro_video")
    private String introVideo;

    /**
     * 上传者ID
     */
    @TableField("user_id")
    private Integer userId;

    /**
     * 课程分类
     */
    @TableField("category_id")
    private Integer categoryId;

    /**
     * 访问权限
     */
    @TableField("right_id")
    private Integer rightId;

    /**
     * 专业领域
     */
    @TableField("field_id")
    private Integer fieldId;

    /**
     * 总时长（分钟）
     */
    @TableField("total_duration")
    private Integer totalDuration;

    /**
     * 难度级别：1-初级，2-中级，3-高级
     */
    @TableField("difficulty_level")
    private Integer difficultyLevel;

    /**
     * 浏览人数
     */
    @TableField("view_count")
    private Integer viewCount;

    /**
     * 点赞数
     */
    @TableField("like_count")
    private Integer likeCount;

    /**
     * 收藏数
     */
    @TableField("favorite_count")
    private Integer favoriteCount;

    /**
     * 平均评分
     */
    @TableField("average_rating")
    private BigDecimal averageRating;

    /**
     * 评价数量
     */
    @TableField("review_count")
    private Integer reviewCount;

    /**
     * 课程价格（积分）
     */
    @TableField("price_points")
    private Integer pricePoints;

    /**
     * 1-草稿，2-审核中，3-已发布，4-已下架
     */
    @TableField("status")
    private Integer status;

    /**
     * 是否推荐课程
     */
    @TableField("is_featured")
    private Boolean isFeatured;

    /**
     * 软删除
     */
    @TableField("deleted")
    private Integer deleted;

    /**
     * 发布时间
     */
    @TableField("published_at")
    private Date publishedAt;

    @TableField("created_at")
    private Date createdAt;

    @TableField("updated_at")
    private Date updatedAt;
}
