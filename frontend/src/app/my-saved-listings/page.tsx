"use client";

import React, { useState, useEffect } from "react";
import { houseSalesAPI, HouseSaleData } from "@/lib/api/house-sales";
import { Send, Edit, Trash2, Eye, Home, ArrowLeft } from "lucide-react";
import Link from "next/link";

const MySavedListingsPage: React.FC = () => {
  const [savedListings, setSavedListings] = useState<HouseSaleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishingId, setPublishingId] = useState<string | null>(null);

  useEffect(() => {
    fetchSavedListings();
  }, []);

  const fetchSavedListings = async () => {
    try {
      const response = await houseSalesAPI.getMySavedHouseSales();
      if (response.success) {
        setSavedListings(response.data);
      }
    } catch (error) {
      console.error('Error fetching saved listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (id: string) => {
    if (!id) return;
    
    setPublishingId(id);
    try {
      const response = await houseSalesAPI.publishHouseSale(id);
      if (response.success) {
        // หา listing ที่จะโพสต์
        const listingToPublish = savedListings.find(listing => listing.id === id);
        
        if (listingToPublish) {
          // สร้าง card data สำหรับแสดงใน homepage
          const cardData = {
            id: Date.now(),
            title: listingToPublish.title,
            description: listingToPublish.description || "บ้านคุณภาพดี พร้อมอยู่",
            image: listingToPublish.images?.[0] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
            badges: listingToPublish.badges || ["โพสต์ใหม่"],
            stats: { views: 0, likes: 0, rating: 5.0 },
            date: new Date().toISOString(),
            category: listingToPublish.houseType,
            price: listingToPublish.price,
            location: listingToPublish.location,
            bedrooms: listingToPublish.bedrooms,
            bathrooms: listingToPublish.bathrooms,
            floors: listingToPublish.floors || 1,
            parkingSpaces: listingToPublish.parkingSpaces || 0,
            usableArea: listingToPublish.usableArea ? `${listingToPublish.usableArea} ตร.ม.` : "ไม่ระบุ",
            landArea: listingToPublish.landArea ? `${listingToPublish.landArea} ตร.ว.` : "ไม่ระบุ",
            fullText: listingToPublish.description || "",
            imageUrls: listingToPublish.images || [],
          };

          // บันทึกลง localStorage เพื่อแสดงใน homepage
          try {
            const existingCards = JSON.parse(localStorage.getItem('userHouseCards') || '[]');
            const updatedCards = [cardData, ...existingCards];
            localStorage.setItem('userHouseCards', JSON.stringify(updatedCards));
            
            // Trigger event เพื่อให้ cards อัพเดท
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new Event('houseSaleAdded'));
            }
          } catch (storageError) {
            console.error("❌ Failed to save to localStorage:", storageError);
          }
        }
        
        alert('โพสต์ประกาศสำเร็จ! ประกาศจะแสดงในหน้าหลักแล้ว');
        // Remove from saved listings
        setSavedListings(prev => prev.filter(listing => listing.id !== id));
      }
    } catch (error) {
      console.error('Error publishing listing:', error);
      alert('เกิดข้อผิดพลาดในการโพสต์ประกาศ');
    } finally {
      setPublishingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!id) return;
    
    if (confirm('คุณแน่ใจหรือไม่ที่จะลบประกาศนี้?')) {
      try {
        await houseSalesAPI.deleteHouseSale(id);
        setSavedListings(prev => prev.filter(listing => listing.id !== id));
        alert('ลบประกาศสำเร็จ');
      } catch (error) {
        console.error('Error deleting listing:', error);
        alert('เกิดข้อผิดพลาดในการลบประกาศ');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">กำลังโหลด...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
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
              ประกาศที่บันทึกไว้
            </h1>
            
            <p className="text-gray-600 max-w-2xl mx-auto">
              จัดการประกาศที่คุณบันทึกไว้ คุณสามารถโพสต์ แก้ไข หรือลบประกาศได้
            </p>
          </div>
        </div>

        {/* Listings */}
        {savedListings.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Home className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              ไม่มีประกาศที่บันทึกไว้
            </h3>
            <p className="text-gray-600 mb-6">
              คุณยังไม่มีประกาศที่บันทึกไว้ เริ่มสร้างประกาศใหม่กันเลย
            </p>
            <Link
              href="/sell-house"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Home className="w-4 h-4 mr-2" />
              สร้างประกาศใหม่
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedListings.map((listing) => (
              <div key={listing.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Image */}
                <div className="relative h-48">
                  <img
                    src={listing.images?.[0] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop"}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-2 py-1 rounded text-xs font-bold">
                    ฿{listing.price}
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium">
                      บันทึกแล้ว
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                    {listing.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {listing.description || "ไม่มีคำอธิบาย"}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-4">
                    <div>📍 {listing.location}</div>
                    <div>🏠 {listing.bedrooms} ห้องนอน</div>
                    <div>🚿 {listing.bathrooms} ห้องน้ำ</div>
                    <div>🚗 {listing.parkingSpaces || 0} ที่จอดรถ</div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handlePublish(listing.id!)}
                      disabled={publishingId === listing.id}
                      className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center text-sm disabled:opacity-50"
                    >
                      {publishingId === listing.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-1" />
                          โพสต์
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={() => alert('ฟีเจอร์แก้ไขจะเพิ่มในเร็วๆ นี้')}
                      className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => handleDelete(listing.id!)}
                      className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tips */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">💡 เกี่ยวกับประกาศที่บันทึกไว้</h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>• ประกาศที่บันทึกไว้จะไม่แสดงในหน้าหลักจนกว่าคุณจะกดโพสต์</li>
            <li>• คุณสามารถแก้ไขประกาศก่อนโพสต์ได้</li>
            <li>• เมื่อโพสต์แล้ว ประกาศจะย้ายไปยังรายการประกาศที่เผยแพร่แล้ว</li>
            <li>• ประกาศที่บันทึกไว้จะถูกเก็บไว้จนกว่าคุณจะลบหรือโพสต์</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MySavedListingsPage;