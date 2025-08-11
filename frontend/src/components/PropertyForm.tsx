"use client";

import React, { useState } from "react";
import {
  Home,
  MapPin,
  Bath,
  Car,
  Upload,
  X,
  Plus,
  Save,
  Eye,
} from "lucide-react";

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

interface PropertyFormProps {
  onSubmit: (data: PropertyFormData) => void;
  onClose?: () => void;
}

const PropertyForm: React.FC<PropertyFormProps> = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState<PropertyFormData>({
    title: "",
    description: "",
    price: "",
    location: "",
    bedrooms: 1,
    bathrooms: 1,
    area: "",
    category: "บ้านเดี่ยว",
    badges: [],
    images: [],
  });

  const [newBadge, setNewBadge] = useState("");
  const [newImage, setNewImage] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const categories = [
    "บ้านเดี่ยว",
    "ทาวน์โฮม",
    "ทาวน์เฮ้าส์",
    "คอนโด",
    "วิลล่า",
    "บ้านสวน",
    "บ้านไร่",
    "อพาร์ทเมนท์",
    "เพนท์เฮ้าส์",
    "บ้านพักตากอากาศ",
  ];

  const suggestedBadges = [
    "ยอดนิยม",
    "แนะนำ",
    "ใหม่",
    "หรู",
    "ขายด่วน",
    "รีโนเวทใหม่",
    "พร้อมอยู่",
    "โปรโมชั่น",
    "ใกล้รถไฟฟ้า",
    "เงียบสงบ",
    "ครอบครัว",
    "คุณภาพ",
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNumberChange = (field: "bedrooms" | "bathrooms", value: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: Math.max(1, value),
    }));
  };

  const addBadge = (badge: string) => {
    if (badge && !formData.badges.includes(badge) && formData.badges.length < 5) {
      setFormData((prev) => ({
        ...prev,
        badges: [...prev.badges, badge],
      }));
      setNewBadge("");
    }
  };

  const removeBadge = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      badges: prev.badges.filter((_, i) => i !== index),
    }));
  };

  const addImage = () => {
    if (newImage && !formData.images.includes(newImage) && formData.images.length < 20) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, newImage],
      }));
      setNewImage("");
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title || !formData.price || !formData.location || !formData.area) {
      alert("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน");
      return;
    }

    // Add default image if no images provided
    const finalData = {
      ...formData,
      images: formData.images.length > 0 ? formData.images : [
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop"
      ],
    };

    onSubmit(finalData);
    
    // Reset form
    setFormData({
      title: "",
      description: "",
      price: "",
      location: "",
      bedrooms: 1,
      bathrooms: 1,
      area: "",
      category: "บ้านเดี่ยว",
      badges: [],
      images: [],
    });
  };

  const generatePreview = () => {
    return {
      id: Date.now(),
      title: formData.title || "ชื่อบ้าน",
      description: formData.description || "คำอธิบาย",
      image: formData.images[0] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
      badges: formData.badges.length > 0 ? formData.badges : ["ใหม่"],
      stats: { views: 0, likes: 0, rating: 5.0 },
      date: new Date().toISOString(),
      category: formData.category,
      price: formData.price || "0",
      location: formData.location || "ที่อยู่",
      bedrooms: formData.bedrooms,
      bathrooms: formData.bathrooms,
      area: formData.area || "0 ตร.ม.",
      fullText: formData.description || "คำอธิบาย",
      imageUrls: formData.images,
    };
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Home className="w-6 h-6 mr-2 text-blue-600" />
          เพิ่มประกาศบ้านใหม่
        </h2>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4 mr-2" />
            ดูตัวอย่าง
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ชื่อประกาศ *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="เช่น บ้านเดี่ยวโมเดิร์น 2 ชั้น"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ราคา (บาท) *
            </label>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="เช่น 4,500,000"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ที่อยู่ *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="เช่น บางนา-ตราด กม.15"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ประเภท
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Area */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              พื้นที่ *
            </label>
            <input
              type="text"
              name="area"
              value={formData.area}
              onChange={handleInputChange}
              placeholder="เช่น 180 ตร.ม."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Bedrooms and Bathrooms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ห้องนอน
            </label>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => handleNumberChange("bedrooms", formData.bedrooms - 1)}
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
              >
                -
              </button>
              <div className="flex items-center space-x-2 px-4 py-2 bg-gray-50 rounded-lg">
                <Home className="w-4 h-4 text-gray-500" />
                <span className="font-medium">{formData.bedrooms}</span>
              </div>
              <button
                type="button"
                onClick={() => handleNumberChange("bedrooms", formData.bedrooms + 1)}
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
              >
                +
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ห้องน้ำ
            </label>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => handleNumberChange("bathrooms", formData.bathrooms - 1)}
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
              >
                -
              </button>
              <div className="flex items-center space-x-2 px-4 py-2 bg-gray-50 rounded-lg">
                <Bath className="w-4 h-4 text-gray-500" />
                <span className="font-medium">{formData.bathrooms}</span>
              </div>
              <button
                type="button"
                onClick={() => handleNumberChange("bathrooms", formData.bathrooms + 1)}
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            คำอธิบาย
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            placeholder="อธิบายรายละเอียดของบ้าน เช่น สิ่งอำนวยความสะดวก ทำเล ฯลฯ"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Badges */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ป้ายกำกับ (สูงสุด 5 ป้าย)
          </label>
          
          {/* Suggested Badges */}
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-2">ป้ายแนะนำ:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedBadges.map((badge) => (
                <button
                  key={badge}
                  type="button"
                  onClick={() => addBadge(badge)}
                  disabled={formData.badges.includes(badge) || formData.badges.length >= 5}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    formData.badges.includes(badge)
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                  }`}
                >
                  {badge}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Badge Input */}
          <div className="flex space-x-2 mb-3">
            <input
              type="text"
              value={newBadge}
              onChange={(e) => setNewBadge(e.target.value)}
              placeholder="เพิ่มป้ายกำกับเอง"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addBadge(newBadge))}
            />
            <button
              type="button"
              onClick={() => addBadge(newBadge)}
              disabled={formData.badges.length >= 5}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Current Badges */}
          <div className="flex flex-wrap gap-2">
            {formData.badges.map((badge, index) => (
              <div
                key={index}
                className="flex items-center space-x-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
              >
                <span>{badge}</span>
                <button
                  type="button"
                  onClick={() => removeBadge(index)}
                  className="text-green-500 hover:text-green-700"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            รูปภาพ (สูงสุด 20 รูป)
          </label>
          
          {/* Image URL Input */}
          <div className="flex space-x-2 mb-3">
            <input
              type="url"
              value={newImage}
              onChange={(e) => setNewImage(e.target.value)}
              placeholder="ใส่ URL รูปภาพ"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addImage())}
            />
            <button
              type="button"
              onClick={addImage}
              disabled={formData.images.length >= 20}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 transition-colors"
            >
              <Upload className="w-4 h-4" />
            </button>
          </div>

          {/* Image Preview */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {formData.images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image}
                  alt={`รูปที่ ${index + 1}`}
                  className="w-full h-20 object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=200&h=150&fit=crop";
                  }}
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            ดูตัวอย่าง
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>บันทึกประกาศ</span>
          </button>
        </div>
      </form>

      {/* Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">ตัวอย่างการ์ด</h3>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Mini Card Preview */}
            <div className="bg-white border rounded-xl overflow-hidden shadow-lg">
              <div className="relative h-32">
                <img
                  src={formData.images[0] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop"}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-2 py-1 rounded text-xs font-bold">
                  ฿{formData.price || "0"}
                </div>
                <div className="absolute top-2 right-2 flex flex-col gap-1">
                  {(formData.badges.length > 0 ? formData.badges : ["ใหม่"]).slice(0, 2).map((badge, index) => (
                    <span
                      key={index}
                      className="bg-white/90 text-gray-800 px-2 py-1 rounded text-xs font-medium"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-bold text-gray-900 mb-1 line-clamp-1">
                  {formData.title || "ชื่อบ้าน"}
                </h4>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {formData.description || "คำอธิบาย"}
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                  <div>📍 {formData.location || "ที่อยู่"}</div>
                  <div>🏠 {formData.bedrooms} ห้องนอน</div>
                  <div>🚿 {formData.bathrooms} ห้องน้ำ</div>
                  <div>📐 {formData.area || "0 ตร.ม."}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyForm;