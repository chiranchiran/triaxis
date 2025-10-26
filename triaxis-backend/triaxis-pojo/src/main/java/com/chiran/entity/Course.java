package com.chiran.entity;

import com.baomidou.mybatisplus.annotation.*;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;
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
    @TableField("path")
    private String path;
    /**
     * 总时长分钟
     */
    @TableField("duration")
    private Integer duration;
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
     * 访问权限（1是免费，2是积分兑换，3是VIP专享）
     */
    @TableField(value = "`right`")
    private Integer right;

    /**
     * 专业领域
     */
    @TableField("subject_id")
    private Integer subjectId;
    /**
     * 收藏次数
     */
    @TableField("collect_count")
    private Integer collectCount;
    /**
     * 查看次数
     */
    @TableField("view_count")
    private Integer viewCount;
    /**
     * 播放次数
     */
    @TableField("watch_count")
    private Integer watchCount;
    /**
     * 点赞次数
     */
    @TableField("like_count")
    private Integer likeCount;
    /**
     * 所需积分
     */
    @TableField("price")
    private Integer price;

    /**
     * 难度级别：1-初级，2-中级，3-高级
     */
    @TableField("level")
    private Integer level;
    /**
     * 状态（1-草稿，2-审核中，3-已发布，4-已下架）
     */
    @TableField("status")
    private Integer status;
    /**
     * 是否推荐资源（0-不推荐，1-推荐）
     */
    @TableField("is_recommended")
    private Boolean isRecommended;

    /**
     * 软删除
     */
    @TableField("deleted")
    @TableLogic
    private Integer deleted;

    /**
     * 创建时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @TableField(value = "create_time", fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    /**
     * 发布时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @TableField("publish_time")
    private LocalDateTime publishTime;

    /**
     * 更新时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @TableField(value = "update_time", fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

    /**
     * 审核人ID
     */
    @TableField("approve_by")
    private Integer approveBy;

    /**
     * 资源详情
     */
    @TableField("details")
    private String details;
}
