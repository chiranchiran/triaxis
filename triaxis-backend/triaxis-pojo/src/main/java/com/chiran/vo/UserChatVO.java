package com.chiran.vo;

import com.chiran.bo.UserBO;
import com.chiran.entity.UserChat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserChatVO implements Serializable {
    private Integer id;
    private UserBO sender;
    private UserChat lastMessage;
    private Integer unread;
}