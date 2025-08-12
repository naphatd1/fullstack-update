'use client';

import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ErrorDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  buttonText?: string;
  onClose: () => void;
}

const ErrorDialog: React.FC<ErrorDialogProps> = ({
  isOpen,
  title,
  message,
  buttonText = 'ตกลง',
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[10000]">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
              <AlertCircle className="w-6 h-6" />
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {title}
          </h3>
          
          <p className="text-gray-600 leading-relaxed">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 text-white bg-red-600 hover:bg-red-700 rounded-xl font-medium transition-colors duration-200 shadow-lg"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorDialog;