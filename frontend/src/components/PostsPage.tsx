"use client";

import React, { useState } from "react";
import PropertyForm from "./PropertyForm";
import AnimatedCards from "./AnimatedCards";
import { Plus, X } from "lucide-react";

interface PropertyFormData {
  title: string;
  description: string;
  price: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  category: string;
  badges: string[];
  images: string[];
}

interface CardData {
  id: number;
  title: string;
  description: string;
  image: string;
  badges: string[];
  stats: {
    views: number;
    likes: number;
    rating: number;
  };
  date: string;
  category: string;
  price: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  fullText: string;
  imageUrls: string[];
}

const PostsPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [newCards, setNewCards] = useState<CardData[]>([]);

  const handleFormSubmit = (formData: PropertyFormData) => {
    // Convert form data to card data
    const newCard: CardData = {
      id: Date.now(),
      title: formData.title,
      description: formData.description,
      image: formData.images[0] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
      badges: formData.badges.length > 0 ? formData.badges : ["ใหม่"],
      stats: {
        views: Math.floor(Math.random() * 100) + 1,
        likes: Math.floor(Math.random() * 50) + 1,
        rating: 4.5 + Math.random() * 0.5,
      },
      date: new Date().toISOString(),
      category: formData.category,
      price: formData.price,
      location: formData.location,
      bedrooms: formData.bedrooms,
      bathrooms: formData.bathrooms,
      area: formData.area,
      fullText: formData.description,
      imageUrls: formData.images.length > 0 ? formData.images : [
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop"
      ],
    };

    // Add new card to the beginning of the list
    setNewCards(prev => [newCard, ...prev]);
    setShowForm(false);
    
    // Show success message
    alert("เพิ่มประกาศสำเร็จ!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Add Button */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">โพสต์</h1>
              {newCards.length > 0 && (
                <div className="ml-4 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  {newCards.length} ประกาศใหม่
                </div>
              )}
            </div>
            
            {/* Add New Post Button */}
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Plus className="w-5 h-5 mr-2" />
              <span className="font-medium">เพิ่มประกาศใหม่</span>
            </button>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <PropertyForm
              onSubmit={handleFormSubmit}
              onClose={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      {/* New Posts Section */}
      {newCards.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></span>
                ประกาศใหม่ของคุณ
              </h2>
              <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {newCards.length} ประกาศ
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {newCards.map((card) => (
                <div
                  key={card.id}
                  className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-green-200"
                >
                  <div className="relative h-48">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-lg font-bold text-sm shadow-lg">
                      ฿{card.price}
                    </div>
                    <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      ใหม่!
                    </div>
                    <div className="absolute bottom-3 left-3 flex gap-1">
                      {card.badges.slice(0, 2).map((badge, index) => (
                        <span
                          key={index}
                          className="bg-white/90 text-gray-800 px-2 py-1 rounded text-xs font-medium shadow-sm"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-1">
                      {card.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {card.description}
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-3">
                      <div className="flex items-center">
                        <span className="mr-1">📍</span>
                        <span className="truncate">{card.location}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-1">🏠</span>
                        <span>{card.bedrooms} ห้องนอน</span>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-1">🚿</span>
                        <span>{card.bathrooms} ห้องน้ำ</span>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-1">📐</span>
                        <span>{card.area}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex space-x-3">
                        <span className="flex items-center">
                          <span className="mr-1">👁️</span>
                          {card.stats.views}
                        </span>
                        <span className="flex items-center">
                          <span className="mr-1">❤️</span>
                          {card.stats.likes}
                        </span>
                      </div>
                      <span className="flex items-center">
                        <span className="mr-1">⭐</span>
                        {card.stats.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* All Posts Section */}
      <div className="border-t-4 border-gray-200">
        <AnimatedCards newCards={newCards} />
      </div>

      {/* Floating Add Button for Mobile */}
      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center z-40 lg:hidden"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
};

export default PostsPage;