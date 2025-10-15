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
  Spin,
  Badge
} from 'antd';
import {
  SearchOutlined,
  PlayCircleOutlined,
  HeartOutlined,
  StarOutlined,
  EyeOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import CourseContainer from '../../components/CourseContainer';
import MyButton from '../../components/MyButton';
import ScoreIcon from '../../components/Score';

const { Search } = Input;
const types = {
  rights: [
    { id: 1, name: '全部' },
    { id: 2, name: '免费' },
    { id: 3, name: 'VIP专享' },
    { id: 4, name: '积分兑换' }
  ],
  subjects: [
    { id: 1, name: '城乡规划' },
    { id: 2, name: '建筑设计' },
    { id: 3, name: '风景园林' },
    { id: 4, name: '地理信息' },
    { id: 5, name: '其他' }
  ],
  categories: [
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
  ]
}


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
    categories: [1]
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
  const navigate = useNavigate()

  // 当专业领域变化时，更新课程分类
  useEffect(() => {
    if (selectedFilters.subjectId) {
      const filtered = types.categories.filter(cat => cat.fieldId === selectedFilters.subjectId);
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

      if (type === 'rightId' || type === 'subjectId' || type === 'categories') {
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
      return ['免费', 'ribbon-green']
    } else if (pricePoints === -1) {
      return ['VIP专享', 'ribbon-orange']
    } else {
      return [`${pricePoints}积分`, 'ribbon-blue']
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

  return (
    <CourseContainer
      isCourse
      title="发现优质专业课程"
      description="系统化学习，提升专业能力"
      placeholder="搜索你想要的课程..."
      types={types}
      handleFilterChange={handleFilterChange}
      list={courses}
      handleSearch={handleSearch}
      selectedFilters={selectedFilters}
      total={total}
      handlePageChange={handlePageChange}
      handleSortChange={handleSortChange}
      setSearchParams={setSearchParams}
      searchParams={searchParams}
      loading={loading}
    >
      {
        courses.map(course => (
          <Col key={course.id} xs={24} sm={12} lg={8} xl={6}>
            <Badge.Ribbon text={`${getPriceTag(course.pricePoints)[0]}`} className={`${getPriceTag(course.pricePoints)[1]}`} size="large">
              <Card
                className="resource-card border-main overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 bg-card"
                cover={
                  <div
                    className="relative h-42 bg-gray-light overflow-hidden"
                    onClick={() => navigate(`/courses/${course.id}`)}
                  >
                    {course.coverImage ? (
                      <img
                        alt="预览图加载失败"
                        title={course.title}
                        src={course.coverImage}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-main text-center">
                        <div className="text-4xl mb-2">🎓</div>
                        <div className="text-sm">暂无课程封面</div>
                      </div>
                    )}
                    <div className='absolute top-3 left-3 flex flex-col items-start gap-2'>
                      <div className="bg-like text-sm px-2 py-1 rounded-lg flex items-center">
                        <HeartOutlined className="mr-1" /> {course.likeCount || 0}
                      </div>
                      <div className="bg-score text-sm px-2 py-1 rounded-lg flex items-center">
                        <ScoreIcon className="mr-1" /> {course.averageRating || 0.0}
                      </div>
                    </div>


                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-dark p-3">
                      <h3 className="text-light font-medium text-sm text-center line-clamp-1">
                        {course.title}
                      </h3>
                    </div>
                  </div>
                }
              >
                <div className="space-y-2">
                  {/* 副标题 */}
                  {course.subtitle && (
                    <p className="text-main text-sm line-clamp-1">
                      {course.subtitle}
                    </p>
                  )}

                  {/* 描述 */}
                  <p className="text-secondary text-xs line-clamp-2 leading-5">
                    {course.description}
                  </p>

                  {/* 课程信息 - 发布时间和时长 */}
                  <div className="flex items-center justify-between text-xs text-secondary">
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
                  <div className="mb-0 flex items-center justify-start text-md text-secondary border-t border-light space-x-4">
                    <span className="flex items-center">
                      <EyeOutlined className="mr-1" />
                      {course.viewCount || 0}
                    </span>
                    <span className="flex items-center">
                      <StarOutlined className="mr-1" />
                      {course.favoriteCount || 0}
                    </span>
                    <span className="flex items-center">
                      难度:{' '}{course.difficultyLevel || 0}级
                    </span>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex space-x-2 mt-1">
                    <MyButton
                      type="black"
                      size="long"
                      className="flex-1"
                      icon={<PlayCircleOutlined />}
                    >
                      学习
                    </MyButton>
                    <MyButton
                      type={favoritedCourses.has(course.id) ? "black" : "white"}
                      size="long"
                      icon={<StarOutlined />}
                      onClick={() => handleFavorite(course.id)}
                    >
                    </MyButton>
                    <MyButton
                      type={likedCourses.has(course.id) ? "black" : "white"}

                      size="long"
                      icon={<HeartOutlined />}
                      onClick={() => handleLike(course.id)}
                    >
                    </MyButton>
                  </div>
                </div>
              </Card>
            </Badge.Ribbon>
          </Col>
        ))
      }
    </CourseContainer>
  );
};

export default Course;