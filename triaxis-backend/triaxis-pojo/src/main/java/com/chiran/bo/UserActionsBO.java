package com.chiran.bo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserActionsBO implements Serializable {
    //用户与资源的关系
    private Boolean isLiked;
    private Boolean isCollected;
    private Boolean isPurchased;
}