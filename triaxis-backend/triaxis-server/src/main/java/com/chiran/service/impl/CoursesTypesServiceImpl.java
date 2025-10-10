package com.chiran.service.impl;

import com.chiran.mapper.CoursesTypesMapper;
import com.chiran.mapper.ResourceTypesMapper;
import com.chiran.service.CoursesTypesService;
import com.chiran.vo.CategoryVO;
import com.chiran.vo.CoursesTypesVO;
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
public class CoursesTypesServiceImpl implements CoursesTypesService {

    @Autowired
    private CoursesTypesMapper coursesTypesMapper;
    @Autowired
    private ResourceTypesMapper resourceTypesMapper;

    @Override
    public CoursesTypesVO getTypes() {
        List<CategoryVO> subjects = resourceTypesMapper.getSubjectLists();
        List<CategoryVO> rights = resourceTypesMapper.getRightLists();
        List<CategoryVO> category = coursesTypesMapper.getCategoryLists();
        return CoursesTypesVO.builder().subjects(subjects).rights(rights).categories(category).build();
    }

}
