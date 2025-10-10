package com.chiran.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.chiran.dto.AddFavoriteDTO;
import com.chiran.dto.CreateFolderDTO;
import com.chiran.dto.UserUpdateDTO;
import com.chiran.entity.User;
import com.chiran.entity.UserFavorite;
import com.chiran.result.PageResult;
import com.chiran.vo.*;

import java.util.List;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author chiran
 * @since 2025-10-07
 */
public interface UserFavoriteService extends IService<UserFavorite> {

    /**
     * 获取用户收藏夹列表
     */
    List<UserFavoriteFolderVO> getUserFolders(Integer userId);

    /**
     * 创建收藏夹
     */
    Boolean createFolder(Integer userId, CreateFolderDTO dto);

    /**
     * 添加收藏项
     */
    Boolean addFavoriteItem(Integer userId, AddFavoriteDTO dto);

    /**
     * 删除收藏项
     */
    Boolean removeFavoriteItem(Integer userId, Integer itemType, Integer itemId);

    /**
     * 获取用户收藏的资源
     */
    PageResult<ResourceVO> getFavoriteResources(Integer userId, Integer page, Integer pageSize);

    /**
     * 获取用户收藏的课程
     */
    PageResult<CourseVO> getFavoriteCourses(Integer userId, Integer page, Integer pageSize);
}
