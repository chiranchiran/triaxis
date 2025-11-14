package com.chiran.dto;

import lombok.Data;

@Data
public class MergeChunksDTO {
    private String hash;
    private String fileName;
    private int chunksCount;
}
