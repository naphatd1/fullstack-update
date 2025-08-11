"use client";

import React, { useState } from 'react';
import { X, Camera, Save, Eye } from 'lucide-react';

interface PostFormData {
  title: string;
  content: string;
  images: string[];
}

interface PostFormProps {
  onSubmit: (data: PostFormData) => void;
  onClose: () => void;
}

const PostForm: React.FC<PostFormProps> = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    content: '',
    images: []
  });

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    const currentImages = formData.images || [];
    const remainingSlots = 10 - currentImages.length;
    const filesToProcess = fileArray.slice(0, remainingSlots);

    if (fileArray.length > remainingSlots) {
      alert(`สามารถอัพโหลดได้สูงสุด 10 รูป (เหลือที่ว่าง ${remainingSlots} รูป)`);
    }

    const newImages: string[] = [];

    for (const file of filesToProcess) {
      try {
        // ตรวจสอบประเภทไฟล์
        if (!file.type.startsWith('image/')) {
          alert(`ไฟล์ ${file.name} ไม่ใช่รูปภาพ`);
          continue;
        }

        // ตรวจสอบขนาดไฟล์ (5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert(`ไฟล์ ${file.name} มีขนาดใหญ่เกิน 5MB`);
          continue;
        }

        // Try Supabase upload first, fallback to base64
        try {
          const { storageService } = await import('@/lib/supabase-storage');
          const result = await storageService.uploadHouseImage(
            file, 
            `post-${Date.now()}`, 
            currentImages.length + newImages.length + 1
          );
          
          if (result.success && result.url) {
            newImages.push(result.url);
            console.log('✅ Uploaded to Supabase:', result.url);
          } else {
            throw new Error('Supabase upload failed');
          }
        } catch (supabaseError) {
          console.warn('Supabase upload failed, using base64:', supabaseError);
          
          // Fallback to base64
          const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
          
          newImages.push(base64);
          console.log('✅ Converted to base64');
        }
      } catch (error) {
        console.error('Error processing file:', file.name, error);
        alert(`เกิดข้อผิดพลาดกับไฟล์ ${file.name}`);
      }
    }

    if (newImages.length > 0) {
      setFormData(prev => ({
        ...prev,
        images: [...currentImages, ...newImages],
      }));
    }

    // Reset input
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('กรุณาใส่หัวข้อโพสต์');
      return;
    }

    if (!formData.content.trim()) {
      alert('กรุณาใส่เนื้อหาโพสต์');
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">สร้างโพสต์ใหม่</h2>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4 mr-2" />
            ดูตัวอย่าง
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            หัวข้อโพสต์ *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="เช่น ข่าวสารอสังหาริมทรัพย์ หรือ เทคนิคการซื้อบ้าน"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            เนื้อหาโพสต์ *
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            rows={8}
            placeholder="เขียนเนื้อหาโพสต์ของคุณ..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            required
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            รูปภาพประกอบ (สูงสุด 10 รูป)
          </label>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="post-image-upload"
            />
            <label htmlFor="post-image-upload" className="cursor-pointer">
              <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                อัพโหลดรูปภาพประกอบ
              </p>
              <p className="text-sm text-gray-500 mb-2">
                คลิกเพื่อเลือกไฟล์รูปภาพ
              </p>
              <p className="text-xs text-gray-400">
                รองรับ JPG, PNG, WebP (สูงสุด 5MB ต่อไฟล์)
              </p>
              <p className="text-xs text-gray-400 mt-1">
                สูงสุด 10 รูป (เหลือ {10 - formData.images.length} รูป)
              </p>
            </label>
          </div>

          {/* Image Preview */}
          {formData.images.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                รูปภาพที่อัพโหลดแล้ว ({formData.images.length}/10)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`รูปที่ ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200&h=150&fit=crop";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {formData.images.length === 0 && (
            <div className="mt-4 text-center py-4">
              <Camera className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">ยังไม่มีรูปภาพ</p>
              <p className="text-xs text-gray-400">เพิ่มรูปภาพเพื่อให้โพสต์น่าสนใจมากขึ้น</p>
            </div>
          )}
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
            <span>บันทึกโพสต์</span>
          </button>
        </div>
      </form>

      {/* Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-lg font-semibold">ตัวอย่างโพสต์</h3>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {formData.title || "หัวข้อโพสต์"}
              </h2>
              
              <div className="prose max-w-none mb-6">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {formData.content || "เนื้อหาโพสต์"}
                </p>
              </div>

              {formData.images.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {formData.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`รูปที่ ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostForm;