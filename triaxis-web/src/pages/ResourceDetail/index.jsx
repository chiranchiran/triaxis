// ResourceDetail.jsx
import React from 'react';
import './index.less'
import { useGetResource } from '../../hooks/api/resources';
import { converBytes } from '../../utils/convertUnit';
import ShowDetail, { renderMutiple, renderSingle, SmallTitle } from '../../components/ShowDetail';
import { isArrayValid } from '../../utils/error/commonUtil';
import { CoverImage, FileTime, Statis } from '../../components/DetailCard';

const ResourceDetail = () => {
  // 获取价格标签
  const getPriceTag = (right, pricePoints) => {
    if (right === 1) {
      return ["tag-green", "免费"]
    } else if (right === 2) {
      return ["tag-orange", "VIP"]
    } else {
      return ["tag-blue", "积分兑换"]
    }
  };

  //   const d = () => {
  //     return (
  //     {/* 附件 */ }
  //                   {
  //     post.attachments && post.attachments.length > 0 && (
  //       <CustomCard>
  //         <CustomCardTitle>附件下载</CustomCardTitle>
  //         <CustomCardContent>
  //           <div className="space-y-2">
  //             {post.attachments.map(attachment => (
  //               <div key={attachment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
  //                 <div className="flex items-center space-x-3">
  //                   <FileTextOutlined className="text-gray-400" />
  //                   <span className="text-gray-700">{attachment.name}</span>
  //                 </div>
  //                 <div className="flex items-center space-x-3">
  //                   <span className="text-sm text-gray-500">{attachment.size}</span>
  //                   <Button size="small" className="border-gray-300 text-gray-600 hover:border-gray-400">
  //                     下载
  //                   </Button>
  //                 </div>
  //               </div>
  //             ))}
  //           </div>
  //         </CustomCardContent>
  //       </CustomCard>
  //     )
  //   }

  //     )
  // }
  const CategoryTag = ({ data = {}, tags }) => {
    const { subject = "", right = "", price = 0, tools = [], categoriesFirst = [], categoriesSecondary = [] } = data

    return (
      <div className="flex flex-wrap flex-col gap-2 text-base">
        {renderSingle(subject, "学科")}
        {renderSingle(getPriceTag(right, price)[1], "权限")}
        {right === 3 && renderSingle(price, "积分")}
        {renderMutiple(categoriesFirst, "一级分类")}
        {renderMutiple(categoriesSecondary, "二级分类")}
        {renderMutiple(tools, "适用工具")}
      </div>

    )
  }

  const TargetStatis = ({ data = {} }) => {
    const { downloadCount = 0, likeCount = 0, collectCount = 0, right = 1, price = 0 } = data
    return (
      <div className="grid grid-cols-4 gap-3 text-center bg-orange-light rounded-lg">
        <Statis count={downloadCount} >下载</Statis>
        <Statis count={likeCount} >点赞</Statis>
        <Statis count={collectCount} >收藏</Statis>
        <Statis count={right === 3 ? price : getPriceTag(right, price)[1]} >价格</Statis>
      </div>
    )
  }
  const TargetTime = ({ data = {} }) => {
    const { size = 0, publishTime = null, updateTime = null } = data
    return (
      <div className="space-y-3">
        <FileTime count={converBytes(size)}>文件大小：</FileTime>
        <FileTime count={publishTime}>上传时间：</FileTime>
        <FileTime count={updateTime}>更新时间：</FileTime>
      </div>
    )
  }
  return (
    <ShowDetail
      useGetDetail={useGetResource}
      textContent={
        {
          titleText: "资源简介",
          detailText: "资源详情",

        }
      }
      targetType={1}
      coverImage={CoverImage}
      categoryTag={CategoryTag}
      targetStatis={TargetStatis}
      targetTime={TargetTime}
      handleReturn={() => { }}
    />
  );
}

export default ResourceDetail;