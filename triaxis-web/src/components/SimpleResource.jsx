import { Badge, Card, Avatar, Col, Empty, Row, Checkbox, message } from 'antd';
import {
  HeartOutlined, DownloadOutlined, StarOutlined, FileOutlined,
  UserOutlined, CloudUploadOutlined, EditOutlined, DeleteOutlined
} from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { getPriceTag } from '../pages/Resource';
import { useGetResources } from '../hooks/api/resources';
import { MyButton } from './MyButton';
import { useNavigate } from 'react-router-dom';
import { subUsername } from '../utils/error/commonUtil';
import { converBytes } from '../utils/convertUnit';
import { orderBy } from 'lodash';
import { MyRESOURCE_TYPE } from '../utils/constant/types';
import { MyEmpty } from './MyEmpty';

const SimpleResource = ({ type }) => {
  /**
 * @description state管理
 */

  // 多选相关状态：选中的资源ID列表、全选状态
  const [selectedIds, setSelectedIds] = useState([]);
  const [checkAll, setCheckAll] = useState(false);

  const navigate = useNavigate();
  /**
   * @description 数据获取
   */

  //传递筛选条件和排序方式
  const { data: resources = {}, isFetching: resourcesLoading, isError: resourcesError } = useGetResources({ orderBy: MyRESOURCE_TYPE[type] }, {
    enabled: !!MyRESOURCE_TYPE[type]
  });
  const records = resources.records || [];

  /**
   * @description 多选功能
   */


  // 全选/取消全选逻辑
  const handleCheckAll = (checked) => {
    setCheckAll(checked);
    setSelectedIds(checked ? records.map(item => item.detail?.id) : []);
  };

  // 单个资源选中/取消选中
  const handleCheckOne = (id, checked) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    }
  };

  // 选中列表变化时，同步全选状态（所有资源都选中则全选勾选）
  useEffect(() => {
    if (records.length === 0) {
      setCheckAll(false);
      return;
    }
    setCheckAll(selectedIds.length === records.length);
  }, [selectedIds, records.length]);


  /**
 * @description 批量删除逻
 */
  const handleBatchDelete = async () => {
    if (selectedIds.length === 0) {
      message.warning('请先选择要删除的资源');
      return;
    }

    try {
      // 这里替换为你的批量删除接口（示例：假设调用deleteBatchResources接口）
      // await deleteBatchResources(selectedIds);
      message.success(`成功删除 ${selectedIds.length} 个资源`);
      // 删除后清空选中列表，刷新数据（如果接口不自动刷新，可手动触发useGetResources重新请求）
      setSelectedIds([]);
    } catch (error) {
      message.error('批量删除失败，请重试');
      console.error('删除失败：', error);
    }
  };



  const getStatus = (status) => {
    switch (status) {
      case 2:
        return "审核中";
      case 3:
        return "已发布";
      case 4:
        return "已下架";
      default:
        return '未知状态';
    }
  }
  // 空状态处理
  if (!records || records.length === 0) {
    return <MyEmpty />
  }
  return (
    <div className="pt-6 check">
      {/* 仅上传资源显示：全选按钮 + 批量删除按钮 */}
      {type === 'uploads' && (
        <div className="mb-4 -mt-3 flex items-center justify-between">
          <Checkbox
            checked={checkAll}
            onChange={(e) => handleCheckAll(e.target.checked)}
            disabled={resourcesLoading}
          >
            全选
          </Checkbox>
          <MyButton
            type="danger"
            size="long"
            icon={<DeleteOutlined />}
            onClick={handleBatchDelete}
            disabled={selectedIds.length === 0 || resourcesLoading}
          >
            批量删除（{selectedIds.length}）
          </MyButton>
        </div>
      )}

      <Row gutter={[24, 24]}>
        {records.map(resource => {
          const {
            detail: {
              id,
              title = "",
              coverImage = "",
              likeCount = 0,
              downloadCount = 0,
              collectCount = 0,
              size = 100,
              publishTime,
              status = 2 // 上传资源的审核状态
            } = {},
            uploader: {
              username = "已注销",
              avatar,
            } = {},
            userActions: {
              isLiked = false,
              isCollected = false,
              isPurchased = false
            } = {}
          } = resource || {};

          const [priceText, ribbonClass] = getPriceTag(isPurchased, resource?.detail?.right, resource?.detail?.price);
          // 判断当前资源是否被选中
          const isChecked = selectedIds.includes(id);

          return (
            <Col xs={24} sm={12} lg={8} xl={6} key={id}>
              <div className='relative'>
                <Badge.Ribbon text={priceText} className={ribbonClass} size="large">
                  <Card
                    className="resource-card border-main overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 bg-card relative"
                    cover={
                      <div
                        className="relative h-42 bg-gray-light overflow-hidden cursor-pointer"
                        onClick={() => navigate(`/resources/${id}`)}
                      >
                        {coverImage ? (
                          <img
                            alt="封面预览图加载失败"
                            title={title}
                            src={coverImage}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-main text-center">
                            <div className="text-4xl mb-2">📁</div>
                            <div className="text-sm">暂无封面图</div>
                          </div>
                        )}
                        <div className="absolute top-3 left-3 text-sm flex flex-col gap-2 ">
                          <div className=" bg-like text-sm px-2 py-1 rounded-lg flex items-center">
                            <HeartOutlined className="mr-1" />
                            {likeCount}
                          </div>
                          {/* 上传资源显示审核状态 */}
                          {type === 'uploads' && (

                            <span className={`px-2 py-0.5 text-main bg-score text-sm px-2 py-1 rounded-lg `}>
                              {getStatus(status)}
                            </span>

                          )}
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-dark p-3">
                          <h3 className="text-light font-medium text-sm text-center line-clamp-1">
                            {title}
                          </h3>
                        </div>
                      </div>
                    }
                  >
                    <div className="space-y-1 pt-1">
                      {/* 作者+时间 */}
                      <div className="flex items-center justify-between gap-2 text-xs text-secondary">
                        <span className="flex items-center cursor-pointer" title={username}>
                          <Avatar
                            size={16}
                            src={avatar}
                            icon={<UserOutlined />}
                            className="border border-main !mr-1"
                          />
                          {subUsername(username, 15)}
                        </span>
                        <span className="flex items-center text-xs">
                          <CloudUploadOutlined className="mr-1" />
                          {publishTime}
                        </span>
                      </div>

                      <div className="mb-0 flex items-center justify-start text-xs text-secondary border-t border-light space-x-4">
                        <span className="flex items-center">
                          <DownloadOutlined className="mr-1" />
                          {downloadCount}
                        </span>
                        <span className="flex items-center">
                          <StarOutlined className="mr-1" />
                          {collectCount}
                        </span>
                        <span className="flex items-center">
                          <FileOutlined className="mr-1" />
                          {converBytes(size)}
                        </span>
                      </div>

                      {/* 操作按钮 */}
                      <div className="flex space-x-2 mt-1">
                        {type === 'uploads' ? (
                          <div className='flex justify-between flex-1'>
                            <Checkbox
                              checked={isChecked}
                              onChange={(e) => handleCheckOne(id, e.target.checked)}
                              disabled={resourcesLoading}
                              className="p-1 rounded" // 增加背景，避免与封面图混淆
                            />
                            <div className='flex gap-2'>
                              <MyButton
                                type="white"
                                size="long"
                                icon={<EditOutlined />}
                                disabled={resourcesLoading}
                              />
                              <MyButton
                                type="white"
                                size="long"
                                icon={<DeleteOutlined />}
                                danger
                                disabled={resourcesLoading}
                                // 单个删除逻辑（可选，与批量删除互补）
                                onClick={(e) => {
                                  e.stopPropagation(); // 阻止触发封面跳转
                                  handleCheckOne(id, true); // 先选中当前资源
                                  handleBatchDelete(); // 执行删除
                                }}
                              />
                            </div>
                          </div>
                        ) : (
                          <>
                            <MyButton
                              type="black"
                              size="long"
                              className="flex-1"
                              icon={<DownloadOutlined />}
                              disabled={resourcesLoading}
                            >
                              下载
                            </MyButton>
                            <MyButton
                              type={isCollected ? "black" : "white"}
                              size="long"
                              icon={<StarOutlined />}
                              disabled={resourcesLoading}
                            />
                            <MyButton
                              type={isLiked ? "black" : "white"}
                              size="long"
                              icon={<HeartOutlined />}
                              disabled={resourcesLoading}
                            />
                          </>
                        )}
                      </div>
                    </div>
                  </Card>
                </Badge.Ribbon>
              </div>

            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default SimpleResource;