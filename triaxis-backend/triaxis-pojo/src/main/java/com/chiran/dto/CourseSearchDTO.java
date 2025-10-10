package com.chiran.dto;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class CourseSearchDTO implements Serializable {
    private Integer id;
    private Integer rightId;
    private Integer fieldId;
    private List<Integer> categoryId;
    private Integer difficultyLevel;
    private Integer minDuration;
    private Integer maxDuration;
    private Integer page;
    private Integer pageSize;
    private String search;
    // 0-时间倒序，1-热度(浏览量)，2-评分，3-收藏量，4-综合排序
    private Integer orderBy;
}