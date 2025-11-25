import React from 'react';
import './index.less'
const Resume = () => {
  return (
    <div className="resume-container">
      <div className='resume overflow-hidden w-full h-full'>
        {/* 头部信息 */}
        <header className="resume-header flex gap-10 justify-between">


          <div className='flex flex-col items-start gap-1'>
            <div className="name-section flex gap-14 items-center">
              <h1>焦玲</h1>
              <p className="job-title">前端/后端/全栈开发</p>
            </div>
            <div className="contact-info flex gap-15 flex-wrap">
              <p> 性别：女</p>
              <p>
                年龄：22岁
              </p>
              <p> 现居城市：厦门</p>

            </div>
            <div className="contact-info flex gap-29 flex-wrap">

              <p> 电话：18219674838</p>
              <p>邮箱：482020095@qq.com</p>
            </div>
          </div>
          <div className="photo-section overflow-hidden'">
            <div className="photo-placeholder overflow-hidden'">
              {/* <span>照片</span> */}
              <img src="public/1.jpg" alt="" className='w-full overflow-hidden full-img' />
            </div>
          </div>
        </header>

        {/* 个人经历 */}
        <section className="section">
          <h2 className="section-title">教育经历</h2>
          <div className="section-content">
            <div className="experience-item flex items-center gap-4">
              <div className='text-base font-bold'>厦门大学（985）：</div> 2022.09 — 2027.06  城乡规划专业本科生
            </div>
          </div>
        </section>
        {/* 项目经历 */}
        <section className="section">
          <h2 className="section-title">项目经历</h2>
          <div className="section-content">
            <div className="project-item">
              <h3 className=''>Triaxis（三轴线）——城乡规划专业共享平台（全栈）</h3>
              <strong className="tech-title px-1">技术栈</strong>
              <div className=" project-highlights">
                <ul>
                  <li className=''>
                    前端：React + React Router + Redux Toolkit + TanStack Query + Axios + stomp.js + SockJS + Vite + React Virtualized + Antd + Semi + Tailwind CSS + react-i18next + Dexie + React Flow + react-md-editor
                  </li>
                  <li>
                    后端：Spring Boot + Spring Security + JWT + SSO + OAuth2 + Redis + MySQL + WebSocket + Spring AMQP + RabbitMQ  + MyBatis + MyBatis-Plus
                  </li>
                </ul>

                <span></span>
              </div>
              <div className="project-description">
                <p><strong>项目描述：</strong>基于React+Spring Boot打造服务于高校城乡规划专业的共享平台，涵盖资源、课程、社区、个人中心四大核心模块，核心构建SSO登录体系、WebSocket实时通信、大文件分片传输架构、网络请求全链路处理、语言主题切换、自适应列表渲染与虚拟列表优化，全面提升应用架构的健壮性与用户体验，推进高校师生的资源共享与学习交流。</p>
              </div>
              <div className="project-highlights">
                <h4>项目亮点</h4>
                <ul className="tech-stack text-pro">
                  <li><strong>SSO+OAuth2认证体系</strong>：基于OAuth2思想设计一套基于<span>双token+Redis+Cookie</span>的安全SSO系统，支持认证中心<span>自动登录</span>、子系统<span>无感刷新</span>、后台精准<span>吊销Token</span>和<span>设备管理</span>，同时防范CSRF、XSS攻击等安全问题，集成<span>OAuth2微信授权</span>等第三方授权管理，支撑多子系统安全接入。</li>
                  <li><strong>声明式权限管理</strong>：通过<span>Hook+高阶组件</span>分层封装核心逻辑，结合<span>懒加载+Suspense+useMemo</span>缓存优化，实现<span>动态路由（含权限继承）</span>、路由缓存与<span>按钮级权限</span>的精细化控制，联动用户身份状态完成路由/组件权限同步。</li>
                  <li><strong>WebSockt实时通信</strong>：基于 STOMP over WebSocket + SockJS 构建实时通信链路，通过<span>自动重连、心跳检测、消息积压缓存重发机制</span>等保障连接可靠性；设计统一hook，实现<span>组件级自动化管理</span>（连接建立、状态监听、订阅发布、生命周期清理）；
                    覆盖系统<span>广播</span>消息、点赞、收藏、单聊<span>点对点</span>通信等多场景实时推送，同时支撑消息<span>发送、撤回、删除、复制、历史消息同步</span>等完整交互，兼顾通信可靠性、开发效率与用户体验。</li>
                  <li><strong>大文件上传下载一体化方案</strong>：设计大文件上传和下载的统一分层架构，通过<span>统一调度、任务管理、分片管理、连接池全局并发控制</span>分层协作，提供上传下载的开始、暂停、恢复、重试、取消等<span>完整生命周期控制</span>，依托<span>WebWorker</span>哈希采样实现<span>秒传校验</span>、
                    Dexie本地存储实现<span>断点续传、暂停、恢复上传</span>功能，支持<span>分片失败自动重试、动态并发控制</span>、Streams API<span>流式读取Blob</span>避免内存堆积，实现架构稳定性、传输效率与用户体验的统一。</li>
                  <li><strong>网络请求全链路处理</strong>：设计了统一的网络请求处理架构，对<span>Axios</span>和<span>WebSocket</span>请求进行集中管理，实现了<span>请求去重、自动Token注入、智能重试与自定义错误分类包装</span>，结合<span>React Query</span>与组件级回调函数，构建了从全局拦截到组件自定义的<span>分层错误处理</span>链路，有效提升了应用的健壮性与用户体验一致性。</li>
                  <li><strong>自适应列表渲染</strong>：结合不同场景选择不同<span>资源展示方案</span>，并封装组件<span>智能识别</span>数据量动态切换<span>无限滚动、按钮加载更多</span>和基于React Virtualized动态高度计算的<span>虚拟列表</span>三种模式，实现最佳性能体验。</li>
                  <li><strong>国际化与主题切换</strong>：通过 React Context设计了集中式用户<span>偏好管理系统</span>，并结合 localStorage 持久化存储用户设置。封装统一的<span>语言、主题切换</span>接口，无缝对接i18n、Antd、Semi、dayjs实现动态语言切，通过CSS 变量与自定义属性支持<span>亮色/暗色主题</span>切换，并同时适配自定义组件、Antd、Semi、Tailwind CSS等。</li>
                </ul>
                {/* <ul className="tech-stack text-">
                <li><strong>统一认证体系</strong>：基于OAuth2设计双Token+Redis的SSO系统，支持自动登录、无感刷新、设备级Token管理，集成微信授权，防范CSRF/XSS攻击，保障多子系统安全接入</li>
                <li><strong>精细化权限管理</strong>：通过Hook+高阶组件实现声明式权限控制，结合动态路由、权限继承与组件级细粒度管控，配合懒加载与缓存优化，确保权限状态实时同步</li>
                <li><strong>可靠实时通信</strong>：基于STOMP over WebSocket构建全双工通信链路，具备自动重连、心跳检测、消息队列保障，覆盖单聊、广播等多场景，支持消息撤回、删除、复制等完整交互</li>
                <li><strong>高性能文件传输</strong>：设计分层式大文件上传架构，集成WebWorker哈希秒传、IndexedDB断点续传、动态分片策略与连接池并发控制，实现传输效率提升30%+与内存优化70%</li>
                <li><strong>全链路错误处理</strong>：构建统一网络请求错误处理架构，实现请求去重、Token自动注入、智能重试与分类包装，建立从全局拦截到组件自定义的完整错误处理链路</li>
                <li><strong>智能渲染优化</strong>：封装自适应渲染组件，根据数据量动态切换虚拟列表、无限滚动与分页加载模式，集成动态高度计算与滚动定位，确保万级数据流畅渲染</li>
                <li><strong>多语言主题系统</strong>：基于Context实现集中式偏好管理，无缝对接i18n框架与UI组件库，支持亮色/暗色主题一键切换，提升用户体验一致性与国际化支持</li>
              </ul> */}
              </div>
            </div>
          </div>
        </section>
        {/* 专业技能 */}
        <section className="section">
          <h2 className="section-title mb-2">专业技能</h2>
          <div className="section-content">
            <div className="project-highlights text-sm">
              <ul>
                <li>掌握JavaScript核心特性（原型链、闭包、事件循环）及ES6+新特性，异步编程（Promise/Async/Await），使用Axios实现请求/响应拦截，结合TanStack Query处理API请求与缓存，高效解决网络请求全链路问题。</li>
                <li>熟悉React框架及生态体系：React Router路由权限控制，Redux Toolkit全局状态管理，react-i18next国际化等。</li>
                <li>了解实时通信方案，基于WebSockt和STOMP协议，使用stomp+SockJS+Spring AMQP构建WebSocket通信。</li>
                <li>熟悉Antd、Semi、Tailwind CSS 等UI框架的使用与主题适配、国际化方案，能独立封装高可用自定义组件。</li>
                <li>了解Git工作流与vite打包，具备全栈开发能力，熟悉 Spring系列、MySQL、Redis等后端技术栈。</li>

                <li>精通HTML5/CSS3，熟悉语义化标签及实现响应式布局，熟悉Ant Design + Bootstrap等组件库</li>
                <li>掌握JavaScript原型链 + 闭包 + 事件循环等核心特性及ES6 + 新特性</li>
                <li>熟悉异步编程（Promise/Async） + jQuery简化开发 + AJAX + Axios/Fetch发送网络请求 + 实现请求拦截与响应拦截</li>
                <li>熟悉React框架及其生态链；函数式组件和类式组件的使用 + 常用Hook和自定义Hook的使用 + React Router路由管理 + Redux Toolkit状态管理 + React Query/TanStack Query处理API请求和缓存</li>
                <li>掌握webpack构建工具，熟悉npm包管理</li>
              </ul>
            </div>

            {/* <div className="skill-category">
            <h3>技术栈 - 后端开发</h3>
            <ul>
              <li>掌握Java面向对象开发，了解Node.js和Express框架</li>
              <li>熟悉Spring Boot整合SSM快速搭建 + Spring MVC开发REST API + Spring Security + JWT实现登录校验和密码加密 + Spring AOP实现公共字段填充 + 日志记录与事务管理 + Spring Cache数据缓存 + Spring Task任务调度等</li>
              <li>了解MySQL基础，MyBatis/MyBatis-Plus操作数据库，Redis缓存热点数据，RabbitMQ异步处理任务</li>
              <li>了解Git工作流，Postman/Swagger接口测试，Linux基础操作</li>
            </ul>
          </div> */}
          </div>
        </section>
      </div>



    </div>
  );
};

export default Resume;