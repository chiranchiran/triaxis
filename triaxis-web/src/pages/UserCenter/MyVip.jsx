import { Button, Col, Progress, Row } from "antd";
import {
  UserOutlined,
  CrownOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import { ItemLayout, SecondTitle } from ".";
import { SubmitConfirmButton } from "../../components/Mymodal";
export const MyVip = () => {
  const vipTime = "2024-02-15"
  const vipLevel = 0
  const startTime = ""
  const percent = 60;
  const onFinish = () => {

  }
  const Right = ({ icon: Icon, title, description }) => {
    return (
      <Col span={8}>
        <div className="text-center p-4 bg-main rounded-lg border border-main">
          <Icon className="text-2xl mb-3" />
          <div className="text-lg font-semibold">{title}</div>
          <div className="text-sm text-secondary">{description}</div>
        </div>
      </Col>
    )
  }

  return (
    <ItemLayout label="会员中心">
      <div className="bg-orange-light p-6 rounded-lg border border-orange-dark flex items-center justify-between gap-20">
        <div className="flex-1">
          <h3 className="text-xl font-bold">普通会员</h3>
          <p className="text-secondary mt-2 mb-4">剩余 15 天，享受基础权益</p>
          <Progress percent={percent} strokeColor="#fab18aff" />
          <div className="text-sm text-secondary mt-2">会员有效期至 {vipTime}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-vip mb-2">¥298/年</div>
          <SubmitConfirmButton onConfirm={onFinish} className="w-30">
            立即续费
          </SubmitConfirmButton>
        </div>
      </div>
      <SecondTitle label="会员权益">
        <Row gutter={16}>
          <Right title="专属课程" description="会员专享精品课程" icon={CrownOutlined} />
          <Right title="资源下载" description="无限量资源下载" icon={DownloadOutlined} />
          <Right title="帖子热度" description="发帖获得更高热度" icon={UserOutlined} />
        </Row>
      </SecondTitle>
    </ItemLayout>
  );
};