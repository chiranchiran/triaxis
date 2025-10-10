// components/Banner/HeroSection.jsx
import React from 'react';
import { Button } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <section className="min-h-[50rem] flex items-center bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-blue-900">
      <div className="container max-w-10xl mx-auto w-full h-96  ">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_3fr] gap-24 items-center">
          {/* 左侧文字内容 */}
          <div className="space-y-8">
            <div className="left space-y-6">
              <img src="/logo.png" alt="Triaxis" className="w-20 h-20" />
              <span className="text-logo text-6xl font-bold text-gray-900 dark:text-white leading-tight"> 三轴线</span>
              <p className="text-description text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                服务于各高校的城乡规划专业知识平台，汇聚最新资源、专业课程和行业动态。
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                type="primary"
                size="large"
                onClick={() => navigate('/courses')}
                className="h-12 w-32 px-8 text-lg bg-black border-primary hover:bg-blue-600"
              >
                课程学习
              </Button>
              <Button
                size="large"
                onClick={() => navigate('/resources')}
                className="h-12 w-40 px-8 text-lg border-gray-300 text-gray-700 dark:text-gray-300 dark:border-gray-600"
                icon={<ArrowRightOutlined />}
              >
                查找资源
              </Button>
            </div>
          </div>

          {/* 右侧知识图谱展示 */}
          <div className="relative">
            <div className="max-w-[80rem] max-h-[45rem] aspect-video bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
              <div className="h-[41rem] bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900 dark:to-green-900 rounded-xl flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
                    知识图谱
                  </div>
                  <div className="text-gray-600 dark:text-gray-300">
                    可视化交互探索
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;