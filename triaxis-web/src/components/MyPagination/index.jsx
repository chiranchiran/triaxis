import React from 'react';
import { Pagination } from '@douyinfe/semi-ui';
import './index.less'


function MyPagination() {
  return (
    <div>
      <Pagination
        total={300}
        showQuickJumper
        showSizeChanger
        pageSizeOpts={[10, 20, 50, 200]}>
      </Pagination>
    </div>
  )
}
export default MyPagination