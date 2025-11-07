import React from 'react';
import { useGetResource } from '../../hooks/api/resources';
import { converBytes } from '../../utils/convertUnit';
import ShowDetail, { renderMutiple, renderSingle, SmallTitle } from '../../components/ShowDetail';
import { isArrayValid } from '../../utils/error/commonUtil';
import { CoverImage, FileTime, Image, Statis } from '../../components/DetailCard';

import { useGetPost } from '../../hooks/api/community';
import { Tag } from 'antd';
import { urgencyMap } from '../../components/postCard';


const PostDetail = () => {

  const CategoryTag = ({ data = {} }) => {
    console.log(data)
    const { subject = "", topic = "", type = 1, urgency = 2, price = 0, isSloved = false, sloveTime = null, deadline = null } = data

    return (
      <div className="flex flex-wrap flex-col gap-2 text-base items-start">
        {type === 2 && (
          <div className='flex gap-2 text-secondary'>
            <Tag className='tag-red !self-start !text-sm' >悬赏贴</Tag>
            <Tag className={`${isSloved ? "tag-green" : "tag-red"} !self-start !text-sm`} >{isSloved ? "已解决" : "未解决"}</Tag>
            <Tag className={`${urgencyMap[urgency].color} !self-start !text-sm`} >{urgencyMap[urgency].text}</Tag>
          </div>
        )}
        {renderSingle(subject, "学科")}
        {renderSingle(topic, "话题")}
        {type === 2 && renderSingle(price, "积分")}
        {!isSloved && renderSingle(deadline, "截止日期")}
      </div>
    )
  }
  const TargetStatis = ({ data = {} }) => {
    const { viewCount = 0, likeCount = 0, collectCount = 0, hot = 0 } = data
    return (
      <div className="grid grid-cols-4 gap-3 text-center bg-orange-light rounded-lg">
        <Statis count={viewCount} >浏览</Statis>
        <Statis count={likeCount} >点赞</Statis>
        <Statis count={collectCount} >收藏</Statis>
        <Statis count={hot} >热度</Statis>
      </div>
    )
  }
  const TargetTime = ({ data = {} }) => {
    const { publishTime = null, updateTime = null } = data
    return (
      <div className="space-y-3">
        <FileTime count={publishTime}>上传时间：</FileTime>
        <FileTime count={updateTime}>更新时间：</FileTime>
      </div>
    )
  }
  return (
    <ShowDetail
      useGetDetail={useGetPost}
      textContent={
        {
          titleText: "帖子简介",
          detailText: "帖子详情",

        }
      }
      targetType={3}
      image={Image}
      categoryTag={CategoryTag}
      targetStatis={TargetStatis}
      targetTime={TargetTime}
      handleReturn={() => { }}
    />
  );
};

export default PostDetail;