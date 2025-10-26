import React, { useCallback, useEffect, useMemo } from 'react'
import { isDataValid } from '../utils/error/commonUtil';
import { FilterButton } from './MyButton';


export default function Category({
  filterList,
  useGetTypes,
  enableSecondaryCategory,
  getSecondaryCategory,
  selectedFilters,
  setSelectedFilters
}) {

  // 获取学科工具和一级分类数据
  const { data: types = {}, isError: typesError } = useGetTypes();

  // 获取二级分类数据 

  const { data: categoriesSecondaryData, isError: secondaryError } = enableSecondaryCategory ? getSecondaryCategory({
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
    const enhanced = {
      right: filterList[0].list,
      subjectId: types.subjects,
      toolIds: types.tools,
      categoriesFirst: types.categoriesFirst
    }

    for (const key in enhanced) {
      const config = filterList.find(item => item.type === key);
      if (!config?.isNotAll) {
        enhanced[key] = addAll(enhanced[key])
      }
    }
    return enhanced;
  }, [types]);

  const enhancedSecondaryCategory = useMemo(() => {
    if (!enableSecondaryCategory) return [];
    return addAll(categoriesSecondaryData);
  }, [categoriesSecondaryData, enableSecondaryCategory]);

  // 初始化一级分类选择
  useEffect(() => {

    if (Object.keys(enhancedtypes).length === 0) return;

    const hasEnoughData = enhancedtypes.subjectId?.length > 1 && enhancedtypes.toolIds?.length > 1;

    if (!hasEnoughData) return;
    const field = filterList.filter(item => !item.isFirst && item.isTypes).map(i => i.type)

    const multiple = filterList.filter(item => item.isMultiple).map(i => i.type)
    const filters = field.reduce((acc, item) => {
      const config = filterList.find(i => i.type === item);
      const value = enhancedtypes[item][config.default]?.id || null;
      acc[item] = multiple.includes(item) ? [value] : value;
      return acc;
    }, {});
    const newFilters = {
      ...selectedFilters,
      ...filters
    };
    const config = filterList.find(i => i.isFirst);
    if (enableSecondaryCategory && enhancedtypes.categoriesFirst?.length > 1) {
      newFilters.categoriesFirst = enhancedtypes.categoriesFirst[config.default]?.id || null;
    }

    setSelectedFilters(newFilters);
  }, [enhancedtypes, enableSecondaryCategory]);

  // 初始化二级分类选择
  useEffect(() => {
    if (!enableSecondaryCategory || enhancedSecondaryCategory.length <= 1) return;
    const config = filterList.find(i => !i.isTypes);
    setSelectedFilters(prev => ({
      ...prev,
      categoriesSecondary: [enhancedSecondaryCategory[config.default]?.id]
    }));
  }, [enhancedSecondaryCategory, enableSecondaryCategory]);

  // 构建筛选配置
  const filterConfigs = useMemo(() => {
    return filterList.map(item => {
      let list = [];

      if (item.isTypes) {
        list = enhancedtypes[item.type] || [];
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
          if (config.isFirst) {
            newFilters[type] = null;
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

  const isError = typesError || secondaryError;

  return (
    <div className="flex flex-col justify-start gap-5 bg-card rounded-xl shadow-sm p-6 mb-8 border border-main">
      {filterConfigs.length > 0 && !isError &&
        filterConfigs.map((config, index) => (
          <TypeSelect key={config.type || index} config={config} />
        ))
      }{
        isError && <p className='text-center text-lg'>出现错误，暂无搜索项</p>
      }
    </div>

  )
}
