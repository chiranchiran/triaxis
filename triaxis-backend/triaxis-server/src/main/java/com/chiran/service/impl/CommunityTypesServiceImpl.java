package com.chiran.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.chiran.bo.CategoryBO;
import com.chiran.bo.ResourceCategoryBO;
import com.chiran.entity.ResourceTool;
import com.chiran.entity.Subject;
import com.chiran.entity.Tool;
import com.chiran.entity.Topic;
import com.chiran.mapper.*;
import com.chiran.service.CommunityTypesService;
import com.chiran.service.ResourceTypesService;
import com.chiran.utils.BeanUtil;
import com.chiran.vo.CommunityTypesVO;
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
public class CommunityTypesServiceImpl implements CommunityTypesService {

    @Autowired
    private ResourceTypesMapper resourceTypesMapper;
    @Autowired
    private CommunityTypesMapper communityTypesMapper;
    @Autowired
    private SubjectMapper subjectMapper;
    @Autowired
    private TopicMapper topicMapper;
    @Autowired
    private ResourceToolMapper resourceToolMapper;
    @Autowired
    private ToolMapper toolMapper;

    @Override
    public CommunityTypesVO getTypes() {
        List<CategoryBO> subjects = resourceTypesMapper.getSubjectLists();
        List<CategoryBO> topics = communityTypesMapper.getTopicLists();
        return CommunityTypesVO.builder().subjects(subjects).topics(topics).build();
    }

   @Override
   public String getTopicName(Integer topicId) {
       LambdaQueryWrapper <Topic> queryWrapper = new LambdaQueryWrapper<>();
       queryWrapper.eq(Topic::getId,topicId).select(Topic::getName);
       Topic topic = topicMapper.selectOne(queryWrapper);
       return topic.getName();
   }
//
//    @Override
//    public List<CategoryBO> getTools(Integer id) {
//        LambdaQueryWrapper <ResourceTool> queryWrapper = new LambdaQueryWrapper<>();
//        queryWrapper.eq(ResourceTool::getResourceId,id).select(ResourceTool::getToolId);
//        List<Integer> ids = resourceToolMapper.selectObjs(queryWrapper);
//        if(ids.size()>0){
//            LambdaQueryWrapper <Tool> queryWrapper1 = new LambdaQueryWrapper<>();
//            queryWrapper1.select(Tool::getId,Tool::getName).in(Tool::getId, ids);
//            List<Tool> list = toolMapper.selectList(queryWrapper1);
//            return BeanUtil.copyList(list,CategoryBO::new);
//        }
//        return null;
//    }
//    public ResourceCategoryBO selectAllCategories(Integer resourceId) {
//        return resourceTypesMapper.selectAllCategories(resourceId);
//    }
}
