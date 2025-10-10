package com.chiran.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;
import java.time.LocalDateTime;
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
@TableName("user_points_history")
public class UserPointsHistory implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    @TableField("user_id")
    private Integer userId;

    /**
     * 积分变化值
     */
    @TableField("points_change")
    private Integer pointsChange;

    /**
     * 变化后余额
     */
    @TableField("current_balance")
    private Integer currentBalance;

    /**
     * 操作类型
     */
    @TableField("action_type")
    private Integer actionType;

    /**
     * 关联的操作记录ID
     */
    @TableField("related_id")
    private Long relatedId;

    /**
     * 流水描述
     */
    @TableField("description")
    private String description;

    @TableField("created_at")
    private LocalDateTime createdAt;
}
