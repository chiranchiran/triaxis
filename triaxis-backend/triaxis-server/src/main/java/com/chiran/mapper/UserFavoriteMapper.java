package com.chiran.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.chiran.entity.UserFavorite;
import com.chiran.vo.UserFavoriteFolderVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface UserFavoriteMapper extends BaseMapper<UserFavorite> {

    /**
     * 获取用户收藏夹列表
     */
    List<UserFavoriteFolderVO> selectUserFolders(Integer userId);

    /**
     * 更新收藏夹项目数量
     */
    int updateFolderItemCount(@Param("folderId") Integer folderId);
}
