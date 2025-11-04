package com.chiran.entity;

import com.baomidou.mybatisplus.annotation.*;

import java.io.Serializable;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

/**
 * <p>
 * 
 * </p>
 *
 * @author chiran
 * @since 2025-10-07
 */
@Getter
@Setter
@TableName("users")
public class User implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 主键ID
     */
    @TableId(type = IdType.AUTO)
    private Integer id;

    /**
     * 用户名
     */
    @TableField(value = "username")
    private String username;

    /**
     * 邮箱（可选）
     */
    @TableField("email")
    private String email;

    /**
     * 手机号（可选）
     */
    @TableField("phone")
    private String phone;

    /**
     * 密码（可选，第三方登录可能没有）
     */
    @TableField("password")
    private String password;

    /**
     * 微信OpenID
     */
    @TableField("wechat_openid")
    private String wechatOpenid;

    /**
     * QQ OpenID
     */
    @TableField("qq_openid")
    private String qqOpenid;

    /**
     * 微博UID
     */
    @TableField("weibo_uid")
    private String weiboUid;

    /**
     * GitHub ID
     */
    @TableField("github_id")
    private String githubId;

    /**
     * 头像URL
     */
    @TableField("avatar")
    private String avatar;

    /**
     * 个人简介
     */
    @TableField("bio")
    private String bio;

    /**
     * 性别：0-未知，1-男，2-女
     */
    @TableField("gender")
    private Integer gender;

    /**
     * 学校
     */
    @TableField("school")
    private String school;

    /**
     * 专业
     */
    @TableField("major")
    private String major;

    /**
     * 年级
     */
    @TableField("grade")
    private String grade;

    /**
     * 专业领域（关联专业领域表）
     */
    @TableField("subject_id")
    private Integer subjectId;

    /**
     * 会员等级：0-普通用户，1-VIP，2-SVIP
     */
    @TableField("vip_level")
    private Integer vipLevel;

    /**
     * 会员到期时间
     */
    @TableField("vip_time")
    private LocalDateTime vipTime;

    /**
     * 积分余额
     */
    @TableField("points")
    private Integer points;

    /**
     * 累计获得积分
     */
    @TableField("points_get")
    private Integer pointsGet;

    /**
     * 累计消耗积分
     */
    @TableField("points_spent")
    private Integer pointsSpent;

    /**
     * 上传资源数
     */
    @TableField("resource_count")
    private Integer resourceCount;

    /**
     * 发布帖子数量
     */
    @TableField("post_count")
    private Integer postCount;

    /**
     * 上传课程数
     */
    @TableField("course_count")
    private Integer courseCount;

    /**
     * 获赞数
     */
    @TableField("like_count")
    private Integer likeCount;

    /**
     * 账户状态：0-禁用，1-正常使用
     */
    @TableField("status")
    private Integer status;

    /**
     * 软删除：1-已删除，0-未删除
     */
    @TableLogic // MyBatis-Plus 逻辑删除注解
    @TableField("deleted")
    private Integer deleted;

    /**
     * 最后登录时间
     */
    @TableField("last_login_at")
    private LocalDateTime lastLoginAt;

    /**
     * 最后登录IP
     */
    @TableField("last_login_ip")
    private String lastLoginIp;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @TableField(value = "create_time", fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @TableField(value = "update_time", fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

    /**
     * 角色：0-普通用户，1-管理员
     */
    @TableField("role")
    private Integer role;
}
