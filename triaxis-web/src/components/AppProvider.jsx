import React, { createContext, useContext } from 'react';
import { message, notification, Modal } from 'antd';


const MessageContext = createContext(null);
const NotificationContext = createContext(null);
const ModalContext = createContext(null);

// Message Provider
export const MessageProvider = ({ children }) => {
  const [messageApi, messageContextHolder] = message.useMessage();

  return (
    <MessageContext.Provider value={messageApi}>
      {messageContextHolder}
      {children}
    </MessageContext.Provider>
  );
};

// Notification Provider  
export const NotificationProvider = ({ children }) => {
  const [notificationApi, notificationContextHolder] = notification.useNotification();

  return (
    <NotificationContext.Provider value={notificationApi}>
      {notificationContextHolder}
      {children}
    </NotificationContext.Provider>
  );
};

// Modal Provider
export const ModalProvider = ({ children }) => {
  const [modalApi, modalContextHolder] = Modal.useModal();

  return (
    <ModalContext.Provider value={modalApi}>
      {modalContextHolder}
      {children}
    </ModalContext.Provider>
  );
};



export const AppProvider = ({ children }) => {
  return (
    <MessageProvider>
      <NotificationProvider>
        <ModalProvider>
          {children}
        </ModalProvider>
      </NotificationProvider>
    </MessageProvider>
  );
};
export const useMessage = () => {
  return useContext(MessageContext);
};

export const useNotification = () => {
  return useContext(NotificationContext);
};

export const useModal = () => {
  return useContext(ModalContext);
};

export const useFeedback = () => {
  const messageApi = useMessage();
  const notificationApi = useNotification();
  const modalApi = useModal();

  return {
    messageApi,
    notificationApi,
    modalApi,
  };
};