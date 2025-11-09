package com.chiran.vo;

import com.chiran.bo.CategoryBO;
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
public class UserMySettingsVO implements Serializable {
    private Integer id;
    private Boolean publicInfo = true;
    private Boolean publicLikes = false;
    private Boolean publicCollections = false;
    private Boolean messageNotification = true;
    private Boolean emailSubscription = false;
}
