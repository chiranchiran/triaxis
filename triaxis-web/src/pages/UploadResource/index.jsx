// UploadResource.jsx
import React, { useState, useMemo } from 'react';
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
  Typography
} from 'antd';
import {
  UploadOutlined,
  PlusOutlined,
  DeleteOutlined,
  InboxOutlined,
  FileTextOutlined,
  FolderOutlined,
  PaperClipOutlined
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

const { Text } = Typography;


const { TextArea } = Input;
const { Option } = Select;
const { Dragger } = Upload;

// 模拟分类数据
const useGetTypes = () => {
  return {
    data: {
      subjects: [
        { id: 1, name: '城乡规划' },
        { id: 2, name: '建筑设计' },
        { id: 3, name: '风景园林' },
        { id: 4, name: '地理信息' }
      ],
      tools: [
        { id: 1, name: 'AutoCAD' },
        { id: 2, name: 'SketchUp' },
        { id: 3, name: 'Revit' },
        { id: 4, name: 'Photoshop' }
      ],
      categoriesFirst: [
        { id: 1, name: '参考图库' },
        { id: 2, name: '设计素材' },
        { id: 3, name: '图纸与作品' },
        { id: 4, name: '课程资源' }
      ]
    }
  };
};

const UploadResource = () => {
  const [form] = Form.useForm();
  const [resourceType, setResourceType] = useState('resource');
  const [tags, setTags] = useState([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [agreement, setAgreement] = useState(false);

  const { data: types = {} } = useGetTypes();

  // 处理标签
  const handleInputConfirm = () => {
    if (inputValue && !tags.includes(inputValue)) {
      setTags([...tags, inputValue]);
    }
    setInputVisible(false);
    setInputValue('');
  };

  const handleTagRemove = (removedTag) => {
    setTags(tags.filter(tag => tag !== removedTag));
  };

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

  // 图片上传配置
  const imageUploadProps = {
    listType: "picture-card",
    beforeUpload: () => false,
    maxCount: 1,
    showUploadList: true
  };

  // 提交表单
  const onFinish = (values) => {
    if (!agreement) {
      message.error('请同意上传协议');
      return;
    }

    const formData = {
      ...values,
      tags,
      type: resourceType
    };

    console.log('提交数据:', formData);
    message.success('上传成功！');
  };
  const [fileList, setFileList] = useState([]);

  // 拖拽传感器配置（不变）
  const sensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 10 },
  });

  // 拖拽排序结束时更新文件顺序（对多文件同样适用）
  const onDragEnd = ({ active, over }) => {
    if (active.id !== over?.id) {
      setFileList(prev => {
        const activeIndex = prev.findIndex(item => item.uid === active.id);
        const overIndex = prev.findIndex(item => item.uid === over?.id);
        return arrayMove(prev, activeIndex, overIndex);
      });
    }
  };

  // 多文件上传状态变化时更新列表（自动处理新增的多个文件）
  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  // 自定义上传区域提示文字（说明支持多文件拖拽）
  const uploadTip = (
    <div style={{ marginTop: 8 }}>
      <Text type="secondary">
        支持拖拽多个文件到此处，或点击按钮选择多个文件（最多5个）
      </Text>
      <br />
      <Text type="secondary">格式支持：图片、文档等（可通过accept限制）</Text>
    </div>
  );
  // 构建分类树数据
  const categoryTreeData = useMemo(() => {
    const mockSecondary = {
      1: [{ id: 11, name: '参考图' }, { id: 12, name: '分析图' }],
      2: [{ id: 21, name: 'PS素材' }, { id: 22, name: '贴图材质' }],
      3: [{ id: 31, name: '建筑图纸' }, { id: 32, name: '规划图纸' }],
      4: [{ id: 41, name: '规划课程' }, { id: 42, name: '建筑课程' }]
    };

    return types.categoriesFirst?.map(category => ({
      label: category.name, // TreeSelect 的 title → Cascader 的 label
      value: category.id,   // 保持 value 不变
      key: category.id,     // 保持 key 不变
      children: mockSecondary[category.id]?.map(sub => ({
        label: sub.name,    // 子节点同样转换 title → label
        value: sub.id,
        key: sub.id
      }))
    })) || [];
  }, [types.categoriesFirst]);
  // 选中变化事件（与 TreeSelect 类似，返回选中的 value 数组和选项数组）
  const handleChange = (value, selectedOptions) => {
    console.log('选中的值：', value);
    console.log('选中的选项详情：', selectedOptions);
  };


  return (
    <div className="max-w-6xl mx-auto bg-card py-4">

      <Form
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 20 }}
        form={form}
        layout="horizontal"
        onFinish={onFinish}
        className="space-y-8"
      >
        {/* 分类设置 */}
        <Row gutter={16}>
          <Col span={24}>
            {/* <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <FileTextOutlined className="mr-2" />
                  基本信息
                </h3>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <FolderOutlined className="mr-2" />
                  分类设置
                </h3> */}
            <Form.Item label="类型" name="type" layout="horizontal"
              rules={[{ required: true, message: '请选择上传的类型' }]}>
              <Radio.Group size="large" defaultValue={1}>
                <Radio value={1}> 资源 </Radio>
                <Radio value={2}> 课程 </Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              name="title" label="标题" layout="horizontal"
              rules={[{ required: true, message: '请输入15字以内的标题' },
              { max: 15, message: '标题不能超过15字' }
              ]}
            >
              <Input placeholder="请输入15字以内的资源标题" className='max-w-120' />
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
                placeholder="简要描述内容特点和使用方法（最多50字）"
                showCount
                maxLength={50}
              />
            </Form.Item>
            {resourceType === 'course' && (
              <Form.Item
                name="subtitle"
                label="副标题"
              >
                <Input placeholder="请输入副标题" />
              </Form.Item>
            )}
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
                      changeOnWheel
                      defaultValue={1}
                      controls
                      min={1}
                      placeholder="输入积分数量"
                      className="w-full overflow-hidden max-w-40"
                    />
                  </Form.Item>
                )
              }
            </Form.Item>
            <Form.Item
              name="subjectId"
              label="学科分类"
              layout="horizontal"
              rules={[{ required: true, message: '请选择学科分类' }]}
            >
              <Select placeholder="选择学科分类" className='max-w-40'>
                {types.subjects?.map(subject => (
                  <Option key={subject.id} value={subject.id}>
                    {subject.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>


            {resourceType === 'resource' && (
              <>
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
                    {types.tools?.map(tool => (
                      <Option key={tool.id} value={tool.id}>
                        {tool.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  name="categories"
                  label="资源分类"
                  rules={[{ required: true, message: '请选择资源分类' }]}
                >
                  <Cascader
                    options={categoryTreeData}       // 级联数据（转换后的 options）
                    placeholder="选择资源分类"       // 与原 TreeSelect 占位符一致
                    mode="multiple"                 // 支持多选（对应 TreeSelect 的 treeCheckable）
                    showCheckedItems                // 展示所有选中项（对应 TreeSelect 的 SHOW_ALL）
                    onChange={handleChange}         // 选中变化事件
                    // 可选：添加搜索功能（与原 TreeSelect 功能对齐）
                    showSearch={{
                      filter: (inputValue, path) =>
                        path.some(option => option.label.toLowerCase().includes(inputValue.toLowerCase()))
                    }}
                    multiple
                    maxTagCount="responsive"
                  />
                </Form.Item>
              </>
            )}

            <Form.Item label="标签">
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map(tag => (
                  <Tag
                    key={tag}
                    closable
                    onClose={() => handleTagRemove(tag)}
                    className="px-2 py-1"
                  >
                    {tag}
                  </Tag>
                ))}
              </div>
              {inputVisible ? (
                <Input
                  size="small"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onBlur={handleInputConfirm}
                  onPressEnter={handleInputConfirm}
                  style={{ width: 120 }}
                />
              ) : (
                <Button
                  size="small"
                  type="dashed"
                  icon={<PlusOutlined />}
                  onClick={() => setInputVisible(true)}
                >
                  添加标签
                </Button>
              )}
            </Form.Item>
            {resourceType === 'course' && (
              <>

                <Form.Item
                  name="categoryId"
                  label="课程分类"
                >
                  <Select
                    mode="multiple"
                    placeholder="选择课程分类"
                  >
                    {types.categoriesFirst?.map(cat => (
                      <Option key={cat.id} value={cat.id}>
                        {cat.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>


                <Form.Item
                  name="level"
                  label="难度级别"
                >
                  <Radio.Group>
                    <Radio value={1}>初级</Radio>
                    <Radio value={2}>中级</Radio>
                    <Radio value={3}>高级</Radio>
                  </Radio.Group>
                </Form.Item>


                <Form.Item
                  name="duration"
                  label="课程时长（分钟）"
                >
                  <InputNumber
                    min={1}
                    placeholder="输入时长"
                    className="w-full"
                  />
                </Form.Item>

              </>
            )}
            <Form.Item
              label={resourceType === 'course' ? '课程文件' : '资源文件'}
              name="file"
              rules={[{ required: true, message: '请上传文件' }]}

            >
              <DndContext sensors={[sensor]} onDragEnd={onDragEnd}>
                <SortableContext
                  items={fileList.map(item => item.uid)}
                  strategy={verticalListSortingStrategy}
                >
                  {/* 使用你的Dragger组件作为上传区域 */}
                  <Dragger
                    className='w-40'
                    {...fileUploadProps(resourceType === 'resource')} // 保留原有的Upload配置
                    fileList={fileList}
                    onChange={onChange}
                    // 自定义文件项渲染（绑定排序功能）
                    itemRender={(originNode, file) => (
                      <DraggableUploadListItem originNode={originNode} file={file} />
                    )}
                  >
                    {/* 保留你原来的上传区域内容 */}
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="text-base">
                      点击或拖拽文件到此处上传
                    </p>
                    <p className="text-xs text-secondary">
                      {resourceType === 'course'
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

            >
              <ImgCrop aspect={16 / 9} rotationSlider>
                <Upload
                  {...imageUploadProps}

                  maxCount={1}
                >
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>上传封面</div>
                  </div>
                </Upload>
              </ImgCrop>
            </Form.Item>
            <Form.Item label="预览图片">
              <ImgCrop aspect={16 / 9} rotationSlider>
                <Upload
                  {...imageUploadProps}
                  maxCount={4}
                >
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>上传预览图</div>
                  </div>
                </Upload>
              </ImgCrop>

            </Form.Item>
            <Form.Item
              name="details"
              label="资源详情"
              rules={[
                { required: true, message: '请输入10字以上详情描述' },
                { min: 10, message: '描述不能少于10字' },
                { max: 5000, message: '描述不能超过5000字' }
              ]}
            >
              <MDEditor
                enableScroll={false}
                preview="edit"
                style={{ fontSize: '16px' }}
                data-color-mode="light"
              />
            </Form.Item>
            <div className="bg-orange-light p-4 rounded my-4">
              <h4 className="font-medium mb-2">上传须知</h4>
              <ul className="text-sm text-main space-y-1 list-disc list-inside">
                <li>请确保内容符合相关法律法规</li>
                <li>请勿上传侵权内容</li>
                <li>审核通常需要1-3个工作日</li>
                <li>通过审核后将在平台展示</li>
              </ul>
            </div>
            <Form.Item>
              <Checkbox
                checked={agreement}
                onChange={(e) => setAgreement(e.target.checked)}
              >
                我已阅读并同意
                <Button type="link" size="small">《资源上传协议》</Button>
                和
                <Button type="link" size="small">《版权声明》</Button>
              </Checkbox>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                disabled={!agreement}
                className="w-full"
              >
                提交{resourceType === 'resource' ? '资源' : '课程'}
              </Button>
            </Form.Item>
            <Divider className="bg-gray" />
          </Col>

        </Row>
      </Form>

    </div >
  );
};

export default UploadResource;