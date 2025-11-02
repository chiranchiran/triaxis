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
import { useUpload } from '../../hooks/api/common';
import { getFileExtension } from '../../utils/error/commonUtil';
const { Dragger } = Upload;

export const UploadFiles = ({ fileList = [], setFileList = {}, type }) => {
  const form = Form.useFormInstance();
  const messageApi = useMessage();
  const { mutate: doUpload, handleSuccess, handleError } = useUpload();
  // 文件类型和大小限制配置
  const fileConfig = {
    1: { // 资源文件
      maxCount: 10,
      maxSize: 500 * 1024 * 1024, // 500MB
      accept: '.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.zip,.rar,.jpg,.jpeg,.png,.gif,.psd',
      types: ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'txt', 'zip', 'rar', 'jpg', 'jpeg', 'png', 'gif', 'psd']
    },
    2: { // 课程文件
      maxCount: 1,
      maxSize: 2 * 1024 * 1024 * 1024, // 2GB
      accept: 'video/*,.mp4,.avi,.mov,.wmv,.flv,.mkv',
      types: ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm']
    },
    3: { // 封面图片
      maxCount: 1,
      maxSize: 50 * 1024 * 1024,
      accept: 'image/*,.jpg,.jpeg,.png,.gif,.webp',
      types: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    },
    4: { // 预览图片
      maxCount: 4,
      maxSize: 50 * 1024 * 1024, // 50MB
      accept: 'image/*,.jpg,.jpeg,.png,.gif,.webp',
      types: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    }
  };
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
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
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
    // 文件数量校验
    const list = form.getFieldValue(getType(type));
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
  //上传单个文件、图片
  const uploadSingleFile = async (file, onProgress) => {
    logger.debug("上传文件或图片", file);

    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', file);
      uploadFile({
        formData, onProgress: (progressEvent) => {
          // 修复进度回调格式
          if (progressEvent.total) {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress({ percent }, file);
          }
        }
      }).then((data) => {
        handleSuccess(data)
        logger.debug('上传成功:', data);
        resolve(data);
      }).catch((error) => {
        handleError(error);
        logger.error('上传失败:', error);
        reject(error);
      })

    });
  };
  //文件上传
  const fileCustomRequest = async (options) => {
    logger.debug("文件上传的配置", options);
    const { file, onProgress, onSuccess, onError } = options;
    try {
      const filePath = await uploadSingleFile(file, onProgress);
      const updatedFile = {
        ...file,
        status: 'done',
        path: filePath,
        type: getFileExtension(file.name),
        response: { path: filePath }
      };
      const index = fileList.findIndex(i => i.uid === file.uid)
      const newFileList = [...fileList];
      newFileList[index] = updatedFile;
      setFileList(newFileList)
      form.setFieldValue("file", newFileList);
      onSuccess(updatedFile, file);
    } catch (error) {
      onError(error);
      messageApi.error(`${file.name} 上传失败`);
    }
  };
  //文件修改
  const handleFileChange = ({ file, fileList: newFileList, event }) => {
    logger.debug("文件变化:", {
      fileStatus: file.status,
      fileList
    });

    const filteredFileList = newFileList.map(item => {
      if (item.status === 'done' && item.response?.path) {
        return {
          ...item,
          path: item.response.path
        };
      }
      return item;
    });

    form.setFieldValue("file", filteredFileList);
    setFileList(filteredFileList);

  };
  // 文件删除处理
  const handleFileRemove = (file) => {
    logger.debug("删除文件:", file);
    const newFileList = fileList.filter(item => item.uid !== file.uid);
    setFileList(newFileList);
    form.setFieldValue("file", newFileList);
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
        '100%': '#87d068',
      },
      size: 3,
      format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
    },
    itemRender: (originNode, file) => (
      <DraggableUploadListItem originNode={originNode} file={file} />
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

    try {
      const imagePath = await uploadSingleFile(file, onProgress);
      const updatedFile = {
        ...file,
        status: 'done',
        path: imagePath,
        response: { path: imagePath }
      };
      const list = form.getFieldValue(getType(imageType))
      const index = list.findIndex(i => i.uid === file.uid)
      const newFileList = [...list];
      newFileList[index] = updatedFile;
      form.setFieldValue(getType(imageType), updatedFile);
      onSuccess(updatedFile, file);
    } catch (error) {
      onError(error);
      messageApi.error(`${file.name} 上传失败`);
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
    // 更新文件状态，确保 path 被正确设置
    if (file.status === 'done' && file.response?.path) {
      file.path = file.response.path
    }
    form.setFieldValue("coverImage", [file]);
  };

  // 预览图片变化处理
  const handlePreviewImagesChange = (info) => {
    logger.debug("预览图片修改", info)
    let fileLists = [...info.fileList];

    fileLists = fileLists.map(file => {
      if (file.status === 'done' && file.response?.path) {
        return {
          ...file,
          path: file.response.path
        };
      }
      return file;
    });

    form.setFieldValue("images", fileLists);
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
                : `支持多种格式，最多可上传${fileConfig[1].maxCount}个文件，单个文件大小不超过 ${fileConfig[1].maxSize / 1024 / 1024}MB`
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
              建议尺寸: 16:9，不超过{fileConfig[type].maxSize / 1024 / 1024}MB
            </div>
          </div>

        </Upload>
      </ImgCrop>
    )
  }
}




