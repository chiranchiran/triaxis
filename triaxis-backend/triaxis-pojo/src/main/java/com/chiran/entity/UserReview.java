package com.chiran.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDateTime;

@Getter
@Setter
public class UserReview implements Serializable {

    private static final long serialVersionUID = 1L;
    @TableId(type = IdType.AUTO) // 主键自增策略
    private Integer id;

    /**
     * 取值：1=资源，2=课程
     */
    @TableField("target_type")
    private Integer targetType;

    /**
     * 关联：资源ID/课程ID（与 target_type 对应）
     */
    @TableField("target_id")
    private Integer targetId;

    /**
     * 外键：关联 users 表的 id 字段（删除用户时级联删除）
     */
    @TableField("user_id")
    private Integer userId;

    /**
     * 取值范围：1-5分
     */
    private Integer rate;

    /**
     */
    private String content;

    @TableField("parent_id")
    private Integer parentId;
    @TableField("root_id")
    private Integer rootId;

    /**
     * 取值：0=审核中，1=审核通过，2=被举报
     */
    private Integer status;

    /**
     * 取值：true=匿名，false=非匿名
     */
    @TableField("is_anonymous")
    private Boolean isAnonymous;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @TableField(value = "create_time", fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @TableField(value = "publish_time", fill = FieldFill.INSERT)
    private LocalDateTime publishTime;

    @TableLogic
    private Integer deleted;

    @TableField("like_count")
    private Integer likeCount;

    @TableField("reply_count")
    private Integer replyCount;
}
