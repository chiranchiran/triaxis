import React, { memo } from 'react';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// 可拖拽的上传列表项组件
const DraggableUploadListItem = memo(({ originNode, file }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: file.uid,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    cursor: 'move',
    opacity: isDragging ? 0.7 : 1,
    marginBottom: 8,
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
});

export default DraggableUploadListItem;