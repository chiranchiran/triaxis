//package com.chiran.service.impl;
//
//import com.chiran.dto.UserUpdateDTO;
//import com.chiran.entity.Course;
//import com.chiran.entity.Resource;
//import com.chiran.entity.User;
//import com.chiran.exception.BusinessException;
//import com.chiran.mapper.UserMapper;
//import com.chiran.service.CourseService;
//import com.chiran.service.ResourceService;
//import com.chiran.service.UserService;
//import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
//import com.chiran.vo.MembershipVO;
//import com.chiran.vo.PointsVO;
//import com.chiran.vo.UserStatsVO;
//import com.chiran.vo.UserVO;
//import io.micrometer.common.util.StringUtils;
//import lombok.RequiredArgsConstructor;
//import org.springframework.beans.BeanUtils;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.time.LocalDateTime;
//import java.util.Date;
//
///**
// * <p>
// *  服务实现类
// * </p>
// *
// * @author chiran
// * @since 2025-10-07
// */
//@Service
//@RequiredArgsConstructor
//public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {
//
//    private final UserMapper userMapper;
//    private final ResourceService resourceService;
//    private final CourseService courseService;
//
//    @Override
//    public UserVO getUserDetail(Integer userId) {
//        User user = this.getById(userId);
//        if (user == null || user.getDeleted() == 1) {
//            throw new BusinessException(14000, "用户不存在");
//        }
//        return convertToVO(user);
//    }
//
//    @Override
//    @Transactional(rollbackFor = Exception.class)
//    public Boolean updateUserProfile(Integer userId, UserUpdateDTO dto) {
//        User user = this.getById(userId);
//        if (user == null || user.getDeleted() == 1) {
//            throw new BusinessException(14000, "用户不存在");
//        }
//
//        // 检查用户名是否重复（如果修改了用户名）
//        if (StringUtils.isNotBlank(dto.getUsername()) && !dto.getUsername().equals(user.getUsername())) {
//            Long count = this.lambdaQuery()
//                    .eq(User::getUsername, dto.getUsername())
//                    .ne(User::getId, userId)
//                    .count();
//            if (count > 0) {
//                throw new BusinessException(14000, "用户名已存在");
//            }
//        }
//
//        // 更新用户信息
//        User updateUser = new User();
//        updateUser.setId(userId);
//        updateUser.setUsername(dto.getUsername());
//        updateUser.setEmail(dto.getEmail());
//        updateUser.setPhone(dto.getPhone());
//        updateUser.setAvatar(dto.getAvatarUrl());
//        updateUser.setBio(dto.getBio());
//        updateUser.setGender(dto.getGender());
//        updateUser.setSchool(dto.getSchool());
//        updateUser.setMajor(dto.getMajor());
//        updateUser.setGrade(dto.getGrade());
//        updateUser.setSubjectId(dto.getProfessionalFieldId());
//        updateUser.setUpdateTime(LocalDateTime.now());
//
//        return this.updateById(updateUser);
//    }
//
//    @Override
//    public UserStatsVO getUserStats(Integer userId) {
//        UserStatsVO stats = userMapper.selectUserStats(userId);
//        if (stats == null) {
//            stats = new UserStatsVO();
//        }
//
//        // 补充其他统计信息
//        Long uploadedResources = resourceService.lambdaQuery()
//                .eq(Resource::getUploaderId, userId)
//                .eq(Resource::getDeleted, 0)
//                .count();
//        stats.setResourceCount(uploadedResources.intValue());
//
//        Long uploadedCourses = courseService.lambdaQuery()
//                .eq(Course::getUserId, userId)
//                .eq(Course::getDeleted, 0)
//                .count();
//        stats.setCourseCount(uploadedCourses.intValue());
//
//        return stats;
//    }
//
//    @Override
//    public MembershipVO getMembershipInfo(Integer userId) {
//        User user = this.getById(userId);
//        if (user == null || user.getDeleted() == 1) {
//            throw new BusinessException(14000, "用户不存在");
//        }
//
//        MembershipVO membership = new MembershipVO();
//        membership.setMembershipLevel(user.getVipLevel());
//
//        // 设置会员等级名称
//        String[] levelNames = {"普通用户", "VIP", "SVIP"};
//        membership.setMembershipLevelName(levelNames[user.getVipLevel()]);
//
//        membership.setMembershipExpiresAt(user.getVipTime());
//
//        // 检查是否过期
//        if (user.getMembershipExpiresAt() != null) {
//            boolean isExpired = user.getMembershipExpiresAt().before(new Date());
//            membership.setIsExpired(isExpired);
//
//            // 计算剩余天数
//            if (!isExpired) {
//                long diff = user.getMembershipExpiresAt().getTime() - System.currentTimeMillis();
//                long remainingDays = diff / (1000 * 60 * 60 * 24);
//                membership.setRemainingDays(remainingDays);
//            } else {
//                membership.setRemainingDays(0L);
//            }
//        } else {
//            membership.setIsExpired(true);
//            membership.setRemainingDays(0L);
//        }
//
//        return membership;
//    }
//
//    @Override
//    public PointsVO getPointsInfo(Integer userId) {
//        User user = this.getById(userId);
//        if (user == null || user.getDeleted() == 1) {
//            throw new BusinessException(14000, "用户不存在");
//        }
//
//        PointsVO points = new PointsVO();
//        points.setPointsBalance(user.getPointsBalance());
//        points.setTotalPointsEarned(user.getTotalPointsEarned());
//        points.setTotalPointsSpent(user.getTotalPointsSpent());
//
//        return points;
//    }
//
//    @Override
//    public void updateLastLoginInfo(Integer userId, String ip) {
//        this.lambdaUpdate()
//                .set(User::getLastLoginAt, new Date())
//                .set(User::getLastLoginIp, ip)
//                .eq(User::getId, userId)
//                .update();
//    }
//
//    /**
//     * 转换为VO对象
//     */
//    private UserVO convertToVO(User user) {
//        UserVO vo = new UserVO();
//        BeanUtils.copyProperties(user, vo);
//        return vo;
//    }
//}
