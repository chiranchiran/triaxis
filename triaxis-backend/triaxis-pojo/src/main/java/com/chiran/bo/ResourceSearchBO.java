package com.chiran.bo;

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
public class ResourceSearchBO implements Serializable {
    //资源信息
    private Integer id;
    private String title;
    private String description;
    private String coverImage;
    private Integer right;
    private Integer price;
    private Long size;
    private Integer status;
    private String extension;
    private String details;
    private Integer downloadCount;
    private Integer collectCount;
    private Integer likeCount;
    @JsonFormat(pattern = "yyyy.MM.dd", timezone = "GMT+8")
    private LocalDateTime publishTime;
    @JsonFormat(pattern = "yyyy.MM.dd", timezone = "GMT+8")
    private LocalDateTime updateTime;
}
