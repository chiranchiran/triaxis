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
  Anchor
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

  // 构建分类树数据
  const categoryTreeData = useMemo(() => {
    const mockSecondary = {
      1: [{ id: 11, name: '参考图' }, { id: 12, name: '分析图' }],
      2: [{ id: 21, name: 'PS素材' }, { id: 22, name: '贴图材质' }],
      3: [{ id: 31, name: '建筑图纸' }, { id: 32, name: '规划图纸' }],
      4: [{ id: 41, name: '规划课程' }, { id: 42, name: '建筑课程' }]
    };

    return types.categoriesFirst?.map(category => ({
      title: category.name,
      value: category.id,
      key: category.id,
      children: mockSecondary[category.id]?.map(sub => ({
        title: sub.name,
        value: sub.id,
        key: sub.id
      }))
    })) || [];
  }, [types.categoriesFirst]);

  // 锚点导航
  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  return (
    <div className="max-w-7xl mx-auto py-8">
      <CustomCard className="flex gap-8">
        {/* 左侧时间线导航 */}
        <Anchor
          affix={false}
          items={[
            {
              key: '1',
              href: '#anchor-demo-basic',
              title: 'Basic demo',
            },
            {
              key: '2',
              href: '#anchor-demo-static',
              title: 'Static demo',
            },
            {
              key: '3',
              href: '#api',
              title: 'API',
              children: [
                {
                  key: '4',
                  href: '#anchor-props',
                  title: 'Anchor Props',
                },
                {
                  key: '5',
                  href: '#link-props',
                  title: 'Link Props',
                },
              ],
            },
          ]}
        />
        {/* <div className="w-56 flex-shrink-0">
            <div className="sticky top-4">
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3">上传内容</h2>
                <Radio.Group
                  value={resourceType}
                  onChange={(e) => setResourceType(e.target.value)}
                  size="small"
                  buttonStyle="solid"
                >
                  <Radio.Button value="resource">资源</Radio.Button>
                  <Radio.Button value="course">课程</Radio.Button>
                </Radio.Group>
              </div>

              <Timeline>
                <Timeline.Item dot={<FileTextOutlined className="text-blue-500" />}>
                  <button
                    onClick={() => scrollToSection('basic-info')}
                    className="text-left hover:text-blue-600 transition-colors"
                  >
                    基本信息
                  </button>
                </Timeline.Item>
                <Timeline.Item dot={<FolderOutlined className="text-green-500" />}>
                  <button
                    onClick={() => scrollToSection('category-info')}
                    className="text-left hover:text-green-600 transition-colors"
                  >
                    分类设置
                  </button>
                </Timeline.Item>
                <Timeline.Item dot={<PaperClipOutlined className="text-purple-500" />}>
                  <button
                    onClick={() => scrollToSection('file-upload')}
                    className="text-left hover:text-purple-600 transition-colors"
                  >
                    文件上传
                  </button>
                </Timeline.Item>
                <Timeline.Item dot={<InboxOutlined className="text-orange-500" />}>
                  <button
                    onClick={() => scrollToSection('submit-section')}
                    className="text-left hover:text-orange-600 transition-colors"
                  >
                    提交确认
                  </button>
                </Timeline.Item>
              </Timeline>
            </div>
          </div> */}

        {/* 右侧表单内容 */}
        <div className="flex-1">
          <Form
            form={form}
            variant="outlined"
            style={{ maxWidth: 600 }}
          >

            <Form.Item label="Input" name="Input" rules={[{ required: true, message: 'Please input!' }]}>
              <Input />
            </Form.Item>

            <Form.Item
              label="InputNumber"
              name="InputNumber"
              rules={[{ required: true, message: 'Please input!' }]}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              label="TextArea"
              name="TextArea"
              rules={[{ required: true, message: 'Please input!' }]}
            >
              <Input.TextArea />
            </Form.Item>

            <Form.Item
              label="Mentions"
              name="Mentions"
              rules={[{ required: true, message: 'Please input!' }]}
            >
              <Mentions />
            </Form.Item>

            <Form.Item
              label="Select"
              name="Select"
              rules={[{ required: true, message: 'Please input!' }]}
            >
              <Select />
            </Form.Item>

            <Form.Item
              label="Cascader"
              name="Cascader"
              rules={[{ required: true, message: 'Please input!' }]}
            >
              <Cascader />
            </Form.Item>

            <Form.Item
              label="TreeSelect"
              name="TreeSelect"
              rules={[{ required: true, message: 'Please input!' }]}
            >
              <TreeSelect />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
            <Form.Item label="上传类型">
              <Radio.Group>
                <Radio value="资源"> 资源 </Radio>
                <Radio value="课程"> 课程 </Radio>
              </Radio.Group>
            </Form.Item>
          </Form>




          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className="space-y-8"
          >
            {/* 基本信息 */}
            <section id="basic-info" className="scroll-mt-8">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <FileTextOutlined className="mr-2" />
                基本信息
              </h3>

              <Row gutter={16}>
                <Col span={24}>

                  <Form.Item label="上传类型" name="type" layout="horizontal"
                    rules={[{ required: true, message: '请选择上传的类型' }]}>
                    <Radio.Group size="large" defaultValue={1}>
                      <Radio value={1}> 资源 </Radio>
                      <Radio value={2}> 课程 </Radio>
                    </Radio.Group>
                  </Form.Item>

                  <Form.Item
                    name="title"
                    label="标题"
                    rules={[{ required: true, message: '请输入标题' }]}
                  >
                    <Input placeholder="请输入资源标题" />
                  </Form.Item>
                </Col>
              </Row>

              {resourceType === 'course' && (
                <Row gutter={16}>
                  <Col span={24}>
                    <Form.Item
                      name="subtitle"
                      label="副标题"
                    >
                      <Input placeholder="请输入副标题" />
                    </Form.Item>
                  </Col>
                </Row>
              )}

              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    name="description"
                    label="描述"
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
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    name="details"
                    label="资源详情"
                  >
                    <MDEditor
                      height={200}
                      preview="edit"
                      data-color-mode="light"
                    />
                  </Form.Item>
                </Col>
              </Row>

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
            </section>

            <Divider />

            {/* 分类设置 */}
            <section id="category-info" className="scroll-mt-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FolderOutlined className="text-green-500 mr-2" />
                分类设置
              </h3>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="subjectId"
                    label="学科分类"
                    rules={[{ required: true, message: '请选择学科分类' }]}
                  >
                    <Select placeholder="选择学科分类">
                      {types.subjects?.map(subject => (
                        <Option key={subject.id} value={subject.id}>
                          {subject.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    name="right"
                    label="访问权限"
                    rules={[{ required: true, message: '请选择访问权限' }]}
                  >
                    <Select placeholder="选择访问权限">
                      <Option value={1}>免费</Option>
                      <Option value={2}>积分兑换</Option>
                      <Option value={3}>VIP专享</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                noStyle
                shouldUpdate={(prev, current) => prev.right !== current.right}
              >
                {({ getFieldValue }) =>
                  getFieldValue('right') === 2 && (
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          name="price"
                          label="所需积分"
                          rules={[{ required: true, message: '请输入积分' }]}
                        >
                          <InputNumber
                            min={1}
                            placeholder="输入积分数量"
                            className="w-full"
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  )
                }
              </Form.Item>

              {resourceType === 'resource' && (
                <>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="toolIds"
                        label="工具分类"
                      >
                        <Select
                          mode="multiple"
                          placeholder="选择工具"
                        >
                          {types.tools?.map(tool => (
                            <Option key={tool.id} value={tool.id}>
                              {tool.name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    name="categories"
                    label="资源分类"
                  >
                    <TreeSelect
                      treeData={categoryTreeData}
                      placeholder="选择分类"
                      treeCheckable
                      showCheckedStrategy={TreeSelect.SHOW_ALL}
                    />
                  </Form.Item>
                </>
              )}

              {resourceType === 'course' && (
                <>
                  <Row gutter={16}>
                    <Col span={12}>
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
                    </Col>
                    <Col span={12}>
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
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={12}>
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
                    </Col>
                  </Row>
                </>
              )}
            </section>

            <Divider />

            {/* 文件上传 */}
            <section id="file-upload" className="scroll-mt-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <PaperClipOutlined className="text-purple-500 mr-2" />
                文件上传
              </h3>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="封面图片"
                    rules={[{ required: true, message: '请上传封面' }]}
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
                </Col>

                <Col span={12}>
                  <Form.Item label="预览图片">
                    <ImgCrop aspect={16 / 9} rotationSlider>
                      <Upload
                        {...imageUploadProps}
                        maxCount={5}
                      >
                        <div>
                          <PlusOutlined />
                          <div style={{ marginTop: 8 }}>上传预览图</div>
                        </div>
                      </Upload>
                    </ImgCrop>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label={resourceType === 'course' ? '课程文件' : '资源文件'}
                rules={[{ required: true, message: '请上传文件' }]}
              >
                <Dragger
                  {...fileUploadProps(resourceType === 'resource')}
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    点击或拖拽文件到此处上传
                  </p>
                  <p className="ant-upload-hint">
                    {resourceType === 'course'
                      ? '支持视频格式，单个文件不超过2GB'
                      : '支持多种格式，可上传多个文件'
                    }
                  </p>
                </Dragger>
              </Form.Item>
            </section>

            <Divider />

            {/* 提交确认 */}
            <section id="submit-section" className="scroll-mt-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <InboxOutlined className="text-orange-500 mr-2" />
                提交确认
              </h3>

              <div className="bg-gray-50 p-4 rounded mb-4">
                <h4 className="font-medium mb-2">上传须知</h4>
                <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
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
            </section>
          </Form>
        </div>

      </CustomCard>
    </div>
  );
};

export default UploadResource;