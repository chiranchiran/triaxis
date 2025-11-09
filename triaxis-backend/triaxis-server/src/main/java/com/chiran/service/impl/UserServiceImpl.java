package com.chiran.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.chiran.bo.CategoryBO;
import com.chiran.bo.UserBO;
import com.chiran.dto.UserUpdateDTO;
import com.chiran.entity.*;
import com.chiran.exception.BusinessException;
import com.chiran.mapper.UserMapper;
import com.chiran.mapper.UserPointMapper;
import com.chiran.mapper.UserPurchaseMapper;
import com.chiran.service.ResourceTypesService;
import com.chiran.service.UserService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.chiran.utils.ExceptionUtil;
import com.chiran.vo.*;
import io.micrometer.common.util.StringUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

import static com.chiran.constant.UserActionTypeConstant.*;

/**
 * <p>
 * 服务实现类
 * </p>
 *
 * @author chiran
 * @since 2025-10-07
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private UserPurchaseMapper userPurchaseMapper;
    @Autowired
    private ResourceTypesService resourceTypesService;
    @Autowired
    private UserPointMapper userPointMapper;
//    private final ResourceService resourceService;
//    private final CourseService courseService;

    @Override
    public UserBO selectUploader(Integer id) {
        LambdaQueryWrapper<User> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(User::getId, id).select(User::getId, User::getUsername, User::getAvatar, User::getSchool, User::getGrade, User::getMajor);
        User u = userMapper.selectOne(queryWrapper);
        checkUserIsExist(u, u.getDeleted() == 1);
        UserBO userBO = new UserBO();
        BeanUtils.copyProperties(u, userBO);
        userBO.setUserId(u.getId());
        return userBO;
    }

    private CategoryBO getSubject(User user) {
        String subject = resourceTypesService.getSubjectName(user.getSubjectId());
        CategoryBO  categoryBO = new CategoryBO();
        categoryBO.setId(user.getSubjectId());
        categoryBO.setName(subject);
        return categoryBO;
    }
    private Integer checkVip(User user) {
        if (user.getVipTime() == null || user.getVipLevel()==0) {
            return 0;
        }
        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(user.getVipTime())) {
            return user.getVipLevel();
        } else {
            return 0;
        }
    }
    private User getUser(Integer id) {
        User user = this.getById(id);
        checkUserIsExist(user, user.getDeleted() == 1);
        Integer vip =  checkVip(user);
        user.setVipLevel(vip);
        return user;
    }
    private Integer getPurchase(Integer id) {
        LambdaQueryWrapper<UserPurchase> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(UserPurchase::getUserId, id);
        Integer purchaseCount = (int) (long) userPurchaseMapper.selectCount(queryWrapper);
        return purchaseCount;
    }

    @Override
    public UserProfileVO getUserProfile(Integer id) {
        User user = getUser(id);
        UserProfileVO userProfileVO = new UserProfileVO();
        BeanUtils.copyProperties(user, userProfileVO);
        CategoryBO subjectCategoryBO = getSubject(user);
        userProfileVO.setSubject(subjectCategoryBO);
        return userProfileVO;
    }

    @Override
    public UserDetailVO getUserDetail(Integer id) {
        User user = getUser(id);
        UserDetailVO userDetailVO = new UserDetailVO();
        BeanUtils.copyProperties(user, userDetailVO);
        CategoryBO subjectCategoryBO = getSubject(user);
        userDetailVO.setSubject(subjectCategoryBO);
        Integer purchaseCount = getPurchase(id);
        userDetailVO.setPurchaseCount(purchaseCount);
        return userDetailVO;
    }

    @Override
    public UserMySettingsVO getUserSettings(Integer id) {
        User user = getUser(id);
        UserMySettingsVO userMySettingsVO = new UserMySettingsVO();
        BeanUtils.copyProperties(user, userMySettingsVO);
        return  userMySettingsVO;
    }

    @Override
    public UserMyPointsVO getUserPoints(Integer id) {
        User user = getUser(id);
        UserMyPointsVO userMyPointsVO = new UserMyPointsVO();
        BeanUtils.copyProperties(user, userMyPointsVO);


        // 1. 统计【获得积分】各类型
        // 签到获得（类型9）
        int checkinObtained = userPointMapper.selectObtainedSum(id, DAILY_CHECKIN_TYPE);
        userMyPointsVO.setCheckinObtained(checkinObtained);

        // 上传资源获得（类型1）
        int uploadResourceObtained = userPointMapper.selectObtainedSum(id, UPLOAD_RESOURCE_TYPE);
        userMyPointsVO.setUploadResourceObtained(uploadResourceObtained);

        // 上传课程获得（类型2）
        int uploadCourseObtained = userPointMapper.selectObtainedSum(id, UPLOAD_COURSE_TYPE);
        userMyPointsVO.setUploadCourseObtained(uploadCourseObtained);

        // 发帖获得（类型3）
        int postObtained = userPointMapper.selectObtainedSum(id, POST_ARTICLE_TYPE);
        userMyPointsVO.setPostObtained(postObtained);

        // 评论获得（类型4）
        int commentObtained = userPointMapper.selectObtainedSum(id, COMMENT_TYPE);
        userMyPointsVO.setCommentObtained(commentObtained);

        // 解决悬赏贴获得（类型5）
        int solveRewardObtained = userPointMapper.selectObtainedSum(id, SOLVE_REWARD_TYPE);
        userMyPointsVO.setSolveRewardObtained(solveRewardObtained);


        // 2. 统计【消耗积分】各类型
        // 购买资源消耗（类型6）
        int buyResourceConsumed = userPointMapper.selectConsumedSum(id, BUY_RESOURCE_TYPE);
        userMyPointsVO.setBuyResourceConsumed(buyResourceConsumed);

        // 购买课程消耗（类型7）
        int buyCourseConsumed = userPointMapper.selectConsumedSum(id, BUY_COURSE_TYPE);
        userMyPointsVO.setBuyCourseConsumed(buyCourseConsumed);

        // 发布悬赏贴消耗（类型8）
        int publishRewardConsumed = userPointMapper.selectConsumedSum(id, PUBLISH_REWARD_TYPE);
        userMyPointsVO.setPublishRewardConsumed(publishRewardConsumed);


        // 3. 总消耗积分 = 各消耗类型总和
        userMyPointsVO.setPointsSpent(buyResourceConsumed + buyCourseConsumed + publishRewardConsumed);
        
        
        LambdaQueryWrapper<UserPoint> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(UserPoint::getUserId,id).orderByDesc(UserPoint::getCreateTime);
        List<UserPoint> list = userPointMapper.selectList(queryWrapper);
        userMyPointsVO.setUserActions(list);
        return  userMyPointsVO;

    }

    @Override
    public UserMyVipVO getUserVip(Integer id) {
        User user = getUser(id);
        UserMyVipVO userMyVipVO = new UserMyVipVO();
        BeanUtils.copyProperties(user, userMyVipVO);
        return userMyVipVO;
    }

    private static void checkUserIsExist(User user, boolean user1) {
        if (user == null || user1) {
            // 账号不存在
            log.info("用户不存在");
            throw ExceptionUtil.create(12000);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Boolean updateUserProfile(Integer id, UserUpdateDTO dto) {
        User user = this.getById(id);
        checkUserIsExist(user, user.getDeleted() == 1);

        // 检查用户名是否重复（如果修改了用户名）
        if (StringUtils.isNotBlank(dto.getUsername()) && !dto.getUsername().equals(user.getUsername())) {
            Long count = this.lambdaQuery()
                    .eq(User::getUsername, dto.getUsername())
                    .ne(User::getId, id)
                    .count();
            if (count > 0) {
                throw new BusinessException(14000, "用户名已存在");
            }
        }

        // 更新用户信息
        User updateUser = new User();
        updateUser.setId(id);
        updateUser.setUsername(dto.getUsername());
        updateUser.setEmail(dto.getEmail());
        updateUser.setPhone(dto.getPhone());
        updateUser.setAvatar(dto.getAvatarUrl());
        updateUser.setBio(dto.getBio());
        updateUser.setGender(dto.getGender());
        updateUser.setSchool(dto.getSchool());
        updateUser.setMajor(dto.getMajor());
        updateUser.setGrade(dto.getGrade());
        updateUser.setSubjectId(dto.getProfessionalFieldId());
        updateUser.setUpdateTime(LocalDateTime.now());

        return this.updateById(updateUser);
    }

    @Override
    public UserStatsVO getUserStats(Integer id) {
        UserStatsVO stats = userMapper.selectUserStats(id);
        if (stats == null) {
            stats = new UserStatsVO();
        }

//        // 补充其他统计信息
//        Long uploadedResources = resourceService.lambdaQuery()
////                .eq(Resource::getUploaderId, id)
//                .eq(Resource::getDeleted, 0)
//                .count();
//        stats.setResourceCount(uploadedResources.intValue());
//
//        Long uploadedCourses = courseService.lambdaQuery()
//                .eq(Course::getUserId, id)
//                .eq(Course::getDeleted, 0)
//                .count();
//        stats.setCourseCount(uploadedCourses.intValue());

        return stats;
    }

    @Override
    public MembershipVO getMembershipInfo(Integer id) {
        User user = this.getById(id);
        if (user == null || user.getDeleted() == 1) {
            throw new BusinessException(14000, "用户不存在");
        }

        MembershipVO membership = new MembershipVO();
        membership.setMembershipLevel(user.getVipLevel());

        // 设置会员等级名称
        String[] levelNames = {"普通用户", "VIP", "SVIP"};
        membership.setMembershipLevelName(levelNames[user.getVipLevel()]);

//        membership.setVipTime(user.getVipTime());

        // 检查是否过期
//        if (user.getVipTime() != null) {
//            boolean isExpired = user.getVipTime().before(new Date());
//            membership.setIsExpired(isExpired);
//
//            // 计算剩余天数
//            if (!isExpired) {
//                long diff = user.getVipTime().getTime() - System.currentTimeMillis();
//                long remainingDays = diff / (1000 * 60 * 60 * 24);
//                membership.setRemainingDays(remainingDays);
//            } else {
//                membership.setRemainingDays(0L);
//            }
//        } else {
//            membership.setIsExpired(true);
//            membership.setRemainingDays(0L);
//        }

        return membership;
    }

    @Override
    public PointsVO getPointsInfo(Integer id) {
        User user = this.getById(id);
        if (user == null || user.getDeleted() == 1) {
            throw new BusinessException(14000, "用户不存在");
        }

        PointsVO points = new PointsVO();
        points.setPointsBalance(user.getPoints());
        points.setTotalPointsEarned(user.getPointsGet());
        points.setTotalPointsSpent(user.getPointsSpent());

        return points;
    }

    @Override
    public void updateLastLoginInfo(Integer id, String ip) {
        this.lambdaUpdate()
                .set(User::getLastLoginAt, new Date())
                .set(User::getLastLoginIp, ip)
                .eq(User::getId, id)
                .update();
    }



    /**
     * 转换为VO对象
     */
    private UserVO convertToVO(User user) {
        UserVO vo = new UserVO();
        BeanUtils.copyProperties(user, vo);
        return vo;
    }

}
