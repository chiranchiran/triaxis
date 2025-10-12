// components/Banner/HeroSection.jsx
import React from 'react';
import { Button } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import UrbanPlanningKnowledgeGraph from './KnowledgeGraph';
import Logo from '../../components/Logo';
import MyButton from '../../components/MyButton';

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <section className="min-h-[41rem] items-center bg-light py-8 px-15">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_3fr] gap-24 items-center max-w-8xl mx-auto">

        {/* 左侧文字内容 */}
        <div className="space-y-8">
          <div className="left space-y-3">
            <Logo size="xl" title="三轴线" />
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              服务于各高校的城乡规划专业知识平台，汇聚最新资源、专业课程和行业动态。
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <MyButton
              size='middle'
              onClick={() => navigate('/courses')}
              type="black"
            >
              课程学习
            </MyButton>
            <MyButton
              size='large'
              onClick={() => navigate('/resources')}
              type="white"
              icon={<ArrowRightOutlined />}
            >
              查找资源
            </MyButton>
          </div>
        </div>

        {/* 右侧知识图谱展示 */}

        <div className="max-w-[80rem] max-h-[45rem] aspect-video bg-card rounded-2xl p-8 shadow-xl border border-main">
          <div className="h-[33rem] bg-main rounded-xl">
            <UrbanPlanningKnowledgeGraph />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;