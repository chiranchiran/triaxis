import React, { useState, useRef, useEffect } from 'react';
import { Button, Divider } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const ResouceCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const carouselRef = useRef(null);
  const autoPlayRef = useRef(null);
  const navigate = useNavigate();
  // 轮播图图片数据
  const carouselImages = [
    { image: "https://picsum.photos/id/24/800/500" },
    { image: "https://picsum.photos/id/26/800/500" },
    { image: "https://picsum.photos/id/42/800/500" }
  ];

  const itemCount = carouselImages.length;

  // 轮播切换逻辑
  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === itemCount - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === 0 ? itemCount - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
  };

  // 自动轮播控制
  const startAutoPlay = () => {
    autoPlayRef.current = setInterval(nextSlide, 5000);
  };

  const stopAutoPlay = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
  };

  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, []);

  // 轮播动画与过渡
  useEffect(() => {
    if (carouselRef.current) {
      const translate = -currentIndex * 100;
      carouselRef.current.style.transform = `translateX(${translate}%)`;
      const handleEnd = () => setIsTransitioning(false);
      carouselRef.current.addEventListener('transitionend', handleEnd);
      // return () => carouselRef.current.removeEventListener('transitionend', handleEnd);
    }
  }, [currentIndex]);

  return (
    <section className="section-spacing bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">核心功能</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">为您提供全方位的专业支持</p>
        </div>

        {/* 左右平级布局：直接用flex，去掉多余“卡片感”样式 */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* 左侧轮播图区域 */}
          <div className="rounded-lg w-full w-3/5 md:w-3/5 h-[500px] relative overflow-hidden">
            <div
              ref={carouselRef}
              className="flex h-full transition-transform duration-500 ease-out"
            >
              {carouselImages.map((item, index) => (
                <div
                  key={index}
                  className="min-w-full"
                  aria-hidden={index !== currentIndex}
                >
                  <img
                    src={item.image}
                    alt={`Course slide ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    loading={index === currentIndex ? "eager" : "lazy"}
                  />
                </div>
              ))}
            </div>

            {/* 轮播导航按钮 */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-all z-10"
              aria-label="上一页"
              disabled={isTransitioning}
            >
              <LeftOutlined className="text-gray-800" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-all z-10"
              aria-label="下一页"
              disabled={isTransitioning}
            >
              <RightOutlined className="text-gray-800" />
            </button>

            {/* 底部指示器（多图时显示） */}
            {itemCount > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {carouselImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`h-3 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-primary w-8' : 'bg-gray-300/50 w-3 hover:bg-gray-400/70'
                      }`}
                    aria-label={`切换到第${index + 1}页`}
                    disabled={isTransitioning}
                  />
                ))}
              </div>
            )}
          </div>

          {/* 右侧固定文字区域：完全扁平化，无多余卡片/遮挡层 */}
          <div className="w-full w-2/5 md:w-2/5 h-[500px] flex flex-col justify-center items-center p-8 md:p-12 bg-gray-50">
            <h3 className="text-2xl font-semibold text-gray-800 ">精品资源</h3>
            <Divider className="bg-gray-200" />
            <p className="text-gray-600 mb-20 leading-relaxed text-center">涵盖城乡规划各类规范、案例、研究报告，助力您的项目顺利推进</p>
            <Button
              type="primary"
              size="large"
              onClick={() => navigate('/resources')}
              className="bg-primary hover:shadow-lg w-35 transition-all bg-gray-800 text-white mp-4"
            >
              立即搜索
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResouceCarousel;