import { Avatar, Button, Empty, Spin } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  MessageOutlined,
  HeartOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  ReloadOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import './index.less'
import { useGetBountyPosts, useGetNormalPosts, useGetPosts } from "../../hooks/api/community";
import { useDispatch, useSelector } from "react-redux";
import { logger } from "../../utils/logger";
import { MyButton, OrderButton } from "../../components/MyButton";
import { BOUNTY_ORDER } from "../../utils/constant/order";
import VirtualList from 'rc-virtual-list';
import { addAll } from "../../utils/error/commonUtil";
import { SquarePost } from "../../components/postCard";
import { returnCommunity } from "../../store/slices/communitySlice";

// 详情页面组件
const CommunityDetail = () => {
  const CONTAINER_HEIGHT = 1000
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const pathList = useLocation().pathname.split("/");
  const path = pathList[pathList.length - 1];
  logger.debug("当前组件是", path)
  const params = useSelector(state => state.community.params)

  /**
   * @description state管理
   */
  //搜索参数
  const [newsearchParams, setNewSearchParams] = useState({
    orderBy: params.searchParams.orderBy,
    search: params.searchParams.search,
    subjectId: params.selectedFilters.subjectId,
    topicIds: params.selectedFilters.topicIds,
    isSolved: null
  });
  //帖子广场分页参数
  const [square, setSquare] = useState({
    page: 1,
    pageSize: 20
  })

  logger.debug("当前的搜索参数是", newsearchParams);
  /**
   * @description 数据获取
   */

  // 获取搜索结果
  const { data: bountyList = {}, isFetching: bountyLoading } = useGetBountyPosts({ ...newsearchParams, ...square }, {
    enabled: !!newsearchParams.orderBy && path === 'bounty'
  });
  const { data: normalList = {}, isFetching: normalLoading } = useGetNormalPosts({ ...newsearchParams, ...square }, {
    enabled: !!newsearchParams.orderBy && path === 'normal'
  });
  const loading = path === 'bounty' ? bountyLoading : normalLoading
  const data = path === 'bounty' ? bountyList : normalList
  const { records: posts = [], total = 0 } = data
  //虚拟列表滚动到底部
  const onScroll = e => {
    // Refer to: https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight#problems_and_solutions
    if (
      Math.abs(e.currentTarget.scrollHeight - e.currentTarget.scrollTop - CONTAINER_HEIGHT) <= 1
    ) {
      setSquare(pre => ({ ...pre, page: pre.page + 1 }))
    }
  };
  // 处理悬赏贴排序
  const handleBountyOrder = (value) => {
    setNewSearchParams(pre => ({ ...pre, isSolved: value }))
    setSquare(pre => ({ ...pre, page: 1 }))
  }
  //用户行为处理函数
  const handleLike = (id) => {

  }

  const handleCollect = (id) => {

  }

  return (
    <div className="max-w-7xl mx-auto p-6 mb-6" >
      <div className="flex items-center justify-between mb-6">
        {/* 左侧信息 */}
        <div className="flex items-center text-lg justify-end">

          <span className="text-xl font-semibold text-main px-2 ">全部{path === 'bounty' ? "悬赏贴" : "帖子"}
            <span className="text-secondary text-base ml-2">
              ({total}条)
            </span>
          </span>

        </div>
        {/* 右侧按钮 */}
        <div className='flex gap-6 items-center'>
          {
            path === "bounty" && (
              <OrderButton
                size="middle"
                list={addAll(BOUNTY_ORDER)}
                value={newsearchParams.isSolved}
                handleSortChange={handleBountyOrder}
              />
            )
          }
          <MyButton
            onClick={() => {
              dispatch(returnCommunity())
              navigate('/community')
            }}
            size="large"
            type="black"
            icon={<ArrowRightOutlined />}>
            返回社区
          </MyButton>
        </div>
      </div>
      {
        loading ? (
          <div className="flex justify-center items-center py-20">
            <Spin size="large" />
          </div>
        ) : posts.length > 0 ? (
          <div className="bg-card rounded-xl p-6">
            <VirtualList
              data={posts}
              height={CONTAINER_HEIGHT}
              itemHeight={200}
              itemKey="id"
              onScroll={onScroll}
              className='pt-3 flex flex-col gap-4 normal bounty'
            >
              {post => (
                <SquarePost post={post} handleLike={handleLike} handleCollect={handleCollect} key={post.id} />
              )}
            </VirtualList>
          </div>
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="暂无相关帖子"
            className="py-20"
          />
        )
      }
    </div >
  );
};
export default CommunityDetail;

