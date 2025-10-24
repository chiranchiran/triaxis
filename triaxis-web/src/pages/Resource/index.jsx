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
import { subUsername } from '../../utils/error/commonUtil';
const filterList = [
  {
    title: "资源权限",
    type: "right",
    field: "rights",
    list: [{
      id: 1,
      name: "免费"
    }, {
      id: 2,
      name: "积分兑换"
    }, {
      id: 3,
      name: "VIP专享"
    }],
    isMultiple: false,
    isTypes: true
  },
  {
    title: "专业领域",
    type: "subjectId",
    isMultiple: false,
    isTypes: true,
    isNotAll: true
  },
  {
    title: "适用软件",
    type: "toolIds",
    isMultiple: true,
    isTypes: true
  },
  {
    title: "资源类型",
    type: "categoriesFirst",
    isMultiple: false,
    isFirst: true,
    isTypes: true,
    isNotAll: true
  },
  {
    title: "二级分类",
    type: "categoriesSecondary",
    isMultiple: true,
    isTypes: false
  }
]
const Resource = () => {
  const navigate = useNavigate();
  const userData = getUserData();
  const { mutation: dolike } = useLike();
  const { mutation: doCollect } = useCollect();

  const [searchParams, setSearchParams] = useState({
    search: "",
    page: 1,
    pageSize: 12,
    orderBy: 0
  });

  // 筛选条件和搜索参数状态
  const [selectedFilters, setSelectedFilters] = useState({
    right: null,
    subjectId: null,
    toolIds: [],
    categoriesFirst: null,
    categoriesSecondary: []
  });
  const getParams = arr => {
    if (arr.length < 1) return;
    if (Array.isArray(arr[0])) {
      return JSON.parse(JSON.stringify(arr[0]));
    }
    return arr;
  };
  const resourcesParams = useMemo(() => ({
    right: selectedFilters.right,
    subjectId: selectedFilters.subjectId,
    toolIds: selectedFilters.toolIds,
    categoryIds: getParams(selectedFilters.categoriesSecondary),
    ...searchParams
  }), [
    selectedFilters.right,
    selectedFilters.subjectId,
    selectedFilters.toolIds,
    selectedFilters.categoriesSecondary,
    searchParams
  ]);

  const { data: resources = {}, isFetching: resourcesLoading, isError: resourcesError } = useGetResources(resourcesParams, {
    enabled: !!selectedFilters.subjectId && !!selectedFilters.categoriesFirst && !!getParams(selectedFilters.categoriesSecondary)
  });

  // 获取价格标签
  const getPriceTag = (isPurchased, right, price) => {
    if (isPurchased) return ['已购买', 'ribbon-green'];
    switch (right) {
      case 1:
        return ['免费', 'ribbon-green'];
      case 3:
        return ['VIP专享', 'ribbon-orange'];
      case 2:
        return [`${price}积分`, 'ribbon-blue'];
      default:
        return [`${price}积分`, 'ribbon-blue'];
    }
  };

  const records = resources.records || [];

  return (
    <CourseContainer
      title="发现优质设计资源"
      description="海量专业资源，助力你的设计创作"
      placeholder="搜索你想要的资源素材..."
      filterList={filterList}
      useGetTypes={useGetResourceTypes}
      enableSecondaryCategory={true}
      getSecondaryCategory={useGetSecondaryCategory}
      dataLoading={resourcesLoading}
      dataError={resourcesError}
      data={resourcesError ? {} : resources}
      selectedFilters={selectedFilters}
      setSelectedFilters={setSelectedFilters}
      searchParams={searchParams}
      setSearchParams={setSearchParams}
    >
      {records.map(resource => {
        const {
          resourceDetail: {
            id,
            title = "",
            description = "没有具体介绍",
            right,
            price = 0,
            coverImage = "",
            likeCount = 0,
            collectCount = 0,
            downloadCount = 0,
            size = 100,
            publishTime,
            updateTime,
          } = {},
          uploader: {
            userId,
            username = "已注销",
            avatar,
          } = {},
          userActions: {
            isLiked = false,
            isCollected = false,
            isPurchased = false
          } = {}
        } = resource || {}
        const [priceText, ribbonClass] = getPriceTag(isPurchased, right, price);

        return (
          <Col xs={24} sm={12} lg={8} xl={6} key={id}>
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
                        alt="封面预览图加载失败"
                        title={title}
                        src={coverImage}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-main text-center">
                        <div className="text-4xl mb-2">📁</div>
                        <div className="text-sm">暂无封面图</div>
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
                  <div className="flex items-center justify-between gap-4 text-xs text-secondary">
                    <span className="flex items-center cursor-pointer" title={username}>
                      <Avatar
                        size={16}
                        src={avatar}
                        icon={<UserOutlined />}
                        className="border border-main !mr-1"
                      />
                      {subUsername(username, 15)}
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