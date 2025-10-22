// components/CourseContainer/index.jsx
import React, { useMemo, useEffect, useCallback } from 'react';
import { Input, Button, Row, Col, Empty, Spin, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { RadioGroup, Radio } from '@douyinfe/semi-ui';
import { useNavigate } from 'react-router-dom';
import FilterButton from '../FilterButton';
import MyButton from '../MyButton';
import MyPagination from '../MyPagination';
import { isDataValid } from '../../utils/error/commonUtil';
import './index.less'

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
  // 获取分类数据
  const { data: types = {}, isLoading: typesLoading, isError: typesError } = useGetTypes();

  // 获取二级分类数据 

  const { data: categoriesSecondaryData, isLoading: secondaryLoading, isError: secondaryError } = enableSecondaryCategory ? getSecondaryCategory({
    subjectId: selectedFilters.subjectId,
    parentId: selectedFilters.categoriesFirst
  }, { enabled: !!selectedFilters.subjectId && !!selectedFilters.categoriesFirst })
    : { data: null, isLoading: false, isError: false };

  const addAll = (type, id = null) => {
    return isDataValid(type)
      ? [{ id, name: '全部' }, ...type]
      : (type || [])
  };
  // 为每个分类列表添加"全部"选项
  const enhancedtypes = useMemo(() => {
    if (!types) return {};
    const enhanced = { ...types };

    for (const key in enhanced) {
      const config = filterList.find(item => item.field === key);
      if (!config?.isNotAll) {
        enhanced[key] = addAll(types[key])
      }
    }

    return enhanced;
  }, [types]);

  const enhancedSecondaryCategory = useMemo(() => {
    if (!enableSecondaryCategory) return [];
    return addAll(categoriesSecondaryData);
  }, [categoriesSecondaryData, enableSecondaryCategory]);

  const allSecondaryCategories = useMemo(() => {
    return isDataValid(categoriesSecondaryData) ? categoriesSecondaryData.map((item) => item.id) : [];
  }, [categoriesSecondaryData]);

  // 初始化一级分类选择
  useEffect(() => {
    if (Object.keys(enhancedtypes).length === 0) return;

    const hasEnoughData =
      enhancedtypes.rights?.length > 1 &&
      enhancedtypes.subjects?.length > 1 &&
      enhancedtypes.tools?.length > 1;

    if (!hasEnoughData) return;
    const field = filterList.filter(item => !item.isFirst && item.isTypes).map(i => i.type)
    const multiple = filterList.filter(item => item.isMultiple).map(i => i.type)
    const filters = field.reduce((acc, item) => {
      const config = filterList.find(i => i.type === item);
      const value = enhancedtypes[config?.field][0]?.id || null;
      acc[item] = multiple.includes(item) ? [value] : value;
      return acc;
    }, {});
    const newFilters = {
      ...selectedFilters,
      ...filters
    };

    if (enableSecondaryCategory && enhancedtypes.categoriesFirst?.length > 1) {
      newFilters.categoriesFirst = enhancedtypes.categoriesFirst[1]?.id || null;
    }

    setSelectedFilters(newFilters);
  }, [enhancedtypes, enableSecondaryCategory]);

  // 初始化二级分类选择
  useEffect(() => {
    if (!enableSecondaryCategory || enhancedSecondaryCategory.length <= 1) return;

    setSelectedFilters(prev => ({
      ...prev,
      categoriesSecondary: [enhancedSecondaryCategory[0]?.id]
    }));
  }, [enhancedSecondaryCategory, enableSecondaryCategory]);

  // 构建筛选配置
  const filterConfigs = useMemo(() => {
    return filterList.map(item => {
      let list = [];

      if (item.isTypes) {
        list = enhancedtypes[item.field] || [];
      } else {
        list = enhancedSecondaryCategory;
      }

      return {
        ...item,
        list: list
      };
    });
  }, [enhancedtypes, enhancedSecondaryCategory]);

  // 处理筛选条件变化
  const handleFilterChange = useCallback((type, value) => {
    setSelectedFilters(prev => {
      const newFilters = { ...prev };
      const currentValues = prev[type] || [];
      const config = filterConfigs.find(item => item.type === type);

      if (!config) return prev;

      if (!config.isMultiple) {
        newFilters[type] = value;
        if (config.isFirst) {
          newFilters.categoriesSecondary = [];
        }
      } else {
        if (value === null) {
          if (!config.isTypes) {
            newFilters[type] = [allSecondaryCategories, null];
          } else {
            newFilters[type] = [null];
          }

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
  }, [filterConfigs]);

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
  // 分类选择组件
  const TypeSelect = ({ config }) => {
    const { title, type, list, isMultiple = false } = config;

    if (!list || !Array.isArray(list) || list.length === 0) return null;

    return (
      <div className="flex items-start">
        <span className="text-sm font-medium text-main mr-4 text-nowrap mt-1">
          {title}：
        </span>
        <div className="flex flex-wrap gap-3">
          {list.map(item => (
            <FilterButton
              onClick={() => handleFilterChange(type, item.id)}
              key={item.id}
              item={item}
              isSelected={isMultiple ?
                (selectedFilters[type] || []).includes(item.id) :
                selectedFilters[type] === item.id
              }
            />
          ))}
        </div>
      </div>
    );
  };

  const records = data?.records || [];
  const loading = dataLoading || typesLoading || secondaryLoading;
  const isError = dataError || typesError || secondaryError;
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
                className="bg-black hover:bg-gray-800 border-black h-full"
                icon={<SearchOutlined />}
              >
                搜索
              </Button>
            }
            allowClear={true}
            onClear={clear}
            size="large"
            loading={loading}
            onSearch={handleSearch}
            className="max-w-2xl mx-auto h-14 py-1 search-btn"
          />
        </div>
      </div>

      <div className="check max-w-7xl mx-auto ">
        {/* 筛选条件区域 */}
        <div className="flex flex-col justify-start gap-5 bg-card rounded-xl shadow-sm p-6 mb-8 border border-main min-h-40">
          {filterConfigs.length > 0 && !isError &&
            filterConfigs.map((config, index) => (
              <TypeSelect key={config.type || index} config={config} />
            ))
          }
        </div>

        {/* 排序选项和结果统计 */}
        <div className="flex items-center justify-center gap-10 mb-10">
          <div className="text-md text-main">
            共 <span className="font-bold text-blue-500">{total}</span> 个结果
          </div>
          <div className="flex items-center space-x-2">
            <Space vertical="true" spacing='loose' align='start'>
              <RadioGroup
                onChange={(e) => handleSortChange(e.target.value)}
                type='button'
                buttonSize='large'
                value={searchParams.orderBy}
                aria-label="单选组合示例"
                name="demo-radio-large"
              >
                {SORT_OPTIONS.map((item, index) => (
                  <Radio key={item.id} value={index}>
                    {item.name}
                  </Radio>
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
          ) : records.length > 0 ? (
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
              className="py-20"
            >
              <MyButton
                size="large"
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