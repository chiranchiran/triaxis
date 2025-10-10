// Course.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  Input,
  Button,
  Row,
  Col,
  Tag,
  Pagination,
  Empty,
  Spin
} from 'antd';
import {
  SearchOutlined,
  PlayCircleOutlined,
  HeartOutlined,
  StarOutlined,
  EyeOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';

const { Search } = Input;

// 模拟数据
const COURSE_RIGHTS = [
  { id: 1, name: '全部' },
  { id: 2, name: '免费' },
  { id: 3, name: 'VIP专享' },
  { id: 4, name: '积分兑换' }
];

const PROFESSIONAL_FIELDS = [
  { id: 1, name: '城乡规划' },
  { id: 2, name: '建筑设计' },
  { id: 3, name: '风景园林' },
  { id: 4, name: '地理信息' },
  { id: 5, name: '其他' }
];

// 课程分类数据（基于专业领域）
const COURSE_CATEGORIES = [
  // 城乡规划领域
  { id: 1, name: '城市规划原理', fieldId: 1 },
  { id: 2, name: '城市设计与更新', fieldId: 1 },
  { id: 3, name: '区域规划', fieldId: 1 },
  { id: 4, name: '交通规划', fieldId: 1 },
  { id: 5, name: '环境规划', fieldId: 1 },

  // 建筑设计领域
  { id: 6, name: '建筑设计基础', fieldId: 2 },
  { id: 7, name: '建筑历史与理论', fieldId: 2 },
  { id: 8, name: '建筑技术', fieldId: 2 },
  { id: 9, name: '室内设计', fieldId: 2 },
  { id: 10, name: '建筑表现技法', fieldId: 2 },

  // 风景园林领域
  { id: 11, name: '景观设计原理', fieldId: 3 },
  { id: 12, name: '植物造景', fieldId: 3 },
  { id: 13, name: '园林工程', fieldId: 3 },
  { id: 14, name: '生态修复', fieldId: 3 },

  // 地理信息领域
  { id: 15, name: 'GIS基础', fieldId: 4 },
  { id: 16, name: '空间分析', fieldId: 4 },
  { id: 17, name: '遥感技术', fieldId: 4 },
  { id: 18, name: '城市规划GIS应用', fieldId: 4 }
];

const SORT_OPTIONS = [
  { id: 0, name: '最新发布' },
  { id: 1, name: '收藏量' },
  { id: 2, name: '学习人数' },
  { id: 3, name: '点赞量' },
  { id: 4, name: '综合排序' }
];

const Course = () => {
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [total, setTotal] = useState(0);
  const [searchParams, setSearchParams] = useState({
    page: 1,
    pageSize: 12,
    orderBy: 0
  });

  const [selectedFilters, setSelectedFilters] = useState({
    rightId: null,
    subjectId: null,
    categoryId: null
  });

  const [filteredCategories, setFilteredCategories] = useState([]);
  const [likedCourses, setLikedCourses] = useState(new Set());
  const [favoritedCourses, setFavoritedCourses] = useState(new Set());

  // 获取课程列表
  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      // 模拟API调用
      setTimeout(() => {
        const mockCourses = Array.from({ length: 12 }, (_, index) => {
          const publishDate = new Date();
          publishDate.setMonth(publishDate.getMonth() - index);

          return {
            id: index + 1,
            title: `城市规划原理与实践课程 ${index + 1}`,
            subtitle: '深入理解城市规划的基本理论与方法',
            description: '本课程系统讲解城市规划的基本原理、发展历程和实践应用，涵盖城市设计、区域规划、交通规划等多个方面，适合城乡规划专业学生和从业人员学习。',
            coverImage: index % 3 === 0 ? '/images/course-placeholder.jpg' : null,
            introVideo: '/videos/course-intro.mp4',
            totalDuration: Math.floor(Math.random() * 600) + 60,
            difficultyLevel: Math.floor(Math.random() * 3) + 1,
            pricePoints: index % 4 === 0 ? 0 : (index % 4 === 1 ? -1 : 100),
            viewCount: Math.floor(Math.random() * 5000),
            likeCount: Math.floor(Math.random() * 500),
            favoriteCount: Math.floor(Math.random() * 300),
            reviewCount: Math.floor(Math.random() * 200),
            averageRating: (Math.random() * 2 + 3).toFixed(1),
            categoryId: Math.floor(Math.random() * 18) + 1,
            publishDate: publishDate.toISOString().split('T')[0].replace(/-/g, '.')
          };
        });

        setCourses(mockCourses);
        setTotal(85642);
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error('获取课程失败:', error);
      setLoading(false);
    }
  }, [searchParams, selectedFilters]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // 当专业领域变化时，更新课程分类
  useEffect(() => {
    if (selectedFilters.subjectId) {
      const filtered = COURSE_CATEGORIES.filter(cat => cat.fieldId === selectedFilters.subjectId);
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories([]);
    }
  }, [selectedFilters.subjectId]);

  // 处理搜索
  const handleSearch = (value) => {
    setSearchParams(prev => ({
      ...prev,
      search: value,
      page: 1
    }));
  };

  // 处理筛选条件变化
  const handleFilterChange = (type, value) => {
    setSelectedFilters(prev => {
      const newFilters = { ...prev };

      if (type === 'rightId' || type === 'subjectId' || type === 'categoryId') {
        newFilters[type] = prev[type] === value ? null : value;
      }

      return newFilters;
    });

    setSearchParams(prev => ({
      ...prev,
      page: 1
    }));
  };

  // 处理排序变化
  const handleSortChange = (orderBy) => {
    setSearchParams(prev => ({
      ...prev,
      orderBy,
      page: 1
    }));
  };

  // 处理分页变化
  const handlePageChange = (page, pageSize) => {
    setSearchParams(prev => ({
      ...prev,
      page,
      pageSize: pageSize || prev.pageSize
    }));
  };

  // 处理点赞
  const handleLike = (courseId) => {
    const newLiked = new Set(likedCourses);
    if (newLiked.has(courseId)) {
      newLiked.delete(courseId);
    } else {
      newLiked.add(courseId);
    }
    setLikedCourses(newLiked);
  };

  // 处理收藏
  const handleFavorite = (courseId) => {
    const newFavorited = new Set(favoritedCourses);
    if (newFavorited.has(courseId)) {
      newFavorited.delete(courseId);
    } else {
      newFavorited.add(courseId);
    }
    setFavoritedCourses(newFavorited);
  };

  // 获取价格标签
  const getPriceTag = (pricePoints) => {
    if (pricePoints === 0) {
      return <Tag color="green" className="text-xs px-2 py-1">免费</Tag>;
    } else if (pricePoints === -1) {
      return <Tag color="gold" className="text-xs px-2 py-1">VIP专享</Tag>;
    } else {
      return <Tag color="blue" className="text-xs px-2 py-1">{pricePoints}积分</Tag>;
    }
  };

  // 获取难度标签
  const getDifficultyTag = (difficultyLevel) => {
    const levels = {
      1: { color: 'green', text: '初级' },
      2: { color: 'orange', text: '中级' },
      3: { color: 'red', text: '高级' }
    };
    const levelInfo = levels[difficultyLevel] || { color: 'default', text: '未知' };
    return <Tag color={levelInfo.color} className="text-xs px-2 py-1">{levelInfo.text}</Tag>;
  };

  // 获取时长显示
  const getDurationText = (minutes) => {
    if (minutes < 60) {
      return `${minutes}分钟`;
    } else {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return mins > 0 ? `${hours}小时${mins}分钟` : `${hours}小时`;
    }
  };

  // 筛选按钮组件
  const FilterButton = ({ item, type, isSelected, isMultiple = false }) => {
    const handleClick = () => {
      handleFilterChange(type, item.id);
    };

    return (
      <button
        onClick={handleClick}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${isSelected
          ? 'bg-gray-200 text-gray-800 border border-gray-300'
          : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
          }`}
      >
        {item.name}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部搜索区域 - 搜索框变大变高 */}
      <div className="bg-gradient-to-b from-sky-100 to-white pt-15 pb-35">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            发现优质专业课程
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            系统化学习，提升专业能力
          </p>
          <Search
            placeholder="搜索你想要的课程..."
            enterButton={
              <Button
                type="primary"
                size="large"
                className="bg-black hover:bg-gray-800 border-black h-full"
                icon={<SearchOutlined />}
              >
                搜索课程
              </Button>
            }
            size="large"
            onSearch={handleSearch}
            className="max-w-2xl mx-auto h-14 py-1 search-btn"
          />
        </div>
      </div>

      {/* 筛选条件区域 */}
      <div className="check max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
          {/* 第一行：课程权限和专业领域 */}
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <span className="text-sm font-medium text-gray-700 mr-4 min-w-[60px]">课程权限：</span>
              <div className="flex flex-wrap gap-2">
                {COURSE_RIGHTS.map(item => (
                  <FilterButton
                    key={item.id}
                    item={item}
                    type="rightId"
                    isSelected={selectedFilters.rightId === item.id}
                  />
                ))}
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700 mr-4 min-w-[60px]">专业领域：</span>
              <div className="flex flex-wrap gap-2">
                {PROFESSIONAL_FIELDS.map(item => (
                  <FilterButton
                    key={item.id}
                    item={item}
                    type="subjectId"
                    isSelected={selectedFilters.subjectId === item.id}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* 第二行：课程分类 - 根据专业领域动态显示 */}
          {filteredCategories.length > 0 && (
            <div className="mb-4">
              <div className="flex items-start">
                <span className="text-sm font-medium text-gray-700 mr-4 min-w-[60px] mt-2">课程分类：</span>
                <div className="flex flex-wrap gap-2 flex-1">
                  {filteredCategories.map(item => (
                    <FilterButton
                      key={item.id}
                      item={item}
                      type="categoryId"
                      isSelected={selectedFilters.categoryId === item.id}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 排序选项和结果统计 */}
        <div className="flex items-center justify-between mb-8">
          <div className="text-sm text-gray-600">
            共 <span className="font-bold text-blue-500">{total}</span> 个课程
          </div>
          <div className="flex items-center space-x-2">
            {SORT_OPTIONS.map(item => (
              <button
                key={item.id}
                onClick={() => handleSortChange(item.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${searchParams.orderBy === item.id
                  ? 'bg-orange-100 text-orange-700 border border-orange-300'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
                  }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>

        {/* 课程列表 */}
        <div>
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Spin size="large" />
            </div>
          ) : courses.length > 0 ? (
            <>
              <Row gutter={[24, 24]}>
                {courses.map(course => (
                  <Col key={course.id} xs={24} sm={12} lg={8} xl={6}>
                    <Card
                      className="course-card h-full border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-white"
                      styles={{
                        body: {
                          padding: '16px'
                        }
                      }}
                      cover={
                        <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                          {course.coverImage ? (
                            <img
                              alt={course.title}
                              src={course.coverImage}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                              <div className="text-center">
                                <div className="text-4xl mb-2">🎓</div>
                                <div className="text-sm">课程封面</div>
                              </div>
                            </div>
                          )}
                          {/* 标签放在左上角 */}
                          <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                            {getPriceTag(course.pricePoints)}
                            {getDifficultyTag(course.difficultyLevel)}
                          </div>
                          {/* 点赞量显示在图片右上角 - 使用浅粉色背景 */}
                          <div className="absolute top-3 right-3 bg-pink-100 bg-like text-pink-600 text-xs px-2 py-1 rounded-full flex items-center">
                            <HeartOutlined className="mr-1" />
                            {course.likeCount}
                          </div>
                          {/* 课程名称放在缩略图内部底部居中 */}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                            <h3 className="text-white font-medium text-sm text-center line-clamp-1">
                              {course.title}
                            </h3>
                          </div>
                        </div>
                      }
                    >
                      <div className="space-y-3">
                        {/* 副标题 */}
                        {course.subtitle && (
                          <p className="text-gray-600 text-sm font-medium line-clamp-1">
                            {course.subtitle}
                          </p>
                        )}

                        {/* 描述 */}
                        <p className="text-gray-600 text-sm line-clamp-2 leading-5">
                          {course.description}
                        </p>

                        {/* 课程信息 - 发布时间和时长 */}
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span className="flex items-center">
                            <ClockCircleOutlined className="mr-1" />
                            {course.publishDate}
                          </span>
                          <span className="flex items-center">
                            <PlayCircleOutlined className="mr-1" />
                            {getDurationText(course.totalDuration)}
                          </span>
                        </div>

                        {/* 统计信息 */}
                        <div className="flex items-center justify-between text-md text-gray-500 border-t border-gray-100 pt-2">
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center">
                              <EyeOutlined className="mr-1" />
                              {course.viewCount || 0}
                            </span>
                            <span className="flex items-center">
                              <StarOutlined className="mr-1" />
                              {course.favoriteCount || 0}
                            </span>
                          </div>
                          {course.averageRating > 0 && (
                            <span className="flex items-center text-yellow-500">
                              <StarOutlined className="mr-1" />
                              {course.averageRating}
                            </span>
                          )}
                        </div>

                        {/* 操作按钮 */}
                        <div className="flex space-x-2">
                          <Button
                            type="primary"
                            size="md"
                            className="flex-1 bg-black hover:bg-gray-800 border-black"
                            icon={<PlayCircleOutlined />}
                          >
                            开始学习
                          </Button>
                          <Button
                            size="md"
                            icon={<StarOutlined />}
                            className={`border-gray-300 ${favoritedCourses.has(course.id)
                              ? 'text-yellow-500 bg-yellow-50 border-yellow-200'
                              : 'text-gray-500 hover:text-yellow-500'
                              }`}
                            onClick={() => handleFavorite(course.id)}
                          />
                          <Button
                            size="md"
                            icon={<HeartOutlined />}
                            className={`border-gray-300 ${likedCourses.has(course.id)
                              ? 'text-pink-500 bg-pink-50 border-pink-200'
                              : 'text-gray-500 hover:text-pink-500'
                              }`}
                            onClick={() => handleLike(course.id)}
                          />
                        </div>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>

              {/* 分页 - 全部用中文 */}
              <div className="flex justify-center mt-8 pt-6 border-t border-gray-100">
                <Pagination
                  current={searchParams.page}
                  pageSize={searchParams.pageSize}
                  total={total}
                  onChange={handlePageChange}
                  showSizeChanger
                  showQuickJumper
                  showTotal={(total, range) =>
                    `显示第 ${range[0]}-${range[1]} 条，共 ${total} 条结果`
                  }
                  pageSizeOptions={['12', '24', '36', '48']}
                />
              </div>
            </>
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="暂无相关课程"
              className="py-20"
            >
              <Button
                type="primary"
                className="bg-black hover:bg-gray-800 border-black"
                onClick={() => {
                  setSearchParams({ page: 1, pageSize: 12, orderBy: 0 });
                  setSelectedFilters({
                    rightId: null,
                    subjectId: null,
                    categoryId: null
                  });
                  setFilteredCategories([]);
                }}
              >
                重新搜索
              </Button>
            </Empty>
          )}
        </div>
      </div>
    </div>
  );
};

export default Course;