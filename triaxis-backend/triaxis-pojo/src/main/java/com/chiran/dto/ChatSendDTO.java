package com.chiran.dto;

import com.chiran.entity.UserChat;
import lombok.Data;

import java.io.Serializable;


@Data
public class ChatSendDTO extends UserChat implements Serializable {
    private Integer receiverId;
    private  Integer senderId;
    private  Integer type;
    private  String content;
}
