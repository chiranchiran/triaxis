import React from 'react';
import { Pagination } from '@douyinfe/semi-ui';
import './index.less'


function MyPagination({ currentPage = 1, pageSize = 10, total, onChange }) {

  return (
    <div>
      <Pagination
        currentPage={currentPage}
        pageSize={pageSize}
        total={total}
        onChange={onChange}
        showQuickJumper
        showSizeChanger
        pageSizeOpts={[12, 16, 24, 32, 128, 200]}>
      </Pagination>
    </div>
  )
}
export default MyPagination