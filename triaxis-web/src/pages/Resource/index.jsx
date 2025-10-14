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
import { RadioGroup, Radio, Space } from '@douyinfe/semi-ui';
import FilterButton from '../../components/FilterButton'
import MyButton from '../../components/MyButton';
import MyPagination from '../../components/MyPagination';
const { Search } = Input;

// 模拟数据
const RESOURCE_RIGHTS = [
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

const SOFTWARE_TOOLS = [
  { id: 1, name: 'AutoCAD' },
  { id: 2, name: 'SketchUp' },
  { id: 3, name: 'Revit' },
  { id: 4, name: 'Rhino' },
  { id: 5, name: 'Photoshop' },
  { id: 6, name: 'Illustrator' },
  { id: 7, name: 'InDesign' },
  { id: 8, name: 'Lumion' },
  { id: 9, name: 'ArcGIS' }
];

const PRIMARY_CATEGORIES = [
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
];

const SORT_OPTIONS = [
  { id: 0, name: '最新发布' },
  { id: 1, name: '收藏量' },
  { id: 2, name: '下载量' },
  { id: 3, name: '点赞量' },
  { id: 4, name: '综合排序' }
];

const Resource = () => {
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
    primaryCategory: null,
    secondaryCategoryIds: []
  });

  const [secondaryCategories, setSecondaryCategories] = useState([]);
  const [likedResources, setLikedResources] = useState(new Set());
  const [favoritedResources, setFavoritedResources] = useState(new Set());


  //获取分类
  useEffect(() => {

  }, [])


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

      if (type === 'rightId' || type === 'subjectId' || type === 'primaryCategory') {
        newFilters[type] = prev[type] === value ? null : value;

        // 当一级分类变化时，重置二级分类
        if (type === 'primaryCategory') {
          newFilters.secondaryCategoryIds = [];
          const primaryCategory = PRIMARY_CATEGORIES.find(cat => cat.id === value);
          setSecondaryCategories(primaryCategory?.children || []);
        }
      } else if (type === 'toolIds' || type === 'secondaryCategoryIds') {
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

  // 获取文件类型标签
  const getFileTypeTag = (fileExtension) => {
    if (!fileExtension) return null;

    const extension = fileExtension.toLowerCase();
    const typeMap = {
      '.pdf': { color: 'red', text: 'PDF' },
      '.zip': { color: 'orange', text: '压缩包' },
      '.dwg': { color: 'blue', text: 'CAD' },
      '.skp': { color: 'green', text: 'SketchUp' },
      '.psd': { color: 'purple', text: 'PSD' },
      '.ai': { color: 'volcano', text: 'AI' }
    };

    const typeInfo = typeMap[extension] || { color: 'default', text: extension.slice(1).toUpperCase() };
    return <Tag color={typeInfo.color} className="text-xs px-2 py-1">{typeInfo.text}</Tag>;
  };

  //分类的行
  const TypeSelect = ({ title, arr, type, isMultiple = false }) => {
    return (
      <div className="flex items-center mb-6">
        <span className="text-sm font-medium text-main mr-4">{title}：</span>
        <div className="flex flex-wrap gap-2">
          {arr.map(item => (
            <FilterButton
              onClick={() => handleFilterChange(type, item.id)}
              key={item.id}
              item={item}
              type={type}
              isSelected={isMultiple ? selectedFilters[type].includes(item.id) : selectedFilters[type] === item.id}
            />
          ))}
        </div>
      </div>
    )
  }
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部搜索框 */}
      <div className="bg-gradient-to-white pt-15 pb-35">
        <div className="find max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-main mb-4">
            发现优质设计资源
          </h1>
          <p className="text-lg text-main mb-8">
            海量专业资源，助力你的设计创作
          </p>
          <Search
            placeholder="搜索你想要的资源素材..."
            enterButton={
              <Button
                type="primary"
                size="large"
                className="bg-black hover:bg-gray-800 border-black h-full"
                icon={<SearchOutlined />}
              >
                搜索
              </Button>
            }
            size="large"
            onSearch={handleSearch}
            className="max-w-2xl mx-auto h-14 py-1 search-btn"
          />
        </div>
      </div>

      <div className="check max-w-7xl mx-auto">
        {/* 筛选条件区域 */}
        <div className="bg-card rounded-xl shadow-sm p-6 mb-8 border border-main">
          {/* 第一行：资源权限和专业领域 */}
          <div className="flex gap-40">
            <TypeSelect title="资源权限" arr={RESOURCE_RIGHTS} type="rightId" />
            <TypeSelect title="专业领域" arr={PROFESSIONAL_FIELDS} type="subjectId" />
          </div>
          <TypeSelect title="适用软件" arr={SOFTWARE_TOOLS} type="toolIds" isMultiple={true} />
          <TypeSelect title="资源类型" arr={PRIMARY_CATEGORIES} type="primaryCategory" />
          <TypeSelect title="二级分类" arr={secondaryCategories} type="secondaryCategoryIds" isMultiple={true} />
        </div>

        {/* 排序选项和结果统计 */}
        <div className="flex items-center justify-center gap-10 mb-10">
          <div className="text-md text-main">
            共 <span className="font-bold text-blue-500">{total}</span> 个结果
          </div>
          <div className="flex items-center space-x-2">
            <Space vertical spacing='loose' align='start'>
              <RadioGroup type='button' buttonSize='large' defaultValue={1} aria-label="单选组合示例" name="demo-radio-large">
                {SORT_OPTIONS.map((item, index) => (
                  <Radio
                    key={item.id}
                    onClick={() => handleSortChange(item.id)}
                    value={index}
                  >
                    {item.name}</Radio>
                ))}
              </RadioGroup>
            </Space>

          </div>
        </div>

        {/* 资源列表 */}
        <div>
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Spin size="large" />
            </div>
          ) : resources.length > 0 ? (
            <>
              <Row gutter={[24, 24]}>
                {resources.map(resource => (
                  <Col key={resource.id} xs={24} sm={12} lg={8} xl={6}>
                    <Badge.Ribbon text={`${getPriceTag(resource.pricePoints)[0]}`} className={`${getPriceTag(resource.pricePoints)[1]}`} size="large">
                      <Card
                        className="resource-card border-main overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 bg-card"
                        cover={
                          <div
                            className="relative h-42 bg-gray-light overflow-hidden"
                            onClick={() => navigate(`/resources/${resource.id}`)}
                          >
                            {resource.thumbnailPath ? (
                              <img
                                alt="预览图加载失败"
                                title={resource.title}
                                src={resource.thumbnailPath}
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
                              {resource.likeCount || 0}
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-dark p-3">
                              <h3 className="text-white font-medium text-sm text-center line-clamp-1">
                                {resource.title}
                              </h3>
                            </div>
                          </div>
                        }
                      >
                        <div className="space-y-2">
                          {/* 描述 */}
                          <p className="text-gray-600 text-sm line-clamp-2 leading-5">
                            {resource.description}
                          </p>
                          {/* 资源信息 - 发布时间和时长 */}
                          <div className="flex items-center justify-between text-xs text-secondary">
                            <span className="flex items-center">
                              <ClockCircleOutlined className="mr-1" />
                              {resource.uploadTime}
                            </span>
                            <span className="flex items-center">
                              <FileOutlined className="mr-1" />
                              ({resource.fileExtension}) 4MB
                            </span>
                          </div>

                          {/* 统计信息 */}
                          <div className="mb-0 flex items-center justify-start text-md text-secondary border-t border-light space-x-4">
                            <span className="flex items-center">
                              <DownloadOutlined className="mr-1" />
                              {resource.downloadCount || 0}
                            </span>
                            <span className="flex items-center">
                              <StarOutlined className="mr-1" />
                              {resource.favoriteCount || 0}
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
                              type={favoritedResources.has(resource.id) ? "black" : "white"}
                              size="long"
                              icon={<StarOutlined />}
                              onClick={() => handleFavorite(resource.id)}
                            >
                            </MyButton>
                            <MyButton
                              type={likedResources.has(resource.id) ? "black" : "white"}

                              size="long"
                              icon={<HeartOutlined />}
                              onClick={() => handleLike(resource.id)}
                            >
                            </MyButton>
                          </div>
                        </div>
                      </Card>
                    </Badge.Ribbon>

                  </Col>
                ))}
              </Row>

              {/* 分页 - 全部用中文 */}
              <div className="flex justify-center mt-8 pt-6 border-t border-gray-100">
                <MyPagination />
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
              description="暂无相关资源"
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
                    toolIds: [],
                    primaryCategory: null,
                    secondaryCategoryIds: []
                  });
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

export default Resource;