// Resource.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  Badge, Card, Input, Button, Row, Col, Tag, Pagination, Empty, Spin
} from 'antd';
import {
  SearchOutlined, DownloadOutlined, HeartOutlined, StarOutlined, ClockCircleOutlined, PlayCircleOutlined, FileOutlined
} from '@ant-design/icons';
import './index.less'
import { useNavigate } from 'react-router-dom';
import FilterButton from '../../components/FilterButton'
import MyButton from '../../components/MyButton';
import CourseContainer from '../../components/CourseContainer';
import { useGetResource, useGetResourceTypes } from '../../hooks/api/resources';

let types = {
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
  tools: [
    { id: 1, name: 'AutoCAD' },
    { id: 2, name: 'SketchUp' },
    { id: 3, name: 'Revit' },
    { id: 4, name: 'Rhino' },
    { id: 5, name: 'Photoshop' },
    { id: 6, name: 'Illustrator' },
    { id: 7, name: 'InDesign' },
    { id: 8, name: 'Lumion' },
    { id: 9, name: 'ArcGIS' }
  ],
  firstCategories: [
    {
      id: 1,
      name: '参考图库',
      children: [
        { id: 101, name: '参考图' },
        { id: 102, name: '分析图' },
        { id: 103, name: '效果图' },
        { id: 104, name: '实景照片' },
        { id: 199, name: '其他' }
      ]
    },
    {
      id: 2,
      name: '设计素材',
      children: [
        { id: 201, name: 'PS素材/笔刷' },
        { id: 202, name: '贴图材质' },
        { id: 203, name: '模型库' },
        { id: 204, name: '渲染素材' },
        { id: 205, name: '配景素材' },
        { id: 206, name: '字体' },
        { id: 299, name: '其他' }
      ]
    },
    {
      id: 3,
      name: '图纸与作品',
      children: [
        { id: 301, name: '建筑特有' },
        { id: 302, name: '规划特有' },
        { id: 303, name: '分析图' },
        { id: 304, name: '作品集' },
        { id: 305, name: '课程作业' },
        { id: 306, name: '竞赛作品' },
        { id: 399, name: '其他' }
      ]
    },
    {
      id: 4,
      name: '文本与报告',
      children: [
        { id: 401, name: '城乡规划特有' },
        { id: 402, name: '调研报告' },
        { id: 403, name: '开题报告' },
        { id: 404, name: '课程论文' },
        { id: 405, name: 'PPT模板' },
        { id: 406, name: '结课汇报' },
        { id: 499, name: '其他' }
      ]
    },
    {
      id: 5,
      name: '插件与软件',
      children: [
        { id: 501, name: '软件安装包' },
        { id: 502, name: '插件/脚本' },
        { id: 503, name: '学习教程' },
        { id: 504, name: '软件技巧' },
        { id: 599, name: '其他' }
      ]
    },
    {
      id: 6,
      name: '数据与资料',
      children: [
        { id: 601, name: '政策法规' },
        { id: 602, name: '统计数据集' },
        { id: 603, name: '地图底图' },
        { id: 604, name: '学术文献' },
        { id: 605, name: '电子书籍' },
        { id: 606, name: '学习笔记' },
        { id: 607, name: '竞赛资讯' },
        { id: 699, name: '其他' }
      ]
    },
    {
      id: 7,
      name: '在线资源',
      children: [
        { id: 701, name: '工具网站' },
        { id: 702, name: '数据网站' },
        { id: 703, name: '灵感网站' },
        { id: 704, name: '行业机构链接' },
        { id: 799, name: '其他' }
      ]
    }
  ]
}

const Resource = () => {
  const { data: ResourcesTypes } = useGetResourceTypes()
  const [loading, setLoading] = useState(false);
  const [resources, setResources] = useState([]);
  const [total, setTotal] = useState(0);
  const [searchParams, setSearchParams] = useState({
    page: 1,
    pageSize: 12,
    orderBy: 0
  });

  const [selectedFilters, setSelectedFilters] = useState({
    rightId: null,
    subjectId: null,
    toolIds: [],
    firstCategories: null,
    secondaryCategories: []
  });

  const [secondaryCategories, setSecondaryCategories] = useState([]);
  const [likedResources, setLikedResources] = useState(new Set());
  const [favoritedResources, setFavoritedResources] = useState(new Set());


  //获取分类
  useEffect(() => {
    types = ResourcesTypes
  }, [ResourcesTypes])


  // 获取资源列表
  const fetchResources = useCallback(async () => {
    setLoading(true);
    try {
      // 模拟API调用
      setTimeout(() => {
        const mockResources = Array.from({ length: 12 }, (_, index) => ({
          id: index + 1,
          title: `建筑设计参考图集 ${index + 1}`,
          description: '这是一份高质量的建筑设计参考图集，包含多种风格的建筑图纸和设计思路，适用于建筑设计专业的学生和从业者参考使用。',
          thumbnailPath: index % 3 === 0 ? '/images/resource-placeholder.jpg' : null,
          pricePoints: index % 4 === 0 ? 0 : (index % 4 === 1 ? -1 : 50),
          fileExtension: index % 3 === 0 ? '.pdf' : (index % 3 === 1 ? '.zip' : '.dwg'),
          downloadCount: Math.floor(Math.random() * 1000),
          likeCount: Math.floor(Math.random() * 500),
          favoriteCount: Math.floor(Math.random() * 300),
          uploadTime: "2022.02.02"
        }));

        setResources(mockResources);
        setTotal(117229);
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error('获取资源失败:', error);
      setLoading(false);
    }
  }, [searchParams, selectedFilters]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

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

      if (type === 'rightId' || type === 'subjectId' || type === 'firstCategories') {
        newFilters[type] = prev[type] === value ? null : value;

        // 当一级分类变化时，重置二级分类
        if (type === 'firstCategories') {
          newFilters.secondaryCategories = [];
          const firstCategories = types.firstCategories.find(cat => cat.id === value);
          setSecondaryCategories(firstCategories?.children || []);
        }
      } else if (type === 'toolIds' || type === 'secondaryCategories') {
        const currentValues = prev[type] || [];
        if (currentValues.includes(value)) {
          newFilters[type] = currentValues.filter(item => item !== value);
        } else {
          newFilters[type] = [...currentValues, value];
        }
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
  const handleLike = (resourceId) => {
    console.log(resourceId)
    const newLiked = new Set(likedResources);
    if (newLiked.has(resourceId)) {
      newLiked.delete(resourceId);
    } else {
      console.log(resourceId)

      newLiked.add(resourceId);
    }
    setLikedResources(newLiked);
    console.log(likedResources)
  };

  // 处理收藏
  const handleFavorite = (resourceId) => {
    const newFavorited = new Set(favoritedResources);
    if (newFavorited.has(resourceId)) {
      newFavorited.delete(resourceId);
    } else {

      newFavorited.add(resourceId);
    }
    setFavoritedResources(newFavorited);
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
  const navigate = useNavigate()
  return (
    <CourseContainer
      title="发现优质设计资源"
      description="海量专业资源，助力你的设计创作"
      placeholder="搜索你想要的资源素材..."
      types={types}
      handleFilterChange={handleFilterChange}
      list={resources}
      handleSearch={handleSearch}
      selectedFilters={selectedFilters}
      total={total}
      handlePageChange={handlePageChange}
      handleSortChange={handleSortChange}
      setSearchParams={setSearchParams}
      searchParams={searchParams}
      loading={loading}
    >

      {resources.map(resource => (
        <Col key={resource?.id} xs={24} sm={12} lg={8} xl={6}>
          <Badge.Ribbon text={`${getPriceTag(resource?.pricePoints)[0]}`} className={`${getPriceTag(resource.pricePoints)[1]}`} size="large">
            <Card
              className="resource-card border-main overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 bg-card"
              cover={
                <div
                  className="relative h-42 bg-gray-light overflow-hidden"
                  onClick={() => navigate(`/resources/${resource?.id}`)}
                >
                  {resource?.thumbnailPath ? (
                    <img
                      alt="预览图加载失败"
                      title={resource?.title}
                      src={resource?.thumbnailPath}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-main text-center">
                      <div className="text-4xl mb-2">📁</div>
                      <div className="text-sm">暂无预览图</div>
                    </div>
                  )}

                  <div className="absolute top-3 left-3 bg-like text-sm px-2 py-1 rounded-lg flex items-center">
                    <HeartOutlined className="mr-1" />
                    {resource?.likeCount || 0}
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-dark p-3">
                    <h3 className="text-light font-medium text-sm text-center line-clamp-1">
                      {resource?.title}
                    </h3>
                  </div>
                </div>
              }
            >
              <div className="space-y-2">
                {/* 描述 */}
                <p className="text-main text-sm line-clamp-2 leading-5">
                  {resource?.description}
                </p>
                {/* 资源信息 - 发布时间和时长 */}
                <div className="flex items-center justify-between text-xs text-secondary">
                  <span className="flex items-center">
                    <ClockCircleOutlined className="mr-1" />
                    {resource?.uploadTime}
                  </span>
                  <span className="flex items-center">
                    <FileOutlined className="mr-1" />
                    ({resource?.fileExtension}) 4MB
                  </span>
                </div>

                {/* 统计信息 */}
                <div className="mb-0 flex items-center justify-start text-md text-secondary border-t border-light space-x-4">
                  <span className="flex items-center">
                    <DownloadOutlined className="mr-1" />
                    {resource?.downloadCount || 0}
                  </span>
                  <span className="flex items-center">
                    <StarOutlined className="mr-1" />
                    {resource?.favoriteCount || 0}
                  </span>
                </div>

                {/* 操作按钮 */}
                <div className="flex space-x-2 mt-1">
                  <MyButton
                    type="black"
                    size="long"
                    className="flex-1"
                    icon={<DownloadOutlined />}
                  >
                    下载
                  </MyButton>
                  <MyButton
                    type={favoritedResources.has(resource?.id) ? "black" : "white"}
                    size="long"
                    icon={<StarOutlined />}
                    onClick={() => handleFavorite(resource?.id)}
                  >
                  </MyButton>
                  <MyButton
                    type={likedResources.has(resource?.id) ? "black" : "white"}

                    size="long"
                    icon={<HeartOutlined />}
                    onClick={() => handleLike(resource?.id)}
                  >
                  </MyButton>
                </div>
              </div>
            </Card>
          </Badge.Ribbon>

        </Col>
      ))}

    </CourseContainer>
  );
};

export default Resource;


