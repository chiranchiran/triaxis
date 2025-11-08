import React from 'react'
import { ItemLayout, SecondTitle } from '.';
import { Descriptions } from 'antd';

export const MyPoints = ({ user }) => {




  const infoList = [{
    key: "1",
    label: "剩余积分",
    children: "200",
    span: 3,
  }, {
    key: "2",
    label: "获得积分",
    children: "200",
    span: 3
  },
  {
    key: "3",
    label: "上传资源获得",
    children: "200",
  },
  {
    key: "4",
    label: "上传课程获得",
    children: "200",
  }, {
    key: "6",
    label: "发帖获得",
    children: "200",
  }, {
    key: "7",
    label: "评论获得",
    children: "200",
  },
  {
    key: "8",
    label: "解决悬赏贴获得",
    children: "200",
  },
  {
    key: "9",
    label: "",
    children: "",
  },
  {
    key: "9",
    label: "消耗积分",
    children: "200",
    span: 4
  },
  {
    key: "10",
    label: "购买资源消耗",
    children: "200",
  },
  {
    key: "11",
    label: "购买课程消耗",
    children: "200",
  },
  {
    key: "12",
    label: "发布悬赏贴消耗",
    children: "200",
  }
  ]
  const actions = [
    { action: '每日签到', points: '+10', time: '2024-01-20', type: 'earn' },
    { action: '发布资源', points: '+50', time: '2024-01-19', type: 'earn' },
    { action: '课程学习', points: '+30', time: '2024-01-18', type: 'earn' },
    { action: '兑换礼品', points: '-100', time: '2024-01-15', type: 'spend' }
  ]

  return (
    <ItemLayout label="积分中心">
      <SecondTitle label="积分数据">
        <Descriptions bordered items={infoList} />
      </SecondTitle>
      <SecondTitle label="积分记录">
        <div className="space-y-4">
          {actions.map((item, index) => (
            <div key={index} className="flex justify-between items-center p-4 setting bg-main rounded-lg transition-colors">
              <div className='flex'>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${item.type === 'earn' ? 'bg-green-light text-green-dark' : 'bg-like text-like'
                  }`}>
                  {item.type === 'earn' ? '+' : '-'}
                </div>
                <div className="flex-col flex">
                  {item.action}
                  <div className="text-md text-secondary">{item.time}</div>

                </div>
              </div>
              <span className={item.type === 'earn' ? 'text-green-dark font-medium' : 'text-like font-medium'}>
                {item.points}
              </span>
            </div>
          ))}
        </div>
      </SecondTitle>
    </ItemLayout>
  );
};
