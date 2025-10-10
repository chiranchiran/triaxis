import React, { useState, useEffect } from 'react';
import { Card, Avatar, Tag, Button, Divider } from 'antd';
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
  EnvironmentOutlined
} from '@ant-design/icons';

const About = () => {
  const [activeSection, setActiveSection] = useState('github');

  // 监听滚动，更新激活的导航项
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['github', 'team', 'developers', 'contact', 'join'];
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

  // 团队数据
  const teamMembers = [
    {
      id: 1,
      name: '张明',
      role: '前端开发工程师',
      avatar: '👨‍💻',
      description: '拥有5年React和Vue.js开发经验，热爱开源项目，致力于创造优秀的用户体验。曾主导多个大型项目的架构设计，擅长性能优化和代码质量把控。在日常工作中，喜欢探索新技术并分享给团队成员。',
      skills: ['React', 'TypeScript', 'TailwindCSS', 'Node.js'],
      joinDate: '2020年3月加入'
    },
    {
      id: 2,
      name: '李华',
      role: 'UI/UX设计师',
      avatar: '👩‍🎨',
      description: '资深UI/UX设计师，专注于创造美观且用户友好的界面设计。拥有丰富的设计系统构建经验，注重设计细节和用户体验。坚信好的设计能够提升产品的价值和使用愉悦感。',
      skills: ['Figma', 'UI设计', '用户体验', '动效设计'],
      joinDate: '2019年8月加入'
    },
    {
      id: 3,
      name: '王伟',
      role: '后端开发工程师',
      avatar: '👨‍🔧',
      description: '全栈开发工程师，专注于Node.js和数据库架构设计。擅长构建高可用、高并发的后端服务，对系统性能优化有深入研究。热衷于技术分享，是团队内部技术培训的主要负责人。',
      skills: ['Node.js', 'MySQL', 'Redis', 'Docker'],
      joinDate: '2021年1月加入'
    }
  ];

  // 待开发计划
  const developmentPlans = [
    {
      title: '移动端应用开发',
      description: '我们计划开发iOS和Android版本的原生应用，为用户提供更便捷的移动体验。这将包括离线功能、推送通知和与设备硬件的深度集成。我们正在研究React Native和Flutter等技术栈，以确保最佳的性能和开发效率。',
      status: '规划中',
      icon: '📱',
      timeline: '预计2024年Q3启动'
    },
    {
      title: 'AI功能集成',
      description: '计划集成机器学习算法来提升用户体验，实现智能化功能。包括个性化推荐、智能搜索和自动化流程。我们正在评估TensorFlow.js和现有AI服务，寻找最适合我们技术栈的解决方案。',
      status: '调研中',
      icon: '🤖',
      timeline: '预计2024年Q4完成调研'
    },
    {
      title: '国际化支持',
      description: '为了扩大产品的全球影响力，我们将支持多语言和地区适配。这包括界面本地化、内容翻译和地区特定的功能定制。我们已经开始收集用户反馈，确定首批支持的语言和地区。',
      status: '待启动',
      icon: '🌍',
      timeline: '预计2025年Q1启动'
    }
  ];

  // 导航项配置
  const navItems = [
    { id: 'github', label: 'GitHub主页', icon: <GithubOutlined />, color: 'bg-blue-100 text-blue-600' },
    { id: 'team', label: '团队介绍', icon: <TeamOutlined />, color: 'bg-orange-100 text-orange-600' },
    { id: 'developers', label: '开发者介绍', icon: <CodeOutlined />, color: 'bg-green-100 text-green-600' },
    { id: 'contact', label: '联系我们', icon: <ContactsOutlined />, color: 'bg-purple-100 text-purple-600' },
    { id: 'join', label: '加入我们', icon: <UserAddOutlined />, color: 'bg-pink-100 text-pink-600' }
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
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 lg:ml-32">
        <div className="max-w-4xl mx-auto space-y-16">
          {/* GitHub主页部分 */}
          <section id="github" className="scroll-mt-24 pt-8">
            <div className="text-center mb-12">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center shadow-lg">
                <GithubOutlined className="text-4xl text-blue-500" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-6">关于我们</h1>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                我们是一支充满激情的技术团队，成立于2018年，致力于创造优秀的开源项目和创新的技术解决方案。
                通过代码改变世界，用技术创造价值是我们的核心理念。我们相信开放协作的力量，积极参与开源社区，
                并持续贡献我们的代码和想法。
              </p>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                我们的项目涵盖了Web开发、移动应用、人工智能和云计算等多个领域。截至目前，我们在GitHub上
                已经获得了超过5000颗星标，我们的开源库被下载超过10万次，为全球开发者提供了实用的工具和解决方案。
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <Tag className="bg-blue-100 text-blue-700 border-0 px-4 py-2 text-sm font-medium">开源项目</Tag>
                <Tag className="bg-green-100 text-green-700 border-0 px-4 py-2 text-sm font-medium">技术创新</Tag>
                <Tag className="bg-orange-100 text-orange-700 border-0 px-4 py-2 text-sm font-medium">团队协作</Tag>
                <Tag className="bg-purple-100 text-purple-700 border-0 px-4 py-2 text-sm font-medium">社区贡献</Tag>
              </div>
              <Button
                type="primary"
                size="large"
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 border-0 h-12 px-8 shadow-lg hover:shadow-xl transition-all duration-300"
                icon={<GithubOutlined />}
              >
                访问我们的GitHub
              </Button>
            </div>
          </section>

          {/* 团队介绍 */}
          <section id="team" className="scroll-mt-24">
            <div className="text-center mb-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center shadow-md">
                <TeamOutlined className="text-2xl text-orange-500" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">团队介绍</h2>
              <p className="text-gray-700 text-lg max-w-2xl mx-auto leading-relaxed">
                我们汇聚了来自不同背景的优秀人才，共同致力于技术创新和产品卓越。团队成员毕业于国内外知名高校，
                拥有在知名科技公司的工作经验。我们注重多元化和包容性，相信不同的视角能够带来更好的创意和解决方案。
              </p>
              <p className="text-gray-600 mt-4 max-w-2xl mx-auto leading-relaxed">
                我们的团队文化强调开放沟通、持续学习和相互支持。我们定期举办技术分享会、代码审查和团队建设活动，
                确保每个成员都能在专业和个人层面获得成长。我们坚信，优秀的团队是创造优秀产品的基础。
              </p>
            </div>
          </section>

          {/* 开发者介绍 */}
          <section id="developers" className="scroll-mt-24">
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">开发者介绍</h3>
              <p className="text-gray-600 text-center max-w-2xl mx-auto">
                认识我们优秀的开发团队成员，他们是我们技术创新和产品卓越的核心力量
              </p>
            </div>

            <div className="space-y-8">
              {teamMembers.map(member => (
                <div
                  key={member.id}
                  className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-white/50"
                >
                  <div className="flex flex-col md:flex-row items-start gap-6">
                    <Avatar
                      size={100}
                      className="mb-4 text-3xl bg-gradient-to-r from-blue-100 to-purple-100 shadow-inner flex-shrink-0"
                    >
                      {member.avatar}
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                        <div>
                          <h4 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h4>
                          <p className="text-blue-500 font-semibold">{member.role}</p>
                        </div>
                        <div className="flex items-center text-gray-500 text-sm mt-2 md:mt-0">
                          <CalendarOutlined className="mr-1" />
                          {member.joinDate}
                        </div>
                      </div>
                      <p className="text-gray-700 mb-6 leading-relaxed">{member.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {member.skills.map((skill, index) => (
                          <Tag
                            key={index}
                            className="bg-gradient-to-r from-green-50 to-blue-50 text-green-700 border-0 px-3 py-1 rounded-full text-sm font-medium"
                          >
                            {skill}
                          </Tag>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 联系我们 */}
          <section id="contact" className="scroll-mt-24">
            <div className="bg-gradient-to-r from-purple-50/80 to-blue-50/80 rounded-2xl p-8 backdrop-blur-sm border border-white/50">
              <div className="text-center mb-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <ContactsOutlined className="text-2xl text-purple-500" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">联系我们</h2>
                <p className="text-gray-700 text-lg max-w-2xl mx-auto">
                  我们始终乐于与志同道合的朋友交流想法、探讨合作。无论您是对我们的项目感兴趣，
                  想要提出建议，还是希望探讨潜在的合作机会，都欢迎通过以下方式与我们取得联系。
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-white/80 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 backdrop-blur-sm">
                  <div className="w-16 h-16 mx-auto mb-4 bg-blue-50 rounded-full flex items-center justify-center">
                    <MailOutlined className="text-xl text-blue-500" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-3 text-lg">邮箱联系</h4>
                  <p className="text-gray-600 mb-2">主要联系方式</p>
                  <p className="text-blue-500 font-semibold">contact@example.com</p>
                  <p className="text-gray-500 text-sm mt-2">我们会在24小时内回复</p>
                </div>

                <div className="text-center p-6 bg-white/80 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 backdrop-blur-sm">
                  <div className="w-16 h-16 mx-auto mb-4 bg-red-50 rounded-full flex items-center justify-center">
                    <span className="text-xl">📱</span>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-3 text-lg">小红书</h4>
                  <p className="text-gray-600 mb-2">关注最新动态</p>
                  <p className="text-red-500 font-semibold">@我们的技术团队</p>
                  <p className="text-gray-500 text-sm mt-2">分享技术心得和项目进展</p>
                </div>

                <div className="text-center p-6 bg-white/80 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 backdrop-blur-sm">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-900 rounded-full flex items-center justify-center">
                    <GithubOutlined className="text-xl text-white" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-3 text-lg">GitHub</h4>
                  <p className="text-gray-600 mb-2">探索开源项目</p>
                  <p className="text-gray-700 font-semibold">github.com/ourteam</p>
                  <p className="text-gray-500 text-sm mt-2">参与我们的开源项目</p>
                </div>
              </div>

              <div className="mt-8 text-center">
                <p className="text-gray-600 max-w-2xl mx-auto">
                  除了以上联系方式，我们也定期参加各类技术大会和社区活动。
                  如果您想面对面交流，欢迎关注我们的活动通知，我们很乐意在活动中与您见面讨论。
                </p>
              </div>
            </div>
          </section>

          {/* 加入我们 */}
          <section id="join" className="scroll-mt-24 pb-16">
            <div className="text-center mb-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-pink-100 to-red-100 rounded-full flex items-center justify-center shadow-md">
                <UserAddOutlined className="text-2xl text-pink-500" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">加入我们</h2>
              <p className="text-gray-700 text-lg max-w-2xl mx-auto leading-relaxed">
                我们正在寻找志同道合的伙伴，一起创造更美好的技术未来。我们提供有竞争力的薪酬、
                灵活的工作方式、持续的学习机会和友好的团队氛围。如果你对技术充满热情，渴望在
                有挑战性的项目中成长，欢迎加入我们的团队。
              </p>
              <p className="text-gray-600 mt-4 max-w-2xl mx-auto leading-relaxed">
                我们目前正在招聘前端工程师、后端工程师、UI/UX设计师和产品经理等职位。
                无论您是经验丰富的专家还是刚刚开始职业生涯的新人，只要您对技术有热情，
                我们都欢迎您的申请。
              </p>
            </div>

            <Divider>
              <span className="text-gray-500 font-semibold bg-white/80 px-4">待开发计划</span>
            </Divider>

            <div className="space-y-6">
              {developmentPlans.map((plan, index) => (
                <div
                  key={index}
                  className="bg-white/70 backdrop-blur-sm rounded-xl p-6 hover:shadow-md transition-all duration-300 border border-white/50 group"
                >
                  <div className="flex items-start">
                    <div className="text-3xl mr-4 group-hover:scale-110 transition-transform duration-300">
                      {plan.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3">
                        <h4 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                          {plan.title}
                        </h4>
                        <div className="flex items-center mt-2 md:mt-0">
                          <Tag className={`${plan.status === '规划中' ? 'bg-blue-100 text-blue-700' :
                            plan.status === '调研中' ? 'bg-orange-100 text-orange-700' :
                              'bg-gray-100 text-gray-600'
                            } border-0 px-3 py-1 rounded-full mr-3`}>
                            {plan.status}
                          </Tag>
                          <div className="flex items-center text-gray-500 text-sm">
                            <EnvironmentOutlined className="mr-1" />
                            {plan.timeline}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{plan.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>


          </section>
        </div>
      </div>
    </div>
  );
};

export default About;