// Resource.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  Badge, Card, Input, Button, Row, Col, Tag, Pagination, Empty, Spin
} from 'antd';
import {
  SearchOutlined, DownloadOutlined, HeartOutlined, StarOutlined, ClockCircleOutlined, PlayCircleOutlined, FileOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { RadioGroup, Radio, Space } from '@douyinfe/semi-ui';
import FilterButton from '../../components/FilterButton'
import MyButton from '../../components/MyButton';
import MyPagination from '../../components/MyPagination';
const { Search } = Input;

const CourseContainer = ({ isCourse = false, title, description, placeholder, loading, searchParams, setSearchParams, total, handlePageChange, handleSortChange, children, types, handleFilterChange, list, handleSearch, selectedFilters }) => {
  const [resources, setResources] = useState([]);
  const SORT_OPTIONS = [
    { id: 0, name: '最新发布' },
    { id: 1, name: '收藏量' },
    { id: 2, name: '下载量' },
    { id: 3, name: '点赞量' },
    { id: 4, name: '综合排序' }
  ];

  //分类的行
  const TypeSelect = ({ title, arr, type, isMultiple = false }) => {
    return (
      <div className="flex items-start ">
        <span className="text-sm font-medium text-main mr-4 text-nowrap mt-1">{title}：</span>
        <div className="flex flex-wrap gap-3">
          {arr && arr.map(item => (
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
        <div className="flex flex-col justify-start gap-6 bg-card rounded-xl shadow-sm p-6 mb-8 border border-main">
          {/* 第一行：资源权限和专业领域 */}
          <div className="flex justify-between gap-6 flex-wrap">
            <TypeSelect title="资源权限" arr={types.rights} type="rightId" />
            <TypeSelect title="专业领域" arr={types.subjects} type="subjectId" />
          </div>
          {isCourse ? (
            <TypeSelect title="课程类型" arr={types.categories} type="categories" isMultiple={true} />
          ) : (
            <>
              <TypeSelect title="适用软件" arr={types.tools} type="toolIds" isMultiple={true} />
              <TypeSelect title="资源类型" arr={types.firstCategories} type="firstCategories" />
              <TypeSelect title="二级分类" arr={types.secondaryCategories} type="secondaryCategories" isMultiple={true} />
            </>
          )
          }

        </div>

        {/* 排序选项和结果统计 */}
        <div className="flex items-center justify-center gap-10 mb-10">
          <div className="text-md text-main">
            共 <span className="font-bold text-blue-500">{total}</span> 个结果
          </div>
          <div className="flex items-center space-x-2">
            <Space vertical spacing='loose' align='start'>
              <RadioGroup
                onChange={(e) => handleSortChange(e.target.value)}
                type='button' buttonSize='large' defaultValue={1} aria-label="单选组合示例" name="demo-radio-large">
                {SORT_OPTIONS.map((item, index) => (
                  <Radio
                    key={item.id}

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
          ) : list.length > 0 ? (
            <>
              <Row gutter={[24, 24]}>
                {children}
              </Row>

              <div className="flex justify-center my-10">
                <MyPagination
                  currentPage={searchParams.page}
                  pageSize={searchParams.pageSize}
                  total={total}
                  onChange={handlePageChange} />
              </div>
            </>
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="暂无相关结果"
              className="py-20"
            >
              <MyButton
                size="large"
                type="black"
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
              </MyButton>
            </Empty>
          )}
        </div>
      </div>
    </section>
  );
};

export default CourseContainer;