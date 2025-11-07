// UploadResource.jsx
import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
  Form,
  Input,
  Select,
  Upload,
  Tag,
  Row,
  Col,
  InputNumber,
  Radio,
  Divider,
  Checkbox,
  Cascader,
  Typography,
  DatePicker,
} from 'antd';
import {
  FolderOutlined,
} from '@ant-design/icons';
import MDEditor from '@uiw/react-md-editor';
import { MyButton, OrderButton } from '../../components/MyButton';
import { Link } from 'react-router-dom';
import { logger } from '../../utils/logger';
import { ResetConfirmButton, SubmitConfirmButton, useToggleConfirm } from '../../components/Mymodal';
import { UploadFiles } from '../../components/UploadFiles';
import { useGetPostTypes, useUploadPost } from '../../hooks/api/community';
import { getFile } from '../../utils/error/commonUtil';

const { TextArea } = Input;
const { Option } = Select;
const CreatePost = () => {
  const [form] = Form.useForm();
  const toggleModal = useToggleConfirm();
  const { mutate: doUploadPost, isSuccess: postSuccess } = useUploadPost();

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

  /**
 *  获取数据
 */
  //获取学科、主题
  const { data: postTypes = {} } = useGetPostTypes();
  const { subjects = [], topics = [] } = postTypes || {}

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
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
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
      const values = form.getFieldsValue();
      logger.debug("初始数据", values);
      const submitData = {
        status: isSave ? 1 : 2,
        type,
        tags: tags,
        subjectId: values.subjectId,
        topicIds: values.topicIds,
        price: values.price,
        urgency: values.urgency,
        deadline: values.dealine.format('YYYY-MM-DD HH:mm:ss'),
        // 文件路径 - 直接从状态中获取
        files: getFile(values.file),
        images: getFile(values.images),
        // 其他字段
        title: values.title,
        description: values.description,
        context: values.content,
      };

      logger.debug('准备提交数据:', submitData);
      doUploadPost(submitData);
    }).catch((error) => {
      logger.error('表单验证失败:', error);
    });
  };
  //处理成功的表单清除
  useEffect(() => {
    if (postSuccess) {
      formReset();
    }
  }, [postSuccess])

  //重置
  const formReset = () => {
    form.resetFields();
    setFileList([]);
    setTagState({
      tags: [],
      inputValue: ''
    });
  };
  return (
    <section>
      <div className="bg-gradient-to-white h-72 uploadResource">
        <div className="max-w-5xl mx-auto px-2">
          <h3 className="text-3xl font-semibold pt-10 mb-3 flex items-center">帖子信息</h3>
          <div className='flex justify-start gap-2 items-center'>
            <span className='text-lg'> <FolderOutlined /> 请选择帖子的分类：</span>
            <OrderButton
              className="!text-lg"
              handleSortChange={(value) => toggleType(value)} value={type} list={[{ id: 1, name: "普通帖子" }, { id: 2, name: "悬赏贴" }]} />
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
            urgency: 1,
            content: "还没有任何详细介绍,支持Markdown语法编辑~",
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
                    placeholder="简要描述帖子的具体内容（最多50字）"
                    showCount
                    maxLength={50}
                  />
                </Form.Item>
              </>
              {/* 分类设置 */}
              <>
                <Form.Item
                  name="subjectId"
                  label="学科分类"
                  layout="horizontal"
                  rules={[{ required: true, message: '请选择学科分类' }]}
                >
                  <Select placeholder="选择学科分类" className='max-w-40'>
                    {subjects && subjects.map(subject => (
                      <Option key={subject.id} value={subject.id}>
                        {subject.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="topicIds"
                  label="主题分类"
                  rules={[{ required: true, message: '请选择主题分类' }]}
                >
                  <Select
                    mode="multiple"
                    placeholder="选择主题"
                    className="w-auto"
                  >
                    {topics && topics.map(topic => (
                      <Option key={topic.id} value={topic.id}>
                        {topic.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                {type === 2 && (
                  <>
                    <Form.Item
                      name="urgency"
                      label="紧急程度"
                      layout="horizontal"
                      rules={[{ required: true, message: '请选择紧急程度' }]}
                    >
                      <Select placeholder="选择紧急程度" className='max-w-40'>
                        <Option value={1}>一般</Option>
                        <Option value={2}>紧急</Option>
                        <Option value={3}>非常紧急</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name="price"
                      label="悬赏积分"
                      rules={[{ required: true, message: '请输入悬赏积分' }]}
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
                    <Form.Item
                      name="dealine"
                      label="截止日期"
                      rules={[{ type: 'object', required: true, message: '请选择截止日期' }]}
                    >
                      <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" className='max-w-60' onChange={() => { debugger }} />
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
                  label="文件"
                  name="file"
                  valuePropName="fileList"
                  rules={[
                    ({ getFieldValue }) => ({
                      validator(_, fileList) {
                        const hasUnfinishedFile = fileList && fileList.some(i => i.status !== 'done');
                        if (hasUnfinishedFile) {
                          return Promise.reject(new Error('请移除没有上传成功的文件'));
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                  getValueFromEvent={normFile}

                >
                  <UploadFiles fileList={fileList} setFileList={setFileList} type={type} />
                </Form.Item>

                <Form.Item label="图片" name="images" valuePropName="fileList" getValueFromEvent={normFile}
                  rules={[
                    ({ getFieldValue }) => ({
                      validator(_, fileList) {
                        const hasUnfinishedFile = fileList && fileList.some(i => i.status !== 'done');
                        if (hasUnfinishedFile) {
                          return Promise.reject(new Error('请移除没有上传成功的图片'));
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}>
                  <UploadFiles type={4} />
                </Form.Item>
              </>
              {/* 详情介绍 */}
              <Form.Item
                name="content"
                label="帖子内容"
                rules={[
                  { required: true, message: '请输入具体帖子' },
                  { max: 5000, message: '内容不能超过5000字' }
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
                      保存草稿
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

  )
};
export default CreatePost;