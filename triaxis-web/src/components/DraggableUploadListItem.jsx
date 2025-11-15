import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from 'antd'; // 假设使用antd组件
import { PauseOutlined, PlayCircleOutlined, SyncOutlined } from '@ant-design/icons'; // 暂停/重试图标

const DraggableUploadListItem = ({ originNode, file, onStatusChange, uploadManager, fn }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: file.uid,
  });

  // 暂停上传
  const handlePause = (e) => {
    e.stopPropagation(); // 避免触发拖拽
    if (file.status === 'uploading') {
      uploadManager.pauseUpload(file.taskId); // 调用上传管理器的暂停方法
      onStatusChange(file.uid, 'paused'); // 通知父组件更新状态
    }
  };

  // 重试上传
  const handleRetry = (e) => {
    e.stopPropagation(); // 避免触发拖拽
    if (file.status === 'paused' || file.status === 'error') {
      uploadManager.retryUpload(file.taskId); // 调用上传管理器的重试方法
      onStatusChange(file.uid, 'uploading'); // 通知父组件更新状态
    }
  };
  // 恢复上传
  const handleResume = (e) => {
    e.stopPropagation(); // 避免触发拖拽
    if (file.status === 'paused' || file.status === 'error') {
      uploadManager.resumeUpload(file.taskId); // 调用上传管理器的重试方法
      onStatusChange(file.uid, 'uploading'); // 通知父组件更新状态
    }
  };


  // 按钮显示逻辑（按状态动态切换）
  const renderControlButtons = () => {
    console.log(file.status)
    switch (file.status) {
      case 'uploading':
        return (
          <PauseOutlined spin={false} onClick={handlePause} className='pt-2 mr-4 text-like' />
        );
      case 'paused':
        return (
          <PlayCircleOutlined spin={false} onClick={handleResume} className='pt-2 mr-4 text-green' />
        );
      case 'error':
        return (
          <SyncOutlined spin={false} onClick={handleRetry} className='mt-3 mr-4 text-green' />
        );
      default:
        return null;
    }
  };

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    cursor: 'move',
    opacity: isDragging ? 0.7 : 1,
    marginBottom: 8,
    display: 'flex', // 让文件信息和按钮横向排列
    alignItems: 'center',
    justifyContent: 'space-between', // 按钮靠右
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center ${isDragging ? 'is-dragging' : ''}`}
      {...attributes}
      {...listeners}
    >
      {!isDragging && renderControlButtons()} {/* 拖拽时不显示按钮，避免误触 */}
      {/* 原始文件信息（如文件名、进度条等） */}
      <div style={{ flex: 1 }}>
        {file.status === 'error' && isDragging ? originNode.props.children : originNode}
      </div>


    </div>
  );
};

export default DraggableUploadListItem;