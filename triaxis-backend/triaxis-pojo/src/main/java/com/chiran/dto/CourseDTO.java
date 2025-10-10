package com.chiran.dto;

import lombok.Data;

import java.io.Serializable;
import java.util.Date;

@Data
public class CourseDTO implements Serializable {
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
    private Integer pricePoints;

    private Integer status;
    private Boolean isFeatured;

    private Date publishedAt;
}
