package com.chiran.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResourceSearchVO implements Serializable {
    //资源信息
    private Integer id;
    private String title;
    private String description;
    private String coverImage;
    private Long size;
    private String extension;
    private Integer userId;
    private String username;
    private String avatar;
    private Integer price;
    private Integer downloadCount;
    private Integer collectCount;
    private Integer likeCount;
    @JsonFormat(pattern = "yyyy.MM.dd", timezone = "GMT+8")
    private LocalDateTime publishTime;
    @JsonFormat(pattern = "yyyy.MM.dd", timezone = "GMT+8")
    private LocalDateTime updateTime;
    //用户与资源的关系
    private Boolean isLiked;
    private Boolean isCollected;
    private Boolean isPurchased;
}
