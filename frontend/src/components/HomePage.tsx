'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { usePerformance } from '@/hooks/usePerformance';
import ClientOnly from './ClientOnly';
import LoadingSpinner from './LoadingSpinner';

// Import HomePage components
import HeroCarousel from './HomePage/HeroCarousel';
import HeroSection from './HomePage/HeroSection';
import AnimatedCards from './AnimatedCards';
import FeaturesSection from './HomePage/FeaturesSection';
import BenefitsSection from './HomePage/BenefitsSection';
import AuthenticatedDashboard from './HomePage/AuthenticatedDashboard';
import FloatingScrollIndicator from './FloatingScrollIndicator';

const HomePage: React.FC = () => {
  const { user, isAuthenticated, isAdmin, loading, getDisplayName } = useAuth();
  const performanceMetrics = usePerformance();

  // Loading fallback component for SSR
  const LoadingFallback = () => (
    <div>
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-start justify-center pt-6 xs:pt-5 sm:pt-4 md:pt-4 lg:pt-6 xl:pt-8 2xl:pt-10 3xl:pt-12 4xl:pt-16">
        <div className="relative overflow-hidden w-full max-w-5xl sm:max-w-6xl lg:max-w-7xl xl:max-w-7xl 2xl:max-w-8xl 3xl:max-w-9xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
          {/* Image Carousel Section - Placeholder */}
          <div className="relative w-full h-[70vh] xs:h-[72vh] sm:h-[74vh] md:h-[76vh] lg:h-[76vh] xl:h-[78vh] 2xl:h-[80vh] 3xl:h-[82vh] 4xl:h-[84vh] bg-gray-200 dark:bg-gray-700 rounded-2xl sm:rounded-3xl animate-pulse"></div>
        </div>
      </div>
      {/* Loading placeholder for content */}
      <div className="bg-white dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="w-64 h-8 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-4 animate-pulse"></div>
            <div className="w-96 h-16 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-6 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );

  // Show loading state only during initial auth check
  if (loading) {
    return (
      <ClientOnly fallback={<LoadingFallback />}>
        <LoadingSpinner 
          size="lg"
          text="กำลังตรวจสอบสถานะการเข้าสู่ระบบ..."
          fullScreen={true}
        />
      </ClientOnly>
    );
  }

  // Data moved to individual components

  if (isAuthenticated) {
    return <AuthenticatedDashboard />;
  }

  return (
    <div className="scroll-smooth">
      {/* 1. Hero Carousel Section */}
      <HeroCarousel />

      {/* Content Sections - Below the fold */}
      <div className="bg-white dark:bg-gray-900">
        {/* 2. Animated Cards Section */}
        <AnimatedCards />
        
        {/* 3. Hero Text Section */}
        <HeroSection />

        {/* 4. Features Section */}
        <FeaturesSection />

        {/* 5. Benefits Section */}
        <BenefitsSection />
      </div>
      
      {/* 6. Floating Scroll Indicator */}
      <FloatingScrollIndicator />
    </div>
  );
};

export default HomePage;