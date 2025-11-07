package com.chiran.vo;

import com.chiran.bo.ResourceSearchBO;
import com.chiran.bo.UserActionsBO;
import com.chiran.bo.UserBO;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResourceSearchVO implements Serializable {
    private ResourceSearchBO detail;
    private UserBO uploader;
    private UserActionsBO userActions;
}
