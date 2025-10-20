package com.chiran.dto;

import lombok.Data;

import java.io.Serializable;

@Data
public class ResourceCategorySecondaryDTO implements Serializable {
    private static final long serialVersionUID = 1L;
    private Integer parentId;
    private Integer subjectId;
}
