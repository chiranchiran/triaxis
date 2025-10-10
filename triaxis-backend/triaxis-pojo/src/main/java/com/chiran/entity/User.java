package com.chiran.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.Date;

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

    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;

    /**
     * 用户名
     */
    @TableField("username")
    private String username;
    /**
     * 用户名
     */
    @TableField("role")
    private Integer role;
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
    @TableField("avatar_url")
    private String avatarUrl;

    /**
     * 个人简介
     */
    @TableField("bio")
    private String bio;

    /**
     * 0-未知，1-男，2-女
     */
    @TableField("gender")
    private Integer gender;

    /**
     * 出生日期
     */
    @TableField("birth_date")
    private Date birthDate;

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
     * 专业领域
     */
    @TableField("professional_field_id")
    private Integer professionalFieldId;

    /**
     * 会员等级：0-普通用户，1-VIP，2-SVIP
     */
    @TableField("membership_level")
    private Integer membershipLevel;

    /**
     * 会员到期时间
     */
    @TableField("membership_expires_at")
    private Date membershipExpiresAt;

    /**
     * 积分余额
     */
    @TableField("points_balance")
    private Integer pointsBalance;

    /**
     * 累计获得积分
     */
    @TableField("total_points_earned")
    private Integer totalPointsEarned;

    /**
     * 累计消耗积分
     */
    @TableField("total_points_spent")
    private Integer totalPointsSpent;

    /**
     * 上传资源数
     */
    @TableField("resource_count")
    private Integer resourceCount;

    /**
     * 下载资源数
     */
    @TableField("download_count")
    private Integer downloadCount;

    /**
     * 获赞数
     */
    @TableField("like_count")
    private Integer likeCount;

    /**
     * 是否激活
     */
    @TableField("is_active")
    private Boolean isActive;

    /**
     * 软删除，1是删除，0未删除
     */
    @TableField("deleted")
    private Integer deleted;

    /**
     * 最后登录时间
     */
    @TableField("last_login_at")
    private Date lastLoginAt;

    /**
     * 最后登录IP
     */
    @TableField("last_login_ip")
    private String lastLoginIp;

    @TableField("created_at")
    private Date createdAt;

    @TableField("updated_at")
    private Date updatedAt;
}
