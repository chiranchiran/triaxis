package com.chiran.entity;

import com.baomidou.mybatisplus.annotation.*;

import java.io.Serializable;
import java.time.LocalDateTime;

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
@TableName("user_actions")
public class UserActions implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    @TableField("user_id")
    private Integer userId;

    /**
     * 1-资源，2-课程，3-帖子，4-用户
     */
    @TableField("target_type")
    private Integer targetType;

    /**
     * 目标ID
     */
    @TableField("target_id")
    private Integer targetId;

    /**
     * 操作类型
     */
    @TableField("action_type")
    private Integer actionType;

    /**
     * 1-执行，0-取消
     */
    @TableField("action_status")
    private Integer actionStatus;

    /**
     * 积分变化，正数为获得，负数为消耗
     */
    @TableField("points_change")
    private Integer pointsChange;

    /**
     * 操作IP
     */
    @TableField("ip_address")
    private String ipAddress;

    /**
     * 用户代理
     */
    @TableField("user_agent")
    private String userAgent;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @TableField(value = "create_time", fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @TableField(value = "update_time", fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
}
