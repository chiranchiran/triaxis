package com.chiran.vo;

import com.chiran.bo.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResourceVO  implements Serializable {
    private ResourceSearchBO resourceDetail;
    private UserBO uploader;
    private UserActionsBO userActions;
    private List<CategoryBO> images;
    private List<CategoryBO> tags;
    private ResourceCategoryBO category;
}
