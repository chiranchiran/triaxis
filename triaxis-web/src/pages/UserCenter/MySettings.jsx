import { Button, Divider, Form, Input, Modal, Switch } from "antd";
import { useState } from "react";
import { usePreference } from "../../components/usePreference";
import { ButtonOption, ItemLayout, SecondTitle, SwitchOption } from ".";
import { MyButton } from "../../components/MyButton";
import { ResetConfirmButton, SubmitConfirmButton } from "../../components/Mymodal";

export const MySettings = () => {
  const { isDark, isEnglish, changeLanguage, changeTheme } = usePreference()
  const [form] = Form.useForm();
  const [changePasswordVisible, setChangePasswordVisible] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // 确认修改的最终逻辑
  const handleFinalConfirm = async () => {
    try {
      // 修改成功
      setChangePasswordVisible(false);

      setShowConfirm(false);
      formReset();

    } catch (err) {
      message.error("修改失败：" + err.message);
      setShowConfirm(false); // 失败后回到表单
    }
  };
  //重置
  const formReset = () => {
    form.resetFields();
  };
  //取消
  const cancel = () => {
    setChangePasswordVisible(false);
    formReset();
  }
  return (
    <ItemLayout label="我的设置">
      <SecondTitle label="偏好设置">
        <SwitchOption title="深色模式" description="切换明暗主题" checked={isDark} onChange={changeTheme} checkedText="深色" unCheckedText="浅色" />
        <SwitchOption title="语言模式" description="切换中英语言" checked={isEnglish} onChange={changeLanguage} checkedText="英文" unCheckedText="中文" />
      </SecondTitle>
      <SecondTitle label="安全设置">
        <ButtonOption title="登录密码" description="定期更改密码有助于保护账户安全" onClick={() => setChangePasswordVisible(true)} text="修改密码" />
      </SecondTitle>
      <SecondTitle label="隐私设置">
        <SwitchOption title="公开个人信息" description="允许他人查看您的个人资料" defaultChecked={true} />
        <SwitchOption title="公开点赞" description="允许他人查看您的点赞" defaultChecked={false} />
        <SwitchOption title="公开收藏" description="允许他人查看您的收藏" defaultChecked={false} />
        <SwitchOption title="消息通知" description="接收系统消息和更新通知" defaultChecked={true} />
        <SwitchOption title="邮件订阅" description="接收产品更新和促销信息" defaultChecked={false} />
      </SecondTitle>
      {/* 修改密码弹窗 */}
      <Modal
        title="修改密码"
        open={changePasswordVisible}
        onCancel={() => setChangePasswordVisible(false)}
        footer={null}
        className="password"
        width={400}
      >    {!showConfirm ?
        <Form
          layout="vertical"
          form={form}
        >
          <Form.Item
            label="原密码"
            name="oldPassword"
            rules={[{ required: true, message: '请输入原密码' }]}
          >
            <Input.Password placeholder="请输入原密码" />
          </Form.Item>

          <Form.Item
            label="新密码"
            name="newPassword"
            rules={[{ required: true, message: '请输入新密码' },
              , {
              min: 6,
              message: "不能少于6位"
            }, {
              max: 16,
              message: "不能超过20位"
            },
            {
              pattern: /^\w{6,16}$/,
              message: '必须是6-16位小写字母、大写字母、数字或下划线'
            }
            ]}

          >
            <Input.Password placeholder="请输入新密码" />
          </Form.Item>

          <Form.Item
            label="确认新密码"
            name="confirmPassword"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: '请确认新密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="请确认新密码" />
          </Form.Item>
          <div className="flex justify-end gap-3">
            <MyButton onClick={() => setShowConfirm(true)} type="black" htmltype="submit" >
              确认修改
            </MyButton>
            <MyButton onClick={cancel} type="gray" htmltype="button" >
              取消
            </MyButton>
          </div>
        </Form> : (
          <div className="p-4 text-center">
            <div className="text-lg font-medium mb-4">确认修改密码？</div>
            <div className="taxt-secondary mb-6">修改后无法撤销操作，是否继续？</div>
            <div className="flex gap-3">
              <MyButton onClick={() => setShowConfirm(false)} type="gray" size="large" htmltype="button" >
                取消
              </MyButton>
              <MyButton onClick={handleFinalConfirm} type="black" size="large" htmltype="submit" >
                确认修改
              </MyButton>
            </div>
          </div>
        )}
      </Modal>
    </ItemLayout>
  );
};