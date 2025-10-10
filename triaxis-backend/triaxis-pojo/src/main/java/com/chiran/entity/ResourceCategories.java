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
@TableName("resource_categories")
public class ResourceCategories implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;

    @TableField("parent_id")
    private Integer parentId;

    @TableField("name")
    private String name;

    @TableField("description")
    private String description;

    /**
     * 1: 一级分类, 2: 二级分类
     */
    @TableField("level")
    private Integer level;

    @TableField("sort_order")
    private Integer sortOrder;

    /**
     * 学科特有标记: 关联学科id, 空为共有
     */
    @TableField("specialized_field")
    private Integer specializedField;

    @TableField("is_active")
    private Boolean isActive;

    @TableField("created_at")
    private LocalDateTime createdAt;
}
