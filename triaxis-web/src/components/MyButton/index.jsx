import React from 'react'
import './index.less'
import { Button } from 'antd';

export default function MyButton({ size = 'small', onClick, type, children, icon, styles }) {

  const getCurrentSize = (size) => {
    switch (size) {
      case 'small': return ""
      case 'middle': return "h-12 w-32 px-8 "
      case 'large': return "h-12 w-40 px-8 "
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

  const current = getCurrentSize(size) + getType(type)

  return (
    <Button
      type="text"
      size='large'
      onClick={onClick}
      icon={icon}
      className={`${current} my-button transition-all transition-colors ${styles}`}
    >
      {children}
    </Button>
  )
}
