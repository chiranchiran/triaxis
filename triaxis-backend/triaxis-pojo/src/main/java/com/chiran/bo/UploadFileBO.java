package com.chiran.bo;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UploadFileBO implements Serializable {
    private Integer uid;
    private String name;
    private String path;
    private String type;
    private Long size;
}
