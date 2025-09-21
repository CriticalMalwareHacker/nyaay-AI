'use client';

import { ComplianceItem, ComplianceCheckProps } from '../types/compilance';
import { useState } from 'react';

const ComplianceCheck = ({ items, onCheckCompliance, onViewDetails }: ComplianceCheckProps) => {
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const handleCheck = (itemId: string) => {
    setActiveItem(itemId);
    onCheckCompliance?.(itemId);
    
    // Simulate API call completion after 2 seconds
    setTimeout(() => {
      setActiveItem(null);
    }, 2000);
  };

  const getStatusIcon = (status: ComplianceItem['status']) => {
    switch (status) {
      case 'compliant':
        return <span className="text-green-500">✓</span>;
      case 'non-compliant':
        return <span className="text-red-500">✗</span>;
      case 'checking':
        return <span className="text-blue-500 animate-pulse">⟳</span>;
      default:
        return <span className="text-gray-500">?</span>;
    }
  };

  const getStatusClass = (status: ComplianceItem['status']) => {
    switch (status) {
      case 'compliant':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'non-compliant':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'checking':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Compliance Check</h2>
      
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-800 dark:text-white">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1">{item.description}</p>
                
                <div className="flex items-center mt-3 space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(item.status)}`}>
                    {getStatusIcon(item.status)} {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                  
                  {item.lastChecked && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Last checked: {item.lastChecked.toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => handleCheck(item.id)}
                  disabled={activeItem === item.id}
                  className={`px-4 py-2 rounded-md font-medium ${
                    activeItem === item.id
                      ? 'bg-blue-400 cursor-not-allowed text-white'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  {activeItem === item.id ? 'Checking...' : 'Check Now'}
                </button>
                
                <button
                  onClick={() => onViewDetails?.(item.id)}
                  className="px-4 py-2 rounded-md font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                >
                  Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <span className="text-green-500 mr-1">✓</span>
            <span className="text-sm dark:text-gray-400">Compliant</span>
          </div>
          <div className="flex items-center">
            <span className="text-red-500 mr-1">✗</span>
            <span className="text-sm dark:text-gray-400">Non-compliant</span>
          </div>
          <div className="flex items-center">
            <span className="text-blue-500 mr-1">⟳</span>
            <span className="text-sm dark:text-gray-400">Checking</span>
          </div>
          <div className="flex items-center">
            <span className="text-gray-500 mr-1">?</span>
            <span className="text-sm dark:text-gray-400">Unknown</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceCheck;