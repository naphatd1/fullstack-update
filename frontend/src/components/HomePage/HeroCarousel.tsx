'use client';

import React from 'react';
import ImageCarousel from '../ImageCarousel';

const HeroCarousel: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-white dark:bg-gray-900">
      {/* Carousel Container - Full Height */}
      <div className="h-screen flex items-start justify-center px-3 xs:px-4 sm:px-6 lg:px-8 pt-6 xs:pt-5 sm:pt-4 md:pt-4 lg:pt-6 xl:pt-8 2xl:pt-10 3xl:pt-12 4xl:pt-16">
        <div className="w-full max-w-5xl sm:max-w-6xl lg:max-w-7xl xl:max-w-7xl 2xl:max-w-8xl 3xl:max-w-9xl mx-auto">
          <ImageCarousel />
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>
    </div>
  );
};

export default HeroCarousel;