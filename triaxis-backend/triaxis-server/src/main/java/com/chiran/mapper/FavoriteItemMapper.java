package com.chiran.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.chiran.entity.FavoriteItem;
import com.chiran.entity.UserFavorite;
import com.chiran.vo.CourseVO;
import com.chiran.vo.ResourceVO;
import com.chiran.vo.UserFavoriteFolderVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface FavoriteItemMapper extends BaseMapper<FavoriteItem> {

    /**
     * 获取用户收藏的资源列表（分页）
     */
    IPage<ResourceVO> selectFavoriteResourcesPage(IPage<ResourceVO> page,
                                                  @Param("userId") Integer userId,
                                                  @Param("favoriteType") Integer favoriteType);

    /**
     * 获取用户收藏的课程列表（分页）
     */
    IPage<CourseVO> selectFavoriteCoursesPage(IPage<CourseVO> page,
                                              @Param("userId") Integer userId,
                                              @Param("favoriteType") Integer favoriteType);

    /**
     * 获取用户收藏的资源总数
     */
    Long countFavoriteResources(@Param("userId") Integer userId,
                                @Param("favoriteType") Integer favoriteType);

    /**
     * 获取用户收藏的课程总数
     */
    Long countFavoriteCourses(@Param("userId") Integer userId,
                              @Param("favoriteType") Integer favoriteType);

    /**
     * 检查是否已收藏
     */
    Long checkFavoriteExists(@Param("userId") Integer userId,
                             @Param("itemType") Integer itemType,
                             @Param("itemId") Integer itemId);
}
