package com.chiran.vo;

import com.chiran.bo.*;
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
public class CommunityPostVO implements Serializable {
    private PostDetailBO detail;
    private UserBO uploader;
    private UserActionsBO userActions;
    private List<CategoryBO> images;
    private List<CategoryBO> tags;
    private PostCategoryBO category;
}
