// src/app/page.tsx
'use client';

import { useEffect, useRef } from 'react';
import Head from 'next/head';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

export default function Nyaaal() {
  const mainRef = useRef(null);
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const featureRefs = useRef<HTMLDivElement[]>([]);
  const cardRefs = useRef<HTMLDivElement[]>([]);
  const statRefs = useRef<HTMLDivElement[]>([]);

  // Initialize GSAP animations
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    // Hero section animations
    if (titleRef.current) {
      gsap.fromTo(titleRef.current, 
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      );
    }
    
    if (subtitleRef.current) {
      gsap.fromTo(subtitleRef.current, 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, delay: 0.3, ease: "power2.out" }
      );
    }
    
    // Feature cards animation
    if (featureRefs.current.length > 0) {
      gsap.fromTo(featureRefs.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          scrollTrigger: {
            trigger: featureRefs.current[0],
            start: "top 80%",
            toggleActions: "play none none none"
          }
        }
      );
    }
    
    // Stats counting animation
    statRefs.current.forEach((stat) => {
      if (!stat) return;
      
      const target = parseInt(stat.getAttribute("data-value") || "0");
      const obj = { value: 0 };

      gsap.to(obj, {
        value: target,
        duration: 2,
        scrollTrigger: {
          trigger: stat,
          start: "top 80%",
          toggleActions: "play none none none"
        },
        onUpdate: () => {
          stat.textContent = `${Math.round(obj.value)}%`;
        }
      });
    });

    // Clean up
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Add to refs arrays
  const addToFeatureRefs = (el: HTMLDivElement | null) => {
    if (el && !featureRefs.current.includes(el)) {
      featureRefs.current.push(el);
    }
  };
  
  const addToCardRefs = (el: HTMLDivElement | null) => {
    if (el && !cardRefs.current.includes(el)) {
      cardRefs.current.push(el);
    }
  };
  
  const addToStatRefs = (el: HTMLDivElement | null) => {
    if (el && !statRefs.current.includes(el)) {
      statRefs.current.push(el);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 text-gray-800" ref={mainRef}>
      <Head>
        <title>Nyaaal AI - Your AI-Powered Legal Assistant</title>
        <meta name="description" content="AI-powered Legal Assistant for startups, freelancers, and small businesses" />
      </Head>

      {/* Navigation */}
      <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <div className="flex items-center">
          <div className="bg-indigo-600 text-white font-bold text-xl p-2 rounded-md">N</div>
          <span className="ml-2 text-xl font-semibold">Nyaaal AI</span>
        </div>
        <div className="hidden md:flex space-x-6">
          <a href="#features" className="hover:text-indigo-600">Features</a>
          <a href="#how-it-works" className="hover:text-indigo-600">How It Works</a>
          <a href="#impact" className="hover:text-indigo-600">Impact</a>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
          Get Started
        </button>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 text-center" ref={heroRef}>
        <h1 
          ref={titleRef}
          className="text-4xl md:text-6xl font-bold mb-6 text-indigo-900"
        >
          Legal Documents Made Simple
        </h1>
        <p 
          ref={subtitleRef}
          className="text-xl md:text-2xl text-indigo-700 mb-10 max-w-3xl mx-auto"
        >
          AI-powered legal assistance for startups, freelancers, and small businesses
        </p>
        
        <div className="flex flex-col md:flex-row justify-center gap-4 mb-16">
          <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-indigo-700 transition-colors">
            Create Document
          </button>
          <button className="bg-white text-indigo-600 border border-indigo-600 px-6 py-3 rounded-lg text-lg font-medium hover:bg-indigo-50 transition-colors">
            Watch Demo
          </button>
        </div>
        
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-6">
          <div className="flex overflow-x-auto space-x-4 pb-4">
            {/* Document type cards */}
            {['NDA', 'Privacy Policy', 'Employment Agreement', 'MoU', 'Contract', 'Terms of Service'].map((docType, index) => (
              <div 
                key={index}
                ref={addToCardRefs}
                className="flex-shrink-0 w-40 h-40 bg-indigo-100 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-indigo-200 transition-colors"
              >
                <div className="bg-indigo-600 text-white p-3 rounded-full mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="font-medium text-indigo-900">{docType}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4 text-indigo-900">Powerful Features</h2>
          <p className="text-xl text-center text-indigo-700 mb-16 max-w-3xl mx-auto">
            Everything you need to handle legal documents with confidence
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div 
              ref={addToFeatureRefs}
              className="bg-indigo-50 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="bg-indigo-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-indigo-900">Smart Document Drafting</h3>
              <p className="text-indigo-700">
                Generate NDAs, MoUs, Privacy Policies, and more with just a few simple inputs.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div 
              ref={addToFeatureRefs}
              className="bg-indigo-50 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="bg-indigo-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-indigo-900">Compliance Check</h3>
              <p className="text-indigo-700">
                Flags missing clauses and ensures compliance with GDPR, Indian IT Act, and more.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div 
              ref={addToFeatureRefs}
              className="bg-indigo-50 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="bg-indigo-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-indigo-900">Multi-Language Support</h3>
              <p className="text-indigo-700">
                Generate documents in English and Indian regional languages for greater accessibility.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div 
              ref={addToFeatureRefs}
              className="bg-indigo-50 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="bg-indigo-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-indigo-900">Document History</h3>
              <p className="text-indigo-700">
                Access and manage all your previously created documents in one secure dashboard.
              </p>
            </div>
            
            {/* Feature 5 */}
            <div 
              ref={addToFeatureRefs}
              className="bg-indigo-50 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="bg-indigo-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-indigo-900">Template Marketplace</h3>
              <p className="text-indigo-700">
                Access a curated collection of ready-to-use legal templates for various needs.
              </p>
            </div>
            
            {/* Feature 6 */}
            <div 
              ref={addToFeatureRefs}
              className="bg-indigo-50 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="bg-indigo-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-indigo-900">Secure & Private</h3>
              <p className="text-indigo-700">
                Your documents are encrypted and stored securely with strict privacy controls.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="impact" className="py-16 bg-indigo-900 text-white px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Our Impact</h2>
          <p className="text-xl text-center text-indigo-200 mb-16 max-w-3xl mx-auto">
            Helping innovators focus on what they do best
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-indigo-800/30 p-8 rounded-2xl backdrop-blur-sm">
              <div ref={addToStatRefs} data-value="92" className="text-5xl font-bold text-green-400 mb-4">0%</div>
              <h3 className="text-xl font-semibold mb-2">Time Saved</h3>
              <p className="text-indigo-200">Average time reduction on legal document creation</p>
            </div>
            
            <div className="bg-indigo-800/30 p-8 rounded-2xl backdrop-blur-sm">
              <div ref={addToStatRefs} data-value="85" className="text-5xl font-bold text-green-400 mb-4">0%</div>
              <h3 className="text-xl font-semibold mb-2">Cost Reduction</h3>
              <p className="text-indigo-200">Compared to traditional legal services</p>
            </div>
            
            <div className="bg-indigo-800/30 p-8 rounded-2xl backdrop-blur-sm">
              <div ref={addToStatRefs} data-value="97" className="text-5xl font-bold text-green-400 mb-4">0%</div>
              <h3 className="text-xl font-semibold mb-2">User Satisfaction</h3>
              <p className="text-indigo-200">Report increased confidence in legal matters</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-10 shadow-xl">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Simplify Your Legal Work?</h2>
          <p className="text-indigo-100 text-xl mb-8">
            Join thousands of startups, freelancers, and small businesses using Nyaaal AI
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <button className="bg-white text-indigo-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-indigo-50 transition-colors">
              Get Started Free
            </button>
            <button className="bg-indigo-900 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-indigo-800 transition-colors">
              Schedule a Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-indigo-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="bg-white text-indigo-600 font-bold text-xl p-2 rounded-md">N</div>
              <span className="ml-2 text-xl font-semibold">Nyaaal AI</span>
            </div>
            <p className="text-indigo-200">
              Making legal assistance accessible to everyone.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-indigo-200 hover:text-white">Features</a></li>
              <li><a href="#" className="text-indigo-200 hover:text-white">Pricing</a></li>
              <li><a href="#" className="text-indigo-200 hover:text-white">Use Cases</a></li>
              <li><a href="#" className="text-indigo-200 hover:text-white">Integrations</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-indigo-200 hover:text-white">Blog</a></li>
              <li><a href="#" className="text-indigo-200 hover:text-white">Templates</a></li>
              <li><a href="#" className="text-indigo-200 hover:text-white">Documentation</a></li>
              <li><a href="#" className="text-indigo-200 hover:text-white">Support</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-indigo-200 hover:text-white">About</a></li>
              <li><a href="#" className="text-indigo-200 hover:text-white">Careers</a></li>
              <li><a href="#" className="text-indigo-200 hover:text-white">Contact</a></li>
              <li><a href="#" className="text-indigo-200 hover:text-white">Legal</a></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-indigo-800 text-center text-indigo-200">
          <p>© {new Date().getFullYear()} Nyaaal AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}