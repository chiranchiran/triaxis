import React, { useCallback, useEffect, useMemo } from 'react'
import { addAll, isArrayValid } from '../utils/commonUtil';
import { FilterButton } from './MyButton';
import { SORT_OPTIONS } from '../utils/constant/order';


export default function Category({
  filterList,
  useGetTypes,
  enableSecondaryCategory,
  getSecondaryCategory,
  selectedFilters,
  setSelectedFilters,
  setSearchParams = null,
  hasOrder = false,
  searchParams = null
}) {

  // 获取学科工具和一级分类数据
  const { data: types = {}, isError: typesError } = useGetTypes();

  // 获取二级分类数据 

  const { data: categoriesSecondaryData, isError: secondaryError } = enableSecondaryCategory ? getSecondaryCategory({
    subjectId: selectedFilters.subjectId,
    parentId: selectedFilters.categoriesFirst
  }, { enabled: !!selectedFilters.subjectId && !!selectedFilters.categoriesFirst })
    : { data: null, isLoading: false, isError: false };

  const enhancedtypes = useMemo(() => {
    if (!types) return {};
    //isTypes标记非二级分类字段，field标记非共有字段
    // subject都有，但是工具、难度、一级分类、话题都属于各自特有，配置field属性添加
    const list = filterList.filter(i => i.field && i.isTypes);
    const enhanced = list.reduce((pre, cur) => {
      //有right的还需要添加right字段
      if (cur.list) {
        pre[cur.type] = cur.list
        return pre;
      }
      pre[cur.type] = types[cur.field]
      return pre
    }, {
      subjectId: types.subjects,
    })

    // 为每个分类列表添加"全部"选项
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

    // const hasEnoughData = enhancedtypes.subjectId?.length > 1 && enhancedtypes.toolIds?.length > 1;

    // if (!hasEnoughData) return;
    const field = filterList.filter(item => !item.isFirst && item.isTypes).map(i => i.type)
    //有字段没有获得数据先不初始化
    for (const i of field) {
      if (!isArrayValid(enhancedtypes[i])) return
    }

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
      //单选
      if (!config.isMultiple) {
        newFilters[type] = value;
        if (config.isFirst) {
          newFilters.categoriesSecondary = [];
        }
        //多选
      } else {
        if (value === null) {
          newFilters[type] = [null];
        } else {
          const withoutNull = currentValues.filter(item => item !== null);
          if (currentValues.includes(value)) {
            // 选择选项
            newFilters[type] = currentValues.filter(item => item !== value);
          } else {
            // 取消选择
            newFilters[type] = [...withoutNull, value];
          }
          //不选中时默认选择全部
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
    <div className="flex flex-col justify-start gap-5 bg-card rounded-xl shadow-sm p-6 mb-8">
      {filterConfigs.length > 0 && !isError &&
        filterConfigs.map((config, index) => (
          <TypeSelect key={config.type || index} config={config} />
        ))}
      {
        isError && <p className='text-center text-lg'>出现错误，暂无搜索项</p>
      }
      {hasOrder && (
        <div className="flex items-start border-t border-main pt-4">
          <span className="text-sm font-medium text-main mr-4 text-nowrap mt-1">
            排序方式：
          </span>
          <div className="flex flex-wrap gap-3">
            {SORT_OPTIONS.map(item => (
              <FilterButton
                onClick={() => setSearchParams(pre => ({ ...pre, orderBy: item.id, page: 1 }))}
                key={item.id}
                item={item}
                isSelected={searchParams.orderBy === item.id}
              />
            ))}
          </div>
        </div>)

      }
    </div>

  )
}
