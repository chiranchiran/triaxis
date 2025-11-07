package com.chiran.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.chiran.bo.PostSearchBO;
import com.chiran.dto.CommunitySearchDTO;
import com.chiran.dto.CommunitySquareDTO;
import com.chiran.dto.ResourceSearchDTO;
import com.chiran.entity.Post;
import com.chiran.entity.Resource;
import com.chiran.vo.CommunityHotVO;
import com.chiran.vo.ResourceVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
 * <p>
 *  Mapper 接口
 * </p>
 *
 * @author chiran
 * @since 2025-10-07
 */
@Mapper
public interface PostMapper extends BaseMapper<Post> {

    IPage<PostSearchBO> searchPosts(Page<PostSearchBO> page, CommunitySearchDTO dto);

    List<CommunityHotVO> getHot();

    IPage<PostSearchBO> getSquare(Page<PostSearchBO> page, CommunitySquareDTO dto);
}
