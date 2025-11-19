package com.chiran.dto;

import lombok.Data;

import java.io.Serializable;

@Data
public class MessageDTO implements Serializable {
    private Integer id;
    private Integer page=0;
    private Integer pageSize=20;
}
