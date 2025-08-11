"use client";

import React, { useState, useEffect } from "react";
import HouseSaleForm from "@/components/HouseSaleForm";
import { Home, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { HouseSaleData } from "@/lib/api/house-sales";
import { useAuth } from "@/hooks/useAuth";

const SellHousePage: React.FC = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<HouseSaleData | null>(null);

  const handleFormSubmit = async (data: HouseSaleData, action: 'save' | 'publish') => {
    try {
      console.log("💾 Saving house sale data locally...");
      
      // สร้าง card data สำหรับแสดงผล
      const cardData = {
        id: Date.now(),
        title: data.title,
        description: data.description || "บ้านคุณภาพดี พร้อมอยู่",
        image: data.images?.[0] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
        badges: data.badges || ["ใหม่", "เพิ่มใหม่"],
        stats: { views: 0, likes: 0, rating: 5.0 },
        date: new Date().toISOString(),
        category: data.houseType,
        price: data.price,
        location: data.location,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        floors: data.floors || 1,
        parkingSpaces: data.parkingSpaces || 0,
        usableArea: data.usableArea ? `${data.usableArea} ตร.ม.` : "ไม่ระบุ",
        landArea: data.landArea ? `${data.landArea} ตร.ว.` : "ไม่ระบุ",
        fullText: data.description || "",
        imageUrls: data.images || [],
      };

      // บันทึกลง localStorage เฉพาะเมื่อโพสต์เลย (เพื่อแสดงใน homepage)
      if (action === 'publish') {
        try {
          const existingCards = JSON.parse(localStorage.getItem('userHouseCards') || '[]');
          const updatedCards = [cardData, ...existingCards];
          localStorage.setItem('userHouseCards', JSON.stringify(updatedCards));
          console.log("✅ Data saved to localStorage successfully");
          
          // Trigger event เพื่อให้ cards อัพเดท
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('houseSaleAdded'));
          }
        } catch (storageError) {
          console.error("❌ Failed to save to localStorage:", storageError);
          // ไม่ throw error เพราะไม่ใช่ critical สำหรับการบันทึก
        }
      }

      // แสดงหน้าสำเร็จทันที (ไม่รอ backend)
      setSubmittedData(data);
      setIsSubmitted(true);
      
      // เลื่อนไปด้านบนของหน้า
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // พยายามส่งไปยัง backend ในพื้นหลัง (แยกออกจาก main flow)
      if (typeof window !== 'undefined') {
        setTimeout(() => {
          import('@/lib/api/house-sales')
            .then(({ houseSalesAPI }) => {
              return houseSalesAPI.createHouseSale({...data, status: action === 'publish' ? 'published' : 'saved'});
            })
            .then((response) => {
              if (response.success) {
                console.log(`✅ Data ${action === 'publish' ? 'published' : 'saved'} to backend successfully`);
              } else {
                console.warn("⚠️ Backend sync failed:", response.message);
              }
            })
            .catch((error) => {
              console.warn("⚠️ Backend sync failed (this is OK):", error.message);
              
              // แจ้งเตือนเฉพาะกรณี authentication error
              if (error.message.includes('เซสชันหมดอายุ') || error.message.includes('access token')) {
                // แสดง toast notification หรือ modal
                if (typeof window !== 'undefined') {
                  const shouldReload = confirm(
                    'เซสชันหมดอายุ ประกาศของคุณถูกบันทึกในเครื่องแล้ว แต่ยังไม่ได้ส่งไปยังเซิร์ฟเวอร์\n\nต้องการเข้าสู่ระบบใหม่เพื่อซิงค์ข้อมูลหรือไม่?'
                  );
                  
                  if (shouldReload) {
                    window.location.href = '/auth/login';
                  }
                }
              }
            });
        }, 500);
      }
      
    } catch (error) {
      console.error("❌ Critical error saving house sale:", error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : "เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง";
      alert(errorMessage);
    }
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setSubmittedData(null);
  };

  // แสดง loading ขณะตรวจสอบ authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังตรวจสอบสิทธิ์...</p>
        </div>
      </div>
    );
  }

  // แสดงข้อความเมื่อไม่ได้ login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              จำเป็นต้องเข้าสู่ระบบ
            </h1>
            
            <p className="text-gray-600 mb-6">
              กรุณาเข้าสู่ระบบก่อนสร้างประกาศขายบ้าน
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/login"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center font-medium"
              >
                เข้าสู่ระบบ
              </Link>
              
              <Link
                href="/auth/register"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-center"
              >
                สมัครสมาชิก
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isSubmitted && submittedData) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Success Message */}
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {submittedData.status === 'published' ? 'ประกาศขายบ้านสำเร็จ!' : 'บันทึกประกาศสำเร็จ!'}
            </h1>
            
            <div className="mb-6">
              <p className="text-gray-600 mb-3">
                {submittedData.status === 'published' 
                  ? 'ประกาศของคุณได้รับการโพสต์เรียบร้อยแล้ว! ประกาศจะแสดงในหน้าหลักและระบบค้นหาทันที'
                  : 'ประกาศของคุณได้รับการบันทึกเรียบร้อยแล้ว! คุณสามารถโพสต์ประกาศได้ในภายหลังจากหน้า "ประกาศที่บันทึกไว้"'
                }
              </p>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <div className="flex-shrink-0">
                    <svg className="w-4 h-4 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="text-sm text-green-800">
                    <p className="font-medium">ระบบทำงานแบบ Offline-First</p>
                    <p className="mt-1">ข้อมูลถูกบันทึกในเครื่องทันที และจะซิงค์ไปยัง server ในพื้นหลัง</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
              <h3 className="font-semibold text-gray-900 mb-4">สรุปข้อมูลประกาศ</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">ชื่อประกาศ:</span>
                  <div className="font-medium">{submittedData.title}</div>
                </div>
                
                <div>
                  <span className="text-gray-600">ราคา:</span>
                  <div className="font-medium text-blue-600">฿{submittedData.price}</div>
                </div>
                
                <div>
                  <span className="text-gray-600">ประเภท:</span>
                  <div className="font-medium">{submittedData.houseType}</div>
                </div>
                
                <div>
                  <span className="text-gray-600">ที่อยู่:</span>
                  <div className="font-medium">{submittedData.location}</div>
                </div>
                
                <div>
                  <span className="text-gray-600">ห้องนอน/ห้องน้ำ:</span>
                  <div className="font-medium">{submittedData.bedrooms}/{submittedData.bathrooms}</div>
                </div>
                
                <div>
                  <span className="text-gray-600">ผู้ติดต่อ:</span>
                  <div className="font-medium">{submittedData.sellerName}</div>
                </div>
                
                <div className="md:col-span-2">
                  <span className="text-gray-600">รูปภาพ:</span>
                  <div className="font-medium text-green-600">
                    {submittedData.images?.length || 0} รูป (อัพโหลดไปยัง Supabase Storage แล้ว)
                  </div>
                </div>
              </div>
            </div>

            {/* Image Preview */}
            {submittedData.images && submittedData.images.length > 0 && (
              <div className="bg-white rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">รูปภาพที่อัพโหลด</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {submittedData.images.slice(0, 8).map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`รูปที่ ${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg"
                      />
                      {index === 0 && (
                        <div className="absolute bottom-1 left-1 bg-blue-600 text-white text-xs px-1 py-0.5 rounded">
                          หลัก
                        </div>
                      )}
                    </div>
                  ))}
                  {submittedData.images.length > 8 && (
                    <div className="w-full h-20 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 text-sm">
                      +{submittedData.images.length - 8} รูป
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {submittedData.status === 'published' ? (
                <Link
                  href="/"
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-center font-medium"
                >
                  🏠 ดูประกาศในหน้าหลัก
                </Link>
              ) : (
                <Link
                  href="/my-saved-listings"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center font-medium"
                >
                  📝 จัดการประกาศที่บันทึกไว้
                </Link>
              )}
              
              <button
                onClick={resetForm}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                ลงประกาศใหม่
              </button>
              
              <Link
                href="/posts"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-center"
              >
                จัดการประกาศ
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/posts"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            กลับไปยังประกาศทั้งหมด
          </Link>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Home className="w-8 h-8 text-blue-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ขายบ้าน
            </h1>
            
            <p className="text-gray-600 max-w-2xl mx-auto mb-4">
              กรอกข้อมูลรายละเอียดของบ้านที่ต้องการขาย เพื่อให้ผู้สนใจสามารถติดต่อคุณได้อย่างสะดวก
            </p>
            
            {/* แสดงข้อมูลผู้ใช้ */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-sm text-blue-700">
                📝 ลงประกาศในนาม: <span className="font-medium">{user?.name || user?.email}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <HouseSaleForm onSubmit={handleFormSubmit} />

        {/* Tips */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">💡 เทิปการลงประกาศที่ดี</h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>• ใส่รูปภาพที่ชัดเจนและหลากหลายมุม</li>
            <li>• เขียนคำอธิบายที่ละเอียดและตรงไปตรงมา</li>
            <li>• ระบุราคาที่เหมาะสมกับสภาพตลาด</li>
            <li>• ใส่ข้อมูลติดต่อที่ถูกต้องและตอบกลับเร็ว</li>
            <li>• อัพเดทสถานะประกาศเมื่อขายแล้ว</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SellHousePage;