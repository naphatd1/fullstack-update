'use client';

import React from 'react';
import Link from 'next/link';
import { Zap, ArrowRight } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <div className="py-12 sm:py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <div className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs sm:text-sm font-medium mb-4 sm:mb-6 lg:mb-8">
            <Zap className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
            ผู้เชี่ยวชาญด้านอสังหาริมทรัพย์
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 dark:text-white leading-tight">
            <span className="block">บ้านในฝัน</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800">
              ที่คุณหาอยู่
            </span>
          </h1>
          
          <p className="mt-4 sm:mt-6 lg:mt-8 max-w-3xl mx-auto text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 leading-relaxed px-4 sm:px-0">
            แหล่งรวมบ้านคุณภาพ ทำเลดี ราคาเป็นธรรม พร้อมบริการครบวงจร 
            ตั้งแต่การดูบ้าน จนถึงการโอนกรรมสิทธิ์ ด้วยทีมผู้เชี่ยวชาญมากประสบการณ์
          </p>
          
          <div className="mt-6 sm:mt-8 lg:mt-10 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4 sm:px-0">
            <Link
              href="/auth/register"
              className="group inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl w-full sm:w-auto"
            >
              เริ่มต้นหาบ้าน
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium rounded-xl text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl w-full sm:w-auto"
            >
              เข้าสู่ระบบ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;