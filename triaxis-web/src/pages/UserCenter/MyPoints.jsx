import React from 'react'
import { ItemLayout, SecondTitle } from '.';
import { Descriptions, Empty } from 'antd';
import { POINTS_TYPE } from '../../utils/constant/types';
import { useGetUserPoints } from '../../hooks/api/user';
import { isArrayValid } from '../../utils/commonUtil';

const MyPoints = () => {
  /**
   * @description 数据获取
  */
  const { data: userPoint = {} } = useGetUserPoints();
  const {
    points = 0,        // 剩余积分
    pointsGet = 0,          // 获得积分（总）
    checkinObtained = 0,        // 签到获得
    uploadResourceObtained = 0, // 上传资源获得
    uploadCourseObtained = 0,   // 上传课程获得
    postObtained = 0,           // 发帖获得
    commentObtained = 0,        // 评论获得
    solveRewardObtained = 0,    // 解决悬赏贴获得
    pointsSpent = 0,          // 消耗积分（总）
    buyResourceConsumed = 0,    // 购买资源消耗
    buyCourseConsumed = 0,      // 购买课程消耗
    publishRewardConsumed = 0,   // 发布悬赏贴消耗
    userActions = []

  } = userPoint;

  const infoList = [
    {
      key: "1",
      label: "剩余积分",
      children: points,
      span: 3,
    },
    {
      key: "2",
      label: "获得积分",
      children: pointsGet,
      span: 3
    },
    {
      key: "3",
      label: "签到获得",
      children: checkinObtained,
      span: 3
    },
    {
      key: "4",
      label: "上传资源获得",
      children: uploadResourceObtained,
    },
    {
      key: "5",
      label: "上传课程获得",
      children: uploadCourseObtained,
    },
    {
      key: "6",
      label: "发帖获得",
      children: postObtained,
    },
    {
      key: "7",
      label: "评论获得",
      children: commentObtained,
    },
    {
      key: "8",
      label: "解决悬赏贴获得",
      children: solveRewardObtained,
    },
    {
      key: "9",
      label: "",
      children: "",
    },
    {
      key: "10",
      label: "消耗积分",
      children: pointsSpent,
      span: 3
    },
    {
      key: "11",
      label: "购买资源消耗",
      children: buyResourceConsumed,
    },
    {
      key: "12",
      label: "购买课程消耗",
      children: buyCourseConsumed
    },
    {
      key: "13",
      label: "发布悬赏贴消耗",
      children: publishRewardConsumed,
    }
  ];

  return (
    <ItemLayout label="积分中心">
      <SecondTitle label="积分数据">
        <Descriptions bordered items={infoList} />
      </SecondTitle>
      <SecondTitle label="积分记录">
        <div className="space-y-4">
          {isArrayValid(userActions) && userActions.map((item) => {
            const { id, pointsChange = 0, pointsType = 0, remark = "无", afterBalance = 0, createTime = "" } = item
            // 判断是获得（正数）还是消耗（负数）
            const isEarn = pointsChange > 0;
            // 积分变动类型描述
            const actionDesc = `备注：${remark || "无"}` || '未知操作';

            return (
              <div
                key={id}  // 用流水记录的唯一id作为key，避免index导致的渲染问题
                className="flex justify-between items-center px-4 py-2 setting bg-main rounded-lg transition-colors"
              >
                <div className='flex items-center'>
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${isEarn ? 'bg-green-light text-green-dark' : 'bg-like text-like'
                      }`}
                  >
                    {isEarn ? '+' : '-'}
                  </div>

                  <div className="flex-col flex gap-1">
                    {/* 操作描述（备注或类型） */}
                    <div className="text-base">{POINTS_TYPE[pointsType]}</div>
                    <div className="text-sm text-secondary">{actionDesc}</div>
                    {/* 时间 + 变化后的积分 */}
                    <div className="text-sm text-secondary flex gap-6">
                      {createTime}
                      <span>
                        余额：{afterBalance}
                      </span>

                    </div>
                  </div>
                </div>

                {/* 变动的积分（带符号，如+200、-100） */}
                <span className={isEarn ? 'text-green-dark font-medium' : 'text-like font-medium'}>
                  {isEarn ? '+' : ''}{pointsChange}  {/* 获得时显示+，消耗时显示原负数 */}
                </span>
              </div>
            );
          })}
          {
            !isArrayValid(userActions) && <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="暂无记录"
              className="pt-10 pb-10"
            ></Empty>
          }
        </div>
      </SecondTitle>
    </ItemLayout>
  );
};
export default MyPoints;
