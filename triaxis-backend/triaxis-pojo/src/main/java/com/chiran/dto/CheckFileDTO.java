package com.chiran.dto;

import lombok.Data;

@Data
public class CheckFileDTO {
    private String hash;
    private String fileName;
    private long size;
}
