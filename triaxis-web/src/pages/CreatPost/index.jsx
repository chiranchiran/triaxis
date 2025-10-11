// CreatePost.jsx
import React, { useState } from 'react';
import {
  Button,
  Form,
  Input,
  Select,
  Tag,
  Divider,
  Row,
  Col,
  message,
  Switch,
  InputNumber,
  Upload,
  Avatar
} from 'antd';
import {
  UploadOutlined,
  PlusOutlined,
  DeleteOutlined,
  TrophyOutlined,
  FileTextOutlined,
  PaperClipOutlined,
  PictureOutlined
} from '@ant-design/icons';
import MDEditor from '@uiw/react-md-editor';

const { TextArea } = Input;
const { Option } = Select;

// 主题分类
const TOPIC_CATEGORIES = [
  { id: 1, name: '学术讨论', icon: '📚', color: 'blue' },
  { id: 2, name: '技术交流', icon: '💻', color: 'green' },
  { id: 3, name: '项目互助', icon: '🤝', color: 'orange' },
  { id: 4, name: '政策解读', icon: '📋', color: 'purple' },
  { id: 5, name: '求职招聘', icon: '💼', color: 'cyan' },
  { id: 6, name: '日常聊天', icon: '💬', color: 'pink' },
  { id: 7, name: '课程交流', icon: '🎓', color: 'red' },
  { id: 8, name: '吐槽专区', icon: '😤', color: 'volcano' }
];

// 专业领域
const PROFESSIONAL_FIELDS = [
  { id: 1, name: '城乡规划' },
  { id: 2, name: '建筑设计' },
  { id: 3, name: '风景园林' },
  { id: 4, name: '地理信息' },
  { id: 5, name: '其他' }
];

// 紧急程度选项
const URGENCY_OPTIONS = [
  { value: 'low', label: '普通', color: 'blue' },
  { value: 'medium', label: '一般', color: 'orange' },
  { value: 'high', label: '紧急', color: 'red' }
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

const CreatePost = () => {
  const [form] = Form.useForm();
  const [postType, setPostType] = useState('normal'); // 'normal' or 'bounty'
  const [tags, setTags] = useState([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [fileList, setFileList] = useState([]);
  const [content, setContent] = useState('**请在此输入您的帖子内容...**\n\n支持 Markdown 语法编辑');
  const [submitting, setSubmitting] = useState(false);

  // 获取主题颜色类名
  const getTopicColorClass = (color) => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-700 border-blue-200',
      green: 'bg-green-100 text-green-700 border-green-200',
      orange: 'bg-orange-100 text-orange-700 border-orange-200',
      purple: 'bg-purple-100 text-purple-700 border-purple-200',
      cyan: 'bg-cyan-100 text-cyan-700 border-cyan-200',
      pink: 'bg-pink-100 text-pink-700 border-pink-200',
      red: 'bg-red-100 text-red-700 border-red-200',
      volcano: 'bg-volcano-100 text-volcano-700 border-volcano-200'
    };
    return colorMap[color] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

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

  // 处理表单提交
  const onFinish = async (values) => {
    setSubmitting(true);
    try {
      // 模拟API调用
      setTimeout(() => {
        console.log('提交数据:', {
          ...values,
          tags,
          content,
          fileList,
          postType
        });

        message.success(postType === 'bounty' ? '悬赏帖发布成功！' : '帖子发布成功！');
        setSubmitting(false);

        // 这里应该是实际的提交逻辑和页面跳转
      }, 1500);
    } catch (error) {
      console.error('发布失败:', error);
      message.error('发布失败，请重试');
      setSubmitting(false);
    }
  };

  // 重置表单
  const handleReset = () => {
    form.resetFields();
    setTags([]);
    setContent('**请在此输入您的帖子内容...**\n\n支持 Markdown 语法编辑');
    setFileList([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* 页面标题 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">发布新帖子</h1>
          <p className="text-gray-600">与社区用户分享您的知识、经验和问题</p>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="space-y-6"
          initialValues={{
            topicId: 1,
            fieldId: 1,
            urgency: 'low',
            bounty: 50,
            allowComments: true,
            isPublic: true
          }}
        >
          {/* 帖子类型选择 */}
          <CustomCard>
            <CustomCardTitle>帖子类型</CustomCardTitle>
            <CustomCardContent>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setPostType('normal')}
                  className={`flex-1 py-4 px-6 rounded-lg border-2 text-center transition-all ${postType === 'normal'
                    ? 'border-orange-300 bg-orange-100 text-black'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                >
                  <FileTextOutlined className="text-2xl mb-3 block mx-auto" />
                  <div className="font-medium text-lg">普通帖子</div>
                  <div className="text-sm opacity-80 mt-1">分享知识、经验、讨论</div>
                </button>
                <button
                  type="button"
                  onClick={() => setPostType('bounty')}
                  className={`flex-1 py-4 px-6 rounded-lg border-2 text-center transition-all ${postType === 'bounty'
                    ? 'border-orange-300 bg-orange-100 text-black'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                >
                  <TrophyOutlined className="text-2xl mb-3 block mx-auto" />
                  <div className="font-medium text-lg">悬赏求助</div>
                  <div className="text-sm opacity-80 mt-1">设置积分奖励寻求帮助</div>
                </button>
              </div>
            </CustomCardContent>
          </CustomCard>

          {/* 基本信息 */}
          <CustomCard>
            <CustomCardTitle>基本信息</CustomCardTitle>
            <CustomCardContent>
              <div className="space-y-6">
                <Row gutter={16}>
                  <Col span={24}>
                    <Form.Item
                      name="title"
                      label="帖子标题"
                      rules={[{ required: true, message: '请输入帖子标题' }]}
                    >
                      <Input
                        size="large"
                        placeholder="请输入清晰明确的标题，吸引更多用户关注"
                        className="border-gray-300 hover:border-gray-400 focus:border-gray-500"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="topicId"
                      label="主题分类"
                      rules={[{ required: true, message: '请选择主题分类' }]}
                    >
                      <Select
                        size="large"
                        placeholder="选择主题分类"
                        className="border-gray-300 hover:border-gray-400"
                      >
                        {TOPIC_CATEGORIES.map(topic => (
                          <Option key={topic.id} value={topic.id}>
                            <span className="flex items-center">
                              <span className="mr-2">{topic.icon}</span>
                              {topic.name}
                            </span>
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="fieldId"
                      label="专业领域"
                      rules={[{ required: true, message: '请选择专业领域' }]}
                    >
                      <Select
                        size="large"
                        placeholder="选择专业领域"
                        className="border-gray-300 hover:border-gray-400"
                      >
                        {PROFESSIONAL_FIELDS.map(field => (
                          <Option key={field.id} value={field.id}>
                            {field.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                {/* 悬赏帖子特有字段 */}
                {postType === 'bounty' && (
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="bounty"
                        label="悬赏积分"
                        rules={[{ required: true, message: '请设置悬赏积分' }]}
                      >
                        <InputNumber
                          min={10}
                          max={1000}
                          size="large"
                          placeholder="设置悬赏积分"
                          className="w-full border-gray-300 hover:border-gray-400"
                          addonAfter="积分"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="urgency"
                        label="紧急程度"
                        rules={[{ required: true, message: '请选择紧急程度' }]}
                      >
                        <Select
                          size="large"
                          placeholder="选择紧急程度"
                          className="border-gray-300 hover:border-gray-400"
                        >
                          {URGENCY_OPTIONS.map(option => (
                            <Option key={option.value} value={option.value}>
                              <span className={`inline-flex items-center px-2 py-1 rounded text-sm ${getTopicColorClass(option.color)}`}>
                                {option.label}
                              </span>
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                )}
              </div>
            </CustomCardContent>
          </CustomCard>

          {/* 内容编辑 */}
          <CustomCard>
            <CustomCardTitle>内容编辑</CustomCardTitle>
            <CustomCardContent>
              <div className="space-y-4">
                <Form.Item
                  name="content"
                  label="帖子内容"
                  rules={[{ required: true, message: '请输入帖子内容' }]}
                >
                  <div className="border border-gray-300 rounded-lg overflow-hidden">
                    <MDEditor
                      value={content}
                      onChange={setContent}
                      height={400}
                      preview="edit"
                      visibleDragbar={false}
                    />
                  </div>
                </Form.Item>

                {/* 编辑器提示 */}
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <div className="text-sm text-blue-700">
                    <div className="font-medium mb-1">编辑提示：</div>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>支持 Markdown 语法，可使用 # 标题、**粗体**、*斜体* 等格式</li>
                      <li>可以插入代码块、图片、链接等丰富内容</li>
                      <li>建议内容清晰明了，便于其他用户理解和回复</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CustomCardContent>
          </CustomCard>

          {/* 附件上传 */}
          <CustomCard>
            <CustomCardTitle>
              <div className="flex items-center">
                <PaperClipOutlined className="mr-2" />
                附件上传
              </div>
            </CustomCardTitle>
            <CustomCardContent>
              <div className="space-y-4">
                <Form.Item
                  label="上传附件"
                  help="支持图片、文档等文件格式，单个文件不超过 10MB"
                >
                  <Upload
                    {...uploadProps}
                    listType="picture"
                    className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors"
                  >
                    <div className="text-center py-8">
                      <UploadOutlined className="text-3xl text-gray-400 mb-2" />
                      <div className="text-gray-600">点击或拖拽文件到此处上传</div>
                      <div className="text-gray-500 text-sm mt-1">
                        支持 JPG, PNG, PDF, DOC, ZIP 等格式
                      </div>
                    </div>
                  </Upload>
                </Form.Item>
              </div>
            </CustomCardContent>
          </CustomCard>

          {/* 标签和设置 */}
          <CustomCard>
            <CustomCardTitle>标签与设置</CustomCardTitle>
            <CustomCardContent>
              <div className="space-y-6">
                {/* 标签输入 */}
                <Form.Item label="帖子标签">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-gray-100 text-gray-700 border border-gray-300"
                      >
                        {tag}
                        <DeleteOutlined
                          className="ml-1 cursor-pointer hover:text-red-500 text-xs"
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
                      className="w-32 border-gray-300"
                      autoFocus
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
                  <div className="text-xs text-gray-500 mt-2">
                    添加相关标签有助于更多人看到您的帖子
                  </div>
                </Form.Item>

                <Divider className="my-4 border-gray-200" />

                {/* 发布设置 */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-800">允许评论</div>
                      <div className="text-sm text-gray-600">其他用户可以对您的帖子进行回复</div>
                    </div>
                    <Form.Item
                      name="allowComments"
                      valuePropName="checked"
                      className="mb-0"
                    >
                      <Switch className="bg-gray-300" defaultChecked />
                    </Form.Item>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-800">公开显示</div>
                      <div className="text-sm text-gray-600">在社区中公开显示您的帖子</div>
                    </div>
                    <Form.Item
                      name="isPublic"
                      valuePropName="checked"
                      className="mb-0"
                    >
                      <Switch className="bg-gray-300" defaultChecked />
                    </Form.Item>
                  </div>

                  {postType === 'bounty' && (
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-800">匿名发布</div>
                        <div className="text-sm text-gray-600">隐藏您的身份信息</div>
                      </div>
                      <Form.Item
                        name="isAnonymous"
                        valuePropName="checked"
                        className="mb-0"
                      >
                        <Switch className="bg-gray-300" />
                      </Form.Item>
                    </div>
                  )}
                </div>
              </div>
            </CustomCardContent>
          </CustomCard>

          {/* 发布预览 */}
          <CustomCard>
            <CustomCardTitle>发布预览</CustomCardTitle>
            <CustomCardContent>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-start space-x-3">
                  <Avatar
                    size={40}
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=user"
                    className="border border-gray-300"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium text-gray-800">您的用户名</span>
                      <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                        Lv.3
                      </span>
                      {postType === 'bounty' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-orange-100 text-orange-700 border border-orange-200">
                          <TrophyOutlined className="mr-1" />
                          悬赏帖
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {form.getFieldValue('title') || '帖子标题将显示在这里'}
                    </h3>

                    <div className="prose prose-sm max-w-none text-gray-700 mb-3">
                      {content ? (
                        <MDEditor.Markdown
                          source={content.length > 150 ? content.substring(0, 150) + '...' : content}
                          style={{ whiteSpace: 'pre-wrap' }}
                        />
                      ) : (
                        '帖子内容预览...'
                      )}
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>刚刚</span>
                      <span>•</span>
                      <span>0 浏览</span>
                      <span>•</span>
                      <span>0 回复</span>
                    </div>
                  </div>
                </div>
              </div>
            </CustomCardContent>
          </CustomCard>

          {/* 操作按钮 */}
          <div>
            <CustomCardContent>
              <div className="flex justify-between items-center">
                <Button
                  onClick={handleReset}
                  className="border-gray-300 text-gray-600 hover:border-gray-400 px-6"
                  size="large"
                >
                  重置
                </Button>

                <div className="flex space-x-3">
                  <Button
                    className="border-gray-300 text-gray-600 hover:border-gray-400 px-6"
                    size="large"
                  >
                    保存草稿
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={submitting}
                    className={`px-8 ${postType === 'bounty' ? 'bg-orange-500 hover:bg-orange-600 border-orange-500' : 'bg-gray-800 hover:bg-gray-700 border-gray-800'}`}
                    size="large"
                  >
                    {submitting ? '发布中...' : (postType === 'bounty' ? '发布悬赏' : '发布帖子')}
                  </Button>
                </div>
              </div>
            </CustomCardContent>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default CreatePost;