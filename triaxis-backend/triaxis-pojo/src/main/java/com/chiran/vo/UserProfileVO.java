package com.chiran.vo;

import com.chiran.bo.CategoryBO;
import com.fasterxml.jackson.annotation.JsonFormat;
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
public class UserProfileVO implements Serializable {
    private Integer id;
    private String username;
    private String avatar;
    private String email;
    private String phone;
    private String wechatOpenid;
    private String qqOpenid;
    private String weiboUid;
    private String githubId;
    private String bio;
    private Integer gender;
    private String school;
    private String major;
    private String grade;
    private CategoryBO subject;
    private Integer vipLevel;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private LocalDateTime vipTime;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private LocalDateTime vipStart;
    @JsonFormat(pattern = "yyyy.MM.dd", timezone = "GMT+8")
    private LocalDateTime createTime;
    private Integer status;
    private Integer role;
}