package com.chiran.dto;

import lombok.Data;

@Data
public class CreateFolderDTO {
    private  Integer id;
    private String name;
    private String description;
    private Integer favoriteType;
    private Boolean isPublic;
}