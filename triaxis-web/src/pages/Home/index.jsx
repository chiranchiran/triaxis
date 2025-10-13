import React from 'react';
import HeroSection from './HeroSection';
import { FireOutlined, ArrowRightOutlined } from '@ant-design/icons';
import News from './News';
import './index.less'
import MyCarousel from './MyCarousel';
import MyButton from '../../components/MyButton';

function Home() {
  const courseDescription = {
    title: '专业课程',
    introduce: '系统学习理论知识，掌握实践技能，提升专业素养与竞争力',
    isImageLeft: false
  }
  //课程轮播图数据
  const courseImages = [
    'https://lf3-static.bytednsdoc.com/obj/eden-cn/hjeh7pldnulm/SemiDocs/bg-1.png',
    'https://lf3-static.bytednsdoc.com/obj/eden-cn/hjeh7pldnulm/SemiDocs/bg-2.png',
    'https://lf3-static.bytednsdoc.com/obj/eden-cn/hjeh7pldnulm/SemiDocs/bg-3.png',
  ]
  const courseList = [
    ['Semi 设计管理系统', '从 Semi Design，到 Any Design', '快速定制你的设计系统，并应用在设计稿和代码中'],
    ['Semi 物料市场', '面向业务场景的定制化组件，支持线上预览和调试', '内容由 Semi Design 用户共建'],
    ['Semi 设计/代码模板', '高效的 Design2Code 设计稿转代码', '海量 Figma前端代码一键转'],
  ]

  const resourceDescription = {
    title: '精品资源',
    introduce: '涵盖城乡规划各类规范、案例、研究报告，助力您的项目顺利推进',
    isImageLeft: true
  }
  //资源轮播图数据
  const resourceImages = [
    'https://lf3-static.bytednsdoc.com/obj/eden-cn/hjeh7pldnulm/SemiDocs/bg-1.png',
    'https://lf3-static.bytednsdoc.com/obj/eden-cn/hjeh7pldnulm/SemiDocs/bg-2.png',
    'https://lf3-static.bytednsdoc.com/obj/eden-cn/hjeh7pldnulm/SemiDocs/bg-3.png',
  ]

  const resourceList = [
    ['Semi 设计管理系统', '从 Semi Design，到 Any Design', '快速定制你的设计系统，并应用在设计稿和代码中'],
    ['Semi 物料市场', '面向业务场景的定制化组件，支持线上预览和调试', '内容由 Semi Design 用户共建'],
    ['Semi 设计/代码模板', '高效的 Design2Code 设计稿转代码', '海量 Figma前端代码一键转'],
  ]
  const newsData = [
    {
      id: 2,
      title: '新版城市规划编制办法解读',
      description: '最新政策解读与实施要点分析',
      tag: '政策',
      hot: true
    },
    {
      id: 21,
      title: '智慧城市发展趋势论坛',
      description: '行业专家深度探讨未来发展方向',
      tag: '论坛',
      hot: true
    },
    {
      id: 23,
      title: '乡村振兴规划案例分享',
      description: '成功实践经验与创新模式交流',
      tag: '案例'
    },
    {
      id: 25,
      title: '国土空间规划技术指南',
      description: '专业技术要点与操作规范解析',
      tag: '技术'
    },
  ];
  const topicData = ['# 学术讨论', '# 技术交流', '# 日常聊天', '# 课程交流', '# 求职招聘']
  //推荐帖子
  return (
    <div>
      <HeroSection />
      <section className="py-20">
        <div className="max-w-7xl mx-auto">
          {/* 功能模块 */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">核心功能</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">为您提供全方位的专业支持</p>
          </div>
          <div className='flex flex-col gap-20'>
            <MyCarousel imgList={resourceImages} textList={resourceList} path='/resources' description={resourceDescription} />
            <MyCarousel imgList={courseImages} textList={courseList} path='/courses' description={courseDescription} />
          </div>
          {/* 热点资讯 */}
          <div className="text-center mb-12 mt-20 news">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              <FireOutlined className="text-orange mr-3" />热点资讯</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">了解行业内最新动态</p>
            <MyButton
              onClick={() => navigate('/community')}
              styles="news-more "
              size="large"
              type="orange"
              icon={<ArrowRightOutlined />}>
              查看更多
            </MyButton>
          </div>
          <div className='flex flex-col gap-20'>
            <News newsData={newsData} topicData={topicData} />
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home


