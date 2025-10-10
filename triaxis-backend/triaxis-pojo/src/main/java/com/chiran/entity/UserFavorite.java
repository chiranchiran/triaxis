package com.chiran.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
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
@TableName("user_favorites")
public class UserFavorite implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;

    @TableField("user_id")
    private Integer userId;

    /**
     * 收藏夹名称
     */
    @TableField("name")
    private String name;

    /**
     * 收藏夹描述
     */
    @TableField("description")
    private String description;

    /**
     * 1-资源，2-课程，3-帖子
     */
    @TableField("favorite_type")
    private Integer favoriteType;

    /**
     * 是否公开
     */
    @TableField("is_public")
    private Boolean isPublic;

    @TableField("sort_order")
    private Integer sortOrder;

    /**
     * 收藏项数量
     */
    @TableField("item_count")
    private Integer itemCount;

    @TableField("created_at")
    private Date createdAt;

    @TableField("updated_at")
    private Date updatedAt;
}
