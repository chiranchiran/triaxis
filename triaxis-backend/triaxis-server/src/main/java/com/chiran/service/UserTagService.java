package com.chiran.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.chiran.bo.CategoryBO;
import com.chiran.dto.AddFavoriteDTO;
import com.chiran.dto.CreateFolderDTO;
import com.chiran.entity.UserFavorite;
import com.chiran.entity.UserTag;
import com.chiran.result.PageResult;
import com.chiran.vo.CourseVO;
import com.chiran.vo.ResourceVO;
import com.chiran.vo.UserFavoriteFolderVO;

import java.util.List;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author chiran
 * @since 2025-10-07
 */
public interface UserTagService extends IService<UserTag> {
    List<CategoryBO> selectTags(Integer targetId, Integer targetType);
}
