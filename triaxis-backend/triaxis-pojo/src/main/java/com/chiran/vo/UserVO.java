package com.chiran.vo;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableLogic;
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
    private Integer subjectId;
    private Integer vipLevel;
    private LocalDateTime vipTime;
    private Integer points;
    private Integer resourceCount;
    private Integer postCount;
    private Integer courseCount;
    private Integer likeCount;
    private Integer status;
    private Integer deleted;
    private Integer role;

}
