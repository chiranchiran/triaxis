package com.chiran.dto;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class CommunitySquareDTO implements Serializable {
    private Integer userId;
    private Integer page;
    private Integer pageSize;
}
