'use client';

import React from 'react';
import { Shield, FileText, Upload, Users } from 'lucide-react';

const FeaturesSection: React.FC = () => {
  const features = [
    {
      name: 'บ้านคุณภาพพรีเมียม',
      description: 'คัดสรรบ้านคุณภาพสูง ทำเลดี พร้อมอยู่ ราคาเหมาะสม พร้อมบริการถ่ายภาพมืออาชีพ',
      icon: Shield,
      color: 'bg-blue-500',
    },
    {
      name: 'บริการครบวงจร',
      description: 'บริการตั้งแต่ดูบ้าน จนถึงโอนกรรมสิทธิ์ พร้อมคำปรึกษาด้านสินเชื่อและกฎหมาย',
      icon: FileText,
      color: 'bg-green-500',
    },
    {
      name: 'ทัวร์บ้านออนไลน์',
      description: 'ชมบ้านแบบ 360 องศา ผ่านระบบ Virtual Tour คุณภาพสูง ประหยัดเวลาในการเดินทาง',
      icon: Upload,
      color: 'bg-purple-500',
    },
    {
      name: 'ผู้เชี่ยวชาญด้านบ้าน',
      description: 'ทีมงานมืออาชีพ ประสบการณ์กว่า 10 ปี ให้คำปรึกษาการลงทุนและเลือกบ้านที่เหมาะสม',
      icon: Users,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="py-12 sm:py-16 lg:py-24 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
            ทำไมต้องเลือกเรา
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4 sm:px-0">
            ประสบการณ์การบริการที่เหนือระดับ ด้วยบ้านคุณภาพ ผู้เชี่ยวชาญมืออาชีพ และบริการครบวงจร
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 sm:gap-8">
          {features.map((feature, index) => (
            <div 
              key={feature.name} 
              className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-2xl ${feature.color} text-white mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-6 w-6 sm:h-8 sm:w-8" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                  {feature.name}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;