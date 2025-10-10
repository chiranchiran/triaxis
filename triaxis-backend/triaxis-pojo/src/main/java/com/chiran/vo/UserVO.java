package com.chiran.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
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
    private String avatarUrl;
    private String bio;
    private Integer gender;
    private Date birthDate;
    private String school;
    private String major;
    private String grade;
    private Integer professionalFieldId;
    private Integer membershipLevel;
    private Date membershipExpiresAt;
    private Integer pointsBalance;
    private Integer resourceCount;
    private Integer downloadCount;
    private Integer likeCount;
    private Date lastLoginAt;
    private Date createdAt;
}
