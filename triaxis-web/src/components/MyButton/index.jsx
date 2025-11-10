import React from 'react'
import './index.less'
import { Button } from 'antd';
import { RadioGroup, Radio } from '@douyinfe/semi-ui';
import { Space } from '@douyinfe/semi-ui';
import { HeartOutlined, HeartFilled, MessageOutlined, UserOutlined, MoreOutlined, LoadingOutlined, StarOutlined, StarFilled, EyeOutlined } from '@ant-design/icons';
const MyButton = ({ size = 'small', loading = false, onClick, type, children, icon, className, ...props }) => {

  const getCurrentSize = (size) => {
    switch (size) {
      case 'small': return ""
      case 'middle': return "h-12 w-32 px-4"
      case 'large': return "h-12 w-40 px-4"
      case 'long': return "!h-7 "
      case 'more': return "!h-7"
    }
  }
  const getType = (type) => {
    switch (type) {
      case 'black': return 'bg-dark text-light'
      case 'blue': return 'bg-primary text-main'
      case 'green': return 'bg-green text-main'
      case 'orange': return 'bg-orange text-main'
      case 'gray': return 'bg-gray border-main text-main'
      case 'white': return 'bg-card text-main border-dark'
    }
  }

  const current = getCurrentSize(size) + " " + getType(type)

  return (
    <Button
      type="text"
      size={size === 'long' || size === 'large' ? 'large' : 'middle'}
      onClick={onClick}
      disabled={loading}
      icon={icon}
      className={`${current} my-button transition-all transition-colors settings ${className}`}
      {...props}
    >
      {children}
    </Button>
  )
}

const FilterButton = ({ item, isSelected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${isSelected
        ? 'bg-gray text-main !font-semibold border border-main'
        : 'bg-card text-main font-normal border border-main'
        }`}
    >
      {item.name}
    </button>
  );
};
const OrderButton = ({ handleSortChange, list = [], size = 'large', value, className }) => {
  return (
    <div className="flex items-center space-x-2">
      <Space spacing='loose' align='start' >
        <RadioGroup
          onChange={(e) => handleSortChange(e.target.value)}
          type='button'
          buttonSize={size}
          value={value}
          aria-label="单选组合示例"
          name="demo-radio-large"
          className={className}
        >
          {list.map((item, index) => (
            <Radio key={item.id} value={item.id}>
              {item.name}
            </Radio>
          ))}
        </RadioGroup>
      </Space>
    </div>)
}
const ActionButton = ({ config, id, targetType = 1, actionFn, data, gap = 6 }) => {
  const { hasLike = true, hasCollect = true, hasReply = true, isLiked = false, isCollected = false, isReply = true, hasView = false } = config
  const { handleLike = null, likeLoading = false, handleCollect = null, collectLoading = false, handleReply = null } = actionFn
  const { likeCount = 0, collectCount = 0, replyCount = 0, viewCount = 0 } = data
  return (
    <div className={`flex items-center gap-${gap}`}>
      {
        hasView &&
        <button
          className="flex cursor-pointer items-center gap-1 text-secondary transition-colors"
        >
          <EyeOutlined />{viewCount}
        </button>
      }
      {
        hasLike && <button
          onClick={() => handleLike(id)}
          disabled={likeLoading}
          className={`flex items-center gap-1 cursor-pointer transition-colors ${isLiked ? "text-like" : "text-secondary hover:!text-like"
            }`}
        >  {isLiked ? <HeartFilled /> : <HeartOutlined />}
          {likeCount}
        </button>
      }
      {
        hasCollect &&
        <button
          onClick={() => handleCollect(id)}
          disabled={collectLoading}
          className={`flex items-center gap-1 cursor-pointer transition-colors ${isCollected ? "text-rate" : "text-secondary hover:!text-like"
            }`}
        >  {isLiked ? <StarFilled /> : <StarOutlined />}
          {collectCount}
        </button>
      }{
        hasReply &&
        <button
          onClick={isReply ? () => handleReply(id) : null}
          className="flex cursor-pointer items-center gap-1 text-secondary transition-colors"
        >
          <MessageOutlined />{replyCount}
        </button>
      }




      <MoreOutlined className="text-secondary cursor-pointer" />
    </div>
  )
}


export { MyButton, FilterButton, OrderButton, ActionButton }
