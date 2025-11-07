package com.chiran.dto;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class CommunityBountyDTO implements Serializable {
    private Integer userId;
    private String search;
    //1代表时间倒序、2代表收藏量，3代表下载量，4代表点赞量，5代表综合排序
    private Integer orderBy;
    private Boolean isSolved;
    private Integer subjectId;
    private List<Integer> topicIds;
    private Integer page;
    private Integer pageSize;
    private Integer type;
}
