package com.chiran.dto;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class ResourceSearchDTO implements Serializable {
    private Integer userId;
    private Integer rightId;
    private Integer subjectId;
    private List<Integer> toolIds;
    private List<Integer> categoryIds;
    private Integer page;
    private Integer pageSize;
    private String search;
    //0代表时间倒序、1代表收藏量，2代表下载量，3代表点赞量，4代表综合排序
    private Integer orderBy;
}
