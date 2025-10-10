-- 创建数据库
CREATE DATABASE IF NOT EXISTS triaxis CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE triaxis;


-- 创建资源相关表
-- 1. 资源权限表
CREATE TABLE resource_rights (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. 专业领域表
CREATE TABLE professional_fields (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. 资源类型表（支持两级分类，记录学科特有信息）
CREATE TABLE resource_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    parent_id INT DEFAULT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    level INT DEFAULT 1 COMMENT '1: 一级分类, 2: 二级分类',
    sort_order INT DEFAULT 0,
    specialized_field INT DEFAULT NULL COMMENT '学科特有标记: 关联学科id, 空为共有',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES resource_categories(id) ON DELETE SET NULL,
	FOREIGN KEY (specialized_field) REFERENCES professional_fields(id) ON DELETE SET NULL
);

-- 4. 软件工具表
CREATE TABLE software_tools (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建用户相关表

-- 1. 用户基础信息表
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(20) NOT NULL UNIQUE COMMENT '用户名',
    role TINYINT NOT NULL DEFAULT 0 COMMENT '角色权限，0普通用户，1为管理员'
    email VARCHAR(100) UNIQUE COMMENT '邮箱（可选）',
    phone VARCHAR(11) UNIQUE COMMENT '手机号（可选）',
    password VARCHAR(100) COMMENT '密码（可选，第三方登录可能没有）',
    
    -- 第三方登录信息
    wechat_openid VARCHAR(100) UNIQUE COMMENT '微信OpenID',
    qq_openid VARCHAR(100) UNIQUE COMMENT 'QQ OpenID',
    weibo_uid VARCHAR(100) UNIQUE COMMENT '微博UID',
    github_id VARCHAR(100) UNIQUE COMMENT 'GitHub ID',
    
    -- 用户基本信息
    avatar_url VARCHAR(500) COMMENT '头像URL',
    bio TEXT COMMENT '个人简介',
    gender TINYINT DEFAULT 0 COMMENT '0-未知，1-男，2-女',
    birth_date DATE COMMENT '出生日期',
    
    -- 专业信息
    school VARCHAR(100) COMMENT '学校',
    major VARCHAR(100) COMMENT '专业',
    grade VARCHAR(50) COMMENT '年级',
    professional_field_id INT COMMENT '专业领域',
    
    -- 会员信息
    membership_level TINYINT DEFAULT 0 COMMENT '会员等级：0-普通用户，1-VIP，2-SVIP',
    membership_expires_at TIMESTAMP NULL COMMENT '会员到期时间',
    
    -- 积分系统
    points_balance INT DEFAULT 0 COMMENT '积分余额',
    total_points_earned INT DEFAULT 0 COMMENT '累计获得积分',
    total_points_spent INT DEFAULT 0 COMMENT '累计消耗积分',
    
    -- 统计信息
    resource_count INT DEFAULT 0 COMMENT '上传资源数',
    download_count INT DEFAULT 0 COMMENT '下载资源数',
    like_count INT DEFAULT 0 COMMENT '获赞数',
  
    -- 状态控制
    is_active BOOLEAN DEFAULT TRUE COMMENT '是否激活',
    deleted TINYINT DEFAULT 0 COMMENT '软删除，1是删除，0未删除',
    
    last_login_at TIMESTAMP NULL COMMENT '最后登录时间',
    last_login_ip VARCHAR(45) COMMENT '最后登录IP',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (professional_field_id) REFERENCES professional_fields(id),
    
    -- 确保至少有一种登录方式
    CHECK (
        email IS NOT NULL OR 
        phone IS NOT NULL OR 
        wechat_openid IS NOT NULL OR 
        qq_openid IS NOT NULL OR 
        weibo_uid IS NOT NULL OR 
        github_id IS NOT NULL
    )
);

-- 5. 核心资源表
CREATE TABLE resources (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_path VARCHAR(500) NOT NULL COMMENT '文件存储路径',
    file_size BIGINT COMMENT '文件大小(字节)',
    thumbnail_path VARCHAR(500) COMMENT '缩略图路径',
    file_extension VARCHAR(20) COMMENT '文件扩展名',
    
    -- 维度关联
    right_id INT NOT NULL,
    field_id INT NOT NULL,
    category_id INT NOT NULL COMMENT '关联到最细分的资源类型',
    
    -- 资源属性
    price_points INT DEFAULT 0 COMMENT '所需积分，0表示免费，-1表示会员专属',
    download_count INT DEFAULT 0,
    view_count INT DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0,
    
    -- 上传信息
    uploader_id INT NOT NULL COMMENT '上传用户ID',
    status TINYINT DEFAULT 1 COMMENT '1-草稿，2-审核中，3-已发布，4-已下架',
    is_featured BOOLEAN DEFAULT FALSE COMMENT '是否推荐资源',
    deleted TINYINT DEFAULT 0 COMMENT '软删除，1是删除，0未删除',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (right_id) REFERENCES resource_rights(id),
    FOREIGN KEY (field_id) REFERENCES professional_fields(id),
    FOREIGN KEY (category_id) REFERENCES resource_categories(id),
    FOREIGN KEY (uploader_id) REFERENCES users(id)
);

-- 6. 资源与软件关联表（多对多）
CREATE TABLE resource_software (
    id INT PRIMARY KEY AUTO_INCREMENT,
    resource_id INT NOT NULL,
    software_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE,
    FOREIGN KEY (software_id) REFERENCES software_tools(id) ON DELETE CASCADE,
    UNIQUE KEY unique_resource_software (resource_id, software_id)
);

-- 7. 资源标签表
CREATE TABLE resource_tags (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. 资源与标签关联表
CREATE TABLE resource_tag_relations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    resource_id INT NOT NULL,
    tag_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES resource_tags(id) ON DELETE CASCADE,
    UNIQUE KEY unique_resource_tag (resource_id, tag_id)
);
-- 1. 插入资源权限数据
INSERT INTO resource_rights (name, description, sort_order) VALUES
('免费', '所有用户均可免费下载', 1),
('VIP专享', '仅VIP会员可下载', 2),
('积分兑换', '需要使用积分兑换下载', 3);

-- 2. 插入专业领域数据
INSERT INTO professional_fields (name, description, sort_order) VALUES
('其他', '其他相关专业领域', 99),
('城乡规划', '城市规划、乡村规划等相关领域', 1),
('建筑设计', '建筑设计与理论', 2),
('风景园林', '园林景观设计', 3),
('地理信息', 'GIS、空间分析等', 4);

-- 插入示例用户数据（多种登录方式）
INSERT INTO users (username,role, email, phone, password, wechat_openid,qq_openid, school, major, professional_field_id, points_balance, membership_level, membership_expires_at) VALUES
-- 账号密码登录
('urban_planner', 0, 'planner@example.com', NULL, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, NULL,'清华大学', '城乡规划', 1, 150, 1, DATE_ADD(NOW(), INTERVAL 30 DAY)),

-- 手机号登录
('arch_designer', 0, NULL, '13800138001', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, NULL,'同济大学', '建筑设计', 2, 80, 0, NULL),

-- 微信登录
('gis_analyst', 0, 'analyst@example.com', NULL, NULL, 'wx_1234567890abcdef',NULL, '武汉大学', '地理信息', 4, 200, 2, DATE_ADD(NOW(), INTERVAL 90 DAY)),

-- QQ登录
('landscape_lover', 0, NULL, NULL, NULL, NULL,'qq_1234567890abcdef','北京林业大学', '风景园林', 3, 45, 0, NULL);

-- 更新QQ登录用户的QQ OpenID
UPDATE users SET qq_openid = 'qq_1234567890abcdef' WHERE username = 'landscape_lover';

-- 3. 插入资源类型数据（两级分类）
INSERT INTO resource_categories (parent_id, name, description, level, sort_order, specialized_field) VALUES
-- 一级分类
(NULL, '其他', '其他', 1, 99, NULL),
(NULL, '参考图库', '各类参考图片资源', 1, 1, NULL),
(NULL, '设计素材', '设计过程中需要的各种素材', 1, 2, NULL),
(NULL, '图纸与作品', '完整的图纸和作品集', 1, 3, NULL),
(NULL, '文本与报告', '文档类资源', 1, 4, NULL),
(NULL, '插件与软件', '软件工具和插件', 1, 5, NULL),
(NULL, '数据与资料', '数据和研究资料', 1, 6, NULL),
(NULL, '在线资源', '有用的网站和在线工具', 1, 7, NULL),

-- 参考图库的二级分类（全部共有）
(1, '其他', '其他', 2, 99, NULL),
(1, '参考图', '设计参考图片', 2, 1, NULL),
(1, '分析图', '各类分析图示例', 2, 2, NULL),
(1, '效果图', '渲染效果图', 2, 3, NULL),
(1, '实景照片', '实地拍摄照片', 2, 4, NULL),

-- 设计素材的二级分类（全部共有）
(2, '其他', '其他', 2, 99, NULL),
(2, 'PS素材/笔刷', 'Photoshop相关素材', 2, 1, NULL),
(2, '贴图材质', '各种材质贴图', 2, 2, NULL),
(2, '模型库', '3D模型资源', 2, 3, NULL),
(2, '渲染素材', '渲染用素材', 2, 4, NULL),
(2, '配景素材', '配景人物、植物等', 2, 5, NULL),
(2, '字体', '设计用字体', 2, 6, NULL),

-- 图纸与作品的二级分类
(3, '其他', '其他', 2, 99, NULL),
(3, '排版', '建筑设计方案排版', 2, 1, 2),
(3, '平面图', '建筑平面图', 2, 2, 2),
(3, '立面图', '建筑立面图', 2, 3, 2),
(3, '剖面图', '建筑剖面图', 2, 4, 2),
(3, '总体规划', '城市总体规划图纸', 2, 5, 1),
(3, '详细规划', '详细规划图纸', 2, 6, 1),
(3, '交通规划', '交通规划图纸', 2, 7, 1),
(3, '分析图', '各类分析图', 2, 8, NULL),
(3, '作品集', '个人或团队作品集', 2, 9, NULL),
(3, '课程作业', '课程设计作业', 2, 10, NULL),
(3, '竞赛作品', '竞赛参赛作品', 2, 11, NULL),

-- 文本与报告的二级分类
(4, '其他', '其他', 2, 99, NULL),
(4, '规划文本', '城乡规划文本模板', 2, 1,1),
(4, '说明书', '规划说明书', 2, 2, 1),
(4, '调研报告', '调研分析报告', 2, 3, NULL),
(4, '开题报告', '研究开题报告', 2, 4, NULL),
(4, '课程论文', '学术论文', 2, 5, NULL),
(4, 'PPT模板', '汇报PPT模板', 2, 6, NULL),
(4, '结课汇报', '课程结课汇报', 2, 7, NULL),

-- 插件与软件的二级分类（全部共有）
(5, '其他', '其他', 2, 99, NULL),
(5, '软件安装包', '软件程序文件', 2, 1, NULL),
(5, '插件/脚本', '各类插件和脚本', 2, 2, NULL),
(5, '学习教程', '软件学习教程', 2, 3, NULL),
(5, '软件技巧', '软件使用技巧', 2, 4, NULL),

-- 数据与资料的二级分类
(6, '其他', '其他', 2, 99, NULL),
(6, '政策法规', '相关政策法规文件', 2, 1, NULL),
(6, '统计数据集', '统计数据资料', 2, 2, NULL),
(6, '地图底图', '基础地图数据', 2, 3, NULL),
(6, '竞赛资讯', '竞赛相关信息', 2, 4, NULL),
(6, '学术文献', '学术论文文献', 2, 5, NULL),
(6, '电子书籍', '电子书资源', 2, 6, NULL),
(6, '学习笔记', '学习笔记分享', 2, 7, NULL),

-- 在线资源的二级分类（全部共有）
(7, '其他', '其他', 2, 99, NULL),
(7, '工具网站', '实用工具网站', 2, 1, NULL),
(7, '数据网站', '数据资源网站', 2, 2, NULL),
(7, '灵感网站', '设计灵感网站', 2, 3, NULL),
(7, '行业机构链接', '行业机构网站', 2, 4, NULL);

-- 4. 插入软件工具数据
INSERT INTO software_tools (name, description, sort_order) VALUES
('其他', '其他', 1),
('AutoCAD', '二维绘图和三维设计', 1),
('SketchUp', '3D建模软件', 2),
('Photoshop', '图像处理软件', 3),
('Illustrator', '矢量图形设计', 4),
('Rhino', '三维建模软件', 5),
('Grasshopper', '参数化设计插件', 6),
('ArcGIS', '地理信息系统', 7),
('QGIS', '开源地理信息系统', 8),
('Revit', 'BIM建筑信息模型', 9),
('3D Max', '三维建模和渲染', 10),
('Lumion', '实时3D可视化', 11),
('Enscape', '实时渲染插件', 12),
('V-Ray', '渲染插件', 13),
('Office', '办公软件套件', 14);

-- 5. 插入示例资源数据
INSERT INTO resources (title, description, file_path, file_size, file_extension, right_id, field_id, category_id, price_points, uploader_id, status, is_featured) VALUES
('城市中心区规划文本模板', '包含完整的城市中心区规划文本框架和内容模板', '/resources/docs/urban_center_template.pdf', 2048576, 'pdf', 1, 1, 25, 0, 1, 2, TRUE),
('SU现代建筑模型库', '包含50个现代风格建筑SketchUp模型', '/resources/models/modern_building_models.zip', 15728640, 'zip', 3, 2, 16, 20, 1, 3, TRUE),
('PS城市分析图素材包', '专门用于制作城市分析图的PS笔刷和样式', '/resources/materials/ps_urban_analysis.psd', 5242880, 'psd', 2, 1, 2, 0, 1, 1, FALSE),
('GIS城市规划数据集', '包含人口、用地、交通等基础数据', '/resources/data/urban_planning_gis.zip', 104857600, 'zip', 3, 4, 32, 30, 1, 1, TRUE),
('居住区规划设计PPT模板', '专业的居住区规划汇报PPT模板', '/resources/templates/residential_planning.pptx', 3145728, 'pptx', 1, 1, 28, 0, 1, 2, FALSE),
('商业建筑立面图集', '各类商业建筑立面设计参考', '/resources/drawings/commercial_facades.dwg', 8388608, 'dwg', 1, 2, 18, 15, 1, 2, TRUE),
('城市交通规划分析图', '城市交通流量与规划分析图例', '/resources/images/traffic_analysis.jpg', 2097152, 'jpg', 2, 1, 22, 0, 1,3, FALSE);

-- 6. 插入资源与软件关联数据
INSERT INTO resource_software (resource_id, software_id) VALUES
(1, 14), (1, 8),  -- 规划文本关联Office和GIS
(2, 2),           -- SU模型关联SketchUp
(3, 3), (3, 4),   -- PS素材关联PS和AI
(4, 7), (4, 8),   -- GIS数据关联ArcGIS和QGIS
(5, 14),          -- PPT模板关联Office
(6, 1),           -- 立面图关联AutoCAD
(7, 3), (7, 4);   -- 分析图关联PS和AI

-- 7. 插入资源标签数据
INSERT INTO resource_tags (name) VALUES
('城市规划'), ('居住区'), ('商业区'), ('公共空间'),
('参数化设计'), ('可持续发展'), ('交通规划'),
('绿地系统'), ('历史文化'), ('智慧城市'),
('现代建筑'), ('商业建筑'), ('交通分析');

-- 8. 插入资源与标签关联数据
INSERT INTO resource_tag_relations (resource_id, tag_id) VALUES
(1, 1), (1, 3), (1, 6),  -- 城市中心区规划
(2, 2), (2, 4), (2, 6), (2, 11), -- 现代建筑模型
(3, 1), (3, 5), (3, 7),  -- 城市分析图
(4, 1), (4, 7), (4, 10), -- GIS数据
(5, 2), (5, 6), (5, 8),  -- 居住区规划
(6, 3), (6, 11), (6, 12), -- 商业建筑立面
(7, 1), (7, 7), (7, 13); -- 交通规划分析

-- 课程相关表设计

-- 1. 课程分类表（一级分类，基于专业领域）
CREATE TABLE course_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE COMMENT '分类名称',
    description TEXT COMMENT '分类描述',
    field_id INT NOT NULL COMMENT '关联的专业领域',
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (field_id) REFERENCES professional_fields(id)
);

-- 2. 课程表
CREATE TABLE courses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL COMMENT '课程标题',
    subtitle VARCHAR(500) COMMENT '课程副标题',
    description TEXT COMMENT '课程描述',
    cover_image VARCHAR(500) COMMENT '课程封面图',
    intro_video VARCHAR(500) COMMENT '视频',
    
    -- 课程基本信息
    user_id INT NOT NULL COMMENT '上传者ID',
    category_id INT NOT NULL COMMENT '课程分类',
    right_id INT NOT NULL COMMENT '访问权限',
    field_id INT NOT NULL COMMENT '专业领域',
    
    -- 课程内容信息
    total_duration INT DEFAULT 0 COMMENT '总时长（分钟）',
    difficulty_level TINYINT DEFAULT 1 COMMENT '难度级别：1-初级，2-中级，3-高级',
    -- 课程统计
    view_count INT DEFAULT 0 COMMENT '浏览人数',
    like_count INT DEFAULT 0 COMMENT '点赞数',
    favorite_count INT DEFAULT 0 COMMENT '收藏数',
    average_rating DECIMAL(3,2) DEFAULT 0 COMMENT '平均评分',
    review_count INT DEFAULT 0 COMMENT '评价数量',
    
    -- 价格信息
    price_points INT DEFAULT 0 COMMENT '课程价格（积分）',
    
    -- 状态控制
    status TINYINT DEFAULT 1 COMMENT '1-草稿，2-审核中，3-已发布，4-已下架',
    is_featured BOOLEAN DEFAULT FALSE COMMENT '是否推荐课程',
    deleted TINYINT DEFAULT 0 COMMENT '软删除',
    
    published_at TIMESTAMP NULL COMMENT '发布时间',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (users_id) REFERENCES users(id),
    FOREIGN KEY (category_id) REFERENCES course_categories(id),
    FOREIGN KEY (right_id) REFERENCES resource_rights(id),
    FOREIGN KEY (field_id) REFERENCES professional_fields(id)
);


-- 5. 课程评价表
CREATE TABLE course_reviews (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    user_id INT NOT NULL,
    rating TINYINT NOT NULL COMMENT '评分1-5',
    title VARCHAR(255) COMMENT '评价标题',
    content TEXT COMMENT '评价内容',
    is_approved BOOLEAN DEFAULT FALSE COMMENT '是否审核通过',
    is_anonymous BOOLEAN DEFAULT FALSE COMMENT '是否匿名评价',
    like_count INT DEFAULT 0 COMMENT '评价点赞数',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_course_user_review (course_id, user_id)
);

-- 6. 课程评价点赞表
CREATE TABLE course_review_likes (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    review_id BIGINT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (review_id) REFERENCES course_reviews(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_review_like (review_id, user_id)
);

-- 7. 课程标签表
CREATE TABLE course_tags (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE COMMENT '标签名称',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. 课程与标签关联表
CREATE TABLE course_tag_relations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    tag_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES course_tags(id) ON DELETE CASCADE,
    UNIQUE KEY unique_course_tag (course_id, tag_id)
);



-- 插入课程分类数据（基于专业领域的一级分类）
INSERT INTO course_categories (name, description, field_id, sort_order) VALUES
-- 城乡规划领域
('城市规划原理', '城市规划基本理论和方法', 1, 1),
('城市设计与更新', '城市设计理论与实践', 1, 2),
('区域规划', '区域发展与规划', 1, 3),
('交通规划', '城市交通系统规划', 1, 4),
('环境规划', '城市环境与生态规划', 1, 5),

-- 建筑设计领域
('建筑设计基础', '建筑设计基本原理', 2, 1),
('建筑历史与理论', '建筑发展历史与理论', 2, 2),
('建筑技术', '建筑结构与材料', 2, 3),
('室内设计', '室内空间设计', 2, 4),
('建筑表现技法', '建筑绘图与表现', 2, 5),

-- 风景园林领域
('景观设计原理', '景观设计基本理论', 3, 1),
('植物造景', '园林植物配置', 3, 2),
('园林工程', '园林工程施工', 3, 3),
('生态修复', '生态修复与保护', 3, 4),

-- 地理信息领域
('GIS基础', '地理信息系统原理', 4, 1),
('空间分析', '空间数据分析方法', 4, 2),
('遥感技术', '遥感原理与应用', 4, 3),
('城市规划GIS应用', 'GIS在城市规划中的应用', 4, 4);

-- 插入示例课程数据
INSERT INTO courses (title, subtitle, description, user_id, category_id, right_id, field_id, total_duration,difficulty_level, price_points, status, is_featured, published_at) VALUES
('城市规划原理与实践', '从理论到实践的完整学习路径', '本课程系统讲解城市规划的基本理论和实践方法，涵盖城市发展历史、规划编制流程、实施管理等内容。', 1, 1, 1, 1, 600, 2, 100, 3, TRUE, NOW()),
('GIS在城市规划中的应用', '利用空间数据分析支持规划决策', '学习如何使用GIS技术辅助城市规划决策，包括空间数据分析、地图制作、规划支持系统等。', 3, 16, 2, 4, 480, 3, 150, 3, TRUE, NOW()),
('建筑设计入门', '零基础学习建筑设计', '适合初学者的建筑设计课程，从基本概念到设计方法，循序渐进掌握建筑设计技能。', 2, 6, 1, 2, 360, 1, 0, TRUE, 3, NOW()),
('景观生态规划', '生态理念在景观设计中的应用', '学习如何将生态理念融入景观设计，创造可持续的景观环境。', 4, 13, 3, 3, 420, 2, 120, FALSE, 3, NOW()),
('SketchUp建筑建模实战', '快速掌握建筑三维建模技巧', '通过实际案例学习SketchUp建模技巧，从基础操作到高级应用。', 2, 10, 1, 2, 300, 2, 80, FALSE, 3, NOW());



-- 插入课程评价数据
INSERT INTO course_reviews (course_id, user_id, rating, title, content, is_approved, like_count) VALUES
(1, 2, 5, '非常实用的城市规划课程', '老师讲解很详细，案例丰富，对实际工作有很大帮助。', TRUE, 3),
(1, 3, 4, '理论与实践结合得很好', '课程内容全面，既有理论深度，又有实践指导价值。', TRUE, 1),
(2, 1, 5, 'GIS应用讲解很到位', '作为规划师，这门课程让我对GIS的应用有了全新认识。', TRUE, 2),
(2, 4, 4, '技术性强，需要一定基础', '课程内容很好，但需要有一定的GIS基础才能跟上。', TRUE, 0),
(3, 3, 5, '适合初学者的好课程', '从零开始学习建筑设计，老师讲解很耐心，容易理解。', TRUE, 1);

-- 插入课程标签数据
INSERT INTO course_tags (name) VALUES
('城市规划'), ('GIS'), ('建筑设计'), ('景观设计'),
('理论与实践'), ('案例分析'), ('软件操作'), ('项目实战'),
('初级'), ('中级'), ('高级'), ('免费');

-- 插入课程标签关联数据
INSERT INTO course_tag_relations (course_id, tag_id) VALUES
(1, 1), (1, 5), (1, 6), (1, 10),
(2, 1), (2, 2), (2, 5), (2, 7), (2, 8), (2, 11),
(3, 3), (3, 7), (3, 9), (3, 12),
(4, 4), (4, 5), (4, 10),
(5, 3), (5, 7), (5, 10);


-- 用户操作模块
-- 1. 用户操作类型表（用数字表示操作类型）
CREATE TABLE user_action_types (
    id TINYINT PRIMARY KEY COMMENT '操作类型ID',
    name VARCHAR(50) NOT NULL UNIQUE COMMENT '操作类型名称',
    description VARCHAR(100) COMMENT '操作描述',
    points_change INT DEFAULT 0 COMMENT '默认积分变化',
    is_active BOOLEAN DEFAULT TRUE
);

-- 2. 用户操作记录表（支持取消操作，同时支持资源和课程）
CREATE TABLE user_actions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    
    -- 支持多种对象类型：资源、课程、帖子等
    target_type TINYINT NOT NULL COMMENT '1-资源，2-课程，3-帖子，4-用户',
    target_id INT NOT NULL COMMENT '目标ID',
    
    action_type TINYINT NOT NULL COMMENT '操作类型',
    action_status TINYINT DEFAULT 1 COMMENT '1-执行，0-取消',
    points_change INT DEFAULT 0 COMMENT '积分变化，正数为获得，负数为消耗',
    
    -- 操作上下文
    ip_address VARCHAR(45) COMMENT '操作IP',
    user_agent TEXT COMMENT '用户代理',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (action_type) REFERENCES user_action_types(id),
    
    -- 同一用户对同一对象的同一操作只记录一次
    UNIQUE KEY unique_user_action (user_id, target_type, target_id, action_type)
);

-- 3. 用户积分流水表
CREATE TABLE user_points_history (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    points_change INT NOT NULL COMMENT '积分变化值',
    current_balance INT NOT NULL COMMENT '变化后余额',
    action_type TINYINT NOT NULL COMMENT '操作类型',
    related_id BIGINT COMMENT '关联的操作记录ID',
    description VARCHAR(255) NOT NULL COMMENT '流水描述',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (action_type) REFERENCES user_action_types(id),
    FOREIGN KEY (related_id) REFERENCES user_actions(id)
);

-- 4. 用户收藏夹表
CREATE TABLE user_favorites (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    name VARCHAR(50) NOT NULL COMMENT '收藏夹名称',
    description TEXT COMMENT '收藏夹描述',
    favorite_type TINYINT DEFAULT 1 COMMENT '1-资源，2-课程，3-帖子',
    is_public BOOLEAN DEFAULT FALSE COMMENT '是否公开',
    sort_order INT DEFAULT 0,
    item_count INT DEFAULT 0 COMMENT '收藏项数量',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_favorite (user_id, name, favorite_type)
);

-- 5. 收藏夹项关联表（支持多种类型）
CREATE TABLE favorite_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    favorite_id INT NOT NULL,
    item_type TINYINT NOT NULL COMMENT '1-资源，2-课程，3-帖子',
    item_id INT NOT NULL COMMENT '收藏项ID',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (favorite_id) REFERENCES user_favorites(id) ON DELETE CASCADE,
    UNIQUE KEY unique_favorite_item (favorite_id, item_type, item_id)
);


-- 插入操作类型数据（扩展支持课程操作）
INSERT INTO user_action_types (id, name, description, points_change) VALUES
-- 资源相关操作
(1, 'resource_like', '点赞资源', 0),
(2, 'resource_cancel_like', '取消点赞资源', 0),
(3, 'resource_favorite', '收藏资源', 0),
(4, 'resource_cancel_favorite', '取消收藏资源', 0),
(5, 'resource_download', '下载资源', -5),
(6, 'resource_upload', '上传资源', 10),
(7, 'resource_review', '评价资源', 2),
(8, 'resource_share', '分享资源', 1),

-- 课程相关操作
(9, 'course_enroll', '报名课程', -10),
(10, 'course_complete', '完成课程', 20),
(11, 'course_review', '评价课程', 5),
(12, 'course_like', '点赞课程', 0),
(13, 'course_cancel_like', '取消点赞课程', 0),
(14, 'course_favorite', '收藏课程', 0),
(15, 'course_cancel_favorite', '取消收藏课程', 0),

-- 通用操作
(16, 'user_follow', '关注用户', 0),
(17, 'user_cancel_follow', '取消关注用户', 0),
(18, 'daily_login', '每日登录', 1);



-- 插入用户操作记录数据（包括资源和课程）
INSERT INTO user_actions (user_id, target_type, target_id, action_type, action_status, points_change) VALUES
-- 资源操作
(1, 1, 1, 1, 1, 0),    -- 点赞资源
(1, 1, 1, 3, 1, 0),    -- 收藏资源
(1, 1, 2, 5, 1, -5),   -- 下载资源
(1, 1, 4, 5, 1, -5),   -- 下载资源

-- 课程操作
(1, 2, 1, 9, 1, -10),  -- 报名课程
(1, 2, 1, 12, 1, 0),   -- 点赞课程
(1, 2, 2, 9, 1, -10),  -- 报名课程

(2, 1, 2, 1, 1, 0),    -- 点赞资源
(2, 1, 2, 3, 1, 0),    -- 收藏资源
(2, 1, 2, 5, 1, -5),   -- 下载资源
(2, 1, 6, 1, 1, 0),    -- 点赞资源

(3, 1, 1, 5, 1, 0),    -- 下载资源（VIP免费）
(3, 1, 4, 5, 1, 0),    -- 下载资源（VIP免费）
(3, 1, 4, 1, 1, 0),    -- 点赞资源
(3, 1, 4, 3, 1, 0),    -- 收藏资源

(4, 1, 3, 1, 1, 0),    -- 点赞资源
(4, 1, 7, 1, 1, 0),    -- 点赞资源
(4, 1, 7, 3, 1, 0);    -- 收藏资源

-- 插入用户收藏夹数据（包括资源和课程收藏）
INSERT INTO user_favorites (user_id, name, description, favorite_type, is_public, item_count) VALUES
(1, '城市规划资料', '收集优秀的城市规划相关资料', 1, TRUE, 2),
(1, '个人参考', '个人学习参考用的资料', 1, FALSE, 1),
(1, '学习课程', '正在学习的课程', 2, FALSE, 2),
(2, '建筑设计灵感', '建筑设计的灵感来源', 1, TRUE, 1),
(3, 'GIS数据资源', '地理信息系统相关数据', 1, TRUE, 1);

-- 插入收藏夹项数据
INSERT INTO favorite_items (favorite_id, item_type, item_id) VALUES
(1, 1, 1),
(1, 1, 4),
(2, 1, 3),
(3, 2, 1),
(3, 2, 2),
(4, 1, 2),
(5, 1, 4);

-- 创建用户索引
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_wechat ON users(wechat_openid);
CREATE INDEX idx_users_qq ON users(qq_openid);
CREATE INDEX idx_users_membership ON users(membership_level, membership_expires_at);
CREATE INDEX idx_users_points ON users(points_balance);
CREATE INDEX idx_users_professional_field ON users(professional_field_id);

CREATE INDEX idx_user_actions_user ON user_actions(user_id);
CREATE INDEX idx_user_actions_target ON user_actions(target_type, target_id);
CREATE INDEX idx_user_actions_type ON user_actions(action_type);
CREATE INDEX idx_user_actions_status ON user_actions(action_status);
CREATE INDEX idx_user_actions_created ON user_actions(created_at);

CREATE INDEX idx_user_points_user ON user_points_history(user_id);
CREATE INDEX idx_user_points_created ON user_points_history(created_at);

CREATE INDEX idx_user_favorites_user ON user_favorites(user_id);
CREATE INDEX idx_favorite_items_favorite ON favorite_items(favorite_id);
CREATE INDEX idx_favorite_items_item ON favorite_items(item_type, item_id);

-- 创建资源索引
CREATE INDEX idx_resources_access_right ON resources(right_id);
CREATE INDEX idx_resources_field ON resources(field_id);
CREATE INDEX idx_resources_category ON resources(category_id);
CREATE INDEX idx_resources_price ON resources(price_points);
CREATE INDEX idx_resources_uploader ON resources(uploader_id);
CREATE INDEX idx_resources_approved ON resources(status);
CREATE INDEX idx_resources_featured ON resources(is_featured);
CREATE INDEX idx_resources_deleted ON resources(deleted);
CREATE INDEX idx_resources_created_at ON resources(created_at);

CREATE INDEX idx_resource_software_resource ON resource_software(resource_id);
CREATE INDEX idx_resource_software_software ON resource_software(software_id);

CREATE INDEX idx_resource_tags_name ON resource_tags(name);
CREATE INDEX idx_resource_tag_relations_resource ON resource_tag_relations(resource_id);
CREATE INDEX idx_resource_tag_relations_tag ON resource_tag_relations(tag_id);

-- 创建课程索引
CREATE INDEX idx_courses_category ON courses(category_id);
CREATE INDEX idx_courses_access_right ON courses(right_id);
CREATE INDEX idx_courses_field ON courses(field_id);
CREATE INDEX idx_courses_status ON courses(status);
CREATE INDEX idx_courses_featured ON courses(is_featured);
CREATE INDEX idx_courses_difficulty ON courses(difficulty_level);
CREATE INDEX idx_courses_rating ON courses(average_rating);
CREATE INDEX idx_courses_created ON courses(created_at);


CREATE INDEX idx_course_reviews_course ON course_reviews(course_id);
CREATE INDEX idx_course_reviews_user ON course_reviews(user_id);
CREATE INDEX idx_course_reviews_rating ON course_reviews(rating);
CREATE INDEX idx_course_reviews_approved ON course_reviews(is_approved);

CREATE INDEX idx_course_review_likes_review ON course_review_likes(review_id);
CREATE INDEX idx_course_review_likes_user ON course_review_likes(user_id);

CREATE INDEX idx_course_tag_relations_course ON course_tag_relations(course_id);
CREATE INDEX idx_course_tag_relations_tag ON course_tag_relations(tag_id);


-- 输出完成信息
SELECT '数据库和表结构创建完成，示例数据已插入' as completion_message;












-- 2. 用户登录历史表
CREATE TABLE user_login_history (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    login_type TINYINT NOT NULL COMMENT '1-账号，2-手机号，3-微信，4-QQ，5-微博，6-GitHub',
    login_ip VARCHAR(45) NOT NULL,
    user_agent TEXT COMMENT '用户代理',
    login_result BOOLEAN NOT NULL COMMENT '登录是否成功',
    failure_reason VARCHAR(100) COMMENT '失败原因',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 插入登录历史记录
INSERT INTO user_login_history (user_id, login_type, login_ip, user_agent, login_result) VALUES
(1, 1, '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', TRUE),
(2, 2, '192.168.1.101', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15', TRUE),
(3, 3, '192.168.1.102', 'Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36', TRUE),
(4, 4, '192.168.1.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', TRUE);

