package com.chiran.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.chiran.bo.*;
import com.chiran.dto.*;
import com.chiran.entity.*;
import com.chiran.mapper.PostMapper;
import com.chiran.mapper.PostImageMapper;
import com.chiran.mapper.PostMapper;
import com.chiran.mapper.TagMapper;
import com.chiran.result.PageResult;
import com.chiran.service.*;
import com.chiran.utils.BeanUtil;
import com.chiran.utils.ExceptionUtil;
import com.chiran.vo.CommunityHotVO;
import com.chiran.vo.CommunityPostVO;
import com.chiran.vo.CommunitySearchVO;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * <p>
 * 服务实现类
 * </p>
 *
 * @author chiran
 * @since 2025-10-07
 */
@Service
public class PostServiceImpl extends ServiceImpl<PostMapper, Post> implements PostService {
    @Autowired
    private PostMapper postMapper;
    @Autowired
    private UserActionService userActionService;
    @Autowired
    private UserService userService;
    @Autowired
    private PostImageMapper postImageMapper;
    @Autowired
    private ResourceTypesService resourceTypesService;
    @Autowired
    private CommunityTypesService communityTypesService;
    @Autowired
    private UserTagService userTagService;
    @Autowired
    private TagMapper tagMapper;
//    @Autowired
//    private PostCategoryService postCategoryService;
//    @Autowired
//    private PostPathService postPathService;
//    @Autowired
//    private PostImageService postImageService;
//    @Autowired
//    private PostToolService postToolService;

    @Override
    public CommunitySearchVO getPosts(CommunitySearchDTO dto) {

        // 搜索悬赏贴
        // 创建分页对象
        Page<PostSearchBO> page = new Page<>(1, dto.getBountyCount());

        // 执行查询
        dto.setType(2);
        IPage<PostSearchBO> bounty = postMapper.searchPosts(page, dto);
        PageResult<PostSearchBO> resultBounty = new PageResult<>(bounty.getTotal(), bounty.getRecords());

        // 搜索普通帖子
        // 创建分页对象
        Page<PostSearchBO> pageNormal = new Page<>(1, dto.getNormalCount());

        // 执行查询
        dto.setType(1);
        IPage<PostSearchBO> normal = postMapper.searchPosts(pageNormal, dto);
        PageResult<PostSearchBO> resultNormal = new PageResult<>(normal.getTotal(), normal.getRecords());
        // 总条数
        Long total = resultNormal.getTotal() + resultBounty.getTotal();
        // 转换为自定义分页结果
        return CommunitySearchVO.builder().total(total).bounty(resultBounty).normal(resultNormal).build();
    }

    @Override
    public List<CommunityHotVO> getHot() {
        List<CommunityHotVO> list = postMapper.getHot();
        return list;
    }

    @Override
    public List<PostSearchBO> getSquare(CommunitySquareDTO dto) {
        Page<PostSearchBO> page = new Page<>(dto.getPage(), dto.getPageSize());
        IPage<PostSearchBO> posts = postMapper.getSquare(page, dto);
        return posts.getRecords();
    }

    @Override
    public PageResult<PostSearchBO> getBounty(CommunityBountyDTO dto) {
        // 创建分页对象
        Page<PostSearchBO> page = new Page<>(dto.getPage(), dto.getPageSize());

        // 执行查询
        dto.setType(2);
        CommunitySearchDTO communitySearchDTO = new CommunitySearchDTO();
        BeanUtils.copyProperties(dto, communitySearchDTO);
        IPage<PostSearchBO> bounty = postMapper.searchPosts(page, communitySearchDTO);
        PageResult<PostSearchBO> resultBounty = new PageResult<>(bounty.getTotal(), bounty.getRecords());
        return resultBounty;
    }

    @Override
    public PageResult<PostSearchBO> getNormal(CommunityBountyDTO dto) {
        // 创建分页对象
        Page<PostSearchBO> page = new Page<>(dto.getPage(), dto.getPageSize());

        // 执行查询
        dto.setType(1);
        CommunitySearchDTO communitySearchDTO = new CommunitySearchDTO();
        BeanUtils.copyProperties(dto, communitySearchDTO);
        IPage<PostSearchBO> bounty = postMapper.searchPosts(page, communitySearchDTO);
        PageResult<PostSearchBO> resultBounty = new PageResult<>(bounty.getTotal(), bounty.getRecords());
        return resultBounty;
    }

    @Override
    public CommunityPostVO getPost(Integer id, Integer userId) {
        Post post = this.getById(id);
        if (post == null || post.getDeleted() == 1) {
            throw ExceptionUtil.create(14001);
        }

        // 增加查看次数
        this.lambdaUpdate()
                .set(Post::getViewCount, post.getViewCount() + 1)
                .eq(Post::getId, id)
                .update();

        PostDetailBO postDetailBO = new PostDetailBO();
        BeanUtils.copyProperties(post, postDetailBO);
        Integer hot = post.getViewCount() + post.getLikeCount() * 2 + post.getReplyCount() * 3 + post.getCollectCount() * 2;
        postDetailBO.setHot(hot);
        // 查询相关的的缩略图
        LambdaQueryWrapper<PostImage> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.select(PostImage::getId, PostImage::getPath).eq(PostImage::getPostId, id).orderByAsc(PostImage::getCreateTime);
        List<PostImage> list = postImageMapper.selectList(queryWrapper);
        List<CategoryBO> images = BeanUtil.copyList(list, CategoryBO::new);
        // 查询分类信息

        PostCategoryBO postCategoryBO = new PostCategoryBO();
        postCategoryBO.setSubject(resourceTypesService.getSubjectName(post.getSubjectId()));
        postCategoryBO.setTopic(communityTypesService.getTopicName(post.getTopicId()));
        CommunityPostVO postVO = CommunityPostVO.builder()
                .detail(postDetailBO)
                .uploader(userService.selectUploader(post.getUserId()))
                .userActions(userActionService.checkAllAction(userId, id, 3))
                .images(images)
                .tags(userTagService.selectTags(id, 3))
                .category(postCategoryBO)
                .build();


        return postVO;
    }

//    @Override
//    public PostVO getPostDetail(Integer id, Integer userId) {
//        Post post = this.getById(id);
//        if (post == null || post.getDeleted() == 1) {
//            throw ExceptionUtil.create(14001);
//        }
//
//        // 增加查看次数
//        this.lambdaUpdate()
//                .set(Post::getViewCount, post.getViewCount() + 1)
//                .eq(Post::getId, id)
//                .update();
//
//        PostSearchBO postSearchBO = new PostSearchBO();
//        BeanUtils.copyProperties(post, postSearchBO);
// //查询相关的的缩略图
//        LambdaQueryWrapper<PostImage> queryWrapper = new LambdaQueryWrapper<>();
//        queryWrapper.select(PostImage::getId, PostImage::getPath).eq(PostImage::getPostId, id).orderByAsc(PostImage::getCreateTime);
//        List<PostImage> list = postImageMapper.selectList(queryWrapper);
//        List<CategoryBO> images = BeanUtil.copyList(list, CategoryBO::new);
//        //查询分类信息
//
//        PostCategoryBO postCategoryBO = postTypesService.selectAllCategories(id);
//        postCategoryBO.setRight(post.getRight());
//        postCategoryBO.setSubject(postTypesService.getSubjectName(post.getSubjectId()));
//        postCategoryBO.setTools(postTypesService.getTools(post.getId()));
//
//        PostVO postVO = PostVO.builder()
//                .postDetail(postSearchBO)
//                .uploader(userService.selectUploader(post.getUserId()))
//                .userActions(userActionService.checkAllAction(userId, id, 1))
//                .images(images)
//                .tags(userTagService.selectTags(id, 1))
//                .category(postCategoryBO)
//                .build();
//
//
//        return postVO;
//    }
//
//    @Override
//    @Transactional(rollbackFor = Exception.class)
//    public Boolean addPost(PostDTO dto) {
//        //修改文件大小
//        getSize(dto);
//        Post post = new Post();
//        BeanUtils.copyProperties(dto, post);
//        post.setId(null);
//        this.save(post);
//        Integer postId = post.getId();
//        //插入tag标签分类和关系
//        addTags(dto, postId,1);
//        //插入资源和分类的关系
//        addCategories(dto, postId);
//        //插入文件路径的关系
//        addPaths(dto, postId);
//        //插入文件预览图的关系
//        addImages(dto, postId);
//        //插入资源和工具的关系
//        addTools(dto, postId);
//        return true;
//    }
//
//    @Override
//    @Transactional(rollbackFor = Exception.class)
//    public Boolean updatePost(PostDTO dto) {
//        Integer postId = dto.getId();
//        //检查权限和资源存在
//        check(postId,dto.getUserId(), dto.getRole());
//        //检查文件变化
//        dto.setSize(null);
//        if (dto.getFiles() != null) {
//            getSize(dto);
//        }
//        Post post = new Post();
//        BeanUtils.copyProperties(dto, post);
//        // 更新资源
//        this.updateById(post);
//        // 更新关联的tag
//        if (dto.getTags() != null) {
//            //删除旧的关联
//            userTagService.lambdaUpdate()
//                    .eq(UserTag::getTagId, postId)
//                    .eq(UserTag::getTargetType, 1)
//                    .remove();
//            if (!dto.getTags().isEmpty()) {
//                //插入tag标签分类和关系
//                addTags(dto, postId,1);
//            }
//        }
//        //更新资源分类关系
//        if (dto.getCategoryIds() != null) {
//            //删除旧的关联
//            postCategoryService.lambdaUpdate()
//                    .eq(PostCategory::getPostId, postId)
//                    .remove();
//            if (!dto.getCategoryIds().isEmpty()) {
//                //插入资源和分类的关系
//                addCategories(dto, postId);
//            }
//        }
//        //更新文件路径的关系
//        if (dto.getFiles() != null) {
//            //删除旧的关联
//            postPathService.lambdaUpdate()
//                    .eq(PostPath::getPostId, postId)
//                    .remove();
//            if (!dto.getCategoryIds().isEmpty()) {
//                //插入文件路径的关系
//                addPaths(dto, postId);
//            }
//        }
//        //更新文件预览图的关系
//        if (dto.getImages() != null) {
//            postImageService.lambdaUpdate()
//                    .eq(PostImage::getPostId, postId)
//                    .remove();
//            if (!dto.getCategoryIds().isEmpty()) {
//                //插入文件预览图的关系
//                addImages(dto, postId);
//            }
//        }
//        //更新资源和工具的关系
//        if (dto.getToolIds() != null) {
//            postToolService.lambdaUpdate()
//                    .eq(PostTool::getPostId, postId)
//                    .remove();
//            if (!dto.getCategoryIds().isEmpty()) {
//                //插入资源和工具的关系
//                addTools(dto, postId);
//            }
//        }
//        return true;
//    }
//
//    @Override
//    @Transactional(rollbackFor = Exception.class)
//    public Boolean removePost(Integer id, Integer userId, Integer role) {
//        //检查权限和资源存在
//        check(id,userId,role);
//        //删除
//        this.removeById(id);
//        removeRelation(id);
//        return true;
//    }
//
//    @Override
//    @Transactional(rollbackFor = Exception.class)
//    public Boolean removePosts(List<Integer> ids,Integer userId,Integer role) {
//        if (ids == null || ids.isEmpty()) {
//            return true;
//        }
//        for(Integer id : ids){
//            check(id,userId,role);
//            //删除
//            this.removeById(id);
//            removeRelation(id);
//        }
//        return true;
//    }
//    private void addTags(PostDTO dto, Integer postId,Integer type) {
//        List<UserTag> userTagList = new ArrayList();
//        for (String s : dto.getTags()) {
//            Tag tag = new Tag();
//            tag.setName(s);
//            tag.setCreateBy(dto.getUserId());
//            tagMapper.insert(tag);
//            Integer tagId = tag.getId();
//            UserTag userTag = new UserTag();
//            userTag.setTagId(tagId);
//            userTag.setUserId(dto.getUserId());
//            userTag.setTargetType(type);
//            userTag.setTargetId(postId);
//            userTagList.add(userTag);
//        }
//        userTagService.saveBatch(userTagList);
//    }
//    private void addCategories(PostDTO dto, Integer postId) {
//        List<PostCategory> postCategoryList = new ArrayList();
//        for (Integer id : dto.getCategoryIds()) {
//            PostCategory postCategory = new PostCategory();
//            postCategory.setCategoryId(id);
//            postCategory.setPostId(postId);
//            postCategoryList.add(postCategory);
//        }
//        postCategoryService.saveBatch(postCategoryList);
//    }
//    private void addPaths(PostDTO dto, Integer postId) {
//        List<PostPath> postPathList = new ArrayList();
//        for (UploadFileBO uploadFileBO : dto.getFiles()) {
//            PostPath postPath = new PostPath();
//            postPath.setPostId(postId);
//            postPath.setSize(uploadFileBO.getSize());
//            postPath.setType(uploadFileBO.getType());
//            postPath.setName(uploadFileBO.getName());
//            postPath.setPath(uploadFileBO.getPath());
//            postPathList.add(postPath);
//        }
//        postPathService.saveBatch(postPathList);
//    }
//    private void addImages(PostDTO dto, Integer postId) {
//        List<PostImage> postImageList = new ArrayList();
//        for (UploadFileBO uploadFileBO : dto.getImages()) {
//            PostImage postImage = new PostImage();
//            postImage.setPostId(postId);
//            postImage.setSize(uploadFileBO.getSize());
//            postImage.setType(uploadFileBO.getType());
//            postImage.setName(uploadFileBO.getName());
//            postImage.setPath(uploadFileBO.getPath());
//            postImageList.add(postImage);
//        }
//        postImageService.saveBatch(postImageList);
//    }
//    private void addTools(PostDTO dto, Integer postId) {
//        List<PostTool> postToolList = new ArrayList();
//        for (Integer id : dto.getToolIds()) {
//            PostTool postTool = new PostTool();
//            postTool.setPostId(postId);
//            postTool.setToolId(id);
//            postToolList.add(postTool);
//        }
//        postToolService.saveBatch(postToolList);
//    }
//    private void getSize(PostDTO dto) {
//        Long size = 0L;
//        for (UploadFileBO uploadFileBO : dto.getFiles()) {
//            size += uploadFileBO.getSize();
//        }
//        dto.setSize(size);
//    }
//    private void check(Integer id, Integer userId,Integer role) {
//        //id不能为空
//        if (id == null) {
//            throw ExceptionUtil.create(15000, "资源ID不能为空");
//        }
//        // 检查资源是否存在
//        Post exist = this.getById(id);
//        if (exist == null || exist.getDeleted() == 1) {
//            throw ExceptionUtil.create(15001, "资源不存在或已被删除");
//        }
//        //校验权限
//        if (exist.getUserId() != userId && role == 0) {
//            throw ExceptionUtil.create(11002,"权限不足,无法删除");
//        }
//    }
//
//    private void removeRelation(Integer id) {
//        //删除旧的关联
//        userTagService.lambdaUpdate()
//                .eq(UserTag::getTagId, id)
//                .eq(UserTag::getTargetType, 1)
//                .remove();
//
//        //删除旧的关联
//        postCategoryService.lambdaUpdate()
//                .eq(PostCategory::getPostId, id)
//                .remove();
//
//        postPathService.lambdaUpdate()
//                .eq(PostPath::getPostId, id)
//                .remove();
//
//        postImageService.lambdaUpdate()
//                .eq(PostImage::getPostId, id)
//                .remove();
//
//        postToolService.lambdaUpdate()
//                .eq(PostTool::getPostId, id)
//                .remove();
//    }
}
