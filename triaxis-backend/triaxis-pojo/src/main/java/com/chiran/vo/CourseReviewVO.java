package com.chiran.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseReviewVO {
    private Long id;
    private Integer courseId;
    private Integer userId;
    private String userName;
    private String userAvatar;
    private Integer rating;
    private String title;
    private String content;
    private Boolean isAnonymous;
    private Integer likeCount;
    private Boolean isLiked; // 当前用户是否点赞
    private Date createdAt;
    private Date updatedAt;
}
