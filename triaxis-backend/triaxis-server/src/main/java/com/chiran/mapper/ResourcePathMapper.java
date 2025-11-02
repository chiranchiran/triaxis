package com.chiran.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.chiran.entity.ResourceCategory;
import com.chiran.entity.ResourcePath;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ResourcePathMapper extends BaseMapper<ResourcePath> {
}
