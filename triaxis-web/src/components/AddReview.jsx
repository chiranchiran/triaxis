import React, { useEffect } from 'react'
import { DetailCard } from './DetailCard'
import { Form, Rate } from 'antd'
import { useAddReview } from '../hooks/api/reviews';
import { SubmitConfirmButton } from './Mymodal';
import TextArea from 'antd/es/input/TextArea';

export const AddReview = ({ isPurchased = true, targetId, targetType }) => {
  const [form] = Form.useForm();
  const { mutate, isFetching, isSuccess } = useAddReview();

  useEffect(() => {
    if (isSuccess) {
      form.resetFields();
    }
  }, [isSuccess])

  /**
* @description 事件处理
*/
  // 回复提交
  const submitReview = async (id) => {
    form.validateFields().then(() => {
      const values = form.getFieldsValue();
      logger.debug("初始数据", values);
      const submitData = {
        rate: values.rate,
        content: values.content,
        targetType,
        targetId,
      };

      logger.debug('准备提交数据:', submitData);
      mutate(submitData);
    }).catch((error) => {
      logger.error('表单验证失败:', error);
    });
  };
  return (
    <DetailCard
      title="发表评价"
      className='comment shadow-md overflow-visible h-auto'
    >

      <Form
        form={form}
        layout="vertical"
        className='!pt-4'
      >
        <Form.Item
          name="rate"
          label="评分"
          rules={[{ required: true, message: '请选择评分' }]}
        >
          <Rate className="text-rate" />
        </Form.Item>

        <Form.Item
          name="content"
          label="评价内容"
          rules={[
            { required: false, message: '请输入评价内容' },
          ]}
        >
          <TextArea
            allowClear
            rows={4}
            placeholder="输入您的评价..."
            className="mb-2 !text-base resize-none border border-main rounded transition-colors"
          />
        </Form.Item>
        <div className='flex'>
          <SubmitConfirmButton
            size='middle'
            type="black"
            className="flex-1"
            loading={isFetching || !isPurchased}
            onConfirm={() => submitReview(id)}
          >
            提交评价
          </SubmitConfirmButton>
        </div>
      </Form>
    </DetailCard>
  )
}
