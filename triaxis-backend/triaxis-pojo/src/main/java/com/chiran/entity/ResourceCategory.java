package com.chiran.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.Date;

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
@TableName("resource_category")
public class ResourceCategory implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;

    @TableField("resource_id")
    private Integer resourceId;

    @TableField("category_id")
    private Integer categoryId;

    @TableField("create_time")
    private Date createTime;
    @TableField("create_by")
    private Integer createdBy;
    @TableField("deleted")
    @TableLogic
    private Integer deleted;
}
