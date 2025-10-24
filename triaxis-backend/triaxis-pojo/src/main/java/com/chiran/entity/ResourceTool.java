package com.chiran.entity;

import com.baomidou.mybatisplus.annotation.*;

import java.io.Serializable;
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
@TableName("resource_tool")
public class ResourceTool implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;

    @TableField("resource_id")
    private Integer resourceId;

    @TableField("tool_id")
    private Integer toolId;

    @TableField("create_time")
    private Date createTime;
    @TableField("create_by")
    private Integer createdBy;
    @TableField("deleted")
    @TableLogic
    private Integer deleted;
}
