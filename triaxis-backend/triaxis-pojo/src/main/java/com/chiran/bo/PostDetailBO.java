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
public class PostDetailBO implements Serializable {
    //帖子信息
    private Integer id;
    private String title;
    private String description;
    private String subject;
    private String topic;
    private String content;
    private Integer type;
    private Integer price;
    private Integer urgency;
    private Boolean isSolved;
    private Boolean isRecommended;
    private Integer viewCount=0;
    private Integer replyCount=0;
    private Integer collectCount=0;
    private Integer likeCount=0;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private LocalDateTime solvedTime;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private LocalDateTime deadline;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private LocalDateTime publishTime;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private LocalDateTime updateTime;
}
