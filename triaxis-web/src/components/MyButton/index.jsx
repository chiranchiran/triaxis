import React from 'react'
import './index.less'
import { Button } from 'antd';
import { RadioGroup, Radio } from '@douyinfe/semi-ui';
import { Space } from '@douyinfe/semi-ui';

const MyButton = ({ size = 'small', loading = false, onClick, type, children, icon, className }) => {

  const getCurrentSize = (size) => {
    switch (size) {
      case 'small': return ""
      case 'middle': return "h-12 w-32 px-8"
      case 'large': return "h-12 w-40 px-8"
      case 'long': return "!h-7 "
    }
  }
  const getType = (type) => {
    switch (type) {
      case 'black': return 'bg-dark text-light text-base'
      case 'blue': return 'bg-primary text-main text-base'
      case 'green': return 'bg-green text-main text-base'
      case 'orange': return 'bg-orange text-main text-base'
      case 'gray': return 'bg-gray border-main text-main text-base'
      case 'white': return 'bg-card text-main border-dark text-base'
    }
  }

  const current = getCurrentSize(size) + " " + getType(type)

  return (
    <Button
      type="text"
      size={size === 'long' ? 'middle' : 'large'}
      onClick={onClick}
      disabled={loading}
      icon={icon}
      className={`${current} my-button transition-all transition-colors ${className}`}
    >
      {loading ? `正在${children}` : children}
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
const OrderButton = ({ handleSortChange, list, value }) => {
  return (
    <div className="flex items-center space-x-2">
      <Space vertical="true" spacing='loose' align='start'>
        <RadioGroup
          onChange={(e) => handleSortChange(e.target.value)}
          type='button'
          buttonSize='large'
          value={value}
          aria-label="单选组合示例"
          name="demo-radio-large"
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


export { MyButton, FilterButton, OrderButton }
