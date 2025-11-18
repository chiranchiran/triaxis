import React from 'react';

const Resume = () => {
  const resumeData = {
    personalInfo: {
      name: "张明",
      title: "前端开发实习生",
      contact: {
        phone: "138-0000-0000",
        email: "zhangming@email.com",
        location: "北京市海淀区",
        portfolio: "zhangming.dev",
        github: "github.com/zhangming"
      }
    },
    education: {
      school: "北京理工大学",
      degree: "计算机科学与技术 | 本科",
      period: "2020.09 - 2024.06",
      gpa: "3.7/4.0",
      courses: ["数据结构", "算法设计", "Web开发", "人机交互", "计算机网络"],
      awards: ["校级一等奖学金 (2022)", "优秀学生干部 (2021)"]
    },
    technicalSkills: {
      frontend: ["HTML5 & CSS3", "JavaScript (ES6+)", "React", "Vue.js", "TypeScript"],
      tools: ["Git", "Webpack", "VS Code", "Figma", "Chrome DevTools"],
      concepts: ["响应式设计", "组件化开发", "RESTful API", "前端性能优化"]
    },
    projects: [
      {
        name: "个人博客系统",
        period: "2023.03 - 2023.06",
        description: "基于React和Node.js开发的个人博客平台，支持Markdown编辑和响应式设计",
        details: [
          "实现文章CRUD功能及标签分类管理",
          "使用React Hooks进行状态管理，提高代码可维护性",
          "采用Tailwind CSS实现响应式设计，适配移动端"
        ],
        tech: ["React", "Node.js", "MongoDB", "Tailwind CSS"]
      },
      {
        name: "在线学习平台UI重构",
        period: "2022.09 - 2022.12",
        description: "参与学校在线学习平台的前端界面重构，提升用户体验",
        details: [
          "负责课程列表和详情页面的组件开发",
          "优化页面加载速度，首屏加载时间减少30%",
          "使用Vue.js和Vuex实现数据状态管理"
        ],
        tech: ["Vue.js", "Vuex", "Element UI", "Sass"]
      }
    ],
    experience: [
      {
        company: "校园技术社团",
        position: "前端开发组成员",
        period: "2021.09 - 至今",
        details: [
          "参与社团网站的前端开发与维护工作",
          "组织前端技术分享会，向成员介绍React基础概念",
          "协助设计并实现社团活动在线报名系统"
        ]
      },
      {
        company: "自由职业项目",
        position: "网页开发实习生",
        period: "2021.03 - 2021.08",
        details: [
          "为本地小型企业设计并开发响应式官方网站",
          "使用HTML、CSS和JavaScript实现交互效果和动画",
          "通过代码优化将网站性能评分从60提升到85"
        ]
      }
    ]
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg p-8 text-gray-800 font-sans">
      {/* 头部信息 */}
      <header className="border-b-2 border-blue-100 pb-6 mb-6">
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900">{resumeData.personalInfo.name}</h1>
          <h2 className="text-xl text-blue-600 mt-2">{resumeData.personalInfo.title}</h2>
        </div>
        <div className="flex flex-wrap justify-center gap-6 text-sm">
          <div className="flex items-center">
            <span className="text-blue-500 mr-2">📱</span>
            <span>{resumeData.personalInfo.contact.phone}</span>
          </div>
          <div className="flex items-center">
            <span className="text-blue-500 mr-2">📧</span>
            <span>{resumeData.personalInfo.contact.email}</span>
          </div>
          <div className="flex items-center">
            <span className="text-blue-500 mr-2">📍</span>
            <span>{resumeData.personalInfo.contact.location}</span>
          </div>
          <div className="flex items-center">
            <span className="text-blue-500 mr-2">🌐</span>
            <span>{resumeData.personalInfo.contact.portfolio}</span>
          </div>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-8">
        {/* 左侧栏 */}
        <div className="md:w-1/3 space-y-6">
          {/* 教育背景 */}
          <section>
            <h3 className="text-lg font-semibold text-blue-700 mb-3 pb-2 border-b border-blue-100">教育背景</h3>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">{resumeData.education.school}</h4>
              <p className="text-sm text-gray-700">{resumeData.education.degree}</p>
              <p className="text-sm text-gray-600">{resumeData.education.period}</p>
              <p className="text-sm text-gray-600">GPA: {resumeData.education.gpa}</p>

              <div className="mt-3">
                <h5 className="text-sm font-medium text-gray-800 mb-1">主修课程:</h5>
                <div className="flex flex-wrap gap-1">
                  {resumeData.education.courses.map((course, index) => (
                    <span key={index} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                      {course}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-3">
                <h5 className="text-sm font-medium text-gray-800 mb-1">获奖情况:</h5>
                <ul className="text-xs text-gray-700 list-disc list-inside space-y-1">
                  {resumeData.education.awards.map((award, index) => (
                    <li key={index}>{award}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* 技术技能 */}
          <section>
            <h3 className="text-lg font-semibold text-blue-700 mb-3 pb-2 border-b border-blue-100">技术技能</h3>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-800 mb-2">前端技术</h4>
              <div className="flex flex-wrap gap-1">
                {resumeData.technicalSkills.frontend.map((skill, index) => (
                  <span key={index} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-800 mb-2">开发工具</h4>
              <div className="flex flex-wrap gap-1">
                {resumeData.technicalSkills.tools.map((tool, index) => (
                  <span key={index} className="text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded">
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-800 mb-2">技术概念</h4>
              <div className="flex flex-wrap gap-1">
                {resumeData.technicalSkills.concepts.map((concept, index) => (
                  <span key={index} className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">
                    {concept}
                  </span>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* 右侧栏 */}
        <div className="md:w-2/3 space-y-6">
          {/* 项目经验 */}
          <section>
            <h3 className="text-lg font-semibold text-blue-700 mb-3 pb-2 border-b border-blue-100">项目经验</h3>
            <div className="space-y-4">
              {resumeData.projects.map((project, index) => (
                <div key={index} className="pb-4 border-b border-gray-100 last:border-0">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-medium text-gray-900">{project.name}</h4>
                    <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">{project.period}</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{project.description}</p>
                  <ul className="text-sm text-gray-700 list-disc list-inside space-y-1 mb-2">
                    {project.details.map((detail, idx) => (
                      <li key={idx}>{detail}</li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-1">
                    {project.tech.map((tech, idx) => (
                      <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 实践经验 */}
          <section>
            <h3 className="text-lg font-semibold text-blue-700 mb-3 pb-2 border-b border-blue-100">实践经验</h3>
            <div className="space-y-4">
              {resumeData.experience.map((exp, index) => (
                <div key={index} className="pb-4 border-b border-gray-100 last:border-0">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h4 className="font-medium text-gray-900">{exp.company}</h4>
                      <p className="text-sm text-gray-700">{exp.position}</p>
                    </div>
                    <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">{exp.period}</span>
                  </div>
                  <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                    {exp.details.map((detail, idx) => (
                      <li key={idx}>{detail}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Resume;