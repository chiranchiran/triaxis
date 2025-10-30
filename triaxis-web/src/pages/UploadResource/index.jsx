// UploadResource.jsx
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Form,
  Input,
  Select,
  Upload,
  Tag,
  Row,
  Col,
  message,
  InputNumber,
  TreeSelect,
  Radio,
  Timeline,
  Button,
  Divider,
  Checkbox,
  Mentions,
  Cascader,
  DatePicker,
  Anchor,
  Typography,
  Segmented,
  Space
} from 'antd';
import {
  UploadOutlined,
  PlusOutlined,
  DeleteOutlined,
  InboxOutlined,
  FileTextOutlined,
  FolderOutlined,
  PaperClipOutlined,
  ExclamationCircleFilled
} from '@ant-design/icons';
import MDEditor from '@uiw/react-md-editor';
import ImgCrop from 'antd-img-crop';
import { CustomCard } from '../../components/DetailCard';
import { DndContext, PointerSensor, useSensor } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import DraggableUploadListItem from '../../components/DraggableUploadListItem';
import './index.less'
import { MyButton, OrderButton } from '../../components/MyButton';
import { Link } from 'react-router-dom';
import { logger } from '../../utils/logger';
import { ResetConfirmButton, SubmitConfirmButton, useToggleConfirm } from '../../components/Mymodal';
import { useGetResourceTypes, useGetSecondaryCategory, useUploadResource } from '../../hooks/api/resources';
import { useGetCourseTypes, useUploadCourse } from '../../hooks/api/courses';
import { useQueryClient } from '@tanstack/react-query';
import { getUserData } from '../../utils/localStorage';
import { uploadFile } from '../../api/modules/common';

const { Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { Dragger } = Upload;

const UploadResource = () => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const toggleModal = useToggleConfirm();
  const { mutate: doUploadResource, isSuccess: resourceSuccess } = useUploadResource()
  const { mutate: doUploadCourse, isSuccess: courseSuccess } = useUploadCourse()
  /**
   *  state管理
   */
  const [type, setType] = useState(1);
  const [fileList, setFileList] = useState([]);
  const [tagState, setTagState] = useState({
    tags: [],
    inputValue: ''
  });
  const { tags, inputValue } = tagState;

  const [selectedTypes, setSelectedTypes] = useState({
    subjectId: null,
    parentId: null
  })

  /**
 *  获取数据
 */
  //获取资源数据学科、工具、一级分类
  const { data: resourceTypes = {}, isError: resourceTypesError } = useGetResourceTypes({ enabled: type === 1 });
  const { subjects: resourceSubjects = [], tools = [], categoriesFirst = [] } = resourceTypes || {}
  //根据资源学科和一级分类获取二级分类
  const { data: categoriesSecondaryData = [], isError: secondaryError, } = useGetSecondaryCategory({
    subjectId: selectedTypes.subjectId,
    parentId: selectedTypes.parentId
  }, { enabled: !!selectedTypes.subjectId && !!selectedTypes.parentId && type == 1 });
  //获取课程学科、难度、分类
  const { data: courseTypes = {}, isError: courseError } = useGetCourseTypes({ enabled: type === 2 });
  const { sujects: courseSubjects = [], categories = [] } = courseTypes || {}

  /**
   * 数据处理
   */

  //级联选择数据
  const categoryTreeData = useMemo(() => {
    if (type === 1) {
      return categoriesFirst.map(firstCat => {
        // 从 queryClient 缓存中获取该一级分类的二级数据
        // logger.debug("构建二级分类数据", firstCat.id)
        const cachedSecondaryData = queryClient.getQueryData(['resources', 'categories', selectedTypes.subjectId, firstCat.id]);

        return {
          label: firstCat.name,
          value: firstCat.id,
          // disabled: !cachedSecondaryData,
          children: cachedSecondaryData ? cachedSecondaryData.map(secondCat => ({
            label: secondCat.name,
            value: secondCat.id,
          })) : []
        };
      });
    } else {
      logger.debug("构建课程分类数据", categories);
      return categories.map(cat => ({
        label: cat.name,
        value: cat.id,
      }))
    }
  }, [type, categoriesFirst, categories, queryClient, categoriesSecondaryData, selectedTypes.subjectId]);

  /**
   * 字段变化处理函数
   */

  // 处理学科选择变化
  const handleSubjectChange = (subjectId) => {
    setSelectedTypes(prev => ({ ...prev, subjectId }));
    // 清空分类选择
    form.setFieldsValue({
      categoriyIds: null
    });
  };

  /**
   * 级联选择器处理
   */

  //处理二级分类加载慢的问题,点击选择后再加载
  const handleCascaderChange = (values) => {
    logger.debug("选中的值", values);
    const newValues = values.filter((item) => {
      if (item.length === 1) {
        const cachedSecondaryData = queryClient.getQueryData(['resources', 'categories', selectedTypes.subjectId, item[0]]);
        if (!cachedSecondaryData) {
          setSelectedTypes(pre => ({ ...pre, parentId: item[0] }));
          logger.debug("没有二级分类")
          return false;
        }
      }
      return true;
    })
    logger.debug("values", newValues)

    form.setFieldsValue({ categoryIds: newValues });
  }

  /**
   * 标签处理
   */
  // 处理标签输入
  const handleInputConfirm = () => {
    if (inputValue && !tags.includes(inputValue)) {
      setTagState({
        tags: [...tags, inputValue],
        inputValue: ''
      });
    }
  };
  //标签移除
  const handleTagRemove = (removedTag) => {
    setTagState({
      ...tagState,
      tags: tags.filter(tag => tag !== removedTag)
    });
  };

  /**
 * 上传处理
 */
  // 文件上传配置
  const fileUploadProps = (multiple = true) => ({
    multiple,
    beforeUpload: (file) => {
      if (!multiple) {
        message.info('课程只能上传一个文件');
        return Upload.LIST_IGNORE;
      }
      return false;
    },
    showUploadList: true
  });
  //文件上传
  const handleFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    form.setFieldValue("file", newFileList)
  };
  // 图片上传配置
  const imageUploadProps = {
    listType: "picture-card",
    beforeUpload: () => false,
    maxCount: 1,
    showUploadList: true,
  };
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  //图片处理函数
  const imagesChange = (info) => {
    const { fileList = [] } = info;
    form.setFieldValue("images", fileList);
  }
  const coverImageChange = (info) => {
    const { fileList = [] } = info;
    form.setFieldValue("coverImage", fileList);
  }


  /**
   * 拖拽处理
   */
  // 拖拽传感器配置
  const sensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 10 },
  });
  ;
  // 拖拽排序结束时更新文件顺序
  const onDragEnd = useCallback(({ active, over }) => {
    if (active.id !== over?.id) {
      setFileList((prev) => {
        const activeIndex = prev.findIndex((item) => item.uid === active.id);
        const overIndex = prev.findIndex((item) => item.uid === over?.id);
        return arrayMove(prev, activeIndex, overIndex);
      });
    }
  }, []);

  /**
   * 表单事件处理
   */

  //类型切换
  const toggleType = value => {
    toggleModal(() => {
      setType(value);
      formReset();
    })
  }
  //提交
  const onFinish = (isSave = false) => {
    form.validateFields().then(() => {
      const processedValues = form.getFieldsValue();
      logger.debug("初始数据", processedValues);
      // 处理分类数据
      fileList.forEach(async (file, index) => {
        const formData = new FormData();
        const resourceFile = file.originFileObj || file;
        formData.append(`file`, resourceFile);
        const url = await uploadFile(formData);
        console.log(url);
      });
      // 添加文本字段
      // formData.append('status', isSave ? 1 : 2);
      // formData.append('title', processedValues.title);
      // formData.append('description', processedValues.description);
      // formData.append('right', processedValues.right);
      // formData.append('subjectId', processedValues.subjectId);
      // formData.append('categoryIds', JSON.stringify(processCategoryIds(processedValues.categoryIds)));
      // formData.append('tags', JSON.stringify(tags));
      // formData.append('details', processedValues.details);
      // // 处理价格
      // if (processedValues.right === 2) {
      //   formData.append('price', processedValues.price);
      // }
      // // 资源特有字段
      // if (type === 1) {
      //   formData.append('toolIds', JSON.stringify(processedValues.toolIds || []));
      // }
      // // 课程特有字段
      // if (type === 2) {
      //   formData.append('subtitle', processedValues.subtitle);
      //   formData.append('level', processedValues.level);
      // }

      // if (processedValues.coverImage && processedValues.coverImage.length > 0) {
      //   const coverFile = processedValues.coverImage[0].originFileObj || processedValues.coverImage[0];
      //   formData.append('coverImage', coverFile);
      // }
      // if (processedValues.images && processedValues.images.length > 0) {
      //   processedValues.images.forEach((file, index) => {
      //     const imageFile = file.originFileObj || file;
      //     formData.append(`images`, imageFile);
      //   });
      // }
      // fileList.forEach((file, index) => {
      //   const resourceFile = file.originFileObj || file;
      //   formData.append(`files`, resourceFile);
      // });

      // logger.debug('formData 准备提交');

      // if (type === 1) doUploadResource(formData);
      // if (type === 2) doUploadCourse(formData);

    }).catch((error) => {
      logger.error('表单验证失败:', error);
    });
  };
  //处理成功的表单清除
  useEffect(() => {
    if (resourceSuccess || courseSuccess) {
      formReset();
    }

  }, [resourceSuccess, courseSuccess])

  // 处理分类ID的函数
  const processCategoryIds = (cascaderValues) => {
    if (!cascaderValues || cascaderValues.length === 0) {
      return [];
    }

    if (type === 1) {
      // 资源类型：处理级联选择
      const secondaryIds = new Set();
      cascaderValues.forEach(valuePath => {
        if (valuePath.length === 2) {
          secondaryIds.add(valuePath[1]);
        } else if (valuePath.length === 1) {
          // 处理只选了一级分类的情况
          const secondaryIdsForFirstCat = getSecondaryIdsByFirstCategory(valuePath[0]);
          secondaryIdsForFirstCat.forEach(id => secondaryIds.add(id));
        }
      });
      return Array.from(secondaryIds);
    } else {
      // 课程类型：直接返回选择的值
      return cascaderValues.flat();
    }
  };

  const getSecondaryIdsByFirstCategory = (id) => {
    const cachedSecondaryData = categoryTreeData.find(i => i.value === id);
    return cachedSecondaryData.children.map((i) => i.value)
  }
  //重置
  const formReset = () => {
    form.resetFields();
    setFileList([]);
    setTagState({
      tags: [],
      inputValue: ''
    });
    setSelectedTypes({
      subjectId: null,
      parentId: null
    });
  };

  return (
    <section>
      <div className="bg-gradient-to-white h-72 uploadResource">
        <div className="max-w-5xl mx-auto px-2">
          <h3 className="text-3xl font-semibold pt-10 mb-3 flex items-center">上传信息</h3>
          <div className='flex justify-start gap-2 items-center'>
            <span className='text-lg'> <FolderOutlined /> 请选择上传的分类：</span>
            <OrderButton
              className="!text-lg"
              handleSortChange={(value) => toggleType(value)} value={type} list={[{ id: 1, name: "资源" }, { id: 2, name: "课程" }]} />
          </div>

        </div>
      </div >
      <div className="-mt-36 max-w-5xl mx-auto flex flex-col items-center bg-card pt-6 py-2 mb-10 rounded-xl shadow-lg">
        <Form
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 20 }}
          form={form}
          initialValues={{
            price: 1,
            level: 2,
            details: "还没有任何详细介绍~",
            agreement: true
          }}
          layout="horizontal"
          onFinish={onFinish}
          className="space-y-8"
        >
          <Row gutter={16}>
            <Col span={24}>
              {/* 标题等设置 */}
              <>
                <Form.Item
                  name="title" label="标题" layout="horizontal"
                  rules={[{ required: true, message: '请输入标题（最多15字）' },
                  { max: 15, message: '标题不能超过15字' }
                  ]}>
                  <Input placeholder="请输入标题（最多15字）" className='max-w-120' />
                </Form.Item>
                <Form.Item
                  name="description"
                  label="描述"
                  layout="horizontal"
                  rules={[
                    { required: true, message: '请输入描述' },
                    { max: 50, message: '描述不能超过50字' }
                  ]}
                >
                  <TextArea
                    rows={3}
                    placeholder="简要描述内容特点和介绍（最多50字）"
                    showCount
                    maxLength={50}
                  />
                </Form.Item>
                {type === 2 && (
                  <Form.Item
                    name="subtitle"
                    label="副标题"
                    rules={[{ required: true, message: '请输入副标题（最多30字）' },
                    { max: 30, message: '副标题不能超过30字' }
                    ]}
                  >
                    <Input placeholder="请输入副标题（最多30字）" />
                  </Form.Item>
                )}
              </>
              {/* 分类设置 */}
              <>
                <Form.Item
                  name="right"
                  label="访问权限"
                  layout="horizontal"
                  rules={[{ required: true, message: '请选择访问权限' }]}
                >
                  <Select placeholder="选择访问权限" className='max-w-40'>
                    <Option value={1}>免费</Option>
                    <Option value={2}>积分兑换</Option>
                    <Option value={3}>VIP专享</Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  noStyle
                  shouldUpdate={(prev, current) => prev.right !== current.right}
                >
                  {({ getFieldValue }) =>
                    getFieldValue('right') === 2 && (
                      <Form.Item
                        name="price"
                        label="所需积分"
                        rules={[{ required: true, message: '请输入积分' }]}
                      >
                        <InputNumber
                          size='middle'
                          controls
                          min={1}
                          step={10}
                          max={100000}
                          placeholder="输入积分数量（1-100000）"
                          className="w-full overflow-hidden max-w-40"
                        />
                      </Form.Item>
                    )
                  }
                </Form.Item>

                {type === 1 && (
                  <>
                    <Form.Item
                      name="subjectId"
                      label="学科分类"
                      layout="horizontal"
                      rules={[{ required: true, message: '请选择学科分类' }]}
                    >
                      <Select placeholder="选择学科分类" className='max-w-40' onChange={handleSubjectChange}>
                        {resourceSubjects && resourceSubjects.map(subject => (
                          <Option key={subject.id} value={subject.id}>
                            {subject.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name="toolIds"
                      label="工具分类"
                      rules={[{ required: true, message: '请选择工具分类' }]}
                    >
                      <Select
                        mode="multiple"
                        placeholder="选择工具"
                        className="w-auto"
                      >
                        {tools && tools.map(tool => (
                          <Option key={tool.id} value={tool.id}>
                            {tool.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item
                      name="categoryIds"
                      label="资源分类"
                      rules={[{ required: true, message: '请选择资源分类' }]}
                    >
                      <Cascader
                        options={categoryTreeData}
                        placeholder="选择资源分类"
                        onChange={handleCascaderChange}
                        // onOpenChange={handleDropdownVisibleChange}
                        showSearch={{
                          filter: (inputValue, path) =>
                            path.some(option => option.label.toLowerCase().includes(inputValue.toLowerCase()))
                        }}
                        multiple
                        disabled={type === 1 && !selectedTypes.subjectId}
                        maxTagCount="responsive"
                      />
                    </Form.Item>
                  </>
                )}
                {type === 2 && (
                  <>
                    <Form.Item
                      name="subjectId"
                      label="学科分类"
                      layout="horizontal"
                      rules={[{ required: true, message: '请选择学科分类' }]}
                    >
                      <Select placeholder="选择学科分类" className='max-w-40'>
                        {courseSubjects && courseSubjects.map(subject => (
                          <Option key={subject.id} value={subject.id}>
                            {subject.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name="level"
                      label="难度级别"
                      rules={[{ required: true, message: '请选择难度级别' }]}
                    >
                      <Radio.Group>
                        <Radio value={1}>初级</Radio>
                        <Radio value={2}>中级</Radio>
                        <Radio value={3}>高级</Radio>
                      </Radio.Group>
                    </Form.Item>
                    <Form.Item
                      name="categoryIds"
                      label="课程分类"
                      rules={[{ required: true, message: '请选择课程分类' }]}
                    >
                      <Select
                        mode="multiple"
                        placeholder="选择课程分类"
                      >
                        {categories && categories.map(cat => (
                          <Option key={cat.id} value={cat.id}>
                            {cat.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </>
                )}
                <Form.Item label="标签">
                  <div className="flex flex-wrap gap-2 mb-2 p-1 flex-col justify-start bg-main border border-main tag-container">
                    <div className='h-5 flex flex-wrap '>
                      {tags && tags.map(tag => (
                        <Tag
                          key={tag}
                          closable
                          onClose={() => handleTagRemove(tag)}
                          className="px-2 py-2"
                        >
                          {tag}
                        </Tag>
                      ))}
                    </div>
                    <Input
                      value={inputValue}
                      onChange={(e) => setTagState({
                        ...tagState,
                        inputValue: e.target.value
                      })}
                      onBlur={handleInputConfirm}
                      onPressEnter={handleInputConfirm}
                      placeholder='按下回车生成标签'
                    >
                    </Input>
                  </div>
                </Form.Item>
              </>

              {/* 文件上传 */}
              <>
                <Form.Item
                  label={type === 2 ? '课程文件' : '资源文件'}
                  name="file"
                  valuePropName="fileList"
                  rules={[{ required: true, message: '请上传文件' }]}

                >
                  <DndContext sensors={[sensor]} onDragEnd={onDragEnd}>
                    <SortableContext
                      items={fileList.map(item => item.uid)}
                      strategy={verticalListSortingStrategy}
                    >
                      <Dragger
                        className='w-40'
                        {...fileUploadProps(type === 1)}
                        fileList={fileList}
                        onChange={handleFileChange}
                        itemRender={(originNode, file) => (
                          <DraggableUploadListItem originNode={originNode} file={file} />
                        )}
                      >
                        <p className="ant-upload-drag-icon">
                          <InboxOutlined />
                        </p>
                        <p className="text-base">
                          点击或拖拽文件到此处上传
                        </p>
                        <p className="text-xs text-secondary">
                          {type === 2
                            ? '支持视频格式，单个文件不超过2GB'
                            : '支持多种格式，可上传多个文件'
                          }
                        </p>
                      </Dragger>
                    </SortableContext>
                  </DndContext>
                </Form.Item>
                <Form.Item
                  label="封面图片" name="coverImage"
                  className='cover'
                  valuePropName="fileList"
                  getValueFromEvent={normFile}
                >
                  <ImgCrop aspect={16 / 9} rotationSlider>
                    <Upload
                      maxCount={1}
                      {...imageUploadProps}
                      onChange={coverImageChange}
                    >
                      <div>
                        <PlusOutlined />
                        <div className='mt-2'>上传封面</div>
                      </div>
                    </Upload>
                  </ImgCrop>
                </Form.Item>
                {type === 1 && (
                  <Form.Item label="预览图片" name="images" valuePropName="fileList" getValueFromEvent={normFile}>
                    <ImgCrop aspect={16 / 9} rotationSlider>
                      <Upload
                        {...imageUploadProps}
                        maxCount={4}
                        multiple
                        onChange={imagesChange}
                      >
                        <div>
                          <PlusOutlined />
                          <div className='mt-2'>上传预览图</div>
                        </div>
                      </Upload>
                    </ImgCrop>
                  </Form.Item>)}
              </>
              {/* 详情介绍 */}
              <Form.Item
                name="details"
                label={`${type === 1 ? '资源' : '课程'}详情`}
                rules={[
                  { max: 5000, message: '描述不能超过5000字' }
                ]}
              >
                <MDEditor
                  enableScroll={false}
                  preview="edit"
                  style={{ minHeight: 300 }}
                  data-color-mode="light"
                />
              </Form.Item>

              <div className='mx-auto w-[95%] my-10 '>
                <Divider className="bg-gray" />
              </div>
              {/* 底部操作 */}
              <div className='mx-32' >
                <div className="bg-orange-light p-4 rounded my-4 text-center flex flex-col justify-center items-center">
                  <h4 className="font-medium mb-2">上传须知</h4>
                  <ul className="text-sm text-secondary space-y-1 list-disc list-inside text-left">
                    <li>请确保内容符合法律法规及平台规范，禁止传播违法违规信息，避免内容下架、账号受限。</li>
                    <li>请勿上传侵犯他人著作权、肖像权等合法权益的内容，侵权需承担法律责任，平台将下架相关内容。</li>
                    <li>审核通常需1-3个工作日，节假日或高峰期可能延长1-2天，建议合理安排提交时间。</li>
                    <li>内容通过审核后将在平台展示（位置依内容质量匹配），可查看数据，违规或数据差可能调整展示范围。</li>
                  </ul>
                </div>
                <Form.Item
                  name="agreement"
                  valuePropName="checked"
                  rules={[
                    {
                      validator: (_, value) =>
                        value ? Promise.resolve() : Promise.reject(new Error('请同意《资源上传协议》和《版权声明》！')),
                    },
                  ]}>
                  <Checkbox>
                    <span className='text-main'>我已阅读并同意</span>
                    <Link to='' className='text-green'> 《资源上传协议》</Link>
                    <span className='text-main'>和</span>
                    <Link to='' className='text-green'> 《版权声明》 </Link>
                  </Checkbox>
                </Form.Item>
                {/* 表单按钮 */}

                <div className='flex justify-between mb-10'>
                  <div className='flex gap-4'>
                    <SubmitConfirmButton onConfirm={onFinish}
                    >
                      提交
                    </SubmitConfirmButton>
                    <MyButton type='gray' htmltype="submit" onClick={() => onFinish(true)}
                    >
                      保存为草稿
                    </MyButton>
                  </div>

                  <ResetConfirmButton onConfirm={formReset}
                  >
                    重置
                  </ResetConfirmButton>
                  {/* <CancelConfirmButton
                    >
                      取消
                    </CancelConfirmButton> */}
                </div>

              </div>
            </Col>
          </Row>
        </Form>
      </div >
    </section>

  );
};

export default UploadResource;