package com.chiran.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;


@Getter
@Setter
@TableName("user_chats")
public class UserChat {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;

    /**
     * 发送者用户ID（关联users表id）
     */
    @TableField("sender_id")
    private Integer senderId;

    /**
     * 接收者ID（单聊=用户ID，群聊=群ID，关联users表id）
     */
    @TableField("receiver_id")
    private Integer receiverId;

    /**
     * 消息内容（文本/图片URL/文件URL）
     */
    @TableField("content")
    private String content;

    /**
     * 消息类型：1=文本，2=图片，3=文件
     */
    @TableField("type")
    private Integer type = 1; // 默认文本类型

    /**
     * 发送时间（数据库自动填充）
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @TableField(value = "send_time", fill = FieldFill.INSERT)
    private LocalDateTime sendTime;

    /**
     * 是否已读：0=未读，1=已读
     */
    @TableField("is_read")
    private Boolean isRead = false; // 默认未读

    /**
     * 是否撤回：0=正常，1=已撤回
     */
    @TableField("is_revoke")
    private Boolean isRevoke = false; // 默认未撤回


    @TableLogic
    private Integer deleted;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @TableField(value = "create_time", fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @TableField(value = "update_time", fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
}
