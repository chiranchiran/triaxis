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
    @TableField("path")
    private String path;

    @TableField("cover_image")
    private String coverImage;
    /**
     * 文件大小(字节)
     */
    @TableField("size")
    private Long size;

    /**
     * 文件扩展名
     */
    @TableField("extension")
    private String extension;

    /**
     * 权限ID（1是免费，2是积分兑换，3是VIP专享）
     */
    @TableField(value = "`right`")
    private Integer right;

    /**
     * 科目ID（关联subjects表）
     */
    @TableField("subject_id")
    private Integer subjectId;

    /**
     * 上传用户ID（关联users表）
     */
    @TableField("user_id")
    private Integer userId;

    /**
     * 下载次数
     */
    @TableField("download_count")
    private Integer downloadCount;

    /**
     * 收藏次数
     */
    @TableField("collect_count")
    private Integer collectCount;
    /**
     * 查看次数
     */
    @TableField("view_count")
    private Integer viewCount;

    /**
     * 点赞次数
     */
    @TableField("like_count")
    private Integer likeCount;
    /**
     * 所需积分
     */
    @TableField("price")
    private Integer price;


    /**
     * 状态（1-草稿，2-审核中，3-已发布，4-已下架）
     */
    @TableField("status")
    private Integer status;

    /**
     * 是否推荐资源（0-不推荐，1-推荐）
     */
    @TableField("is_recommended")
    private Boolean isRecommended;

    /**
     * 软删除标识（0-未删除，1-已删除）
     */
    @TableField("deleted")
    @TableLogic
    private Integer deleted;

    /**
     * 创建时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @TableField(value = "create_time", fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    /**
     * 发布时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @TableField("publish_time")
    private LocalDateTime publishTime;

    /**
     * 更新时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @TableField(value = "update_time", fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

    /**
     * 审核人ID
     */
    @TableField("approve_by")
    private Integer approveBy;

    /**
     * 资源详情
     */
    @TableField("details")
    private String details;
}
