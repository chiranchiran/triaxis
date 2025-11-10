package com.chiran.dto;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class ResourceSearchDTO implements Serializable {
    private Integer userId;
    private Integer right;
    private Integer subjectId;
    private List<Integer> toolIds;
    private List<Integer> categoriesFirst;
    private List<Integer> categoriesSecondary;
    private Integer page;
    private Integer pageSize;
    private String search;
    //1代表时间倒序、2代表收藏量，3代表下载量，4代表点赞量，5代表综合排序，6收藏时间，7点赞时间，8上传时间，9购买时间
    private Integer orderBy;
}
