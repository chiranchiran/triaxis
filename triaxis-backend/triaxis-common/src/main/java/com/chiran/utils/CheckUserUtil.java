package com.chiran.utils;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.toolkit.support.SFunction;
import org.springframework.stereotype.Component;

@Component
public class CheckUserUtil {
    public static <T> boolean checkAction(Integer userId, Integer targetId, Integer targetType, SFunction<T,Integer> userField, SFunction<T,Integer> targetIdField, SFunction<T,Integer> targetTypeField, BaseMapper<T> mapper) {
        if (userId == null || targetId == null || targetType == null
                || userField == null || targetIdField == null || targetTypeField == null || mapper == null) {
            return false;
        }
        LambdaQueryWrapper<T> lq = new LambdaQueryWrapper<>();
        lq.eq(userField, userId)
                .eq(targetIdField, targetId)
                .eq(targetTypeField,targetType);
        Long count = mapper.selectCount(lq);
        return count > 0;
    }
}
