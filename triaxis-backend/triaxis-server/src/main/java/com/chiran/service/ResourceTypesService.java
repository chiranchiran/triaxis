package com.chiran.service;

import com.chiran.vo.CategoryVO;
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

public interface ResourceTypesService {

    ResourcesTypesVO getTypes();

    List<CategoryVO> getCategorySecondary(Integer subjectId, Integer parentId);
}
