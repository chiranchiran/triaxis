import React from 'react';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// 可拖拽的上传列表项组件
const DraggableUploadListItem = ({ originNode, file }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: file.uid, // 每个文件的唯一标识，确保排序正常
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    cursor: 'move',
    opacity: isDragging ? 0.7 : 1,
    marginBottom: 8, // 增加文件项间距，避免拥挤
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={isDragging ? 'is-dragging' : ''}
      {...attributes}
      {...listeners}
    >
      {file.status === 'error' && isDragging ? originNode.props.children : originNode}
    </div>
  );
};
export default DraggableUploadListItem;