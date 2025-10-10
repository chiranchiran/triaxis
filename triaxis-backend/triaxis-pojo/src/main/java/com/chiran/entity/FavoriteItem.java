package com.chiran.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;
import java.time.LocalDateTime;
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
@TableName("favorite_items")
public class FavoriteItem implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    @TableField("favorite_id")
    private Integer favoriteId;

    /**
     * 1-资源，2-课程，3-帖子
     */
    @TableField("item_type")
    private Integer itemType;

    /**
     * 收藏项ID
     */
    @TableField("item_id")
    private Integer itemId;

    @TableField("created_at")
    private Date createdAt;
}
