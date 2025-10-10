import React from 'react';
import HeroSection from './HeroSection';

import News from './News';
import './index.less'
import CourseCarousel from './CourseCarousel';
import ResouceCarousel from './ResouceCarousel';

function Home() {
  return (
    <div>
      <HeroSection />
      <ResouceCarousel />
      <CourseCarousel />
      <News />
    </div>
  )
}

export default Home


