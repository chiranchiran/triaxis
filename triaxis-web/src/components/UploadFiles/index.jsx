import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
  Button,
  Form,
  Upload,
} from 'antd';
import {
  PlusOutlined,
  InboxOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import { DndContext, PointerSensor, useSensor } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import DraggableUploadListItem from '../../components/DraggableUploadListItem';
import { logger } from '../../utils/logger';
import { uploadFile } from '../../api/modules/common';
import { useMessage } from '../../components/AppProvider';
import { useUploadFile } from '../../hooks/api/common';
import { cleanFileList, getFileExtension } from '../../utils/commonUtil';
import service from '../../utils/api/service';
import { useMutation } from '@tanstack/react-query';
import { fileConfig } from '../../utils/constant/validate';
import { useDispatch } from 'react-redux';
import { UploadManager } from '../../utils/filehandler/uploadManager';
import { converBytes } from '../../utils/convertUnit';
import { setFormValue } from '../../store/slices/uploadSlice';
const { Dragger } = Upload;


// 初始化上传管理器
const uploadManager = new UploadManager();

// 初始化
await uploadManager.initialize();

export const UploadFiles = ({ fileList = [], setFileList = {}, type }) => {
  const form = Form.useFormInstance();
  const dispatch = useDispatch()
  const messageApi = useMessage();
  const { mutateAsync: doUpload, handleSuccess, handleError } = useUploadFile();


  const getType = (type) => {
    switch (type) {
      case 1:
      case 2:
        return 'file';
      case 3:
        return 'coverImage';
      case 4:
        return 'images';
    }
  }
  // 文件、图片上传校验
  const beforeUploadCustom = (file, type = 1) => {
    // 文件类型校验
    logger.debug("文件校验", type)
    const config = fileConfig[type]
    const fileExtension = getFileExtension(file.name)
    const isValidType = config.types.includes(fileExtension);
    if (!isValidType) {
      messageApi.error(`不支持的文件格式: ${fileExtension}，请上传 ${config.types.join(', ')} 格式的文件`);
      return Upload.LIST_IGNORE;
    }
    // 文件数量校验,注意首次上传的时候fileList是undefined
    const list = form.getFieldValue(getType(type)) || [];
    logger.debug(list);
    if (list.length >= config.maxCount) {
      messageApi.error(`最多只能上传 ${config.maxCount} 个文件`);
      return Upload.LIST_IGNORE;
    }
    // 文件大小校验
    if (file.size > config.maxSize) {
      const maxSizeMB = type === 2 ?
        `${config.maxSize / 1024 / 1024 / 1024}GB` :
        `${config.maxSize / 1024 / 1024}MB`;
      messageApi.error(`文件大小不能超过 ${maxSizeMB}`);
      return Upload.LIST_IGNORE;
    }
    logger.debug("文件校验成功")
    return true;
  };
  const fn = {}
  //文件上传
  const fileCustomRequest = async (options) => {
    logger.debug("文件上传的配置", options);
    const { file, onProgress, onSuccess, onError } = options;
    fn.onSuccess = onSuccess;
    fn.onError = onError;
    fn.onProgress = onProgress;
    try {
      //   const formData = new FormData();
      //   formData.append('file', file);
      const timeStart = Date.now();
      //   await doUpload({
      //     formData, onProgress: (progressEvent) => {
      //       if (progressEvent.total) {
      //         const percent = Math.round(
      //           (progressEvent.loaded * 100) / progressEvent.total
      //         );
      //         onProgress({ percent }, file);
      //       }
      //     }
      //   })
      //   const timeEnd = Date.now();
      //   logger.debug("上传成功，共耗时秒数", (timeEnd - timeStart) / 1000)
      //   onSuccess(updatedFile, file);
      const task = await uploadManager.addFile(file);
      file.taskId = task.taskId;
      //绑定自定义progress回调
      task.on('progress', (progress, taskInfo) => {
        const percent = Math.round(progress * 100) / 100
        logger.debug(`上传进度：${percent}%`, '任务信息：', taskInfo);
        onProgress({ percent }, file);
      });
      // 5. 绑定自定义success回调（拿到URL）
      task.on('success', (taskInfo) => {
        const timeEnd = Date.now();
        logger.debug("上传成功，共耗时秒数", (timeEnd - timeStart) / 1000)
        logger.debug('上传成功！');
        const url = taskInfo.fileUrl
        logger.debug('文件URL：', url); // 直接拿到后端返回的URL
        logger.debug('任务详情：', taskInfo);
        const updatedFile = {
          ...file,
          status: 'done',
          url: url,
          type: getFileExtension(file.name),
          response: { url: url }
        };
        const index = fileList.findIndex(i => i.uid === file.uid)
        const newFileList = [...fileList];
        newFileList[index] = updatedFile;
        setFileList(newFileList)
        form.setFieldValue("file", newFileList);
        onSuccess(updatedFile, file);
      });
      task.on('error', (error) => {
        const timeEnd = Date.now();
        logger.debug("上传失败，共耗时秒数", (timeEnd - timeStart) / 1000)
        logger.debug("失败", error)
        onError(error);
        messageApi.error(`${file.name} 上传失败`);
      })


    } catch (error) {

    }
  }

  //文件修改
  const handleFileChange = ({ file, fileList: newFileList, event }) => {
    logger.debug("文件变化:", {
      fileStatus: file.status,
      newFileList
    });

    const filteredFileList = newFileList.map(item => {
      if (item.status === 'done' && item.response?.url) {
        return {
          ...item,
          url: item.response.url
        };
      }
      return item;
    });
    form.setFieldValue('file', filteredFileList);
    setFileList(filteredFileList);
    dispatch(setFormValue({ file: cleanFileList(filteredFileList) }))
  };

  const changeStatus = (id, status) => {
    const list = form.getFieldValue('file');
    const item = list.find(i => i.uid === id);
    item.status = status;
    const newList = [...list]
    form.setFieldValue('file', newList);
    setFileList(newList);
    dispatch(setFormValue({ file: cleanFileList(newList) }))
  }

  // 文件删除处理
  const handleFileRemove = (file) => {
    logger.debug("删除文件:", file);
    const newFileList = fileList.filter(item => item.uid !== file.uid);
    setFileList(newFileList);
    form.setFieldValue("file", newFileList);
    uploadManager.cancelUpload(file.taskId)
    return true;
  };
  //文件上传配置
  const fileUploadProps = (type = 1) => ({
    name: 'file',
    accept: fileConfig[type].accept,
    multiple: type === 1,
    fileList,
    sequential: true,
    maxCount: fileConfig[type].maxCount,
    beforeUpload: (file) => beforeUploadCustom(file, type),
    customRequest: fileCustomRequest,
    onChange: handleFileChange,
    onRemove: handleFileRemove,
    showUploadList: true,
    progress: {
      strokeColor: {
        '0%': '#e3ece3',
        '100%': '#aadbaaff',
      },
      strokeWidth: 3,
      format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
    },
    itemRender: (originNode, file) => (
      <DraggableUploadListItem originNode={originNode} file={file} uploadManager={uploadManager} fn={fn} onStatusChange={changeStatus} />
    ),
  });

  /**
   * 拖拽处理
   */
  // 拖拽传感器配置
  const sensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 10 },
  });
  ;
  // 拖拽排序结束时更新文件顺序
  const onDragEnd = ({ active, over }) => {
    if (active.id !== over?.id) {
      setFileList((prev) => {
        const activeIndex = prev.findIndex((item) => item.uid === active.id);
        const overIndex = prev.findIndex((item) => item.uid === over?.id);
        return arrayMove(prev, activeIndex, overIndex);
      });
    }
  };
  // 图片上传
  const imageCustomRequest = async (options, imageType = 3) => {
    const { file, onProgress, onSuccess, onError } = options;
    const timeStart = Date.now();
    const task = await uploadManager.addFile(file);
    try {
      task.on('progress', (progress, taskInfo) => {
        const percent = Math.round(progress * 100) / 100
        logger.debug(`上传进度：${percent}%`, '任务信息：', taskInfo);
        onProgress({ percent }, file);
      });
      // 5. 绑定自定义success回调（拿到URL）
      task.on('success', (taskInfo) => {
        const timeEnd = Date.now();
        logger.debug("上传成功，共耗时秒数", (timeEnd - timeStart) / 1000)
        logger.debug('上传成功！');
        const url = taskInfo.fileUrl
        logger.debug('文件URL：', url); // 直接拿到后端返回的URL
        logger.debug('任务详情：', taskInfo);
        const updatedFile = {
          ...file,
          status: 'done',
          url: url,
          type: getFileExtension(file.name),
          response: { url: url }
        };
        const list = form.getFieldValue(getType(imageType))
        const index = list.findIndex(i => i.uid === file.uid)
        const newFileList = [...list];
        newFileList[index] = updatedFile;
        form.setFieldValue(getType(imageType), updatedFile);
        onSuccess(updatedFile, file);
      });
      task.on('error', (error) => {
        const timeEnd = Date.now();
        logger.debug("上传失败，共耗时秒数", (timeEnd - timeStart) / 1000)
        logger.debug("失败", error)
        onError(error);
        messageApi.error(`${file.name} 上传失败`);
      })
    } catch (error) {
    }
  };

  //图片处理函数
  const handleCoverImageChange = (info) => {
    logger.debug("封面图片修改")
    const fileLists = [...info.fileList];
    // 只保留最后一个文件
    const file = fileLists.slice(-1)[0];
    if (!file) {
      form.setFieldValue("coverImage", []);
      return
    }
    // 更新文件状态，确保 url 被正确设置
    if (file.status === 'done' && file.response?.url) {
      file.url = file.response.url
    }
    form.setFieldValue("coverImage", [file]);
    dispatch(setFormValue({ coverImage: cleanFileList([file]) }))
  };

  // 预览图片变化处理
  const handlePreviewImagesChange = (info) => {
    logger.debug("预览图片修改", info)
    let fileLists = [...info.fileList];

    fileLists = fileLists.map(file => {
      if (file.status === 'done' && file.response?.url) {
        return {
          ...file,
          url: file.response.url
        };
      }
      return file;
    });

    form.setFieldValue("images", fileLists);
    dispatch(setFormValue({ images: cleanFileList(fileLists) }))
  };
  // 图片删除处理
  const handleImageRemove = (file, type) => {
    logger.debug("删除图片:", file);
    if (type === 3) {
      form.setFieldValue("coverImage", []);
    } else {
      // 获取当前的预览图片列表并移除被删除的图片
      const currentImages = form.getFieldValue("images") || [];
      const newImages = currentImages.filter(item => item.uid !== file.uid);
      form.setFieldValue("images", newImages);
    }
    return true;
  };

  // 图片上传配置
  const imageUploadProps = (type = 3) => ({
    listType: "picture-card",
    multiple: type === 4,
    maxCount: fileConfig[type].maxCount,
    accept: fileConfig[type].accept,
    showUploadList: {
      showDownloadIcon: false,
      showRemoveIcon: true,
      showPreviewIcon: true,
    },
    beforeUpload: (file) => beforeUploadCustom(file, type),
    customRequest: (options) => imageCustomRequest(options, type),
    onChange: (info) => {
      if (type === 3) {
        handleCoverImageChange(info);
      } else {
        handlePreviewImagesChange(info);
      }
    },
    onRemove: (file) => handleImageRemove(file, type),
    progress: {
      strokeColor: {
        '0%': '#108ee9',
        '100%': '#87d068',
      },
      size: 2,
      format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
    }
  });


  if (type === 1 || type === 2) {
    return (
      <DndContext sensors={[sensor]} onDragEnd={onDragEnd}>
        <SortableContext
          items={fileList.map(item => item.uid)}
          strategy={verticalListSortingStrategy}
        >
          <Dragger
            className='w-50'
            {...fileUploadProps(type)}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="text-sm mb-1">
              点击或拖拽文件到此处上传
            </p>
            <p className="text-xs text-secondary">
              {type === 2
                ? `支持视频格式，单个文件大小不超过${fileConfig[2].maxSize / 1024 / 1024}MB`
                : `支持多种格式，最多可上传${fileConfig[1].maxCount}个文件，单个文件大小不超过 ${converBytes(fileConfig[type].maxSize)}`
              }
            </p>
          </Dragger>
        </SortableContext>
      </DndContext>
    )
  }
  if (type === 3 || type === 4) {
    return (
      <ImgCrop aspect={16 / 9} rotationSlider>
        <Upload
          {...imageUploadProps(type)}
        >
          <div>
            <PlusOutlined />
            <div className='mt-1 text-sm'>上传封面</div>
            <div className="text-xs text-gray-400 mt-1">
              建议尺寸: 16:9，不超过{converBytes(fileConfig[type].maxSize)}
            </div>
          </div>

        </Upload>
      </ImgCrop>
    )
  }
}




