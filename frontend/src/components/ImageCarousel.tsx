'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { publicAPI } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

interface ImageFile {
  id: string;
  filename: string;
  originalName: string;
  path: string;
  mimetype: string;
  size: number;
  createdAt: string;
}

const ImageCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isSwipingLeft, setIsSwipingLeft] = useState(false);
  const [isSwipingRight, setIsSwipingRight] = useState(false);

  // Mock data for now since backend isn't running
  const mockImages = [
    {
      id: '1',
      filename: 'modern-house.jpg',
      originalName: 'บ้านโมเดิร์นสไตล์มินิมอล - 4.5 ล้านบาท',
      path: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=600&fit=crop',
      mimetype: 'image/jpeg',
      size: 1024,
      createdAt: new Date().toISOString(),
      price: '4,500,000',
      location: 'บางนา-ตราด กม.15',
      bedrooms: 3,
      bathrooms: 2,
      area: '180 ตร.ม.'
    },
    {
      id: '2', 
      filename: 'luxury-villa.jpg',
      originalName: 'วิลล่าหรู พร้อมสระว่ายน้ำ - 12.8 ล้านบาท',
      path: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=600&fit=crop',
      mimetype: 'image/jpeg',
      size: 1024,
      createdAt: new Date().toISOString(),
      price: '12,800,000',
      location: 'เอกมัย-รามอินทรา',
      bedrooms: 4,
      bathrooms: 3,
      area: '350 ตร.ม.'
    },
    {
      id: '3',
      filename: 'family-home.jpg', 
      originalName: 'บ้านครอบครัว ย่านเงียบสงบ - 2.9 ล้านบาท',
      path: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=600&fit=crop',
      mimetype: 'image/jpeg',
      size: 1024,
      createdAt: new Date().toISOString(),
      price: '2,900,000',
      location: 'ลาดกระบัง',
      bedrooms: 3,
      bathrooms: 2,
      area: '120 ตร.ม.'
    },
    {
      id: '4',
      filename: 'townhouse.jpg', 
      originalName: 'ทาวน์เฮ้าส์ใหม่ ใกล้รถไฟฟ้า - 3.2 ล้านบาท',
      path: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200&h=600&fit=crop',
      mimetype: 'image/jpeg',
      size: 1024,
      createdAt: new Date().toISOString(),
      price: '3,200,000',
      location: 'ห้วยขวาง',
      bedrooms: 3,
      bathrooms: 2,
      area: '150 ตร.ม.'
    }
  ];

  // Use mock images for now since backend doesn't have public endpoint
  const { data: imagesData, isLoading } = useQuery({
    queryKey: ['public-carousel-images'],
    queryFn: async () => {
      // Simulate loading time
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Using mock data for carousel');
      return { data: mockImages };
    },
    staleTime: 15 * 60 * 1000, // 15 minutes cache
    gcTime: 30 * 60 * 1000, // 30 minutes garbage collection
    retry: 1, // Only retry once
    refetchOnWindowFocus: false, // Don't refetch on focus
    refetchOnMount: false, // Don't refetch if cached
  });

  const images = imagesData?.data || [];

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || images.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [isPlaying, images.length]);

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Touch handlers for swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null); // Reset touchEnd
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentTouch = e.targetTouches[0].clientX;
    setTouchEnd(currentTouch);
    
    // Provide visual feedback during swipe
    if (touchStart && Math.abs(touchStart - currentTouch) > 20) {
      const distance = touchStart - currentTouch;
      if (distance > 0) {
        setIsSwipingLeft(true);
        setIsSwipingRight(false);
      } else {
        setIsSwipingLeft(false);
        setIsSwipingRight(true);
      }
    }
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && images.length > 1) {
      goToNext();
    }
    if (isRightSwipe && images.length > 1) {
      goToPrevious();
    }
    
    // Reset touch states
    setTouchStart(null);
    setTouchEnd(null);
    setIsSwipingLeft(false);
    setIsSwipingRight(false);
  };

  // Mouse drag handlers for desktop (optional)
  const handleMouseDown = (e: React.MouseEvent) => {
    setTouchEnd(null);
    setTouchStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!touchStart) return;
    setTouchEnd(e.clientX);
  };

  const handleMouseUp = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && images.length > 1) {
      goToNext();
    }
    if (isRightSwipe && images.length > 1) {
      goToPrevious();
    }
    
    setTouchStart(null);
    setTouchEnd(null);
    setIsSwipingLeft(false);
    setIsSwipingRight(false);
  };

  if (isLoading) {
    return (
      <div className="relative w-full h-[50vh] xs:h-[55vh] sm:h-[60vh] md:h-[65vh] lg:h-[70vh] xl:h-[75vh] 2xl:h-[80vh] bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-800 dark:to-gray-700 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg sm:shadow-xl lg:shadow-2xl">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-blue-200 border-t-blue-600"></div>
            <div className="absolute top-1 sm:top-2 left-1/2 transform -translate-x-1/2 animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-4 border-transparent border-t-purple-500" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="relative w-full h-[50vh] xs:h-[55vh] sm:h-[60vh] md:h-[65vh] lg:h-[70vh] xl:h-[75vh] 2xl:h-[80vh] bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 dark:from-gray-700 dark:via-gray-800 dark:to-gray-900 rounded-xl sm:rounded-2xl overflow-hidden flex items-center justify-center shadow-lg sm:shadow-xl lg:shadow-2xl">
        <div className="text-center px-4">
          <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg sm:text-xl text-gray-900 dark:text-white mb-2">ไม่มีรูปภาพ</h3>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">อัปโหลดรูปภาพเพื่อแสดงใน carousel</p>
        </div>
      </div>
    );
  }

  const currentImage = images[currentIndex];

  return (
    <div 
      className="relative w-full h-[50vh] xs:h-[55vh] sm:h-[60vh] md:h-[65vh] lg:h-[70vh] xl:h-[75vh] 2xl:h-[80vh] rounded-xl sm:rounded-2xl overflow-hidden shadow-lg sm:shadow-xl lg:shadow-2xl group cursor-grab active:cursor-grabbing"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => {
        setTouchStart(null);
        setTouchEnd(null);
        setIsSwipingLeft(false);
        setIsSwipingRight(false);
      }}
    >
      {/* Main Image Container with Enhanced Effects */}
      <div className="relative w-full h-full overflow-hidden">
        {/* Background Blur Layer for Depth */}
        <div 
          className="absolute inset-0 w-full h-full scale-110 blur-sm opacity-30 transition-all duration-700"
          style={{
            backgroundImage: `url(${currentImage?.path || '/api/placeholder/800/400'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        ></div>
        <img
          src={currentImage?.path || '/api/placeholder/800/400'}
          alt={currentImage?.originalName || 'Carousel image'}
          className="w-full h-full object-cover transition-all duration-700 ease-in-out transform group-hover:scale-105"
          loading="lazy"
          decoding="async"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
          onError={(e) => {
            // Fallback to placeholder if image fails to load
            (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDgwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zODQgMjA4SDQxNlYyNDBIMzg0VjIwOFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTM2OCAyMjRIMzg0VjI0MEgzNjhWMjI0WiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNNDE2IDIyNEg0MzJWMjQwSDQxNlYyMjRaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0zNTIgMjQwSDM2OFYyNTZIMzUyVjI0MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHA+CjwvcGF0aD4KPC9zdmc+';
          }}
        />
        
        {/* Subtle Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
        
        {/* Shimmer Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1500"></div>
        </div>

        {/* Swipe Visual Feedback */}
        {isSwipingLeft && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-blue-500/20 pointer-events-none transition-opacity duration-200">
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/80">
              <ChevronRight className="w-8 h-8 animate-pulse" />
            </div>
          </div>
        )}
        
        {isSwipingRight && (
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-blue-500/20 pointer-events-none transition-opacity duration-200">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/80">
              <ChevronLeft className="w-8 h-8 animate-pulse" />
            </div>
          </div>
        )}
        

      </div>

      {/* Navigation Arrows - Responsive */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 sm:left-4 lg:left-6 top-1/2 transform -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-sm rounded-full p-2 sm:p-3 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 shadow-lg border border-white/30 flex items-center justify-center"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white drop-shadow-md" />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-2 sm:right-4 lg:right-6 top-1/2 transform -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-sm rounded-full p-2 sm:p-3 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 shadow-lg border border-white/30 flex items-center justify-center"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white drop-shadow-md" />
          </button>
        </>
      )}

      {/* Play/Pause Button */}
      {images.length > 1 && (
        <button
          onClick={togglePlayPause}
          className="absolute top-3 sm:top-4 lg:top-6 right-3 sm:right-4 lg:right-6 bg-white/30 hover:bg-white/50 backdrop-blur-sm rounded-full p-2 sm:p-3 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 shadow-lg border border-white/30"
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 sm:w-5 sm:h-5 text-white drop-shadow-md" />
          ) : (
            <Play className="w-4 h-4 sm:w-5 sm:h-5 text-white drop-shadow-md" />
          )}
        </button>
      )}

      {/* Dots Indicator */}
      {images.length > 1 && (
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 sm:space-x-3 bg-black/40 backdrop-blur-sm rounded-full px-3 sm:px-4 py-2 border border-white/30">
          {images.map((_image: ImageFile, index: number) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-white scale-125 shadow-lg'
                  : 'bg-white/50 hover:bg-white/75 hover:scale-110'
              }`}
            />
          ))}
        </div>
      )}

      {/* Image Counter */}
      {images.length > 1 && (
        <div className="absolute top-3 sm:top-4 lg:top-6 left-3 sm:left-4 lg:left-6 bg-black/40 backdrop-blur-sm rounded-lg px-3 py-1.5 text-white text-xs sm:text-sm font-semibold shadow-lg border border-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-blue-300">{currentIndex + 1}</span>
          <span className="text-white/70 mx-1">/</span>
          <span className="text-white/90">{images.length}</span>
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;