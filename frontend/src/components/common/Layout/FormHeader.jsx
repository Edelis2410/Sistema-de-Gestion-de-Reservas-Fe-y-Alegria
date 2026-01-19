// src/components/common/Layout/FormHeader.jsx
import React from 'react';
import { ArrowLeft } from 'lucide-react';

const FormHeader = ({ 
  title, 
  subtitle, 
  onBack,
  backButton = true 
}) => {
  return (
    <div className="flex items-center space-x-4 mb-6">
      {backButton && (
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
      )}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        {subtitle && <p className="text-gray-600 text-sm">{subtitle}</p>}
      </div>
    </div>
  );
};

export default FormHeader;