package com.chiran.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResourcesTypesVO implements Serializable {
    private List<CategoryVO> rights;
    private List<CategoryVO> subjects;
    private List<CategoryVO> tools;
    private List<CategoryVO> categoriesFirst;
}
