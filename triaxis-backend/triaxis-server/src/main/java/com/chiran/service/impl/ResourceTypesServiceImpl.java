package com.chiran.service.impl;

import com.chiran.mapper.*;
import com.chiran.service.ResourceTypesService;
import com.chiran.vo.CategoryVO;
import com.chiran.vo.ResourcesTypesVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * <p>
 * 服务实现类
 * </p>
 *
 * @author chiran
 * @since 2025-10-07
 */
@Service
public class ResourceTypesServiceImpl implements ResourceTypesService {

    @Autowired
    private ResourceTypesMapper resourceTypesMapper;

    @Override
    public ResourcesTypesVO getTypes() {
        List<CategoryVO> subjects = resourceTypesMapper.getSubjectLists();
        List<CategoryVO> rights = resourceTypesMapper.getRightLists();
        List<CategoryVO> tools = resourceTypesMapper.getToolLists();
        List<CategoryVO> categoryFirst = resourceTypesMapper.getCategoryFirstLists();
        return ResourcesTypesVO.builder().subjects(subjects).rights(rights).tools(tools).categoriesFirst(categoryFirst).build();
    }

    @Override
    public List<CategoryVO> getCategoryFirst(Integer subjectId, Integer parentId) {
        return resourceTypesMapper.getCategorySecondLists(subjectId,parentId);
    }
}
