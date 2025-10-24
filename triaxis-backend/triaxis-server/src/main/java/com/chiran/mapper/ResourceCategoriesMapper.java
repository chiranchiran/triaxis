package com.chiran.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.chiran.entity.ResourceCategories;
import com.chiran.entity.ResourceCategory;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ResourceCategoriesMapper extends BaseMapper<ResourceCategories> {
}
