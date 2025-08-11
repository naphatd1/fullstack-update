"use client";

import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Loader2, AlertCircle } from 'lucide-react';
import { storageService } from '@/lib/supabase-storage';

interface ImageUploaderProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  houseId?: string;
  maxImages?: number;
  className?: string;
}

interface UploadingFile {
  file: File;
  progress: number;
  error?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  onImagesChange,
  houseId = 'temp',
  maxImages = 20,
  className = ''
}) => {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
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

    uploadFiles(filesToUpload);
  };

  const uploadFiles = async (files: File[]) => {
    // เพิ่มไฟล์ที่กำลังอัพโหลดเข้า state
    const newUploadingFiles = files.map(file => ({
      file,
      progress: 0
    }));
    
    setUploadingFiles(prev => [...prev, ...newUploadingFiles]);

    // อัพโหลดทีละไฟล์
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      try {
        // อัพเดท progress เป็น 10% เมื่อเริ่มอัพโหลด
        setUploadingFiles(prev => 
          prev.map(uf => 
            uf.file === file ? { ...uf, progress: 10 } : uf
          )
        );

        // อัพโหลดไฟล์
        const result = await storageService.uploadHouseImage(
          file, 
          houseId, 
          images.length + i + 1
        );

        if (result.success && result.url) {
          // อัพเดท progress เป็น 100%
          setUploadingFiles(prev => 
            prev.map(uf => 
              uf.file === file ? { ...uf, progress: 100 } : uf
            )
          );

          // เพิ่ม URL เข้าไปในรายการรูปภาพ
          onImagesChange([...images, result.url]);

          // ลบออกจากรายการที่กำลังอัพโหลด
          setTimeout(() => {
            setUploadingFiles(prev => prev.filter(uf => uf.file !== file));
          }, 1000);

        } else {
          // แสดง error
          setUploadingFiles(prev => 
            prev.map(uf => 
              uf.file === file ? { ...uf, error: result.error } : uf
            )
          );
        }

      } catch (error) {
        console.error('Upload error:', error);
        setUploadingFiles(prev => 
          prev.map(uf => 
            uf.file === file ? { ...uf, error: 'เกิดข้อผิดพลาดในการอัพโหลด' } : uf
          )
        );
      }
    }
  };

  const removeImage = async (index: number) => {
    const imageUrl = images[index];
    
    // ลบจาก Supabase (ถ้าเป็น URL จาก Supabase)
    if (imageUrl.includes('supabase')) {
      try {
        await storageService.deleteHouseImage(imageUrl);
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }

    // ลบจาก state
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const removeUploadingFile = (file: File) => {
    setUploadingFiles(prev => prev.filter(uf => uf.file !== file));
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

      {/* Uploading Files */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">กำลังอัพโหลด...</h4>
          {uploadingFiles.map((uploadingFile, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                {uploadingFile.error ? (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                ) : (
                  <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {uploadingFile.file.name}
                </p>
                
                {uploadingFile.error ? (
                  <p className="text-xs text-red-500">{uploadingFile.error}</p>
                ) : (
                  <div className="mt-1">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadingFile.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {uploadingFile.progress}%
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={() => removeUploadingFile(uploadingFile.file)}
                className="flex-shrink-0 p-1 text-gray-400 hover:text-red-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

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
      {images.length === 0 && uploadingFiles.length === 0 && (
        <div className="text-center py-4">
          <Camera className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">ยังไม่มีรูปภาพ</p>
          <p className="text-xs text-gray-400">เพิ่มรูปภาพเพื่อให้ประกาศน่าสนใจมากขึ้น</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;