import React from 'react';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { MyButton } from '../MyButton';
import { useModal } from '../AppProvider';

export const useDeleteConfirm = () => {
  const modal = useModal();

  return (onConfirm, onCancel, options = {}) => {
    modal.confirm({
      title: '确定要删除?',
      icon: <ExclamationCircleFilled />,
      content: '删除后将无法找回',
      okText: '确认',
      cancelText: '取消',
      onOk: onConfirm,
      onCancel: onCancel,
      ...options,

    });
  };
};

export const useResetConfirm = () => {
  const modal = useModal();

  return (onConfirm, onCancel, options = {}) => {
    modal.confirm({
      title: '确定要重置?',
      icon: <ExclamationCircleFilled />,
      content: '重置后将恢复初始状态',
      okText: '确认',
      cancelText: '取消',
      onOk: onConfirm,
      onCancel: onCancel,
      ...options,
    });
  };
};

export const useCancelConfirm = () => {
  const modal = useModal();

  return (onConfirm, onCancel, options = {}) => {
    modal.confirm({
      title: '确定要取消?',
      icon: <ExclamationCircleFilled />,
      content: '取消后当前操作将不会保存',
      okText: '确认',
      cancelText: '取消',
      onOk: onConfirm,
      onCancel: onCancel,
      ...options,
    });
  };
};

export const useSubmitConfirm = () => {
  const modal = useModal();

  return (onConfirm, onCancel, options = {}) => {
    modal.confirm({
      title: '确定要提交?',
      icon: <ExclamationCircleFilled />,
      content: '提交后将进入审核流程',
      okText: '确认',
      cancelText: '取消',
      onOk: onConfirm,
      onCancel: onCancel,
      ...options,
    });
  };
};

export const useToggleConfirm = () => {
  const modal = useModal();

  return (onConfirm, onCancel, options = {}) => {
    modal.confirm({
      title: '确定要切换?',
      icon: <ExclamationCircleFilled />,
      content: '当前所有输入的内容将丢失',
      okText: '确认',
      cancelText: '取消',
      onOk: onConfirm,
      onCancel: onCancel,
      ...options,
    });
  };
};


export const DeleteConfirmButton = ({ onConfirm, onCancel, children, ...buttonProps }) => {
  const showDeleteConfirm = useDeleteConfirm();

  const handleClick = () => {
    showDeleteConfirm(onConfirm, onCancel);
  };

  return (
    <MyButton {...buttonProps} onClick={handleClick}>
      {children || '删除'}
    </MyButton>
  );
};

export const ResetConfirmButton = ({ onConfirm, onCancel, children, ...buttonProps }) => {
  const showResetConfirm = useResetConfirm();

  const handleClick = () => {
    showResetConfirm(onConfirm, onCancel);
  };

  return (
    <MyButton type="gray" htmltype="button"  {...buttonProps} onClick={handleClick}>
      {children || '重置'}
    </MyButton>
  );
};

export const CancelConfirmButton = ({ onConfirm, onCancel, children, ...buttonProps }) => {
  const showCancelConfirm = useCancelConfirm();

  const handleClick = () => {
    showCancelConfirm(onConfirm, onCancel);
  };

  return (
    <MyButton {...buttonProps} onClick={handleClick} type="gray" htmltype="button">
      {children || '取消'}
    </MyButton>
  );
};

export const SubmitConfirmButton = ({ onConfirm, onCancel, children, ...buttonProps }) => {
  const showSubmitConfirm = useSubmitConfirm();

  const handleClick = () => {
    showSubmitConfirm(onConfirm, onCancel);
  };

  return (
    <MyButton {...buttonProps} onClick={handleClick} type="black" htmltype="submit">
      {children || '提交'}
    </MyButton>
  );
};

export const ToggleConfirmButton = ({ onConfirm, onCancel, children, ...buttonProps }) => {
  const showToggleConfirm = useToggleConfirm();

  const handleClick = () => {
    showToggleConfirm(onConfirm, onCancel);
  };

  return (
    <MyButton {...buttonProps} onClick={handleClick}>
      {children || '切换状态'}
    </MyButton>
  );
};

// 3. 通用的确认按钮组件
export const ConfirmButton = ({
  onConfirm,
  onCancel,
  title = '确定要执行此操作?',
  content = '请确认您的操作',
  confirmText = '确定',
  cancelText = '取消',
  icon = <ExclamationCircleFilled />,
  children,
  ...buttonProps
}) => {
  const modal = useModal();

  const handleClick = () => {
    modal.confirm({
      title,
      icon,
      content,
      okText: confirmText,
      cancelText: cancelText,
      onOk: onConfirm,
      onCancel: onCancel,
    });
  };

  return (
    <MyButton {...buttonProps} onClick={handleClick}>
      {children}
    </MyButton>
  );
};