package com.chiran.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserStatsVO implements Serializable {
    private Integer resourceCount;
    private Integer courseCount;
    private Integer downloadCount;
    private Integer likeCount;
    private Integer favoriteCount;
    private Integer pointsBalance;
}
