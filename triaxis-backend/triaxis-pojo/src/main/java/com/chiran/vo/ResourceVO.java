package com.chiran.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResourceVO implements Serializable {
    //资源信息
    private Integer id;
    private String title;
    private String description;
    private Long size;
    private String extension;
    private Integer rightId;
    private Integer subjectId;
    private Integer userId;
    private Integer price = 0;
    private String details;
    private Integer downloadCount;
    private Integer collectCount;
    private Integer likeCount;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private LocalDateTime publishTime;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private LocalDateTime updateTime;
    private List<Integer> toolIds;
    private List<Integer> categoryIds;
    //用户与资源的关系
    private Boolean isLiked = false;
    private Boolean isCollected = false;
    private Boolean isPurchased = false;
}
