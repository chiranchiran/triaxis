package com.chiran.dto;

import lombok.Data;

import java.io.Serializable;

@Data
public class CourseReviewDTO implements Serializable {
    private Integer courseId;
    private Integer rating;
    private String title;
    private String content;
    private Boolean isAnonymous;
}
