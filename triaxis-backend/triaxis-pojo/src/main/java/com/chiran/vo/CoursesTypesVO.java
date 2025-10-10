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
public class CoursesTypesVO implements Serializable {
    private List<CategoryVO> rights;
    private List<CategoryVO> subjects;
    private List<CategoryVO> categories;
}
