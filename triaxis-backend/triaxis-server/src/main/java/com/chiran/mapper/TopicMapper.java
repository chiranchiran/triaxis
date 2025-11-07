package com.chiran.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.chiran.entity.Subject;
import com.chiran.entity.Topic;
import org.apache.ibatis.annotations.Mapper;

/**
 * <p>
 *  Mapper 接口
 * </p>
 *
 * @author chiran
 * @since 2025-10-07
 */
@Mapper
public interface TopicMapper extends BaseMapper<Topic> {
}
