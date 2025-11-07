package com.chiran.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
@Getter
@Setter
@TableName("posts") // 绑定数据库表名
public class Post {
    private static final long serialVersionUID = 1L;
    /**
     * 帖子ID（自增主键）
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;

    /**
     * 帖子标题
     */
    @TableField("title")
    private String title;

    /**
     * 帖子描述
     */
    @TableField("description")
    private String description = "该帖子没有具体描述";

    /**
     * 帖子内容
     */
    @TableField("content")
    private String content;

    /**
     * 帖子类型：1-普通帖，2-悬赏帖
     */
    @TableField("type")
    private Integer type;

    /**
     * 关联专业领域ID
     */
    @TableField("subject_id")
    private Integer subjectId;

    /**
     * 关联主题分类ID
     */
    @TableField("topic_id")
    private Integer topicId;

    /**
     * 发帖人ID
     */
    @TableField("user_id")
    private Integer userId;

    /**
     * 浏览量
     */
    @TableField("view_count")
    private Integer viewCount = 0;

    /**
     * 回复数
     */
    @TableField("reply_count")
    private Integer replyCount = 0;

    /**
     * 点赞数
     */
    @TableField("like_count")
    private Integer likeCount = 0;

    /**
     * 收藏数
     */
    @TableField("collect_count")
    private Integer collectCount = 0;

    /**
     * 悬赏积分
     */
    @TableField("price")
    private Integer price;

    /**
     * 截止时间
     */
    @TableField("deadline")
    private LocalDateTime deadline;

    /**
     * 紧急程度：1-紧急，2-一般，3-普通
     */
    @TableField("urgency")
    private Integer urgency = 2;

    /**
     * 是否解决：1-是，0-否
     */
    @TableField("is_solved")
    private Boolean isSolved = false;

    /**
     * 解决时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @TableField("solved_time")
    private LocalDateTime solvedTime;

    /**
     * 是否推荐：1-是，0-否
     */
    @TableField("is_recommended")
    private Boolean isRecommended = false;

    /**
     * 状态：1-草稿，2-审核中，3-已发布，4-被举报
     */
    @TableField("status")
    private Integer status = 3;

    /**
     * 软删除标识：1-已删除，0-未删除
     */
    @TableLogic
    @TableField("deleted")
    private Integer deleted = 0;

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
}
