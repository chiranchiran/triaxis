package com.chiran.dto;

import lombok.Data;

@Data
public class AddFavoriteDTO {
    private Integer id;
    private Integer favoriteId;
    private Integer itemType;
    private Integer itemId;
}