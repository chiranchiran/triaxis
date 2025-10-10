package com.chiran.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.chiran.dto.ResourceDTO;
import com.chiran.dto.ResourceSearchDTO;
import com.chiran.entity.Resource;
import com.chiran.entity.ResourceSoftware;
import com.chiran.exception.BusinessException;
import com.chiran.mapper.ResourceMapper;
import com.chiran.mapper.ResourceSoftwareMapper;
import com.chiran.result.PageResult;
import com.chiran.service.ResourceService;
import com.chiran.service.ResourceSoftwareService;
import com.chiran.vo.ResourceVO;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

/**
 * <p>
 * 服务实现类
 * </p>
 *
 * @author chiran
 * @since 2025-10-07
 */
@Service
public class ResourceSoftwareServiceImpl extends ServiceImpl<ResourceSoftwareMapper, ResourceSoftware> implements ResourceSoftwareService {

}
