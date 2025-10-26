package com.chiran.dto;

import lombok.Data;

import java.io.Serializable;


@Data
public class ReviewSearchDTO implements Serializable {
    private Integer targetId;
    private  Integer userId;
    private  Integer targetType;
    private Integer rootId;
    private Integer size;
    private Integer orderBy;
}
