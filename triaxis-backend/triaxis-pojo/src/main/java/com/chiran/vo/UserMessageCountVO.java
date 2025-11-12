package com.chiran.vo;

import com.chiran.bo.MessageTargetBo;
import com.chiran.bo.ReviewTargetBo;
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
public class UserMessageCountVO implements Serializable {
    private Integer total;
    private Integer chat;
    private Integer like;
    private Integer collect;
    private Integer review;
    private Integer system;
}