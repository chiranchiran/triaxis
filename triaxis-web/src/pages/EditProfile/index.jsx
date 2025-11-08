import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Upload, Typography, Divider, Checkbox } from 'antd';
import { UserOutlined, EditOutlined } from '@ant-design/icons';
import { MyButton } from '../../components/MyButton';
import { ResetConfirmButton, SubmitConfirmButton } from '../../components/Mymodal';
import { UploadFiles } from '../../components/UploadFiles';
import { normFile, getFile, isArrayValid } from '../../utils/error/commonUtil';
import { logger } from '../../utils/logger';
import { useGetResourceTypes } from '../../hooks/api/resources';
import { useGetUser } from '../../hooks/api/user';

const { Text, Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const EditProfile = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  /**
   * @description 数据获取
   */
  const { data: user = {} } = useGetUser();
  const { data: resourceTypes = {}, isError: resourceTypesError } = useGetResourceTypes();
  const { subjects = [] } = resourceTypes || {}
  // 初始化表单值
  useEffect(() => {
    form.setFieldsValue({
      username: user.username || '',
      realName: user.realName || '',
      gender: user.gender || 0,
      school: user.school || '',
      major: user.major || '',
      grade: user.grade || '',
      subject: user.subject || '',
      bio: user.bio || '',
      avatar: user.avatar ? [{ url: user.avatar, status: 'done' }] : [],
    });
    // 初始化头像文件列表
    if (user.avatar) {
      setFileList([{ url: user.avatar, status: 'done' }]);
    }
  }, [form, user]);

  // 表单提交逻辑
  const onFinish = () => {
    form.validateFields().then((values) => {
      logger.debug('编辑个人资料提交数据:', values);
      // 处理提交数据
      const submitData = {
        ...user,
        username: values.username,
        realName: values.realName,
        gender: values.gender,
        school: values.school,
        major: values.major,
        grade: values.grade,
        subject: values.subject,
        bio: values.bio,
        // 处理头像（如果有新上传）
        avatar: values.avatar && values.avatar.length > 0
          ? getFile(values.avatar)[0]
          : user.avatar,
      };
      setIsSuccess(true);
    }).catch((error) => {
      logger.error('表单验证失败:', error);
    });
  };

  // 重置表单
  const formReset = () => {
    form.resetFields();
    setFileList(user.avatar ? [{ url: user.avatar, status: 'done' }] : []);
  };

  return (
    <section>
      {/* 顶部渐变背景*/}
      <div className="bg-gradient-to-white h-72 uploadResource">
        <div className="max-w-5xl mx-auto px-2 text-lg">
          <Title level={3} className="text-3xl font-semibold pt-10 mb-3 flex items-center">
            编辑个人资料
          </Title>
          <EditOutlined className="mr-2" /> 完善您的个人信息，提升账号可信度
        </div>
      </div>

      {/* 中间白色卡片*/}
      <div className="-mt-36 max-w-5xl mx-auto px-8 bg-card pt-6 py-2 mb-10 rounded-xl shadow-lg">
        <Form
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 20 }}
          form={form}
          layout="horizontal"
          onFinish={onFinish}
          className="space-y-8"
          initialValues={{
            ...user,
            subject: subjects.find(i => i.name === user.subject)?.id
          }}
        >
          {/* 1. 用户名 */}
          <Form.Item
            name="username"
            label="用户名"
            rules={[
              { required: true, message: "请输入用户名" },
              {
                min: 6,
                message: "不能少于6位"
              }, {
                max: 16,
                message: "不能超过16位"
              },
              {
                pattern: /^\w{6,16}$/,
                message: '必须是6-16位小写字母、大写字母、数字或下划线'
              }
            ]}
          >
            <Input placeholder="请输入用户名（最多20字）" className="max-w-120" />
          </Form.Item>


          {/* 3. 性别 */}
          <Form.Item
            name="gender"
            label="性别"
            rules={[{ required: true, message: '请选择性别' }]}
          >
            <Select placeholder="选择性别" className="max-w-40">
              <Option value={0}>未知</Option>
              <Option value={1}>男</Option>
              <Option value={2}>女</Option>
            </Select>
          </Form.Item>

          {/* 4. 学校 */}
          <Form.Item
            name="school"
            label="学校"
            rules={[{ max: 30, message: '学校名称不能超过30字' }]}
          >
            <Input placeholder="请输入学校名称" className="max-w-120" />
          </Form.Item>

          {/* 5. 专业 */}
          <Form.Item
            name="major"
            label="专业"
            rules={[{ max: 30, message: '专业名称不能超过30字' }]}
          >
            <Input placeholder="请输入专业名称" className="max-w-120" />
          </Form.Item>

          {/* 6. 年级 */}
          <Form.Item
            name="grade"
            label="年级"
          >
            <Select placeholder="选择年级" className="max-w-40">
              <Option value="大一">大一</Option>
              <Option value="大二">大二</Option>
              <Option value="大三">大三</Option>
              <Option value="大四">大四</Option>
              <Option value="大五">大五</Option>
              <Option value="研一">研一</Option>
              <Option value="研二">研二</Option>
              <Option value="研三">研三</Option>
              <Option value="博士生">博士生</Option>
              <Option value="学生">学生</Option>
              <Option value="老师">老师</Option>
              <Option value="工作职员">工作职员</Option>
              <Option value="其他">其他</Option>
            </Select>
          </Form.Item>

          {/* 7. 研究领域 */}
          <Form.Item
            name="subject"
            label="研究领域"
            rules={[
              { required: true, message: '请选择研究领域' },]}
          >
            <Select placeholder="选择研究领域" className="max-w-40">
              {
                isArrayValid(subjects) && subjects.map(i => (
                  <Option value={i.id}>{i.name}</Option>
                ))
              }
            </Select>
          </Form.Item>

          {/* 8. 个人简介 */}
          <Form.Item
            name="bio"
            label="个人简介"
            rules={[{ max: 500, message: '个人简介不能超过500字' }]}
          >
            <TextArea
              rows={4}
              placeholder="请输入个人简介"
              showCount
              maxLength={500}
            />
          </Form.Item>

          {/* 9. 头像上传 */}
          <Form.Item
            label="头像"
            name="avatar"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[
              ({ getFieldValue }) => ({
                validator(_, fileList) {
                  const hasUnfinishedFile = fileList && fileList.some(i => i.status !== 'done');
                  if (hasUnfinishedFile) {
                    return Promise.reject(new Error('请移除未上传成功的图片'));
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <UploadFiles
              type={3}
            />
          </Form.Item>

          <Divider className="bg-gray my-8" />

          {/* 底部按钮 */}
          <div className="flex justify-between mb-4 mx-32">
            <div className="flex gap-4">
              <SubmitConfirmButton onConfirm={onFinish}>
                提交
              </SubmitConfirmButton>
            </div>
            <ResetConfirmButton onConfirm={formReset}>
              重置
            </ResetConfirmButton>
          </div>
        </Form>
      </div>
    </section>
  );
};

export default EditProfile;