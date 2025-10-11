import React from 'react'

export default function Logo({ size }) {
  const getSize = (n) => {
    switch (n) {
      case 'small':
        return [8, 'text-xl'];
      case 'large':
        return [12, 'text-3xl'];
      default: // 默认尺寸
        return [10, 'text-2xl'];
    }
  };

  const [imageSize, textClass] = getSize(size);

  return (
    <div className="flex items-center space-x-3">
      <img
        src="/logo.png"
        alt="Triaxis"
        className={`w-${imageSize} h-${imageSize}`}
      />
      <span className={`${textClass} font-bold text-main`}>Triaxis</span>
    </div>
  );
}