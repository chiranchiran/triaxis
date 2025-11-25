import React from 'react';
import { Empty, Button } from '@douyinfe/semi-ui';
import { IllustrationConstruction, IllustrationConstructionDark, IllustrationNoAccess, IllustrationNoAccessDark, IllustrationNotFound, IllustrationNotFoundDark } from '@douyinfe/semi-illustrations';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from 'antd';

const Loading = () => {
  return (
    // <Empty
    //   image={<IllustrationConstruction style={{ width: 400, height: 400 }} />}
    //   darkModeImage={<IllustrationConstructionDark style={{ width: 400, height: 400 }} />}
    //   description={'加载页面中'}
    // >
    // </Empty>
    <Skeleton active paragraph={{ rows: 20 }} className='p-20' />
  )
};
export default Loading;