package com.chiran.vo;

import com.chiran.bo.CategoryBO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

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
    private Integer role;
    /**
     * 头像URL
     */
    private String avatar;
    /**
     * 会员等级：0-普通用户，1-VIP，2-SVIP
     */
    private Integer vipLevel;
    /**
     * 会员到期时间
     */
    private LocalDateTime vipTime;
    /**
     * 积分余额
     */
    private Integer points;
    private Integer Status;
    private String password;

}