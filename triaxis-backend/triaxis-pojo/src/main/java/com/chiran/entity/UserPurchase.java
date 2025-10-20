package com.chiran.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

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
@TableName("user_purchases")
public class UserPurchase implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;

    @TableField("user_id")
    private Integer userId;
    @TableField("target_type")
    private Integer targetType;
    @TableField("target_id")
    private Integer targetId;
    @TableField("deleted")
    @TableLogic
    private Integer deleted;
}
