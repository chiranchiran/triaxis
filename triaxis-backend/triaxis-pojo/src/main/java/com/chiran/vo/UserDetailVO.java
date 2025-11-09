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
public class UserDetailVO implements Serializable {
    private Integer id;
    private String username;
    private String avatar;
    private String bio;
    private Integer gender;
    private String school;
    private String major;
    private String grade;
    private CategoryBO subject;
    private Integer vipLevel;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private LocalDateTime vipTime;
    @JsonFormat(pattern = "yyyy.MM.dd", timezone = "GMT+8")
    private LocalDateTime createTime;
    private Integer points;
    private Integer resourceCount;
    private Integer postCount;
    private Integer courseCount;
    private Integer likeCount;
    private Integer purchaseCount;
    private Integer status;
    private Integer role;
}
