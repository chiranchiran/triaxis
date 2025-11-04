package com.chiran.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.chiran.entity.ResourceImage;
import com.chiran.entity.ResourcePath;
import com.chiran.mapper.ResourceImageMapper;
import com.chiran.mapper.ResourcePathMapper;
import com.chiran.service.ResourceImageService;
import com.chiran.service.ResourcePathService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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
public class ResourceImageServiceImpl extends ServiceImpl<ResourceImageMapper, ResourceImage> implements ResourceImageService {
}