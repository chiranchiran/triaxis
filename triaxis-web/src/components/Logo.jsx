import React from 'react'
import { NavLink } from 'react-router-dom';

export default function Logo({ size, title, onClick, isNav = false }) {
  const getSize = (n) => {
    switch (n) {
      case 'small':
        return [8, 'text-xl'];
      case 'large':
        return [12, 'text-3xl'];
      case 'xl':
        return [20, "text-6xl"];
      default:
        return [10, 'text-2xl'];
    }
  }
  const name = title || "Triaxis"
  const [imageSize, textClass] = getSize(size);
  const content = (
    <>
      <img
        src="/logo.png"
        alt="Triaxis"
        className={`w-${imageSize} h-${imageSize}`}
      />
      <span className={`${textClass} font-bold text-main`}>{name}</span>
    </>
  );


  return (
    isNav ? (
      <NavLink
        to='/'
        className="logo flex items-center space-x-3"
      >
        {content}
      </NavLink>
    ) : (
      <div onClick={onClick} className="flex items-center space-x-3">
        {content}
      </div>
    )
  );
};