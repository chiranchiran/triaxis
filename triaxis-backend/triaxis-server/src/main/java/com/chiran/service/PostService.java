package com.chiran.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.chiran.bo.PostSearchBO;
import com.chiran.dto.*;
import com.chiran.entity.Post;
import com.chiran.entity.Resource;
import com.chiran.result.PageResult;
import com.chiran.vo.CommunityHotVO;
import com.chiran.vo.CommunityPostVO;
import com.chiran.vo.CommunitySearchVO;
import com.chiran.vo.ResourceVO;

import java.util.List;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author chiran
 * @since 2025-10-07
 */
public interface PostService extends IService<Post> {

    CommunitySearchVO getPosts(CommunitySearchDTO communitySearchDTO);

    List<CommunityHotVO> getHot();

    List<PostSearchBO> getSquare(CommunitySquareDTO communitySquareDTO);

    PageResult<PostSearchBO> getBounty(CommunityBountyDTO communityBountyDTO);
    PageResult<PostSearchBO> getNormal(CommunityBountyDTO communityBountyDTO);

    CommunityPostVO getPost(Integer id, Integer userId);

//
//    /**
//     * 新增资源
//     */
//    Boolean addResource(ResourceDTO dto);
//
//    /**
//     * 修改资源
//     */
//    Boolean updateResource(ResourceDTO dto);
//
//    /**
//     * 删除资源（软删除）
//     */
//    Boolean removeResource(Integer id,Integer userId,Integer role);
//
//    /**
//     * 批量删除资源
//     */
//    Boolean removeResources(List<Integer> ids,Integer userId,Integer role);

}
