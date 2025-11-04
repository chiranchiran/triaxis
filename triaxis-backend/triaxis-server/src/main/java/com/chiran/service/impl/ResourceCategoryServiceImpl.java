package com.chiran.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.chiran.bo.CategoryBO;
import com.chiran.entity.ResourceCategory;
import com.chiran.entity.Tag;
import com.chiran.entity.UserTag;
import com.chiran.mapper.ResourceCategoryMapper;
import com.chiran.mapper.TagMapper;
import com.chiran.mapper.UserTagMapper;
import com.chiran.service.ResourceCategoryService;
import com.chiran.service.UserTagService;
import com.chiran.utils.BeanUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * <p>
 *  服务实现类
 * </p>
 *
 * @author chiran
 * @since 2025-10-07
 */
@Service
@RequiredArgsConstructor
public class ResourceCategoryServiceImpl extends ServiceImpl<ResourceCategoryMapper, ResourceCategory> implements ResourceCategoryService {
}