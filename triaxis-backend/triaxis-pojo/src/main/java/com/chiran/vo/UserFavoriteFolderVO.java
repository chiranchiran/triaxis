package com.chiran.vo;

import lombok.Data;

import java.util.Date;

@Data
public class UserFavoriteFolderVO {
    private Integer id;
    private String name;
    private String description;
    private Integer favoriteType;
    private Boolean isPublic;
    private Integer itemCount;
    private Date createdAt;
}
