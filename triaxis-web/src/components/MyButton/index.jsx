import React from 'react'
import './index.less'
import { Button } from 'antd';

export default function MyButton({ size = 'small', onClick, type, children, icon, className }) {

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
      icon={icon}
      className={`${current} my-button transition-all transition-colors ${className}`}
    >
      {children}
    </Button>
  )
}
