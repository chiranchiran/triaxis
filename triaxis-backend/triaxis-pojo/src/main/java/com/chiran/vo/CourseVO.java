package com.chiran.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseVO implements Serializable {
    private Integer id;
    private String title;
    private String subtitle;
    private String description;
    private String coverImage;
    private String introVideo;

    private Integer userId;
    private Integer categoryId;
    private Integer rightId;
    private Integer fieldId;

    private Integer totalDuration;
    private Integer difficultyLevel;

    private Integer viewCount;
    private Integer likeCount;
    private Integer favoriteCount;
    private BigDecimal averageRating;
    private Integer reviewCount;

    private Integer pricePoints;

    private Integer status;
    private Boolean isFeatured;

    private Date publishedAt;
    private Date createdAt;
    private Date updatedAt;

    // 用户是否已购买/已收藏等状态（根据业务需要添加）
    private Boolean isPurchased;
    private Boolean isFavorited;
    private Boolean isLiked;
}
