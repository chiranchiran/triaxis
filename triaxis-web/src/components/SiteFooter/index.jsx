import React from 'react';
import { WechatOutlined } from '@ant-design/icons';
import './index.less';
import { NavLink } from 'react-router-dom';
import Logo from '../Logo';

const SiteFooter = () => {
  const footerSections = [
    {
      title: '关于我们',
      links: [
        { name: 'github主页', url: '/about' },
        { name: '团队介绍', url: '/about' },
        { name: '联系我们', url: '/about' },
        { name: '加入我们', url: '/about' }
      ]
    },
    {
      title: '帮助中心',
      links: [
        { name: '会员权益', url: '/about' },
        { name: '反馈中心', url: '/about' }
      ]
    },
    {
      title: '法律信息',
      links: [
        { name: '隐私政策', url: '/about' },
        { name: '用户协议', url: '/about' },
      ]
    }
  ];

  return (
    <footer className="bg-gray border-t border-main container-footer pt-6 pb-2 px-8">
      {/* 主要内容区域 */}
      <div className="py-10 grid grid-cols-1 lg:grid-cols-12 gap-20">
        <div className="lg:col-span-6 px-10 flex justify-between ">
          {/* Logo和介绍文字 */}
          <div className="flex-1 min-w-0 pt-10">
            <Logo size="large" />
            <p className="mt-4 text-secondary text-md leading-relaxed">
              城乡规划专业交流平台，连接规划师的智慧。
            </p>
          </div>
          {/* 二维码区域 - 与logo垂直居中对齐 */}
          <div className="flex-shrink-0 px-13">
            <div className="bg-main rounded-lg p-3 inline-block mb-2 border border-main">
              <div className="w-32 h-32 bg-gray flex items-center justify-center text-muted rounded">
                <WechatOutlined className="text-3xl" />
              </div>
            </div>
            <p className="text-md text-muted text-center">微信扫码体验小程序</p>
          </div>
        </div>

        {/* 右侧：链接区域（占5列） */}
        <div className="lg:col-span-6 px-10 grid grid-cols-2 md:grid-cols-3 gap-x-15 gap-y-6 mt-8 lg:mt-0">
          {footerSections.map((section, index) => (
            <div key={index} className="space-y-4">
              <h3 className="text-lg font-semibold text-main">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <NavLink
                    key={linkIndex}
                    to={link.url}
                    className={({ isActive }) => isActive ? "text-secondary hover:text-primary transition-all duration-300 block" : "text-secondary hover:text-primary transition-all duration-300 block"}
                  >
                    {link.name}
                  </NavLink>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* 版权信息区域 */}
      <div className="border-t border-main py-6 text-center">
        <p className="text-secondary text-sm">
          © 2025 池苒 版权所有  所有程序代码、设计方案均受《著作权法》保护，侵权必究
        </p>
        <p className="text-muted text-xs mt-2">
          ICP备案：京ICP备123456号
        </p>
      </div>
    </footer>
  );
};

export default SiteFooter;
