package com.chiran.bo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResourceCategoryBO {
    private String subject;
    private Integer right;
    private List<CategoryBO> tools;
    private  List<CategoryBO> categoriesFirst;
    private  List<CategoryBO> categoriesSecondary;
}
