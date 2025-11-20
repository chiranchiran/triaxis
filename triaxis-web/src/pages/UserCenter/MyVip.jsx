import { Button, Col, Progress, Row } from "antd";
import { UserOutlined, CrownOutlined, DownloadOutlined, LockOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { ItemLayout, SecondTitle } from ".";
import { SubmitConfirmButton } from "../../components/Mymodal";
import { useGetUserVip } from "../../hooks/api/user";

const MyVip = () => {
  /**
   * @description 数据获取
   */
  const { data: userVip = {} } = useGetUserVip();
  const { vipTime = "", vipLevel = 0, vipStart = "" } = userVip;

  // 核心逻辑：计算会员状态、剩余天数、进度条百分比 
  // 格式化时间（兼容空值）
  const startDate = dayjs(vipStart).isValid() ? dayjs(vipStart) : null;
  const endDate = dayjs(vipTime).isValid() ? dayjs(vipTime) : null;
  const now = dayjs();

  // 判断会员是否有效（已开通且未过期）
  const isVipValid = vipLevel > 0 && startDate && endDate && now.isBefore(endDate);

  // 计算剩余天数（仅有效会员）
  const remainingDays = isVipValid
    ? Math.max(0, endDate.diff(now, 'day'))
    : 0;

  // 计算进度条百分比（已用时长/总时长 * 100）
  const getPercent = () => {
    if (!isVipValid || !startDate || !endDate) return 0;
    const totalDays = endDate.diff(startDate, 'day'); // 总有效期天数
    const usedDays = now.diff(startDate, 'day'); // 已使用天数
    return totalDays > 0 ? Math.min(100, Math.round((usedDays / totalDays) * 100)) : 0;
  };
  const percent = getPercent();

  //按钮事件
  const handleOpenOrRenew = () => {
    // 统一处理「开通会员」和「续费」逻辑（跳转支付/会员套餐页）
    console.log(isVipValid ? "触发续费逻辑" : "触发开通会员逻辑");
  };

  // 权益项组件（兼容已开通/未开通状态）
  const Right = ({ icon: Icon, title, description, isLocked }) => {
    return (
      <Col span={8}>
        <div className={`text-center p-4 rounded-lg border ${isLocked ? 'bg-gray-50 border-gray-200' : 'bg-main border-main'}`}>
          {isLocked ? (
            <LockOutlined className="text-2xl mb-3 text-gray-400" />
          ) : (
            <Icon className="text-2xl mb-3" />
          )}
          <div className={`text-lg font-semibold ${isLocked ? 'text-gray-400' : ''}`}>{title}</div>
          <div className={`text-sm ${isLocked ? 'text-gray-400' : 'text-secondary'}`}>
            {isLocked ? '开通会员解锁' : description}
          </div>
        </div>
      </Col>
    );
  };

  return (
    <ItemLayout label="会员中心">
      {/* 头部会员状态区域（区分已开通/未开通） */}
      {isVipValid ? (
        // 已开通会员界面
        <div className="bg-orange-light p-6 rounded-lg border border-orange-dark flex items-center justify-between gap-20">
          <div className="flex-1">
            <h3 className="text-xl font-bold">
              {vipLevel === 1 ? "普通会员" : vipLevel === 2 ? "高级会员" : "VIP会员"}
            </h3>
            <p className="text-secondary mt-2 mb-4">
              剩余 {remainingDays} 天，享受专属权益
            </p>
            <Progress percent={percent} strokeColor="#fab18aff" />
            <div className="text-sm text-secondary mt-2">
              会员有效期：{startDate.format('YYYY-MM-DD')} - {endDate.format('YYYY-MM-DD')}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-vip mb-2">¥298/年</div>
            <SubmitConfirmButton
              onConfirm={handleOpenOrRenew}
              className="w-30"
            >
              立即续费
            </SubmitConfirmButton>
          </div>
        </div>
      ) : (
        // 未开通会员界面
        <div className="bg-main p-6 rounded-lg border border-secondary flex flex-col items-center justify-center text-center">
          <div className="text-3xl text-vip mb-4 flex gap-1">
            <CrownOutlined className="text-4xl" />VIP
            <span className="ml-4">¥298/年</span>

          </div>
          <h3 className="text-xl font-bold mb-2">尚未开通会员</h3>
          <p className="text-secondary mb-6 max-w-md">
            开通会员即可享受专属课程、无限量资源下载、帖子高热度等特权，助力高效学习
          </p>
          <SubmitConfirmButton
            onConfirm={handleOpenOrRenew}
            className="w-40"
          >
            立即开通会员
          </SubmitConfirmButton>
        </div>
      )}

      {/* 会员权益区域 */}
      <SecondTitle label="会员权益">
        <Row gutter={16}>
          <Right
            title="专属课程"
            description="会员专享精品课程"
            icon={CrownOutlined}
            isLocked={!isVipValid}
          />
          <Right
            title="资源下载"
            description="无限量资源下载"
            icon={DownloadOutlined}
            isLocked={!isVipValid}
          />
          <Right
            title="帖子热度"
            description="发帖获得更高热度"
            icon={UserOutlined}
            isLocked={!isVipValid}
          />
        </Row>
      </SecondTitle>
    </ItemLayout>
  );
};
export default MyVip;