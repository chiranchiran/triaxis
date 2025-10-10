package com.chiran.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;
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
@TableName("user_action_types")
public class UserActionTypes implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 操作类型ID
     */
    @TableId("id")
    private Integer id;

    /**
     * 操作类型名称
     */
    @TableField("name")
    private String name;

    /**
     * 操作描述
     */
    @TableField("description")
    private String description;

    /**
     * 默认积分变化
     */
    @TableField("points_change")
    private Integer pointsChange;

    @TableField("is_active")
    private Boolean isActive;
}
