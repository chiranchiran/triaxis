// UploadResource.jsx
import React, { useState } from 'react';
import {
  Button,
  Form,
  Input,
  Select,
  Upload,
  Tag,
  Divider,
  Row,
  Col,
  message,
  Steps,
  Switch,
  InputNumber
} from 'antd';
import {
  UploadOutlined,
  PlusOutlined,
  DeleteOutlined,
  FileOutlined,
  VideoCameraOutlined,
  PictureOutlined,
  InboxOutlined
} from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;
const { Dragger } = Upload;

// 分类选项
const CATEGORY_OPTIONS = [
  {
    value: 'reference', label: '参考图库', children: [
      { value: 'reference_images', label: '参考图' },
      { value: 'analysis_diagrams', label: '分析图' },
      { value: 'rendering_images', label: '效果图' },
      { value: 'real_photos', label: '实景照片' }
    ]
  },
  {
    value: 'materials', label: '设计素材', children: [
      { value: 'ps_materials', label: 'PS素材/笔刷' },
      { value: 'textures', label: '贴图材质' },
      { value: 'models', label: '模型库' },
      { value: 'rendering_materials', label: '渲染素材' }
    ]
  },
  {
    value: 'designs', label: '图纸与作品', children: [
      { value: 'architecture_drawings', label: '建筑特有' },
      { value: 'planning_drawings', label: '规划特有' },
      { value: 'analysis_drawings', label: '分析图' },
      { value: 'portfolio', label: '作品集' }
    ]
  },
  {
    value: 'courses', label: '课程资源', children: [
      { value: 'planning_courses', label: '城乡规划课程' },
      { value: 'architecture_courses', label: '建筑设计课程' },
      { value: 'landscape_courses', label: '风景园林课程' },
      { value: 'gis_courses', label: '地理信息课程' }
    ]
  }
];

// 软件工具选项
const SOFTWARE_OPTIONS = [
  'AutoCAD', 'SketchUp', 'Revit', 'Rhino', 'Photoshop',
  'Illustrator', 'InDesign', 'Lumion', 'ArcGIS', 'GIS', '其他'
];

// 专业领域选项
const FIELD_OPTIONS = [
  '城乡规划', '建筑设计', '风景园林', '地理信息', '其他'
];

// 价格类型选项
const PRICE_OPTIONS = [
  { value: 'free', label: '免费' },
  { value: 'vip', label: 'VIP专享' },
  { value: 'points', label: '积分兑换' }
];

// 自定义卡片组件
const CustomCard = ({ children, className = '', ...props }) => (
  <div
    className={`bg-white rounded-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-sm ${className}`}
    {...props}
  >
    {children}
  </div>
);

// 自定义卡片标题组件
const CustomCardTitle = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-b border-gray-100 bg-gray-50 ${className}`}>
    <h3 className="text-lg font-semibold text-gray-800">{children}</h3>
  </div>
);

// 自定义卡片内容组件
const CustomCardContent = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

const UploadResource = () => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [resourceType, setResourceType] = useState('resource'); // 'resource' or 'course'
  const [tags, setTags] = useState([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [fileList, setFileList] = useState([]);
  const [imageList, setImageList] = useState([]);

  // 步骤配置
  const steps = [
    {
      title: '基本信息',
      description: '填写资源基本信息'
    },
    {
      title: '文件上传',
      description: '上传资源文件'
    },
    {
      title: '权限设置',
      description: '设置访问权限'
    },
    {
      title: '确认提交',
      description: '确认并提交资源'
    }
  ];

  // 处理标签输入
  const handleInputConfirm = () => {
    if (inputValue && tags.indexOf(inputValue) === -1) {
      setTags([...tags, inputValue]);
    }
    setInputVisible(false);
    setInputValue('');
  };

  // 移除标签
  const handleTagRemove = (removedTag) => {
    const newTags = tags.filter(tag => tag !== removedTag);
    setTags(newTags);
  };

  // 显示标签输入框
  const showInput = () => {
    setInputVisible(true);
  };

  // 文件上传配置
  const uploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
  };

  // 图片上传配置
  const imageUploadProps = {
    onRemove: (file) => {
      const index = imageList.indexOf(file);
      const newImageList = imageList.slice();
      newImageList.splice(index, 1);
      setImageList(newImageList);
    },
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('只能上传图片文件!');
        return false;
      }
      setImageList([...imageList, file]);
      return false;
    },
    fileList: imageList,
  };

  // 处理表单提交
  const onFinish = (values) => {
    console.log('表单数据:', values);
    console.log('标签:', tags);
    console.log('文件列表:', fileList);
    console.log('图片列表:', imageList);

    message.success('资源上传成功！');
    // 这里应该是实际的API调用
  };

  // 下一步
  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  // 上一步
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* 步骤指示器 */}
        <CustomCard className="mb-6">
          <CustomCardContent>
            <Steps current={currentStep} className="custom-steps">
              {steps.map((item, index) => (
                <Steps.Step key={index} title={item.title} description={item.description} />
              ))}
            </Steps>
          </CustomCardContent>
        </CustomCard>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="space-y-6"
        >
          {/* 第一步：基本信息 */}
          {currentStep === 0 && (
            <CustomCard>
              <CustomCardTitle>基本信息</CustomCardTitle>
              <CustomCardContent>
                <div className="space-y-6">
                  {/* 资源类型选择 */}
                  <div className="flex space-x-4 mb-6">
                    <button
                      type="button"
                      onClick={() => setResourceType('resource')}
                      className={`flex-1 py-3 px-4 rounded-lg border-2 text-center transition-all ${resourceType === 'resource'
                        ? 'border-gray-800 bg-gray-800 text-white'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                        }`}
                    >
                      <FileOutlined className="text-lg mb-2 block" />
                      <div className="font-medium">上传资源</div>
                      <div className="text-sm opacity-80">设计素材、图纸、文档等</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setResourceType('course')}
                      className={`flex-1 py-3 px-4 rounded-lg border-2 text-center transition-all ${resourceType === 'course'
                        ? 'border-gray-800 bg-gray-800 text-white'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                        }`}
                    >
                      <VideoCameraOutlined className="text-lg mb-2 block" />
                      <div className="font-medium">上传课程</div>
                      <div className="text-sm opacity-80">视频课程、教程等</div>
                    </button>
                  </div>

                  <Row gutter={16}>
                    <Col span={24}>
                      <Form.Item
                        name="title"
                        label="标题"
                        rules={[{ required: true, message: '请输入资源标题' }]}
                      >
                        <Input
                          size="large"
                          placeholder="请输入资源标题"
                          className="border-gray-300 hover:border-gray-400 focus:border-gray-500"
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={24}>
                      <Form.Item
                        name="description"
                        label="描述"
                        rules={[{ required: true, message: '请输入资源描述' }]}
                      >
                        <TextArea
                          rows={4}
                          placeholder="详细描述资源的内容、特点和使用方法"
                          className="border-gray-300 hover:border-gray-400 focus:border-gray-500 resize-none"
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="category"
                        label="主分类"
                        rules={[{ required: true, message: '请选择主分类' }]}
                      >
                        <Select
                          placeholder="选择主分类"
                          className="border-gray-300 hover:border-gray-400"
                        >
                          {CATEGORY_OPTIONS.map(category => (
                            <Option key={category.value} value={category.value}>
                              {category.label}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="subCategory"
                        label="子分类"
                        rules={[{ required: true, message: '请选择子分类' }]}
                      >
                        <Select
                          placeholder="选择子分类"
                          className="border-gray-300 !bg-white hover:border-gray-400"
                        >
                          {CATEGORY_OPTIONS.flatMap(cat =>
                            cat.children?.map(sub => (
                              <Option key={sub.value} value={sub.value}>
                                {sub.label}
                              </Option>
                            ))
                          )}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="field"
                        label="专业领域"
                        rules={[{ required: true, message: '请选择专业领域' }]}
                      >
                        <Select
                          placeholder="选择专业领域"
                          className="border-gray-300 hover:border-gray-400"
                        >
                          {FIELD_OPTIONS.map(field => (
                            <Option key={field} value={field}>
                              {field}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="software"
                        label="适用软件"
                      >
                        <Select
                          mode="multiple"
                          placeholder="选择适用软件"
                          className="border-gray-300 hover:border-gray-400"
                        >
                          {SOFTWARE_OPTIONS.map(software => (
                            <Option key={software} value={software}>
                              {software}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>

                  {/* 标签输入 */}
                  <Form.Item label="标签">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {tags.map(tag => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 border border-gray-300"
                        >
                          {tag}
                          <DeleteOutlined
                            className="ml-1 cursor-pointer hover:text-red-500"
                            onClick={() => handleTagRemove(tag)}
                          />
                        </span>
                      ))}
                    </div>
                    {inputVisible ? (
                      <Input
                        type="text"
                        size="small"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onBlur={handleInputConfirm}
                        onPressEnter={handleInputConfirm}
                        className="w-32"
                      />
                    ) : (
                      <Button
                        size="small"
                        type="dashed"
                        icon={<PlusOutlined />}
                        onClick={showInput}
                        className="border-gray-300 text-gray-600 hover:border-gray-400"
                      >
                        添加标签
                      </Button>
                    )}
                  </Form.Item>
                </div>
              </CustomCardContent>
            </CustomCard>
          )}

          {/* 第二步：文件上传 */}
          {currentStep === 1 && (
            <CustomCard>
              <CustomCardTitle>文件上传</CustomCardTitle>
              <CustomCardContent>
                <div className="space-y-6">
                  {/* 主文件上传 */}
                  <Form.Item
                    label={resourceType === 'course' ? '课程文件/视频' : '资源文件'}
                    rules={[{ required: true, message: '请上传文件' }]}
                  >
                    <Dragger
                      {...uploadProps}
                      className="border-2 border-dashed border-gray-300 hover:border-gray-400 bg-gray-50"
                    >
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined className="text-3xl text-gray-400" />
                      </p>
                      <p className="ant-upload-text text-gray-700">
                        点击或拖拽文件到此处上传
                      </p>
                      <p className="ant-upload-hint text-gray-500">
                        {resourceType === 'course'
                          ? '支持视频文件格式，建议大小不超过2GB'
                          : '支持各种设计文件格式，建议大小不超过500MB'
                        }
                      </p>
                    </Dragger>
                  </Form.Item>

                  {/* 预览图片上传 */}
                  <Form.Item label="预览图片">
                    <Dragger
                      {...imageUploadProps}
                      className="border-2 border-dashed border-gray-300 hover:border-gray-400 bg-gray-50"
                    >
                      <p className="ant-upload-drag-icon">
                        <PictureOutlined className="text-3xl text-gray-400" />
                      </p>
                      <p className="ant-upload-text text-gray-700">
                        点击或拖拽图片到此处上传
                      </p>
                      <p className="ant-upload-hint text-gray-500">
                        支持JPG、PNG等图片格式，用于资源预览展示
                      </p>
                    </Dragger>
                  </Form.Item>

                  {/* 课程特有字段 */}
                  {resourceType === 'course' && (
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          name="duration"
                          label="课程时长（分钟）"
                        >
                          <InputNumber
                            min={1}
                            placeholder="请输入课程时长"
                            className="w-full border-gray-300 hover:border-gray-400"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name="difficulty"
                          label="难度级别"
                        >
                          <Select
                            placeholder="选择难度级别"
                            className="border-gray-300 hover:border-gray-400"
                          >
                            <Option value="beginner">初级</Option>
                            <Option value="intermediate">中级</Option>
                            <Option value="advanced">高级</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                  )}
                </div>
              </CustomCardContent>
            </CustomCard>
          )}

          {/* 第三步：权限设置 */}
          {currentStep === 2 && (
            <CustomCard>
              <CustomCardTitle>权限设置</CustomCardTitle>
              <CustomCardContent>
                <div className="space-y-6">
                  <Form.Item
                    name="priceType"
                    label="资源权限"
                    rules={[{ required: true, message: '请选择资源权限' }]}
                  >
                    <Select
                      placeholder="选择资源权限类型"
                      className="border-gray-300 hover:border-gray-400"
                    >
                      {PRICE_OPTIONS.map(option => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, currentValues) =>
                      prevValues.priceType !== currentValues.priceType
                    }
                  >
                    {({ getFieldValue }) =>
                      getFieldValue('priceType') === 'points' ? (
                        <Form.Item
                          name="points"
                          label="积分数量"
                          rules={[{ required: true, message: '请输入积分数量' }]}
                        >
                          <InputNumber
                            min={1}
                            placeholder="请输入积分数量"
                            className="w-full border-gray-300 hover:border-gray-400"
                          />
                        </Form.Item>
                      ) : null
                    }
                  </Form.Item>

                  <Form.Item
                    name="allowDownload"
                    label="允许下载"
                    valuePropName="checked"
                  >
                    <Switch className="bg-gray-300" />
                  </Form.Item>

                  <Form.Item
                    name="allowComment"
                    label="允许评论"
                    valuePropName="checked"
                    initialValue={true}
                  >
                    <Switch className="bg-gray-300" />
                  </Form.Item>

                  <Form.Item
                    name="isPublic"
                    label="公开显示"
                    valuePropName="checked"
                    initialValue={true}
                  >
                    <Switch className="bg-gray-300" />
                  </Form.Item>
                </div>
              </CustomCardContent>
            </CustomCard>
          )}

          {/* 第四步：确认提交 */}
          {currentStep === 3 && (
            <CustomCard>
              <CustomCardTitle>确认提交</CustomCardTitle>
              <CustomCardContent>
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="font-medium text-gray-800 mb-3">上传信息概览</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>资源类型:</span>
                        <span className="text-gray-800">{resourceType === 'resource' ? '设计资源' : '课程资源'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>文件数量:</span>
                        <span className="text-gray-800">{fileList.length} 个文件</span>
                      </div>
                      <div className="flex justify-between">
                        <span>预览图片:</span>
                        <span className="text-gray-800">{imageList.length} 张图片</span>
                      </div>
                      <div className="flex justify-between">
                        <span>标签数量:</span>
                        <span className="text-gray-800">{tags.length} 个标签</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-800 mb-2">上传须知</h4>
                    <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                      <li>请确保上传的内容符合相关法律法规</li>
                      <li>请勿上传侵犯他人知识产权的资源</li>
                      <li>资源审核通常需要1-3个工作日</li>
                      <li>通过审核的资源将会在平台上展示</li>
                    </ul>
                  </div>

                  <Form.Item
                    name="agreement"
                    valuePropName="checked"
                    rules={[{ required: true, message: '请阅读并同意上传协议' }]}
                  >
                    <div className="flex items-start space-x-2">
                      <input type="checkbox" className="mt-1" />
                      <span className="text-sm text-gray-600">
                        我已阅读并同意
                        <a href="#" className="text-gray-800 hover:underline ml-1">《资源上传协议》</a>
                        和
                        <a href="#" className="text-gray-800 hover:underline ml-1">《版权声明》</a>
                      </span>
                    </div>
                  </Form.Item>
                </div>
              </CustomCardContent>
            </CustomCard>
          )}

          {/* 导航按钮 */}
          <div>
            <CustomCardContent>
              <div className="flex justify-between">
                <div>
                  {currentStep > 0 && (
                    <Button
                      type='primary'
                      onClick={prevStep}
                      className="border-gray-300 text-gray-600 hover:border-gray-400"
                    >
                      上一步
                    </Button>
                  )}
                </div>
                <div className="flex space-x-3">
                  {currentStep < steps.length - 1 ? (
                    <Button
                      type='primary'
                      onClick={nextStep}
                      className="bg-gray-800 hover:bg-gray-700 border-gray-800 text-white"
                    >
                      下一步
                    </Button>
                  ) : (
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="bg-gray-800 hover:bg-gray-700 border-gray-800 text-white"
                    >
                      提交资源
                    </Button>
                  )}
                </div>
              </div>
            </CustomCardContent>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default UploadResource;