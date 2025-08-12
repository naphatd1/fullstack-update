'use client';

import React from 'react';
import { CheckCircle, Star, Lock, Globe, Zap, Smartphone } from 'lucide-react';

const BenefitsSection: React.FC = () => {
  const benefits = [
    'บ้านคุณภาพ ราคาเป็นธรรม',
    'ทำเลดี การเดินทางสะดวก',
    'ตรวจสอบเอกสารครบถ้วน',
    'ความเชี่ยวชาญด้านตลาดบ้าน',
    'บริการส่วนบุคคล ใส่ใจทุกรายละเอียด',
    'สนับสนุนลูกค้า 24/7 หลังการขาย'
  ];

  return (
    <div className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
              ทำไมต้องเลือกบ้านกับเรา?
            </h2>
            <div className="space-y-4">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <span className="text-lg text-gray-700 dark:text-gray-300">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
              <div className="flex items-center mb-6">
                <Star className="h-6 w-6 text-yellow-300 mr-2" />
                <span className="text-lg font-semibold">บริการพรีเมียม</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">
                บ้านคุณภาพ บริการเยี่ยม
              </h3>
              <p className="text-blue-100 mb-6">
                เราให้บริการด้านอสังหาริมทรัพย์อย่างครบวงจร ด้วยความเชี่ยวชาญ 
                การดูแลอย่างใส่ใจ และบริการลูกค้าระดับพรีเมียม เพื่อให้การลงทุนของคุณเติบโตอย่างมั่นคง
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center">
                  <Lock className="h-4 w-4 mr-2" />
                  <span>เชื่อถือได้ ปลอดภัย</span>
                </div>
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-2" />
                  <span>ครอบคลุมทุกพื้นที่</span>
                </div>
                <div className="flex items-center">
                  <Zap className="h-4 w-4 mr-2" />
                  <span>ตอบสนองรวดเร็ว</span>
                </div>
                <div className="flex items-center">
                  <Smartphone className="h-4 w-4 mr-2" />
                  <span>พร้อมให้บริการตลอด</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BenefitsSection;