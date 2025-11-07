package com.chiran.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.chiran.bo.CategoryBO;
import com.chiran.dto.AddFavoriteDTO;
import com.chiran.dto.CreateFolderDTO;
import com.chiran.entity.FavoriteItem;
import com.chiran.entity.Tag;
import com.chiran.entity.UserFavorite;
import com.chiran.entity.UserTag;
import com.chiran.exception.BusinessException;
import com.chiran.mapper.FavoriteItemMapper;
import com.chiran.mapper.TagMapper;
import com.chiran.mapper.UserFavoriteMapper;
import com.chiran.mapper.UserTagMapper;
import com.chiran.result.PageResult;
import com.chiran.service.CourseService;
import com.chiran.service.ResourceService;
import com.chiran.service.UserFavoriteService;
import com.chiran.service.UserTagService;
import com.chiran.utils.BeanUtil;
import com.chiran.vo.CourseVO;
import com.chiran.vo.ResourceVO;
import com.chiran.vo.UserFavoriteFolderVO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

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
public class UserTagServiceImpl extends ServiceImpl<UserTagMapper, UserTag> implements UserTagService {
    @Autowired
    private UserTagMapper userTagMapper;
    @Autowired
    private TagMapper tagMapper;
    @Override
    public List<CategoryBO> selectTags(Integer targetId, Integer targetType) {
        LambdaQueryWrapper<UserTag> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.select(UserTag::getTagId)
                .eq(UserTag::getTargetType, targetType)
                .eq(UserTag::getTargetId, targetId);

        List<UserTag> userTagList = userTagMapper.selectList(queryWrapper);
        if (userTagList.isEmpty()) {
            return Collections.emptyList(); // 建议返回空列表，而非 null（避免调用处空指针）
        }

        // 提取 tagId 组成 ID 集合（关键修正）
        List<Integer> tagIds = userTagList.stream()
                .map(UserTag::getTagId)
                .collect(Collectors.toList());

        // 用 tagId 集合批量查询 Tag
        List<Tag> tagList = tagMapper.selectBatchIds(tagIds);

        // 转换为 CategoryBO
        return BeanUtil.copyList(tagList, CategoryBO::new);
    }
}