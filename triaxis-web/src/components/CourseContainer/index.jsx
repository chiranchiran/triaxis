// components/CourseContainer/index.jsx
import React from 'react';
import { Input, Button, Row, Col, Empty, Spin, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import MyPagination from '../MyPagination';
import './index.less'
import { MyButton, OrderButton } from '../MyButton';
import Category from '../Category';

const { Search } = Input;
const SORT_OPTIONS = [
  { id: 0, name: '最新发布' },
  { id: 1, name: '收藏量' },
  { id: 2, name: '下载量' },
  { id: 3, name: '点赞量' },
  { id: 4, name: '综合排序' }
];
const CourseContainer = ({
  title,
  description,
  placeholder,
  filterList,
  useGetTypes,
  enableSecondaryCategory,
  getSecondaryCategory,
  dataLoading,
  dataError,
  searchParams,
  setSearchParams,
  children,
  data = {},
  selectedFilters,
  setSelectedFilters
}) => {

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

  // 处理搜索
  const handleSearch = (value) => {
    setSearchParams(prev => ({
      ...prev,
      search: value.trim(),
      page: 1
    }));
  };

  const clear = () => {
    setSearchParams(prev => ({
      ...prev,
      search: "",
      page: 1
    }));
  }

  const records = data?.records || [];
  const total = data?.total || 0;

  return (
    <section>
      {/* 顶部搜索框 */}
      <div className="bg-gradient-to-white pt-15 pb-35">
        <div className="find max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-main mb-4">
            {title}
          </h1>
          <p className="text-lg text-main mb-8">
            {description}
          </p>
          <Search
            placeholder={placeholder}
            enterButton={
              <Button
                type="primary"
                size="large"
                className="bg-black  border-black h-full"
                icon={<SearchOutlined />}
              >
                搜索
              </Button>
            }
            allowClear={true}
            onClear={clear}
            size="large"
            loading={dataLoading}
            onSearch={handleSearch}
            className="max-w-2xl mx-auto h-14 py-1 search-btn"
          />
        </div>
      </div>

      <div className="check max-w-7xl mx-auto">
        {/* 筛选条件区域 */}
        <Category
          filterList={filterList}
          useGetTypes={useGetTypes}
          enableSecondaryCategory={enableSecondaryCategory}
          getSecondaryCategory={getSecondaryCategory}
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
        />
        {/* 排序选项和结果统计 */}
        <div className="flex items-center justify-center gap-10 mb-10">
          <div className="text-md text-main">
            共 <span className="font-bold text-blue-500">{total}</span> 个结果
          </div>
          <OrderButton handleSortChange={handleSortChange} list={SORT_OPTIONS} value={searchParams.orderBy} />
        </div>

        {/* 资源列表 */}
        <div>
          {dataLoading ? (
            <div className="flex justify-center items-center py-20">
              <Spin size="large" />
            </div>
          ) : records.length > 0 && !dataError ? (
            <>
              <Row gutter={[24, 24]}>
                {children}
              </Row>

              <div className="flex justify-center my-10">
                <MyPagination
                  currentPage={searchParams.page}
                  pageSize={searchParams.pageSize}
                  total={total}
                  onChange={handlePageChange}
                />
              </div>
            </>
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="暂无相关结果"
              className="pt-10 pb-20"
            >
              <MyButton
                size="middle"
                type="black"
                onClick={() => {
                  setSearchParams({
                    page: 1,
                    pageSize: 12,
                    orderBy: 0,
                    search: ""
                  });
                }}
              >
                重置搜索条件
              </MyButton>
            </Empty>
          )}
        </div>
      </div>
    </section>
  );
};

export default CourseContainer;