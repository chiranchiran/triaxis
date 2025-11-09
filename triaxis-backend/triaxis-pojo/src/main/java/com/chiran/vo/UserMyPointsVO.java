package com.chiran.vo;

import com.chiran.bo.CategoryBO;
import com.chiran.entity.UserPoint;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserMyPointsVO implements Serializable {
    private Integer id;
    private Integer points;
    private Integer pointsGet;
    private Integer pointsSpent;
    // 签到获得
    private Integer checkinObtained;

    // 上传资源获得
    private Integer uploadResourceObtained;

    // 上传课程获得
    private Integer uploadCourseObtained;

    // 发帖获得
    private Integer postObtained;

    // 评论获得
    private Integer commentObtained;

    // 解决悬赏贴获得
    private Integer solveRewardObtained;

    // 购买资源消耗
    private Integer buyResourceConsumed;

    // 购买课程消耗
    private Integer buyCourseConsumed;

    // 发布悬赏贴消耗
    private Integer publishRewardConsumed;
    private List<UserPoint> userActions;
}
