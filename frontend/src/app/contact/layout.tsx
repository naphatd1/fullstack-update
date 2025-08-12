"use client";

import React from "react";
import Link from "next/link";
import { MessageCircle, Home } from "lucide-react";
import { Toaster } from "react-hot-toast";

// Simple navbar without auth for contact page
function ContactNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200/50 dark:border-slate-700/50 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              className="group flex items-center space-x-3 sm:space-x-4 transition-all duration-300 hover:opacity-90"
            >
              <div className="relative">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-800/30 dark:to-teal-800/30 rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-105">
                  <Home className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
              <div className="hidden xs:flex flex-col">
                <span className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-slate-600 to-slate-500 dark:from-slate-300 dark:to-slate-100 bg-clip-text text-transparent leading-tight">
                  This House
                </span>
                <span className="text-sm sm:text-base font-normal text-emerald-600 dark:text-emerald-400 -mt-1 tracking-wide opacity-80">
                  Is The Best
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Home className="w-4 h-4" />
              <span>หน้าหลัก</span>
            </Link>
            <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 px-3 py-2 rounded-xl text-sm font-medium bg-slate-100 dark:bg-slate-800">
              <MessageCircle className="w-4 h-4" />
              <span>ติดต่อเรา</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

// Simple footer for contact page
function ContactFooter() {
  return (
    <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-400">
            © 2024 This House Is The Best. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 flex flex-col">
      <ContactNavbar />
      <main className="flex-1 w-full pt-14 sm:pt-16">{children}</main>
      <ContactFooter />
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
            borderRadius: "8px",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
          },
          success: {
            duration: 3000,
            style: {
              background: "#10b981",
              color: "#fff",
            },
          },
          error: {
            duration: 4000,
            style: {
              background: "#ef4444",
              color: "#fff",
            },
          },
        }}
      />
    </div>
  );
}
