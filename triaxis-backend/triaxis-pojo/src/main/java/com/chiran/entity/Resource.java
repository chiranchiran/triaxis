package com.chiran.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

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
@TableName("resources")
public class Resource implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;

    @TableField("title")
    private String title;

    @TableField("description")
    private String description;

    /**
     * 文件存储路径
     */
    @TableField("file_path")
    private String filePath;

    /**
     * 文件大小(字节)
     */
    @TableField("file_size")
    private Long fileSize;

    /**
     * 缩略图路径
     */
    @TableField("thumbnail_path")
    private String thumbnailPath;

    /**
     * 文件扩展名
     */
    @TableField("file_extension")
    private String fileExtension;

    @TableField("right_id")
    private Integer rightId;

    @TableField("field_id")
    private Integer fieldId;

    /**
     * 关联到最细分的资源类型
     */
    @TableField("category_id")
    private Integer categoryId;

    /**
     * 所需积分，0表示免费，-1表示会员专属
     */
    @TableField("price_points")
    private Integer pricePoints;

    @TableField("download_count")
    private Integer downloadCount;

    @TableField("view_count")
    private Integer viewCount;

    @TableField("average_rating")
    private BigDecimal averageRating;

    /**
     * 上传用户ID
     */
    @TableField("uploader_id")
    private Integer uploaderId;

    /**
     * 1-草稿，2-审核中，3-已发布，4-已下架
     */
    @TableField("status")
    private Integer status;

    /**
     * 是否推荐资源
     */
    @TableField("is_featured")
    private Boolean isFeatured;

    /**
     * 软删除，1是删除，0未删除
     */
    @TableField("deleted")
    private Integer deleted;

    @TableField("created_at")
    private Date createdAt;

    @TableField("updated_at")
    private Date  updatedAt;
    // 关联的软件工具列表（非数据库字段）
    @TableField(exist = false)
    private List<Integer> toolIds;
}
