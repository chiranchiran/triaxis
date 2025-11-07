package com.chiran.service;

import com.chiran.bo.CategoryBO;
import com.chiran.bo.ResourceCategoryBO;
import com.chiran.vo.CommunityTypesVO;
import com.chiran.vo.ResourcesTypesVO;

import java.util.List;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author chiran
 * @since 2025-10-07
 */

public interface CommunityTypesService {

    CommunityTypesVO getTypes();

   String getTopicName(Integer topicId);
//    List<CategoryBO> getTools(Integer id);
//    ResourceCategoryBO selectAllCategories(Integer id);
}
