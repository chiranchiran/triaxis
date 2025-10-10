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
public class UserInfoVO implements Serializable {
    private Integer id;
    /**
     * 用户名
     */
    private String username;

    /**
     * 角色
     */
    private Byte role;
    /**
     * 头像URL
     */
    private String avatarUrl;
    /**
     * 会员等级：0-普通用户，1-VIP，2-SVIP
     */
    private Byte membershipLevel;
    /**
     * 积分余额
     */
    private Integer pointsBalance;
    private Boolean isActive;
    private String password;
}