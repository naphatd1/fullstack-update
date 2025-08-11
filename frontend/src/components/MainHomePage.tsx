'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import ClientOnly from './ClientOnly';
import LoadingSpinner from './LoadingSpinner';

// Import components normally to fix loading issues
import ImageCarousel from './ImageCarousel';
import AnimatedCards from './AnimatedCards';
import FloatingScrollIndicator from './FloatingScrollIndicator';
import { 
  Shield, 
  Zap, 
  Lock, 
  Globe, 
  Smartphone,
  ArrowRight,
  Star
} from 'lucide-react';

const MainHomePage: React.FC = () => {
  // Loading fallback component for SSR
  const LoadingFallback = () => (
    <div>
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-start justify-center pt-6 xs:pt-5 sm:pt-4 md:pt-4 lg:pt-6 xl:pt-8 2xl:pt-10 3xl:pt-12 4xl:pt-16">
        <div className="relative overflow-hidden w-full max-w-5xl sm:max-w-6xl lg:max-w-7xl xl:max-w-7xl 2xl:max-w-8xl 3xl:max-w-9xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
          {/* Image Carousel Section - Placeholder */}
          <div className="relative w-full h-[70vh] xs:h-[72vh] sm:h-[74vh] md:h-[76vh] lg:h-[76vh] xl:h-[78vh] 2xl:h-[80vh] 3xl:h-[82vh] 4xl:h-[84vh] bg-gray-200 dark:bg-gray-700 rounded-2xl sm:rounded-3xl animate-pulse"></div>
        </div>
      </div>
      {/* Loading placeholder for content */}
      <div className="bg-white dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="w-64 h-8 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-4 animate-pulse"></div>
            <div className="w-96 h-16 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-6 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );

  const features = [
    'ค้นหาบ้านในฝันของคุณได้ง่ายดาย',
    'เครื่องมือเปรียบเทียบราคาที่แม่นยำ',
    'ความเชี่ยวชาญด้านตลาดบ้าน',
    'บริการส่วนบุคคล ใส่ใจทุกรายละเอียด',
    'สนับสนุนลูกค้า 24/7 หลังการขาย'
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <ClientOnly fallback={<LoadingFallback />}>
        {/* Image Carousel Section */}
        <div className="relative overflow-hidden">
          <div className="min-h-screen bg-white dark:bg-gray-900 flex items-start justify-center pt-6 xs:pt-5 sm:pt-4 md:pt-4 lg:pt-6 xl:pt-8 2xl:pt-10 3xl:pt-12 4xl:pt-16">
            <div className="relative overflow-hidden w-full max-w-5xl sm:max-w-6xl lg:max-w-7xl xl:max-w-7xl 2xl:max-w-8xl 3xl:max-w-9xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
              <ImageCarousel />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-900">
          {/* Animated Cards Section */}
          <AnimatedCards />

          {/* Text Content Section */}
          <div className="py-12 sm:py-16 lg:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
                  ค้นหาบ้านในฝันของคุณ
                </h2>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  เราคือแพลตฟอร์มที่จะช่วยให้คุณค้นหาและเปรียบเทียบบ้านได้อย่างง่ายดาย 
                  พร้อมข้อมูลที่ครบถ้วนและเครื่องมือที่ทันสมัย
                </p>
              </div>

              {/* Features Grid */}
              <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative px-7 py-6 bg-white dark:bg-gray-800 ring-1 ring-gray-900/5 rounded-lg leading-none flex items-top justify-start space-x-6">
                    <Shield className="w-8 h-8 text-purple-600" />
                    <div className="space-y-2">
                      <p className="text-slate-800 dark:text-white font-medium">ความปลอดภัย</p>
                      <p className="text-slate-500 dark:text-gray-300 text-sm">ข้อมูลของคุณได้รับการปกป้องด้วยระบบรักษาความปลอดภัยระดับสูง</p>
                    </div>
                  </div>
                </div>

                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative px-7 py-6 bg-white dark:bg-gray-800 ring-1 ring-gray-900/5 rounded-lg leading-none flex items-top justify-start space-x-6">
                    <Zap className="w-8 h-8 text-blue-600" />
                    <div className="space-y-2">
                      <p className="text-slate-800 dark:text-white font-medium">ความเร็ว</p>
                      <p className="text-slate-500 dark:text-gray-300 text-sm">ค้นหาและเปรียบเทียบบ้านได้อย่างรวดเร็วด้วยเทคโนโลยีที่ทันสมัย</p>
                    </div>
                  </div>
                </div>

                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-600 to-yellow-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative px-7 py-6 bg-white dark:bg-gray-800 ring-1 ring-gray-900/5 rounded-lg leading-none flex items-top justify-start space-x-6">
                    <Globe className="w-8 h-8 text-orange-600" />
                    <div className="space-y-2">
                      <p className="text-slate-800 dark:text-white font-medium">ครอบคลุม</p>
                      <p className="text-slate-500 dark:text-gray-300 text-sm">ข้อมูลบ้านจากทั่วประเทศไทย พร้อมรายละเอียดที่ครบถ้วน</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features List */}
              <div className="mt-16">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
                  ทำไมต้องเลือกเรา?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Star className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Section */}
              <div className="mt-16 text-center">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
                  <h3 className="text-2xl font-bold mb-4">พร้อมเริ่มต้นแล้วหรือยัง?</h3>
                  <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                    เข้าร่วมกับเราวันนี้และค้นหาบ้านในฝันของคุณได้ทันที
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center">
                      เริ่มค้นหาบ้าน
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                    <button className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                      เรียนรู้เพิ่มเติม
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Scroll Indicator */}
        <FloatingScrollIndicator />
      </ClientOnly>
    </div>
  );
};

export default MainHomePage;