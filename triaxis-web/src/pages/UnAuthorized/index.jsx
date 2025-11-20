import React from 'react';
import { Empty, Button } from '@douyinfe/semi-ui';
import { IllustrationNoAccess, IllustrationNoAccessDark, IllustrationNotFound, IllustrationNotFoundDark } from '@douyinfe/semi-illustrations';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const UnAuthorized = () => {
  const { isAuthorized } = useSelector(state => state.auth)
  const navigate = useNavigate();

  return (
    <Empty
      className='mt-20'
      image={<IllustrationNoAccess style={{ width: 400, height: 400 }} />}
      darkModeImage={<IllustrationNoAccessDark style={{ width: 400, height: 400 }} />}
      title="没有权限"
      description={isAuthorized ? '您没有权限访问此页面，请登录其他账号！' : '您还没登录，请先登录再访问此页面！'}
    >
      <div className="mx-auto flex justify-center" >
        <Button onClick={() => navigate('/login')} style={{ marginBottom: 100, height: "40px", fontSize: "16px", borderRadius: '8px', padding: '6px 24px', backgroundColor: "rgba(50, 47, 47, 1)" }} theme="solid" >
          {isAuthorized ? '登录其他账号' : '登录账户'}
        </Button>
      </div>
    </Empty>)
};
export default UnAuthorized;