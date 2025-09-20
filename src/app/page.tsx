// src/app/page.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

export default function Nyaaal() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Nyaaal AI</h1>
          <nav className="hidden md:flex space-x-8">
            <a href="#home" className="text-gray-600 hover:text-indigo-600">Home</a>
            <a href="#services" className="text-gray-600 hover:text-indigo-600">Services</a>
            <a href="#pricing" className="text-gray-600 hover:text-indigo-600">Pricing</a>
            <a href="#about" className="text-gray-600 hover:text-indigo-600">About Us</a>
          </nav>
          <a href="#" className="hidden md:block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Get Started</a>
          <button 
            className="md:hidden" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>
        <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
          <a href="#home" className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100">Home</a>
          <a href="#services" className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100">Services</a>
          <a href="#pricing" className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100">Pricing</a>
          <a href="#about" className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100">About Us</a>
          <a href="#" className="block py-2 px-4 text-sm text-white bg-indigo-600 hover:bg-indigo-700">Get Started</a>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="bg-white" ref={heroRef}>
        <div className="container mx-auto px-6 py-20 text-center">
          <h2 
            ref={titleRef}
            className="text-4xl md:text-5xl font-bold text-gray-800"
          >
            AI-Powered Legal Solutions for Startups & Businesses
          </h2>
          <p 
            ref={subtitleRef}
            className="text-gray-600 mt-4 max-w-2xl mx-auto"
          >
            From contracts to compliance, our AI assistant helps you create, review, and manage legal documents with confidence.
          </p>
          <a href="#services" className="mt-8 inline-block bg-indigo-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-indigo-700">Explore Services</a>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20">
        <div className="container mx-auto px-6">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">All Your Legal Needs, Covered by AI</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div 
              ref={addToFeatureRefs}
              className="bg-white p-8 rounded-lg shadow-md text-center"
            >
              <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-800 mb-2">Smart Document Creation</h4>
              <p className="text-gray-600">Generate legal documents like NDAs, Privacy Policies, and Contracts with AI assistance.</p>
            </div>
            <div 
              ref={addToFeatureRefs}
              className="bg-white p-8 rounded-lg shadow-md text-center"
            >
              <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-800 mb-2">Compliance Check</h4>
              <p className="text-gray-600">Ensure your documents comply with regulations like GDPR, Indian IT Act, and more.</p>
            </div>
            <div 
              ref={addToFeatureRefs}
              className="bg-white p-8 rounded-lg shadow-md text-center"
            >
              <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path>
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-800 mb-2">Multi-Language Support</h4>
              <p className="text-gray-600">Generate documents in English and Indian regional languages for greater accessibility.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-6">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">Get Legal Documents in 3 Easy Steps</h3>
          <div className="flex flex-col md:flex-row justify-around items-center text-center">
            <div className="mb-8 md:mb-0">
              <div className="bg-gray-200 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-gray-600">1</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-800">Select Document Type</h4>
              <p className="text-gray-600 mt-2">Choose from NDA, Privacy Policy, Contract, and more.</p>
            </div>
            <div className="hidden md:block w-1/4 border-t-2 border-dashed border-gray-300"></div>
            <div className="mb-8 md:mb-0">
              <div className="bg-gray-200 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-gray-600">2</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-800">Answer Questions</h4>
              <p className="text-gray-600 mt-2">Fill out a simple questionnaire about your needs.</p>
            </div>
            <div className="hidden md:block w-1/4 border-t-2 border-dashed border-gray-300"></div>
            <div>
              <div className="bg-gray-200 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-gray-600">3</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-800">Download & Use</h4>
              <p className="text-gray-600 mt-2">Receive your customized legal document instantly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">Why Choose Nyaaal AI</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <h4 className="text-xl font-semibold text-gray-800">AI-Powered</h4>
              <p className="text-gray-600 mt-2">Our advanced AI ensures accurate and relevant legal documents.</p>
            </div>
            <div className="text-center">
              <h4 className="text-xl font-semibold text-gray-800">Cost Effective</h4>
              <p className="text-gray-600 mt-2">Save up to 80% compared to traditional legal services.</p>
            </div>
            <div className="text-center">
              <h4 className="text-xl font-semibold text-gray-800">Time Saving</h4>
              <p className="text-gray-600 mt-2">Generate documents in minutes instead of days or weeks.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="impact" className="bg-indigo-900 text-white py-16 px-4">
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

      {/* Testimonials Section */}
      <section id="about" className="bg-white py-20">
        <div className="container mx-auto px-6">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">Loved by Startups Across India</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-100 p-8 rounded-lg">
              <p className="text-gray-600 mb-4">"Nyaaal AI made creating our legal documents incredibly easy. The process was straightforward and much more affordable than hiring a lawyer."</p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full mr-4 bg-indigo-100 flex items-center justify-center">
                  <span className="text-indigo-600 font-semibold">AK</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Aarav Kumar</p>
                  <p className="text-sm text-gray-600">Founder, FinTech Innovations</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-100 p-8 rounded-lg">
              <p className="text-gray-600 mb-4">"We got our essential legal documents done in no time. The multi-language support was especially helpful for our regional clients."</p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full mr-4 bg-indigo-100 flex items-center justify-center">
                  <span className="text-indigo-600 font-semibold">SP</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Saanvi Patel</p>
                  <p className="text-sm text-gray-600">CEO, Healthify Solutions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-6">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">Simple, Transparent Pricing</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <h4 className="text-xl font-semibold text-gray-800">Basic</h4>
              <p className="text-4xl font-bold text-gray-800 my-4">₹4,999</p>
              <p className="text-gray-600">One-time</p>
              <ul className="text-left my-8 space-y-2">
                <li>✓ 5 Document Generations</li>
                <li>✓ Basic Compliance Check</li>
                <li>✓ English Language Only</li>
                <li>- Legal Consultation</li>
              </ul>
              <a href="#" className="bg-gray-200 text-gray-800 px-6 py-3 rounded-md font-semibold hover:bg-gray-300 block">Choose Plan</a>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg text-center border-2 border-indigo-600">
              <p className="text-indigo-600 font-semibold mb-2">Most Popular</p>
              <h4 className="text-xl font-semibold text-gray-800">Pro</h4>
              <p className="text-4xl font-bold text-gray-800 my-4">₹9,999</p>
              <p className="text-gray-600">One-time</p>
              <ul className="text-left my-8 space-y-2">
                <li>✓ Unlimited Document Generations</li>
                <li>✓ Advanced Compliance Check</li>
                <li>✓ Multi-Language Support</li>
                <li>✓ 30-min Legal Consultation</li>
              </ul>
              <a href="#" className="bg-indigo-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-indigo-700 block">Choose Plan</a>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <h4 className="text-xl font-semibold text-gray-800">Enterprise</h4>
              <p className="text-4xl font-bold text-gray-800 my-4">Custom</p>
              <p className="text-gray-600">Annual</p>
              <ul className="text-left my-8 space-y-2">
                <li>✓ All Pro features</li>
                <li>✓ Custom Document Templates</li>
                <li>✓ Priority Support</li>
                <li>✓ Dedicated Account Manager</li>
              </ul>
              <a href="#" className="bg-gray-200 text-gray-800 px-6 py-3 rounded-md font-semibold hover:bg-gray-300 block">Contact Us</a>
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
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-bold text-lg mb-4">Nyaaal AI</h4>
              <p className="text-gray-400">AI-powered legal solutions for the next generation of Indian businesses.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul>
                <li className="mb-2"><a href="#" className="hover:text-indigo-400">Document Generation</a></li>
                <li className="mb-2"><a href="#" className="hover:text-indigo-400">Compliance Check</a></li>
                <li className="mb-2"><a href="#" className="hover:text-indigo-400">Multi-Language Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul>
                <li className="mb-2"><a href="#" className="hover:text-indigo-400">About Us</a></li>
                <li className="mb-2"><a href="#" className="hover:text-indigo-400">Contact</a></li>
                <li className="mb-2"><a href="#" className="hover:text-indigo-400">Privacy Policy</a></li>
                <li className="mb-2"><a href="#" className="hover:text-indigo-400">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M21.562 8.438a8.21 8.21 0 01-2.357.646 4.113 4.113 0 001.805-2.27 8.23 8.23 0 01-2.606.996 4.109 4.109 0 00-7.003 3.742 11.64 11.64 0 01-8.457-4.287 4.109 4.109 0 001.27 5.478A4.086 4.086 0 012.8 12.3v.052a4.109 4.109 0 003.292 4.022 4.09 4.09 0 01-1.853.07 4.109 4.109 0 003.834 2.85A8.25 8.25 0 012.5 20.25a11.595 11.595 0 006.29 1.844c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0021.563 8.438z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.48 2.94 8.26 6.97 9.53.5.09.68-.22.68-.48v-1.7c-2.84.62-3.44-1.37-3.44-1.37-.45-1.15-1.1-1.46-1.1-1.46-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.1.39-1.99 1.03-2.69a3.6 3.6 0 01.1-2.64s.84-.27 2.75 1.02a9.58 9.58 0 015 0c1.91-1.29 2.75-1.02 2.75-1.02.54 1.25.14 2.3.1 2.64.64.7 1.03 1.6 1.03 2.69 0 3.84-2.33 4.68-4.56 4.93.36.31.68.92.68 1.85v2.72c0 .27.18.57.69.48A10 10 0 0022 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Nyaaal AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}