package com.chiran.vo;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableLogic;
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
public class ReviewSearchVO implements Serializable {
    private UserBO user;
    private UserBO replyTo;
    private Integer id;
    private Integer parentId;
    private Integer rootId;
    private Integer rate;
    private String content="";
    @JsonFormat(pattern = "yyyy.MM.dd HH:mm:ss", timezone = "GMT+8")
    private LocalDateTime publishTime;
    private Integer likeCount=0;
    private Boolean isLiked=false;
    private Integer replyCount=0;
}
