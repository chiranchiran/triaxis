package com.chiran.bo;

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
public class CategoriesBO implements Serializable {
    private String subject;
    private List<CategoryBO> tools;
    private List<CategoryBO> categoriesFirst;
    private List<CategoryBO> categoriesSecondary;
}