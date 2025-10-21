// Resource.jsx
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  Badge, Card, Row, Col, Avatar
} from 'antd';
import {
  DownloadOutlined, HeartOutlined, StarOutlined, FileOutlined,
  CloudUploadOutlined, SyncOutlined, UserOutlined
} from '@ant-design/icons';
import './index.less'
import { useNavigate } from 'react-router-dom';
import CourseContainer from '../../components/CourseContainer';
import { useGetResourceTypes, useGetResources, useGetSecondaryCategory } from '../../hooks/api/resources';
import { converBytes } from '../../utils/convertUnit';
import { getUserData } from '../../utils/localStorage';
import { useCollect } from '../../hooks/api/common';
import { useLike } from '../../hooks/api/common';
import MyButton from '../../components/MyButton';
import { isDataValid, subUsername } from '../../utils/error/commonUtil';

const Resource = () => {
  const navigate = useNavigate();
  const userData = getUserData();
  const id = userData?.id;
  const { mutation: dolike } = useLike();
  const { mutation: doCollect } = useCollect();

  const [searchParams, setSearchParams] = useState({
    search: "",
    page: 1,
    pageSize: 10,
    orderBy: 0
  });
  // 筛选条件和搜索参数状态
  const [selectedFilters, setSelectedFilters] = useState({
    rightId: null,
    subjectId: null,
    toolIds: [null],
    categoriesFirst: null,
    categoriesSecondary: [null]
  });
  // 获取分类数据
  const { data: resourceTypes = {}, isLoading: typesLoading, isError: typesError } = useGetResourceTypes({ enabled: true, });

  // 获取二级分类数据 
  const { data: categoriesSecondaryData, isLoading: secondaryLoading, isError: secondaryError } = useGetSecondaryCategory({
    subjectId: selectedFilters.subjectId,
    parentId: selectedFilters.categoriesFirst
  });


  // 为每个分类列表添加"全部"选项
  const enhancedResourceTypes = useMemo(() => {
    if (!resourceTypes) return {}

    return {
      ...resourceTypes,
      rights: isDataValid(resourceTypes.rights)
        ? [{ id: null, name: '全部' }, ...resourceTypes.rights]
        : (resourceTypes.rights || []),
      subjects: isDataValid(resourceTypes.subjects)
        ? [{ id: null, name: '全部' }, ...resourceTypes.subjects]
        : (resourceTypes.subjects || []),
      tools: isDataValid(resourceTypes.tools)
        ? [{ id: null, name: '全部' }, ...resourceTypes.tools]
        : (resourceTypes.tools || []),
    };
  }, [resourceTypes]);

  const enhancedSecondaryCategory = useMemo(() => {
    return isDataValid(categoriesSecondaryData)
      ? [{ id: null, name: '全部' }, ...(categoriesSecondaryData || [])]
      : (categoriesSecondaryData || [])
  }, [categoriesSecondaryData]);
  const allSecondaryCategories = useMemo(() => {
    return isDataValid(categoriesSecondaryData) ? categoriesSecondaryData.map((item) => item.id) : []
  }, [categoriesSecondaryData]);
  // 初始化一级分类选择
  useEffect(() => {
    if (enhancedResourceTypes.rights &&
      enhancedResourceTypes.subjects &&
      enhancedResourceTypes.tools &&
      enhancedResourceTypes.categoriesFirst) {

      const hasEnoughData =
        enhancedResourceTypes.rights.length > 1 &&
        enhancedResourceTypes.subjects.length > 1 &&
        enhancedResourceTypes.tools.length > 1 &&
        enhancedResourceTypes.categoriesFirst.length > 1;

      if (hasEnoughData) {
        setSelectedFilters(prev => ({
          ...prev,
          rightId: enhancedResourceTypes.rights[1].id,
          subjectId: enhancedResourceTypes.subjects[1].id,
          toolIds: [enhancedResourceTypes.tools[1].id],
          categoriesFirst: enhancedResourceTypes.categoriesFirst[1].id
        }));
      }
    }
  }, [enhancedResourceTypes]);

  // 初始化二级分类选择
  useEffect(() => {
    if (enhancedSecondaryCategory.length > 1) {
      setSelectedFilters(prev => ({
        ...prev,
        categoriesSecondary: [enhancedSecondaryCategory[1].id]
      }));
    }
  }, [enhancedSecondaryCategory]);


  // 构建筛选配置
  const filterConfigs = useMemo(() => [
    {
      title: "资源权限",
      type: "rightId",
      list: enhancedResourceTypes?.rights || [],
      isMultiple: false
    },
    {
      title: "专业领域",
      type: "subjectId",
      list: enhancedResourceTypes?.subjects || [],
      isMultiple: false
    },
    {
      title: "适用软件",
      type: "toolIds",
      list: enhancedResourceTypes?.tools || [],
      isMultiple: true
    },
    {
      title: "资源类型",
      type: "categoriesFirst",
      list: enhancedResourceTypes?.categoriesFirst || [],
      isMultiple: false
    },
    {
      title: "二级分类",
      type: "categoriesSecondary",
      list: enhancedSecondaryCategory,
      isMultiple: true
    }
  ], [enhancedResourceTypes, enhancedSecondaryCategory]);



  // 获取资源数据
  const { data: resources = {}, isFetching: resourcesLoading, isError: resourcesError } = useGetResources({
    useId: id,
    rightId: selectedFilters.rightId,
    subjectId: selectedFilters.subjectId,
    toolIds: selectedFilters.toolIds,
    categoryIds: selectedFilters.categoriesSecondary[0] === null ? allSecondaryCategories : selectedFilters.categoriesSecondary,
    ...searchParams
  });

  // 处理搜索
  const handleSearch = (value) => {
    setSearchParams(prev => ({
      ...prev,
      search: value,
      page: 1
    }));
  };

  // 处理筛选条件变化
  const handleFilterChange = useCallback((type, value) => {
    setSelectedFilters(prev => {
      const newFilters = { ...prev };
      const currentValues = prev[type] || [];

      if (type === 'rightId' || type === 'subjectId' || type === 'categoriesFirst') {
        newFilters[type] = value;
        if (type === 'categoriesFirst') {
          newFilters.categoriesSecondary = [];
        }
      } else if (type === 'toolIds' || type === 'categoriesSecondary') {
        if (value === null) {
          newFilters[type] = [null];
        } else {
          const withoutNull = currentValues.filter(item => item !== null);
          if (withoutNull.includes(value)) {
            newFilters[type] = withoutNull.filter(item => item !== value);
          } else {
            newFilters[type] = [...withoutNull, value];
          }
          if (newFilters[type].length === 0) {
            newFilters[type] = [null];
          }
        }
      }
      return newFilters;
    });
  }, []);


  // 获取价格标签
  const getPriceTag = (isPurchased, price) => {
    if (isPurchased) return ['已购买', 'ribbon-green'];
    switch (price) {
      case 0:
        return ['免费', 'ribbon-green'];
      case -1:
        return ['VIP专享', 'ribbon-orange'];
      default:
        return [`${price}积分`, 'ribbon-blue'];
    }
  };

  const records = resources.records || [];
  const loading = resourcesLoading || typesLoading || secondaryLoading;
  const isError = resourcesError || typesError || secondaryError

  return (
    <CourseContainer
      title="发现优质设计资源"
      description="海量专业资源，助力你的设计创作"
      placeholder="搜索你想要的资源素材..."
      filterConfigs={isError ? [] : filterConfigs}
      handleFilterChange={handleFilterChange}
      data={isError ? [] : resources}
      handleSearch={handleSearch}
      selectedFilters={selectedFilters}
      searchParams={searchParams}
      setSearchParams={setSearchParams}
      loading={loading}
    >
      {records.map(resource => {
        const {
          id,
          title,
          description = "没有具体介绍",
          price = 0,
          coverImage = "",
          size = 100,
          likeCount = 0,
          collectCount = 0,
          downloadCount = 0,
          userId,
          username = "已注销",
          avatar,
          publishTime,
          updateTime,
          isLiked = false,
          isCollected = false,
          isPurchased = false
        } = resource;

        const [priceText, ribbonClass] = getPriceTag(isPurchased, price);

        return (
          <Col key={id} xs={24} sm={12} lg={8} xl={6}>
            <Badge.Ribbon text={priceText} className={ribbonClass} size="large">
              <Card
                className="resource-card border-main overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 bg-card"
                cover={
                  <div
                    className="relative h-42 bg-gray-light overflow-hidden cursor-pointer"
                    onClick={() => navigate(`/resources/${id}`)}
                  >
                    {coverImage ? (
                      <img
                        alt="预览图加载失败"
                        title={title}
                        src={coverImage}
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
                      {likeCount}
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-dark p-3">
                      <h3 className="text-light font-medium text-sm text-center line-clamp-1">
                        {title}
                      </h3>
                    </div>
                  </div>
                }
              >
                <div className="space-y-2">
                  {/* 描述 */}
                  <p className="text-main text-sm line-clamp-2 leading-5">
                    {description}
                  </p>

                  {/* 资源信息 - 发布时间和时长 */}
                  <div className="flex items-center justify-start  gap-4 text-xs text-secondary">
                    <span className="flex items-center cursor-pointer" title={username}>
                      <Avatar
                        size={16}
                        src={avatar}
                        icon={<UserOutlined />}
                        className="border border-main !mr-1"
                      />
                      {subUsername(username, 10)}
                    </span>
                    {publishTime && (
                      <span className="flex items-center">
                        <CloudUploadOutlined className="mr-1" />
                        {publishTime}
                      </span>
                    )}
                    {publishTime !== updateTime && updateTime && (
                      <span className="flex items-center">
                        <SyncOutlined className="mr-1" />
                        {updateTime}
                      </span>
                    )}

                  </div>

                  {/* 统计信息 */}
                  <div className="mb-0 flex items-center justify-start text-md text-secondary border-t border-light space-x-4">
                    <span className="flex items-center">
                      <DownloadOutlined className="mr-1" />
                      {downloadCount}
                    </span>
                    <span className="flex items-center">
                      <StarOutlined className="mr-1" />
                      {collectCount}
                    </span>
                    <span className="flex items-center">
                      <FileOutlined className="mr-1" />
                      {converBytes(size)}
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
                      type={isCollected ? "black" : "white"}
                      size="long"
                      icon={<StarOutlined />}
                      onClick={() => doCollect(1, id, userId)}
                    />
                    <MyButton
                      type={isLiked ? "black" : "white"}
                      size="long"
                      icon={<HeartOutlined />}
                      onClick={() => dolike(1, id, userId)}
                    />
                  </div>
                </div>
              </Card>
            </Badge.Ribbon>
          </Col>
        );
      })}
    </CourseContainer>
  );
};

export default Resource;