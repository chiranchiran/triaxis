import React, { useState, useEffect } from 'react';
import { Card, Avatar, Tag, Button, Divider, Progress } from 'antd';
import {
  GithubOutlined,
  MailOutlined,
  HeartOutlined,
  TeamOutlined,
  ContactsOutlined,
  UserAddOutlined,
  RocketOutlined,
  CodeOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  CheckSquareOutlined
} from '@ant-design/icons';
import './index.less'

const About = () => {
  const [activeSection, setActiveSection] = useState('tech');

  // 监听滚动，更新激活的导航项
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['tech', 'team', 'contact', 'join'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) {
        setActiveSection(current);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 技术栈数据
  const techStack = {
    frontend: [
      { name: 'React 18', color: 'bg-blue-100 text-blue-700 border-blue-200' },
      { name: 'Vite', color: 'bg-purple-100 text-purple-700 border-purple-200' },

      { name: 'Ant Design', color: 'bg-cyan-100 text-cyan-700 border-cyan-200' },
      { name: 'Material-UI', color: 'bg-teal-100 text-teal-700 border-teal-200' },
      { name: 'Semi Design', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
      { name: 'React Flow', color: 'bg-violet-100 text-violet-700 border-violet-200' },
      { name: 'Tailwind CSS', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },

      { name: 'React Router', color: 'bg-amber-100 text-amber-700 border-amber-200' },
      { name: 'Redux Toolkit', color: 'bg-orange-100 text-orange-700 border-orange-200' },
      { name: 'TanStack Query', color: 'bg-lime-100 text-lime-700 border-lime-200' },

      { name: 'Taro', color: 'bg-pink-100 text-pink-700 border-pink-200' },
      { name: 'Taroify', color: 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200' }
    ],
    backend: [
      { name: 'Spring Boot 3', color: 'bg-green-100 text-green-700 border-green-200' },
      { name: 'Spring Security', color: 'bg-lime-100 text-lime-700 border-lime-200' },
      { name: 'JWT', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
      { name: 'Spring MVC', color: 'bg-teal-100 text-teal-700 border-teal-200' },
      { name: 'MySQL 8.0', color: 'bg-cyan-100 text-cyan-700 border-cyan-200' },
      { name: 'MyBatis', color: 'bg-sky-100 text-sky-700 border-sky-200' },
      { name: 'MyBatis-Plus', color: 'bg-blue-100 text-blue-700 border-blue-200' },
      { name: 'Redis', color: 'bg-red-100 text-red-700 border-red-200' },

      { name: 'RabbitMQ', color: 'bg-orange-100 text-orange-700 border-orange-200' },
      { name: 'WebSocket', color: 'bg-amber-100 text-amber-700 border-amber-200' },
      { name: 'Docker', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
      { name: 'Spring Cloud', color: 'bg-violet-100 text-violet-700 border-violet-200' },
    ]
  };

  // 开发计划
  const developmentPlans = [
    {
      title: '微信小程序开发',
      description: '基于Taro框架开发微信小程序版本，实现核心功能移动化，支持微信登录和分享功能。',
      status: '进行中',
      icon: '📱',
      progress: 60,
      timeline: '2024 Q2'
    },
    {
      title: '主题色切换功能',
      description: '实现动态主题色切换，支持明暗模式，提供多种预设主题，用户可自定义配色方案。',
      status: '规划中',
      icon: '🎨',
      progress: 0,
      timeline: '2024 Q3'
    },
    {
      title: 'AI功能集成',
      description: '集成机器学习能力，包括智能推荐、自然语言处理、图像识别等AI功能模块。',
      status: '规划中',
      icon: '🤖',
      progress: 0,
      timeline: '2024 Q4'
    },
    {
      title: '微服务架构升级',
      description: '将单体应用拆分为微服务，实现服务治理、链路追踪、熔断降级等云原生特性。',
      status: '调研中',
      icon: '☁️',
      progress: 20,
      timeline: '2025 Q1'
    },
    {
      title: '多语言国际化',
      description: '支持中英文切换，实现完整的国际化方案，包括日期、货币、文本等本地化处理。',
      status: '规划中',
      icon: '🌐',
      progress: 0,
      timeline: '2024 Q3'
    },
    {
      title: '性能监控系统',
      description: '构建完整的应用性能监控体系，包括前端性能监控、后端链路追踪和业务指标监控。',
      status: '规划中',
      icon: '📊',
      progress: 0,
      timeline: '2024 Q4'
    }
  ];

  // 导航项配置
  const navItems = [
    { id: 'tech', label: '技术栈', icon: <CodeOutlined />, color: 'bg-blue-100 text-blue-600' },
    { id: 'team', label: '开发团队', icon: <TeamOutlined />, color: 'bg-green-100 text-green-600' },
    { id: 'contact', label: '联系我们', icon: <ContactsOutlined />, color: 'bg-purple-100 text-purple-600' },
    { id: 'join', label: '开发计划', icon: <RocketOutlined />, color: 'bg-orange-100 text-orange-600' }
  ];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="min-h-screen max-w-7xl mx-auto">

        {/* 左侧固定导航 */}
        <div className="fixed md:left-20 sm:10 top-1/2 transform -translate-y-1/2 z-10">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 border border-white/20">
            <div className="space-y-4">
              {navItems.map((item, index) => (
                <div key={item.id} className="relative flex items-center">
                  {/* 时间线连接线 */}
                  {index < navItems.length - 1 && (
                    <div className="absolute left-4 top-8 w-0.5 h-8 bg-gray-300/50 ml-3"></div>
                  )}

                  {/* 时间线节点 */}
                  <button
                    onClick={() => scrollToSection(item.id)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${activeSection === item.id
                      ? `${item.color} shadow-md scale-110`
                      : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                      }`}
                    title={item.label}
                  >
                    {item.icon}
                  </button>

                  {/* 导航标签 */}
                  <div className={`ml-3 transition-all duration-300 ${activeSection === item.id
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 translate-x-2'
                    }`}>
                    <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                      {item.label}
                    </span>
                  </div>
                </div>
              ))}
              <Button
                type="primary"
                size="large"
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 border-0 h-12 px-8 shadow-lg hover:shadow-xl transition-all duration-300"
                icon={<GithubOutlined />}
              >
                访问GitHub
              </Button>
            </div>
          </div>
        </div>

        <div className="mx-auto px-4 py-8 lg:ml-32">
          <div className="max-w-7xl mx-auto space-y-16 px-10">
            {/* 技术栈部分 */}
            <section id="tech" className="scroll-mt-24 ">
              <div className="text-center mb-12">
                {/* 内层 Flex 容器：控制图标和标题在同一行 */}
                <div className="flex items-center justify-center gap-4 mb-6">
                  <span className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <CodeOutlined className="text-4xl text-blue-500" />
                  </span>
                  <span className="text-4xl font-bold text-gray-900">技术栈</span>
                </div>

                {/* 描述文字单独一行 */}
                <p className="text-xl text-gray-700 leading-relaxed max-w-2xl mx-auto">
                  我们采用现代化的技术栈，确保应用的高性能、可维护性和可扩展性
                </p>
              </div>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                {/* 前端技术栈 */}
                <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-sm">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">前端技术</h3>
                    <div className="w-60 h-1 bg-blue-400 mx-auto"></div>
                  </div>
                  <div className="space-y-0 pl-10">
                    {techStack.frontend.map((tech, index) => (
                      <div key={index} className="flex text-center items-center px-10 py-2 hover:bg-gray-50 rounded-lg transition-colors">
                        <CheckSquareOutlined style={{ fontSize: 24, color: 'rgba(149, 199, 247, 1)' }} />
                        <span className="text-gray-700 text-center text-xl pl-5">

                          {tech.name}</span>
                        {/* <Tag className={`${tech.color} border px-3 py-1 rounded-full text-sm font-medium`}>
                        {tech.name.includes('React') ? 'UI框架' :
                          tech.name.includes('Vite') ? '构建工具' :
                            tech.name.includes('TypeScript') ? '语言' :
                              tech.name.includes('Ant') ? '组件库' :
                                tech.name.includes('Tailwind') ? 'CSS框架' :
                                  tech.name.includes('Redux') ? '状态管理' : '工具'}
                      </Tag> */}
                      </div>
                    ))}
                  </div>
                </Card>

                {/* 后端技术栈 */}
                <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-sm">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">后端技术</h3>
                    <div className="w-60 h-1 bg-green-400/70 mx-auto"></div>
                  </div>
                  <div className="space-y-0 pl-10">
                    {techStack.backend.map((tech, index) => (
                      <div key={index} className="flex text-center items-center px-10 py-2 hover:bg-gray-50 rounded-lg transition-colors">
                        <CheckSquareOutlined style={{ fontSize: 24, color: 'rgb(143, 227, 182)' }} />
                        <span className="text-gray-700 text-center text-xl pl-5">

                          {tech.name}</span>
                        {/* <Tag className={`${tech.color} border px-3 py-1 rounded-full text-sm font-medium`}>
                        {tech.name.includes('Spring') ? '框架' :
                          tech.name.includes('MySQL') ? '数据库' :
                            tech.name.includes('Redis') ? '缓存' :
                              tech.name.includes('RabbitMQ') ? '消息队列' :
                                tech.name.includes('Docker') ? '容器' : '工具'}
                      </Tag> */}
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </section>

            {/* 开发团队 */}
            <section id="team" className="scroll-mt-24">
              <div className="text-center mb-12">
                {/* 内层 Flex 容器：控制图标和标题在同一行 */}
                <div className="flex items-center justify-center gap-4 mb-6">
                  <span className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <TeamOutlined className="text-4xl text-blue-500" />
                  </span>
                  <span className="text-4xl font-bold text-gray-900">开发团队</span>
                </div>

                {/* 描述文字单独一行 */}
                <p className="text-xl text-gray-700 leading-relaxed max-w-2xl mx-auto">
                  了解我们的开发团队，期待与你的相遇~
                </p>
              </div>

              <div className="max-w-5xl mx-auto">
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-white/50">
                  <div className="flex flex-col md:flex-row items-start gap-6">
                    <Avatar
                      size={100}
                      className="mb-4 text-3xl bg-gradient-to-r from-blue-100 to-purple-100 shadow-inner flex-shrink-0"
                    >
                      👨‍💻
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                        <div>
                          <h4 className="text-xl font-bold text-gray-900 mb-1">独立开发者</h4>
                          <p className="text-blue-500 font-semibold">全栈工程师</p>
                        </div>
                        <div className="flex items-center text-gray-500 text-sm mt-2 md:mt-0">
                          <CalendarOutlined className="mr-1" />
                          2020年3月加入
                        </div>
                      </div>
                      <p className="text-gray-700 mb-6 leading-relaxed">
                        拥有丰富的前后端开发经验，专注于现代化Web技术栈。擅长React生态、Spring Boot微服务架构，
                        致力于构建高性能、可扩展的应用程序。热爱开源技术，持续学习新技术并应用于实际项目中。
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Tag className="bg-blue-100 text-blue-700 border-0 px-3 py-1 rounded-full text-sm font-medium">
                          React专家
                        </Tag>
                        <Tag className="bg-green-100 text-green-700 border-0 px-3 py-1 rounded-full text-sm font-medium">
                          Spring Boot
                        </Tag>
                        <Tag className="bg-purple-100 text-purple-700 border-0 px-3 py-1 rounded-full text-sm font-medium">
                          架构设计
                        </Tag>
                        <Tag className="bg-orange-100 text-orange-700 border-0 px-3 py-1 rounded-full text-sm font-medium">
                          性能优化
                        </Tag>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 联系我们 */}
            <section id="contact" className="scroll-mt-24">
              <div className="bg-purple rounded-5xl p-8 backdrop-blur-sm border border-white/50">
                <div className="text-center mb-12">

                  {/* 内层 Flex 容器：控制图标和标题在同一行 */}
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <span className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <ContactsOutlined className="text-4xl text-blue-500" />
                    </span>
                    <span className="text-4xl font-bold text-gray-900">联系我们</span>
                  </div>

                  {/* 描述文字单独一行 */}
                  <p className="text-xl text-gray-700 leading-relaxed max-w-2xl mx-auto">
                    我们始终乐于与志同道合的朋友交流想法、探讨合作。无论您是对我们的项目感兴趣，
                    想要提出建议，还是希望探讨潜在的合作机会，都欢迎通过以下方式取得联系。
                  </p>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-white/80 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 backdrop-blur-sm">
                    <div className="w-16 h-16 mx-auto mb-4 bg-blue-50 rounded-full flex items-center justify-center">
                      <MailOutlined className="text-xl text-blue-500" />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-3 text-lg">邮箱联系</h4>
                    <p className="text-gray-600 mb-2">主要联系方式</p>
                    <Button
                      type="primary"
                      size="large"
                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 border-0 h-12 px-8 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      contact@example.com
                    </Button>
                    <p className="text-gray-500 text-sm mt-2">我们会在24小时内回复</p>
                  </div>

                  <div className="text-center p-6 bg-white/80 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 backdrop-blur-sm">
                    <div className="w-16 h-16 mx-auto mb-4 bg-red-50 rounded-full flex items-center justify-center">
                      <span className="text-xl">📱</span>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-3 text-lg">小红书</h4>
                    <p className="text-gray-600 mb-2">关注最新动态</p>
                    <Button
                      type="primary"
                      size="large"
                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 border-0 h-12 px-8 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      contact@example.com
                    </Button>

                    <p className="text-gray-500 text-sm mt-2">分享技术心得和项目进展</p>
                  </div>

                  <div className="text-center p-6 bg-white/80 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 backdrop-blur-sm">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-900 rounded-full flex items-center justify-center">
                      <GithubOutlined className="text-xl text-white" />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-3 text-lg">GitHub</h4>
                    <p className="text-gray-600 mb-2">探索开源项目</p>
                    <Button
                      type="primary"
                      size="large"
                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 border-0 h-12 px-8 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      contact@example.com
                    </Button>
                    <p className="text-gray-500 text-sm mt-2">参与我们的开源项目</p>
                  </div>
                </div>
              </div>
            </section>

            {/* 开发计划 */}
            <section id="join" className="scroll-mt-24 pb-16">
              <div className="text-center mb-12">
                {/* 内层 Flex 容器：控制图标和标题在同一行 */}
                <div className="flex items-center justify-center gap-4 mb-6">
                  <span className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <RocketOutlined className="text-4xl text-blue-500" />
                  </span>
                  <span className="text-4xl font-bold text-gray-900">开发计划</span>
                </div>

                {/* 描述文字单独一行 */}
                <p className="text-xl text-gray-700 leading-relaxed max-w-2xl mx-auto">
                  我们正在不断改进和完善产品，以下是我们的开发计划，如果您对我们的开发计划有任何建议，或者想要参与其中，欢迎通过上面的联系方式与我们联系。
                </p>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {developmentPlans.map((plan, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 backdrop-blur-sm rounded-xl p-6 hover:shadow-md transition-all duration-300 border border-white/50 group"
                  >
                    <div className="flex items-start gap-4">

                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3">
                          <h4 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                            {plan.title}
                          </h4>
                          <div className="flex items-center mt-2 sm:mt-0">
                            <Tag className={`${plan.status === '进行中' ? 'bg-blue-100 text-blue-700' :
                              plan.status === '规划中' ? 'bg-gray-100 text-gray-600' :
                                'bg-orange-100 text-orange-700'
                              } border-0 px-3 py-1 rounded-full mr-3`}>
                              {plan.status}
                            </Tag>
                            <div className="flex items-center text-gray-500 text-sm">
                              <EnvironmentOutlined className="mr-1" />
                              {plan.timeline}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed mb-4">{plan.description}</p>
                        {plan.progress > 0 && (
                          <div className="flex items-center gap-3">
                            <Progress
                              percent={plan.progress}
                              size="small"
                              strokeColor={{
                                '0%': '#f1d9acff',
                                '100%': '#f1d8aaff',
                              }}
                            />
                            <span className="text-sm text-gray-500">{plan.progress}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </section>
          </div>
        </div>
      </div>

    </div>
  );
};

export default About;