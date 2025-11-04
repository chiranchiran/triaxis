package com.chiran.vo;

import com.chiran.bo.CategoryBO;
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
public class CommunityTypesVO implements Serializable {
    private List<CategoryBO> subjects;
    private List<CategoryBO> topics;
}
