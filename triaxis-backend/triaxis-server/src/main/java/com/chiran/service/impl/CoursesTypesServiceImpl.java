package com.chiran.service.impl;

import com.chiran.mapper.CoursesTypesMapper;
import com.chiran.mapper.ResourceTypesMapper;
import com.chiran.service.CoursesTypesService;
import com.chiran.bo.CategoryBO;
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
        List<CategoryBO> subjects = resourceTypesMapper.getSubjectLists();
        List<CategoryBO> category = coursesTypesMapper.getCategoryLists();
        return CoursesTypesVO.builder().subjects(subjects).categories(category).build();
    }

}
