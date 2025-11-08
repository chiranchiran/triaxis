package com.chiran.vo;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserVO implements Serializable {
    private Integer id;
    private String username;
    private String email;
    private String phone;
    private String avatar;
    private String wechatOpenid;
    private String qqOpenid;
    private String weiboUid;
    private String githubId;
    private String bio;
    private Integer gender;
    private String school;
    private String major;
    private String grade;
    private String subject;
    private Integer vipLevel;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private LocalDateTime vipTime;
    @JsonFormat(pattern = "yyyy.MM.dd", timezone = "GMT+8")
    private LocalDateTime createTime;
    private Integer points;
    private Integer pointsGet;
    private Integer pointsSpent;
    private Integer resourceCount;
    private Integer postCount;
    private Integer courseCount;
    private Integer likeCount;
    private Integer purchaseCount;
    private Integer status;
    private Integer role;

}
