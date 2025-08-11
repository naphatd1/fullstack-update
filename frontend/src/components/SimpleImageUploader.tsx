"use client";

import React, { useState, useRef } from 'react';
import { Camera, X, Upload } from 'lucide-react';

interface SimpleImageUploaderProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  className?: string;
}

const SimpleImageUploader: React.FC<SimpleImageUploaderProps> = ({
  images,
  onImagesChange,
  maxImages = 20,
  className = ''
}) => {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const remainingSlots = maxImages - images.length;
    const filesToUpload = fileArray.slice(0, remainingSlots);

    if (fileArray.length > remainingSlots) {
      alert(`สามารถอัพโหลดได้สูงสุด ${maxImages} รูป (เหลือที่ว่าง ${remainingSlots} รูป)`);
    }

    processFiles(filesToUpload);
  };

  const processFiles = async (files: File[]) => {
    const newImages: string[] = [];

    for (const file of files) {
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

        // แปลงเป็น base64
        const base64 = await fileToBase64(file);
        newImages.push(base64);

      } catch (error) {
        console.error('Error processing file:', file.name, error);
        alert(`เกิดข้อผิดพลาดกับไฟล์ ${file.name}`);
      }
    }

    if (newImages.length > 0) {
      onImagesChange([...images, ...newImages]);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
          dragOver
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />

        <div className="flex flex-col items-center space-y-2">
          <Camera className="w-12 h-12 text-gray-400" />
          <div>
            <p className="text-lg font-medium text-gray-900">
              อัพโหลดรูปภาพบ้าน
            </p>
            <p className="text-sm text-gray-500">
              ลากไฟล์มาวาง หรือคลิกเพื่อเลือกไฟล์
            </p>
          </div>
          <div className="text-xs text-gray-400">
            รองรับ JPG, PNG, WebP (สูงสุด 5MB ต่อไฟล์)
          </div>
          <div className="text-xs text-gray-400">
            สูงสุด {maxImages} รูป (เหลือ {maxImages - images.length} รูป)
          </div>
        </div>
      </div>

      {/* Uploaded Images */}
      {images.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">
            รูปภาพที่อัพโหลดแล้ว ({images.length}/{maxImages})
          </h4>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image}
                  alt={`รูปที่ ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=200&h=150&fit=crop";
                  }}
                />
                
                <button
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                >
                  <X className="w-3 h-3" />
                </button>

                {index === 0 && (
                  <div className="absolute bottom-1 left-1 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                    รูปหลัก
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {images.length === 0 && (
        <div className="text-center py-4">
          <Camera className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">ยังไม่มีรูปภาพ</p>
          <p className="text-xs text-gray-400">เพิ่มรูปภาพเพื่อให้ประกาศน่าสนใจมากขึ้น</p>
        </div>
      )}

      {/* Info Message */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-xs text-blue-800">
          💡 <strong>คำแนะนำ:</strong> เลือกรูปภาพที่ชัดเจนและแสดงมุมมองที่หลากหลายของบ้าน 
          เพื่อให้ผู้สนใจเห็นรายละเอียดได้ดีที่สุด
        </p>
      </div>
    </div>
  );
};

export default SimpleImageUploader;