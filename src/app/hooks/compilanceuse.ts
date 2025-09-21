'use client';

import { useState, useEffect } from 'react';
import { ComplianceItem } from '../types/compilance';

// Mock compliance data - replace with actual API calls
const initialComplianceItems: ComplianceItem[] = [
  {
    id: '1',
    title: 'GDPR Compliance',
    description: 'Ensure data processing follows GDPR regulations',
    status: 'unknown',
  },
  {
    id: '2',
    title: 'PCI DSS Compliance',
    description: 'Payment Card Industry Data Security Standard',
    status: 'unknown',
  },
  {
    id: '3',
    title: 'HIPAA Compliance',
    description: 'Health Insurance Portability and Accountability Act',
    status: 'unknown',
  },
  {
    id: '4',
    title: 'SSL Certificate',
    description: 'Valid and up-to-date SSL certificate',
    status: 'unknown',
  },
];

export const useCompliance = () => {
  const [items, setItems] = useState<ComplianceItem[]>(initialComplianceItems);

  // Load compliance status from localStorage on initial load
  useEffect(() => {
    // Check if we're in a browser environment before accessing localStorage
    if (typeof window !== 'undefined') {
      const savedCompliance = localStorage.getItem('complianceStatus');
      if (savedCompliance) {
        try {
          const parsedData = JSON.parse(savedCompliance);
          // Ensure parsed data has the correct structure
          if (Array.isArray(parsedData)) {
            setItems(parsedData);
          }
        } catch (error) {
          console.error('Failed to parse compliance data from localStorage', error);
        }
      }
    }
  }, []);

  // Save compliance status to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('complianceStatus', JSON.stringify(items));
    }
  }, [items]);

  const checkCompliance = (itemId: string) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId 
          ? { ...item, status: 'checking' } 
          : item
      )
    );

    // Simulate API call to check compliance
    setTimeout(() => {
      // Randomly determine compliance status for demonstration
      const isCompliant = Math.random() > 0.3;
      
      setItems(prevItems => 
        prevItems.map(item => 
          item.id === itemId 
            ? { 
                ...item, 
                status: isCompliant ? 'compliant' : 'non-compliant',
                lastChecked: new Date()
              } 
            : item
        )
      );
    }, 2000);
  };

  const viewDetails = (itemId: string) => {
    // In a real application, this would navigate to a details page or show a modal
    console.log(`Viewing details for compliance item: ${itemId}`);
    alert(`Details for compliance item ${itemId} would be shown here.`);
  };

  return {
    items,
    checkCompliance,
    viewDetails
  };
};