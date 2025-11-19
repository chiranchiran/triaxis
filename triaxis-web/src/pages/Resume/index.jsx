import React from 'react';
import './index.less'
const Resume = () => {
  return (
    <div className="resume-container">
      {/* 头部信息 */}
      <header className="resume-header">
        <div className="name-section">
          <h1>焦玲</h1>
          <p className="job-title">后端/前端/全栈开发</p>
        </div>
        <div className="photo-section">
          <div className="photo-placeholder">
            <span>照片</span>
          </div>
        </div>
        <div className="contact-info">
          <p><span className="icon">👤</span> 性别：女 | 年龄：22岁</p>
          <p><span className="icon">📱</span> 电话：18219674838</p>
          <p><span className="icon">📧</span> 邮箱：482020095@qq.com</p>
          <p><span className="icon">📍</span> 现居城市：厦门</p>
        </div>
      </header>

      {/* 个人经历 */}
      <section className="section">
        <h2 className="section-title">个人经历</h2>
        <div className="section-content">
          <div className="experience-item">
            <h3>个人优势</h3>
            <ul>
              <li>做事认真细心负责,抗压能力强,为人热情开朗,沟通表达能力较强。</li>
              <li>熟悉编程语言(Java、Python等)、web前后端开发相关知识，开发文档与RESTful接口文档等。</li>
            </ul>
          </div>

          <div className="experience-item">
            <h3>教育经历</h3>
            <div className="education-detail">
              <p><strong>2023-2025年</strong>，先后担任厦门大学建筑与土木工程学院新媒体中心部长、宣传中心主任。</p>
              <ul>
                <li>协调宣传中心各部门工作，管理学院官方公众号</li>
                <li>担任阳光心理志愿者社团和新部部长、中华文化促进学社活动管理部副部长</li>
                <li>承办心理剧大赛、525心理月系列活动等多个校级活动</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 专业技能 */}
      <section className="section">
        <h2 className="section-title">专业技能</h2>
        <div className="section-content">
          <div className="skill-category">
            <h3>技术栈 - 前端开发</h3>
            <ul>
              <li>精通HTML5/CSS3，熟悉语义化标签及实现响应式布局，熟悉Ant Design、Bootstrap等组件库</li>
              <li>掌握JavaScript原型链、闭包、事件循环等核心特性及ES6+新特性</li>
              <li>熟悉异步编程（Promise/Async）、jQuery简化开发、AJAX、Axios/Fetch发送网络请求、实现请求拦截与响应拦截</li>
              <li>熟悉React框架及其生态链；函数式组件和类式组件的使用、常用Hook和自定义Hook的使用、React Router路由管理、Redux Toolkit状态管理、React Query/TanStack Query处理API请求和缓存</li>
              <li>掌握webpack构建工具，熟悉npm包管理</li>
            </ul>
          </div>

          <div className="skill-category">
            <h3>技术栈 - 后端开发</h3>
            <ul>
              <li>掌握Java面向对象开发，了解Node.js和Express框架</li>
              <li>熟悉Spring Boot整合SSM快速搭建、Spring MVC开发REST API、Spring Security+JWT实现登录校验和密码加密、Spring AOP实现公共字段填充、日志记录与事务管理、Spring Cache数据缓存、Spring Task任务调度等</li>
              <li>了解MySQL基础，MyBatis/MyBatis-Plus操作数据库，Redis缓存热点数据，RabbitMQ异步处理任务</li>
              <li>了解Git工作流，Postman/Swagger接口测试，Linux基础操作</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 项目经历 */}
      <section className="section">
        <h2 className="section-title">项目经历</h2>
        <div className="section-content">
          <div className="project-item">
            <h3>夜景时光——校园点餐系统（全栈）</h3>
            <div className="tech-stack">
              <strong>技术栈：</strong>前端(React、React Router、Redux Toolkit、React Query、TanStack Query)，后端（Spring Boot、Redis、RabbitMQ、MyBatis-Plus、MySQL、JWT、Spring AOP、Spring Cache、Spring Task、WebSocket）
            </div>
            <div className="project-description">
              <p><strong>项目描述：</strong>分为商家管理端和用户移动端，管理端包含门店管理、分类管理、菜品管理、套餐管理、订单管理、数据统计、核心功能，用户端包含下单、购物车管理、历史订单管理、地址管理等核心功能，通过模块化架构设计实现前后端解耦。</p>
            </div>
            <div className="project-highlights">
              <h4>项目亮点</h4>
              <ul>
                <li>通过API请求接口封装、自定义组件和Hook、路由配置、Spring三层架构与不同功能子工程分离实现前后端解耦</li>
                <li>前端使用请求拦截器辅助后端Token校验、响应拦截器辅助错误处理；使用Redux Toolkit管理用户和界面UI相关状态信息；React Query和TanStack Query处理API请求状态和数据缓存，实现了错误重传、不同请求状态界面及时切换、利用缓存缓存页面切换卡顿问题、自动刷新缓存等功能，优化用户体验</li>
                <li>后端使用JWT认证，通过Redis和Spring Cache实现数据缓存，降低数据库压力；基于WebSocket+Spring Task实现实时订单提醒与超时关单；通过AOP+MyBatis-Plus优化公共字段处理与动态SQL，减少冗余代码，RabbitMQ实现流量削峰</li>
              </ul>
            </div>
          </div>

          <div className="project-item">
            <h3>Chronos——个人博客（全栈）</h3>
            <div className="tech-stack">
              <strong>技术栈：</strong>前端(React、React Router、Redux Toolkit、React Query、TanStack Query、ByteMD)，后端（Spring Boot、Spring Security、Redis、MyBatis-Plus、MySQL、JWT、Spring AOP）
            </div>
            <div className="project-description">
              <p><strong>项目描述：</strong>采用ByteMD编辑器提供流畅的写作体验，实现文章管理、分类管理、留言功能、收藏功能等。</p>
            </div>
            <div className="project-highlights">
              <h4>项目亮点</h4>
              <ul>
                <li>前端采用ByteMD编辑器提供流畅的写作体验，支持Markdown渲染和代码高亮；使用Redux Toolkit管理用户和界面UI相关状态信息；React Query和TanStack Query处理API请求状态和数据缓存</li>
                <li>后端使用JWT认证，集成Elasticsearch进行全文搜索，使用Redis缓存减少数据库查询次数，提高数据库性能</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Resume;