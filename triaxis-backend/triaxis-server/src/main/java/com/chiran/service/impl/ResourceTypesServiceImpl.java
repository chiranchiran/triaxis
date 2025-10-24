package com.chiran.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.chiran.bo.ResourceCategoryBO;
import com.chiran.entity.*;
import com.chiran.mapper.*;
import com.chiran.service.ResourceTypesService;
import com.chiran.bo.CategoryBO;
import com.chiran.utils.BeanUtil;
import com.chiran.vo.ResourcesTypesVO;
import org.apache.ibatis.annotations.Param;
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
    @Autowired
    private SubjectMapper subjectMapper;
    @Autowired
    private ResourceToolMapper resourceToolMapper;
    @Autowired
    private ToolMapper toolMapper;

    @Override
    public ResourcesTypesVO getTypes() {
        List<CategoryBO> subjects = resourceTypesMapper.getSubjectLists();
        List<CategoryBO> tools = resourceTypesMapper.getToolLists();
        List<CategoryBO> categoryFirst = resourceTypesMapper.getCategoryFirstLists();
        return ResourcesTypesVO.builder().subjects(subjects).tools(tools).categoriesFirst(categoryFirst).build();
    }

    @Override
    public List<CategoryBO> getCategorySecondary(Integer subjectId, Integer parentId) {
        return resourceTypesMapper.getCategorySecondLists(subjectId,parentId);
    }

    @Override
    public String getSubjectName(Integer subjectId) {
        LambdaQueryWrapper <Subject> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(Subject::getId,subjectId).select(Subject::getName);
        Subject subject = subjectMapper.selectOne(queryWrapper);
        return subject.getName();
    }

    @Override
    public List<CategoryBO> getTools(Integer id) {
        LambdaQueryWrapper <ResourceTool> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(ResourceTool::getResourceId,id).select(ResourceTool::getToolId);
        List<Integer> ids = resourceToolMapper.selectObjs(queryWrapper);
        if(ids.size()>0){
            LambdaQueryWrapper <Tool> queryWrapper1 = new LambdaQueryWrapper<>();
            queryWrapper1.select(Tool::getId,Tool::getName).in(Tool::getId, ids);
            List<Tool> list = toolMapper.selectList(queryWrapper1);
            return BeanUtil.copyList(list,CategoryBO::new);
        }
        return null;
    }
    public ResourceCategoryBO selectAllCategories(Integer resourceId) {
        return resourceTypesMapper.selectAllCategories(resourceId);
    }
}
