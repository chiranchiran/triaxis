import React, { useState } from 'react';
import {
  Button,
  Form,
  Input,
  Select,
  message,
  Pagination
} from 'antd';
import {
  SendOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;

const FeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState([
    {
      id: '1',
      content: '网站的搜索功能很好用，但是希望能增加按时间筛选的功能，这样查找历史记录会更方便。',
      type: '功能建议',
      timestamp: '2024-01-15 10:30',
    },
    {
      id: '2',
      content: '界面设计很清新，颜色搭配很舒服！不过加载速度有时候有点慢，希望能优化一下性能。',
      type: '性能优化',
      timestamp: '2024-01-14 16:45',
    },
    {
      id: '3',
      content: '移动端适配做得不错，但是在小屏幕手机上部分按钮有点小，点击不太方便。',
      type: '用户体验',
      timestamp: '2024-01-13 09:20',
    },
    {
      id: '4',
      content: '希望增加深色模式，晚上使用的时候对眼睛更友好，现在的浅色主题在夜间有点刺眼。',
      type: '功能建议',
      timestamp: '2024-01-12 14:20',
    },
    {
      id: '5',
      content: '数据导出功能很好用，但希望能支持更多格式，比如CSV和JSON。',
      type: '功能建议',
      timestamp: '2024-01-11 11:30',
    },
    {
      id: '6',
      content: '页面加载时的动画效果很流畅，提升了用户体验。',
      type: 'UI设计',
      timestamp: '2024-01-10 15:40',
    }
  ]);

  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;

  // 分页数据
  const currentFeedbacks = feedbacks.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      const newFeedback = {
        id: Date.now().toString(),
        content: values.content,
        type: values.type,
        timestamp: new Date().toLocaleString('zh-CN'),
      };

      setFeedbacks(prev => [newFeedback, ...prev]);
      form.resetFields();
      setCurrentPage(1); // 提交后回到第一页
      message.success('反馈提交成功！感谢您的意见！');
    } catch (error) {
      message.error('提交失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  const getTypeColor = (type) => {
    const colorMap = {
      '功能建议': 'bg-blue-100 text-blue-600 border-blue-600',
      'UI设计': 'bg-blue-100 text-blue-600 border-blue-600',
      '性能优化': 'bg-blue-100 text-blue-600 border-blue-600',
      '内容问题': 'bg-blue-100 text-blue-600 border-blue-600',
      '用户体验': 'bg-blue-100 text-blue-600 border-blue-600',
      '其他建议': 'bg-blue-100 text-blue-600 border-blue-600',
    };
    return colorMap[type] || 'bg-blue-100 text-blue-600 border-blue-600';
  };

  const cardStyle = {
    background: 'var(--bg-elevated)',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '16px',
    border: '1px solid var(--border)',
    transition: 'all 0.2s ease'
  };

  const cardHoverStyle = {
    ...cardStyle,
    borderColor: 'var(--border-light)',
    background: 'var(--bg-gray)'
  };

  return (
    <div className="min-h-screen bg-gray">
      <div className="max-w-3xl mx-auto p-6">
        {/* 页面标题 */}
        <div className="text-center mb-10 pt-6">
          <h1 className="text-2xl font-bold text-main mb-3">意见反馈</h1>
          <p className="text-secondary">我们重视您的每一个建议</p>
        </div>

        {/* 反馈表单 */}
        <div
          style={cardStyle}
          className="mb-10"
        >
          <div className="flex items-center gap-2 mb-6">
            <SendOutlined className="text-main text-lg" />
            <h2 className="text-lg font-semibold text-main">提交反馈</h2>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            size="large"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Form.Item
                name="type"
                label="反馈类型"
                rules={[{ required: true, message: '请选择反馈类型' }]}
                className="mb-0"
              >
                <Select
                  placeholder="选择反馈类型"
                  className="w-full"
                >
                  <Option value="功能建议">功能建议</Option>
                  <Option value="UI设计">UI设计</Option>
                  <Option value="性能优化">性能优化</Option>
                  <Option value="内容问题">内容问题</Option>
                  <Option value="用户体验">用户体验</Option>
                  <Option value="其他建议">其他建议</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="content"
                label="反馈内容"
                rules={[
                  { required: true, message: '请输入反馈内容' },
                  { min: 10, message: '至少输入10个字符' },
                  { max: 500, message: '最多输入500个字符' }
                ]}
                className="mb-0 md:col-span-2"
              >
                <TextArea
                  rows={5}
                  placeholder="请详细描述您遇到的问题或建议..."
                  showCount
                  maxLength={500}
                  style={{ resize: 'vertical' }}
                  className="resize-vertical"
                />
              </Form.Item>
            </div>

            <div className="flex justify-end mt-6">
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                className="bg-text-secondary border-text-secondary hover:bg-text-muted hover:border-text-muted h-10 px-8 rounded font-medium"
              >
                {submitting ? '提交中...' : '提交反馈'}
              </Button>
            </div>
          </Form>
        </div>

        {/* 历史反馈记录 */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-main">历史反馈记录</h2>
            <span className="text-sm text-secondary">
              共 {feedbacks.length} 条记录
            </span>
          </div>

          {/* 反馈列表 */}
          <div className="mb-6">
            {currentFeedbacks.map((feedback, index) => (
              <div
                key={feedback.id}
                style={cardStyle}
                className="hover:bg-gray-50 cursor-pointer transition-all duration-200"
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--bg-gray)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--bg-elevated)';
                }}
              >
                <div className="flex flex-col">
                  {/* 反馈类型和时间 */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-xs px-3 py-1 rounded-full border ${getTypeColor(feedback.type)}`}
                    >
                      {feedback.type}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-muted">
                      <ClockCircleOutlined />
                      <span>{feedback.timestamp}</span>
                    </div>
                  </div>

                  {/* 反馈内容 */}
                  <p className="text-main leading-relaxed text-sm whitespace-pre-line">
                    {feedback.content}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* 分页 */}
          {feedbacks.length > pageSize && (
            <div className="flex justify-center">
              <Pagination
                current={currentPage}
                total={feedbacks.length}
                pageSize={pageSize}
                onChange={(page) => setCurrentPage(page)}
                showSizeChanger={false}
                className="custom-pagination"
              />
            </div>
          )}

          {/* 空状态 */}
          {feedbacks.length === 0 && (
            <div style={cardStyle} className="text-center py-12">
              <div className="text-3xl mb-4">💬</div>
              <h3 className="text-main text-lg mb-2">暂无反馈记录</h3>
              <p className="text-muted">提交您的第一条反馈吧</p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .custom-pagination .ant-pagination-item {
          border-radius: 6px;
          border-color: var(--border);
        }
        
        .custom-pagination .ant-pagination-item a {
          color: var(--text-secondary);
        }
        
        .custom-pagination .ant-pagination-item-active {
          border-color: var(--text-secondary);
          background: var(--text-secondary);
        }
        
        .custom-pagination .ant-pagination-item-active a {
          color: white;
        }
        
        .custom-pagination .ant-pagination-prev,
        .custom-pagination .ant-pagination-next {
          border-radius: 6px;
          border-color: var(--border);
        }
        
        .custom-pagination .ant-pagination-prev button,
        .custom-pagination .ant-pagination-next button {
          color: var(--text-secondary);
        }
        
        .resize-vertical {
          resize: vertical;
          min-height: 100px;
        }
      `}</style>
    </div>
  );
};

export default FeedbackPage;