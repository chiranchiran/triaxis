import { useQuery } from '@tanstack/react-query';
import { useState, useCallback } from 'react';

export const useGet = (key, queryFunction, initialPage = 1, initialPageSize = 10, options = {}) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [queryParams, setQueryParams] = useState({});

  const mergedParams = useCallback(() => {
    return { ...queryParams, currentPage, pageSize };
  }, [queryParams, currentPage, pageSize]);

  // const query = useApi(queryFunction, {
  //   module: module,
  //   apiName: apiName,
  //   mergedParams,
  //   isMutation: true,
  //   ...options
  // }
  // )
  const query = useQuery({
    queryKey: [key, mergedParams()],
    queryFn: async () => {
      const res = await queryFunction(mergedParams());
      if (res.code === 0) {
        showNotification(`获取失败: ${res.msg || '未知错误'}`, 'error');
        throw new Error(res.msg || '获取失败');
      }

      // 计算分页元数据
      const total = res.data.total;
      const totalPages = Math.ceil(total / pageSize);
      const hasNextPage = currentPage < totalPages;
      const hasPrevPage = currentPage > 1;

      return {
        records: res.data.records,
        total,
        currentPage,
        totalPages,
        hasNextPage,
        hasPrevPage
      };
    },
    keepPreviousData: true,
    staleTime: 5000,
  });

  // 重置页码为1时设置页面大小
  const setPageSizeWithReset = (size) => {
    setCurrentPage(1);
    setPageSize(size);
  };

  // 设置查询参数（用于搜索）
  const setParams = (params) => {
    setCurrentPage(1);
    setQueryParams(params);
  };

  return {
    ...query,
    setCurrentPage,
    pageSize,
    setPageSize: setPageSizeWithReset,
    setParams,
    goToNextPage: () => {
      if (query.data?.hasNextPage) {
        setCurrentPage(p => p + 1);
      }
    },
    goToPrevPage: () => {
      if (query.data?.hasPrevPage) {
        setCurrentPage(p => p - 1);
      }
    },
    goToPage: (newPage) => {
      if (newPage >= 1 && newPage <= query.data?.totalPages) {
        setCurrentPage(newPage);
      }
    }
  };
};