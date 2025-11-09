package com.chiran.constant;

public class UserActionTypeConstant {
    // 定义积分类型常量（与数据库points_type对应）
    // 获得类型
    public static final Integer DAILY_CHECKIN_TYPE = 9; // 签到获得
    public static final Integer UPLOAD_RESOURCE_TYPE = 1; // 上传资源获得
    public static final Integer UPLOAD_COURSE_TYPE = 2; // 上传课程获得
    public static final Integer POST_ARTICLE_TYPE = 3; // 发帖获得
    public static final Integer COMMENT_TYPE = 4; // 评论获得
    public static final Integer SOLVE_REWARD_TYPE = 5; // 解决悬赏贴获得

    // 消耗类型
    public static final Integer BUY_RESOURCE_TYPE = 6; // 购买资源消耗
    public static final Integer BUY_COURSE_TYPE = 7; // 购买课程消耗
    public static final Integer PUBLISH_REWARD_TYPE = 8; // 发布悬赏贴消耗

}
