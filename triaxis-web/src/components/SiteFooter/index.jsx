import React from 'react';
import { WechatOutlined } from '@ant-design/icons';
import './index.less';
import { NavLink } from 'react-router-dom';

const SiteFooter = () => {
  const footerSections = [
    {
      title: '关于我们',
      links: [
        { name: 'github主页', url: '#' },
        { name: '团队介绍', url: '/about' },
        { name: '联系我们', url: '/about' },
        { name: '加入我们', url: '/about' }
      ]
    },
    {
      title: '帮助中心',
      links: [
        { name: '会员权益', url: '#' },
        { name: '反馈中心', url: '#' }
      ]
    },
    {
      title: '法律信息',
      links: [
        { name: '隐私政策', url: '#' },
        { name: '用户协议', url: '#' },
      ]
    }
  ];

  return (
    <footer className="bg-gray-200 border-t border-main">
      <div className="container-footer">
        {/* 主要内容区域 */}
        <div className="py-10">
          {/* 外层网格：小屏单列，大屏左右布局 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            {/* 左侧：logo + 介绍 + 二维码（占7列） */}
            <div className="lg:col-span-6">
              {/* 使用flex布局实现垂直居中对齐 */}
              <div className="flex px-10 flex-collg:flex-row items-start lg:items-center gap-0">
                {/* Logo和介绍文字 */}
                <div className="flex-1 min-w-0">
                  <div className="mb-4 flex items-center space-x-3">
                    <div className="w-15 h-15 rounded-lg flex items-center justify-center">
                      <img src="/logo.png" alt="Triaxis" className="w-15 h-15" />
                    </div>
                    <span className="text-3xl font-bold text-main">Triaxis</span>
                  </div>
                  <p className="text-secondary text-md leading-relaxed">
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
            </div>

            {/* 右侧：链接区域（占5列） */}
            <div className="lg:col-span-6  px-10 grid grid-cols-2 md:grid-cols-3 gap-x-15 gap-y-6 mt-8 lg:mt-0">
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
                        className={({ isActive }) => isActive ? "text-secondary hover:text-primary transition-all duration-300 link-hover block" : "text-secondary hover:text-primary transition-all duration-300 link-hover block"}
                      >
                        {link.name}
                      </NavLink>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 版权信息区域 */}
        <div className="border-t border-main py-6">
          <div className="text-center">
            <p className="text-secondary text-sm">
              © 2025 池苒 版权所有  所有程序代码、设计方案均受《著作权法》保护，侵权必究
            </p>
            <p className="text-muted text-xs mt-2">
              ICP备案：京ICP备123456号
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
