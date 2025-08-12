'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { 
  Activity,
  Home, 
  MessageCircle,
  ArrowRight,
  CheckCircle,
  Upload,
  Users
} from 'lucide-react';

const AuthenticatedDashboard: React.FC = () => {
  const { user, isAdmin, getDisplayName } = useAuth();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm font-medium mb-4">
            <CheckCircle className="h-4 w-4 mr-2" />
            Successfully logged in
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-tight">
            <span className="block mb-2">Welcome back,</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 break-words">
              {getDisplayName()}
            </span>
          </h1>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4 sm:px-0">
            You're logged in as <span className="font-semibold text-blue-600 dark:text-blue-400">{user?.role}</span>. 
            Ready to explore your dashboard and manage your content?
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 px-4 sm:px-0 max-w-4xl mx-auto">
          <Link
            href="/dashboard"
            className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 touch-manipulation"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="p-2 sm:p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors duration-300">
                  <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover:text-blue-600 transition-colors duration-300" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Dashboard
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                View analytics, recent activity, and system overview
              </p>
            </div>
          </Link>

          <Link
            href="/sell-house"
            className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors duration-300">
                  <Home className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors duration-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                ขายบ้าน
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                ลงประกาศขายบ้านและอสังหาริมทรัพย์
              </p>
            </div>
          </Link>

          <Link
            href="/public-contact"
            className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/30 group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors duration-300">
                  <MessageCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-green-600 transition-colors duration-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                ติดต่อนายหน้า
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                ติดต่อสอบถามข้อมูลเพิ่มเติมกับนายหน้ามืออาชีพ
              </p>
            </div>
          </Link>

          <Link
            href="/files"
            className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors duration-300">
                  <Upload className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-purple-600 transition-colors duration-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                File Manager
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Upload and organize your media files
              </p>
            </div>
          </Link>

          {isAdmin() && (
            <Link
              href="/admin/dashboard"
              className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-orange-100 dark:bg-orange-900/30 group-hover:bg-orange-200 dark:group-hover:bg-orange-900/50 transition-colors duration-300">
                    <Users className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-orange-600 transition-colors duration-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Admin Panel
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Manage users and system settings
                </p>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthenticatedDashboard;