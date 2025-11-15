package com.chiran.dto;

import lombok.Data;

import java.io.Serializable;


@Data
public class ChatSendDTO implements Serializable {
    private Integer receiverId;
    private  Integer senderId;
    private  Integer type;
    private  String content;
}
