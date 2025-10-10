package com.chiran.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.chiran.dto.AddFavoriteDTO;
import com.chiran.dto.CreateFolderDTO;
import com.chiran.dto.UserUpdateDTO;
import com.chiran.entity.*;
import com.chiran.exception.BusinessException;
import com.chiran.mapper.FavoriteItemMapper;
import com.chiran.mapper.UserFavoriteMapper;
import com.chiran.mapper.UserMapper;
import com.chiran.result.PageResult;
import com.chiran.service.CourseService;
import com.chiran.service.ResourceService;
import com.chiran.service.UserFavoriteService;
import com.chiran.service.UserService;
import com.chiran.vo.*;
import io.micrometer.common.util.StringUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
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
public class UserFavoriteServiceImpl extends ServiceImpl<UserFavoriteMapper, UserFavorite> implements UserFavoriteService {

    private final UserFavoriteMapper userFavoriteMapper;
    private final FavoriteItemMapper favoriteItemMapper;
    private final ResourceService resourceService;
    private final CourseService courseService;

    @Override
    public List<UserFavoriteFolderVO> getUserFolders(Integer userId) {
        return userFavoriteMapper.selectUserFolders(userId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Boolean createFolder(Integer userId, CreateFolderDTO dto) {
        // 检查同名收藏夹是否存在
        Long count = this.lambdaQuery()
                .eq(UserFavorite::getUserId, userId)
                .eq(UserFavorite::getName, dto.getName())
                .eq(UserFavorite::getFavoriteType, dto.getFavoriteType())
                .count();
        if (count > 0) {
            throw new BusinessException(14000, "同名收藏夹已存在");
        }

        UserFavorite folder = new UserFavorite();
        folder.setUserId(userId);
        folder.setName(dto.getName());
        folder.setDescription(dto.getDescription());
        folder.setFavoriteType(dto.getFavoriteType());
        folder.setIsPublic(dto.getIsPublic() != null ? dto.getIsPublic() : false);
        folder.setSortOrder(0);
        folder.setItemCount(0);
        folder.setCreatedAt(new Date());
        folder.setUpdatedAt(new Date());

        return this.save(folder);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Boolean addFavoriteItem(Integer userId, AddFavoriteDTO dto) {
        // 检查收藏夹是否存在且属于该用户
        UserFavorite folder = this.getById(dto.getFavoriteId());
        if (folder == null || !folder.getUserId().equals(userId)) {
            throw new BusinessException(14000, "收藏夹不存在");
        }

        // 检查是否已收藏
        Long exists = favoriteItemMapper.checkFavoriteExists(userId, dto.getItemType(), dto.getItemId());
        if (exists > 0) {
            throw new BusinessException(14000, "已收藏该内容");
        }

        // 验证收藏项是否存在
        if (!validateFavoriteItem(dto.getItemType(), dto.getItemId())) {
            throw new BusinessException(14000, "收藏的内容不存在");
        }

        // 添加收藏项
        FavoriteItem item = new FavoriteItem();
        item.setFavoriteId(dto.getFavoriteId());
        item.setItemType(dto.getItemType());
        item.setItemId(dto.getItemId());
        item.setCreatedAt(new Date());

        boolean saved = favoriteItemMapper.insert(item) > 0;
        if (saved) {
            // 更新收藏夹项目数量
            userFavoriteMapper.updateFolderItemCount(dto.getFavoriteId());
        }

        return saved;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Boolean removeFavoriteItem(Integer userId, Integer itemType, Integer itemId) {
        // 查找收藏项
        FavoriteItem item = favoriteItemMapper.selectOne(new LambdaQueryWrapper<FavoriteItem>()
                .eq(FavoriteItem::getItemType, itemType)
                .eq(FavoriteItem::getItemId, itemId)
                .inSql(FavoriteItem::getFavoriteId,
                        "SELECT id FROM user_favorites WHERE user_id = " + userId));

        if (item == null) {
            throw new BusinessException(14000, "收藏项不存在");
        }

        // 删除收藏项
        boolean removed = favoriteItemMapper.deleteById(item.getId()) > 0;
        if (removed) {
            // 更新收藏夹项目数量
            userFavoriteMapper.updateFolderItemCount(item.getFavoriteId());
        }

        return removed;
    }

    @Override
    public PageResult<ResourceVO> getFavoriteResources(Integer userId, Integer page, Integer pageSize) {
        // 设置分页参数
        if (page == null || page <= 0) page = 1;
        if (pageSize == null || pageSize <= 0) pageSize = 10;

        // 创建分页对象
        Page<ResourceVO> pageObj = new Page<>(page, pageSize);

        // 执行分页查询
        IPage<ResourceVO> resultPage = favoriteItemMapper.selectFavoriteResourcesPage(pageObj, userId, 1);

        // 转换为自定义分页结果
        return new PageResult<>(resultPage.getTotal(),resultPage.getRecords());
    }

    @Override
    public PageResult<CourseVO> getFavoriteCourses(Integer userId, Integer page, Integer pageSize) {
        // 设置分页参数
        if (page == null || page <= 0) page = 1;
        if (pageSize == null || pageSize <= 0) pageSize = 10;

        // 创建分页对象
        Page<CourseVO> pageObj = new Page<>(page, pageSize);

        // 执行分页查询
        IPage<CourseVO> resultPage = favoriteItemMapper.selectFavoriteCoursesPage(pageObj, userId, 2);

        // 转换为自定义分页结果
        return new PageResult<>(resultPage.getTotal(),resultPage.getRecords());
    }

    /**
     * 验证收藏项是否存在
     */
    private boolean validateFavoriteItem(Integer itemType, Integer itemId) {
        switch (itemType) {
            case 1: // 资源
                return resourceService.getById(itemId) != null;
            case 2: // 课程
                return courseService.getById(itemId) != null;
            default:
                return false;
        }
    }
}