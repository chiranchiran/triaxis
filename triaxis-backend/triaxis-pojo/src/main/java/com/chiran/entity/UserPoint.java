package com.chiran.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@TableName("user_points")
public class UserPoint {
    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;

    @TableField("user_id")
    private Integer userId;

        /**
         * 变动积分（正数=获得，负数=消耗）
         */
        @TableField("points_change")
        private Integer pointsChange;

        /**
         * 积分变动类型
         */
        @TableField("points_type")
        private Integer pointsType;

        /**
         * 变动前的剩余积分
         */
        @TableField("before_balance")
        private Integer beforeBalance;

        /**
         * 变动后的剩余积分
         */
        @TableField("after_balance")
        private Integer afterBalance;

        /**
         * 备注（如："上传资源《xxx》获得积分"）
         */
        @TableField("remark")
        private String remark;

        /**
         * 记录创建时间（操作发生时间）
         * 插入时自动填充当前时间
         */
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
        @TableField(value = "create_time", fill = FieldFill.INSERT)
        private LocalDateTime createTime;

        /**
         * 逻辑删除字段（0=未删除，1=已删除）
         */
        @TableLogic // MP逻辑删除注解
        private Integer deleted;

}
