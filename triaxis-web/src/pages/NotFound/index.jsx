import React from 'react';
import { Empty, Button } from '@douyinfe/semi-ui';
import { IllustrationNotFound, IllustrationNotFoundDark } from '@douyinfe/semi-illustrations';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Empty
      image={<IllustrationNotFound style={{ width: 400, height: 400 }} />}
      darkModeImage={<IllustrationNotFoundDark style={{ width: 400, height: 400 }} />}
      title="页面404"
      description="找不到该页面！"
    >
      <div>
        <Button onClick={() => navigate('/')} style={{ marginBottom: 100, height: "40px", fontSize: "16px", borderRadius: '8px', padding: '6px 24px', backgroundColor: "rgba(50, 47, 47, 1)" }} theme="solid" >
          回到首页
        </Button>
      </div>
    </Empty>)
};
export default NotFound;