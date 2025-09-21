'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Template {
  id: number;
  title: string;
  category: "Legal" | "Business" | "HR" | "Startup" | "Compliance";
  description: string;
  complexity: "Simple" | "Moderate" | "Complex";
  rating: number;
  downloads: number;
  price: "Free" | "Premium";
}

type Category = 'all' | 'Legal' | 'Business' | 'HR' | 'Startup' | 'Compliance';
type Complexity = 'all' | 'Simple' | 'Moderate' | 'Complex';
type Price = 'all' | 'Free' | 'Premium';

export default function TemplateMarketplace() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentCategory, setCurrentCategory] = useState<Category>('all');
  const [currentComplexity, setCurrentComplexity] = useState<Complexity>('all');
  const [currentPrice, setCurrentPrice] = useState<Price>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'rating'>('popular');
  const [loadingTemplates, setLoadingTemplates] = useState<Set<number>>(new Set());

  const templates: Template[] = [
    { id: 1, title: "Non-Disclosure Agreement (NDA)", category: "Legal", description: "A standard mutual NDA to protect confidential information shared between parties.", complexity: "Simple", rating: 4.8, downloads: 1245, price: "Free" },
    { id: 2, title: "Memorandum of Understanding (MOU)", category: "Business", description: "Outline the broad strokes of an agreement before diving into a formal contract.", complexity: "Moderate", rating: 4.5, downloads: 876, price: "Free" },
    { id: 3, title: "Privacy Policy", category: "Legal", description: "A comprehensive privacy policy template for websites and mobile applications.", complexity: "Complex", rating: 4.7, downloads: 2109, price: "Premium" },
    { id: 4, title: "Employment Agreement", category: "HR", description: "Define terms of employment, responsibilities, and compensation for a new hire.", complexity: "Moderate", rating: 4.6, downloads: 1532, price: "Premium" },
    { id: 5, title: "Investor Agreement", category: "Startup", description: "A simple agreement for startups raising a seed round from angel investors.", complexity: "Complex", rating: 4.9, downloads: 987, price: "Premium" },
    { id: 6, title: "Vendor Contract", category: "Business", description: "Formalize your relationship with a service provider or vendor.", complexity: "Moderate", rating: 4.4, downloads: 765, price: "Free" },
    { id: 7, title: "Consulting Agreement", category: "Business", description: "Hire a consultant with clearly defined scope, deliverables, and payment terms.", complexity: "Moderate", rating: 4.5, downloads: 654, price: "Premium" },
    { id: 8, title: "Employee Handbook", category: "HR", description: "A complete employee handbook template covering company policies, culture, and procedures.", complexity: "Complex", rating: 4.7, downloads: 1123, price: "Premium" },
    { id: 9, title: "Term Sheet", category: "Startup", description: "A non-binding agreement outlining the basic terms and conditions of an investment.", complexity: "Moderate", rating: 4.6, downloads: 876, price: "Free" },
    { id: 10, title: "GDPR Compliance Checklist", category: "Compliance", description: "Ensure your business complies with GDPR regulations with this detailed checklist.", complexity: "Complex", rating: 4.8, downloads: 1345, price: "Premium" },
    { id: 11, title: "PCI DSS Compliance Guide", category: "Compliance", description: "Step-by-step guide to achieving PCI DSS compliance for your business.", complexity: "Complex", rating: 4.7, downloads: 987, price: "Premium" },
    { id: 12, title: "HIPAA Compliance Checklist", category: "Compliance", description: "Comprehensive checklist for healthcare organizations to ensure HIPAA compliance.", complexity: "Complex", rating: 4.9, downloads: 1109, price: "Premium" },
    { id: 13, title: "Offer Letter", category: "HR", description: "Extend a formal job offer to a candidate with this customizable template.", complexity: "Simple", rating: 4.5, downloads: 1654, price: "Free" },
    { id: 14, title: "Partnership Agreement", category: "Business", description: "Establish roles, responsibilities, and ownership stakes for business partners.", complexity: "Complex", rating: 4.6, downloads: 932, price: "Premium" },
    { id: 15, title: "IT Security Policy", category: "Compliance", description: "Comprehensive IT security policy template for organizations of all sizes.", complexity: "Moderate", rating: 4.7, downloads: 876, price: "Premium" },
  ];

  const handleTemplateClick = async (template: Template) => {
    // Add template to loading set
    setLoadingTemplates(prev => new Set([...prev, template.id]));
  
    try {
      if (template.price === 'Free') {
        // For free templates, navigate directly to generator with template ID
        await new Promise(resolve => setTimeout(resolve, 800));
        router.push(`/generator?templateId=${template.id}&title=${encodeURIComponent(template.title)}`);
      } else {
        // For premium templates, navigate to generator with premium flag
        await new Promise(resolve => setTimeout(resolve, 600));
        router.push(`/generator?templateId=${template.id}&title=${encodeURIComponent(template.title)}&premium=true`);
        
        // Alternative options for premium templates:
        // router.push(`/pricing?template=${template.id}`); // If you have a pricing page
        // router.push(`/upgrade?from=template&id=${template.id}`); // If you have an upgrade page
        // window.open('https://yoursite.com/premium', '_blank'); // External premium page
      }
    } catch (error) {
      console.error('Navigation error:', error);
      setLoadingTemplates(prev => {
        const newSet = new Set(prev);
        newSet.delete(template.id);
        return newSet;
      });
    }
  };
  

  const filteredTemplates = templates
    .filter(template =>
      (currentCategory === 'all' || template.category === currentCategory) &&
      (currentComplexity === 'all' || template.complexity === currentComplexity) &&
      (currentPrice === 'all' || template.price === currentPrice) &&
      (template.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
       template.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === 'popular') return b.downloads - a.downloads;
      if (sortBy === 'rating') return b.rating - a.rating;
      return b.id - a.id; // newest first
    });

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Simple': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Moderate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Complex': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getPriceColor = (price: string) => {
    return price === 'Free' 
      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
  };

  const getButtonText = (template: Template, isLoading: boolean) => {
    if (isLoading) {
      return template.price === 'Free' ? 'Loading Template...' : 'Loading Details...';
    }
    return template.price === 'Free' ? 'Use Template' : 'View Details';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 sm:px-6">
            <Link
      href="/"
      className="px-5 py-2 text-white bg-gray-800 hover:bg-gray-700 rounded-xl font-semibold shadow-md border border-gray-700 transition-colors"
    >
      Return to Home
    </Link>
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Legal Document Templates
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Professionally crafted legal templates to streamline your document creation process. 
            All templates are designed specifically for Indian laws and regulations.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="md:col-span-2">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search templates..."
                  className="w-full px-4 py-3 pl-10 text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Sort Dropdown */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-4 py-3 text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="popular">Most Popular</option>
                <option value="newest">Newest First</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {/* Filter Button for Mobile */}
            <div className="md:hidden">
              <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Filters
              </button>
            </div>
          </div>

          {/* Filter Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
              <div className="flex flex-wrap gap-2">
                {(['all', 'Legal', 'Business', 'HR', 'Startup', 'Compliance'] as Category[]).map(category => (
                  <button
                    key={category}
                    onClick={() => setCurrentCategory(category)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      currentCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {category === 'all' ? 'All' : category}
                  </button>
                ))}
              </div>
            </div>

            {/* Complexity Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Complexity</label>
              <div className="flex flex-wrap gap-2">
                {(['all', 'Simple', 'Moderate', 'Complex'] as Complexity[]).map(complexity => (
                  <button
                    key={complexity}
                    onClick={() => setCurrentComplexity(complexity)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      currentComplexity === complexity
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {complexity === 'all' ? 'All' : complexity}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Price</label>
              <div className="flex flex-wrap gap-2">
                {(['all', 'Free', 'Premium'] as Price[]).map(price => (
                  <button
                    key={price}
                    onClick={() => setCurrentPrice(price)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      currentPrice === price
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {price === 'all' ? 'All' : price}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredTemplates.length > 0 ? (
            filteredTemplates.map(template => {
              const isLoading = loadingTemplates.has(template.id);
              return (
                <div key={template.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriceColor(template.price)}`}>
                        {template.price}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getComplexityColor(template.complexity)}`}>
                        {template.complexity}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{template.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{template.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="ml-1 text-sm font-medium text-gray-900 dark:text-white">{template.rating}</span>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{template.downloads.toLocaleString()} downloads</span>
                    </div>
                    
                    <button 
                      onClick={() => handleTemplateClick(template)}
                      disabled={isLoading}
                      className={`w-full py-2 rounded-lg font-medium transition-colors flex items-center justify-center ${
                        isLoading 
                          ? 'bg-gray-400 text-white cursor-not-allowed' 
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {isLoading && (
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      )}
                      {getButtonText(template, isLoading)}
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">No templates found</h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="bg-blue-600 rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Need a custom legal document?</h2>
          <p className="text-blue-100 mb-6">Our AI can generate customized legal documents tailored to your specific needs</p>
          <Link href="/generator" className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
            Generate Custom Document
          </Link>
        </div>
      </div>
    </div>
  );
}
