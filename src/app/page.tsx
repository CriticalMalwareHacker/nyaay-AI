// src/app/page.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import ContactUs from './contactus/page';
import AboutUs from './aboutus/page';
import Pricing from './pricing/page';

export default function NyaayAI() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true); // Dark mode as default
  const mainRef = useRef(null);
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const featureRefs = useRef<HTMLDivElement[]>([]);
  const cardRefs = useRef<HTMLDivElement[]>([]);
  const statRefs = useRef<HTMLDivElement[]>([]);

  // Toggle dark/light mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

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
    
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`} ref={mainRef}>
      <Head>
        <title>Nyaay AI - AI-Powered Legal Assistant for India</title>
        <meta name="description" content="India's premier AI-powered legal assistant for startups, businesses, and individuals" />
      </Head>

      {/* Header */}
<header className={`sticky top-0 z-50 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-b shadow-sm`}>
  <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center">
    {/* Left section - Logo (fixed width) */}
    <div className="flex items-center w-1/3">
      <span className="w-20">
        <img src="LOGO_PNG.png" alt="Logo" />
      </span>
    </div>
    {/* Centered Nav */}
<nav className="hidden md:flex space-x-8 justify-center items-center flex-1">
  <a href="#home" className={`hover:text-indigo-500 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Home</a>
  <a href="#services" className={`hover:text-indigo-500 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Services</a>
  <a href="/pricing" className={`hover:text-indigo-500 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Pricing</a>
  <a href="/aboutus" className={`hover:text-indigo-500 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>About Us</a>
  <a href="/contactus" className={`hover:text-indigo-500 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Contact Us</a>
</nav>

         <div className="flex items-center justify-end space-x-4 w-1/3">
  <button 
    onClick={() => setDarkMode(!darkMode)}
    className={`p-2 rounded-full ${darkMode ? 'bg-gray-800 text-amber-300' : 'bg-gray-200 text-gray-700'}`}
  >
    {darkMode ? (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
      </svg>
    ) : (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
      </svg>
    )}
  </button>
  <button 
    className="md:hidden" 
    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
  >
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
    </svg>
  </button>
</div>

        </div>
        <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'} ${darkMode ? 'bg-gray-800' : 'bg-white'} border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <a href="#home" className={`block py-3 px-6 ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}>Home</a>
          <a href="#services" className={`block py-3 px-6 ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}>Services</a>
          <a href="#pricing" className={`block py-3 px-6 ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}>Pricing</a>
          <a href="#about" className={`block py-3 px-6 ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}>About Us</a>
          <a href="#" className="block py-3 px-6 text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-gray-700">Already a user?</a>
        </div>                            
      </header>

      {/* Hero Section */}
      <section id="home" className="relative py-16 md:py-24" ref={heroRef}>
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute left-0 top-0 w-72 h-72 rounded-full ${darkMode ? 'bg-indigo-900/20' : 'bg-indigo-100/40'} blur-3xl`}></div>
          <div className={`absolute right-0 bottom-0 w-72 h-72 rounded-full ${darkMode ? 'bg-amber-900/20' : 'bg-amber-100/40'} blur-3xl`}></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 py-16 md:py-24 text-center relative z-10">
<h1 
  ref={titleRef}
  style={{ fontFamily: "'Samarkan', sans-serif" }}
  className={`text-1xl sm:text-2xl md:text-9xl font-bold mb-6 mt-0 ${darkMode ? 'text-white' : 'text-gray-900'}`}
>
  Nyaay AI
</h1>
          <p 
            ref={subtitleRef}
            className={`text-lg sm:text-xl md:text-2xl mt-4 max-w-3xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
          >
            India's AI-powered legal assistant designed for Indian laws, languages, and businesses
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
            <a href="#services" className="bg-indigo-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-indigo-700 transition-colors shadow-lg">
              Explore Services
            </a>
          </div>
        </div>
      </section>

 {/* Services Section */}
<section id="services" className="py-16 md:py-20 relative">
  <div className="absolute inset-0 overflow-hidden">
    <div className={`absolute left-1/4 top-0 w-96 h-96 rounded-full ${darkMode ? 'bg-indigo-900/10' : 'bg-indigo-100/30'} blur-3xl`}></div>
  </div>

  <div className="container mx-auto px-4 sm:px-6 relative z-10">
    <h3 className={`text-2xl sm:text-3xl font-bold text-center mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Comprehensive Legal Solutions</h3>
    <p className={`text-lg text-center mb-12 md:mb-16 max-w-3xl mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
      From document drafting to compliance, we cover all your legal needs with AI precision
    </p>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {[
        {
          icon: (
            <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          ),
          title: "Smart Document Drafting",
          description: "Generate legal documents like NDAs, MoUs, and contracts with AI precision tailored to Indian laws.",
          link: "http://localhost:3000/generator"
        },
        {
          icon: (
            <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
          ),
          title: "Compliance Check",
          description: "Ensure your documents comply with Indian regulations like IT Act, Companies Act, and state-specific laws.",
          link: "http://localhost:3000/compliance"
        },
        {
          icon: (
            <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path>
            </svg>
          ),
          title: "Legal Documents Marketplace",
          description: "Access ready-to-use legal templates and documents for quick and reliable drafting.",
          link: "http://localhost:3000/marketplace"
        }
      ].map((service, index) => (
        <a
          key={index}
          href={service.link}
          className={`block p-6 rounded-lg ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-200'} border shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer`}
          target="_blank" // optional: remove if you want same tab navigation
        >
          <div className={`rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4 ${darkMode ? 'bg-indigo-900/20' : 'bg-indigo-100'}`}>
            {service.icon}
          </div>
          <h4 className="text-xl font-semibold mb-3 text-indigo-600">{service.title}</h4>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
            {service.description}
          </p>
        </a>
      ))}
    </div>
  </div>
</section>


      {/* Stats Section */}
      <section className={`py-16 md:py-20 ${darkMode ? 'bg-gray-800' : 'bg-indigo-50'} relative`}>
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute left-0 top-0 w-96 h-96 rounded-full ${darkMode ? 'bg-indigo-900/20' : 'bg-indigo-200/30'} blur-3xl`}></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-center">
            {[
              { value: 92, title: "Time Saved", description: "Average time reduction on legal document creation" },
              { value: 85, title: "Cost Reduction", description: "Compared to traditional legal services" },
              { value: 97, title: "User Satisfaction", description: "Report increased confidence in legal matters" }
            ].map((stat, index) => (
              <div 
                key={index}
                className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-white border-gray-200'} border shadow-md`}
              >
                <div ref={addToStatRefs} data-value={stat.value} className="text-4xl md:text-5xl font-bold text-amber-500 mb-4">0%</div>
                <h3 className="text-xl font-semibold mb-2 text-indigo-600">{stat.title}</h3>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Indian Market Focus Section */}
      <section className="py-16 md:py-20 relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute right-0 top-0 w-96 h-96 rounded-full ${darkMode ? 'bg-amber-900/10' : 'bg-amber-100/30'} blur-3xl`}></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <h3 className={`text-2xl sm:text-3xl font-bold text-center mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Designed for the Indian Market</h3>
          <p className={`text-lg text-center mb-12 md:mb-16 max-w-3xl mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Tailored specifically for Indian laws, business practices, and linguistic diversity
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border shadow-md mb-6`}>
                <h4 className="text-xl font-semibold mb-4 text-indigo-600">Compliance with Indian Regulations</h4>
                <ul className={`space-y-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-amber-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Indian Companies Act, 2013
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-amber-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Information Technology Act, 2000
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-amber-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    State-specific business regulations
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-amber-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    GST and tax compliance
                  </li>
                </ul>
              </div>
            </div>
            
            <div>
              <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border shadow-md`}>
                <h4 className="text-xl font-semibold mb-4 text-indigo-600">Multi-Language Document Generation</h4>
                <div className="grid grid-cols-2 gap-4">
                  {['Hindi', 'Tamil', 'Telugu', 'Bengali', 'Marathi', 'Gujarati'].map((language) => (
                    <div key={language} className={`flex items-center justify-center p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-indigo-100'}`}>
                      <span className={darkMode ? 'text-gray-300' : 'text-indigo-800'}>{language}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute left-0 top-0 w-full h-72 ${darkMode ? 'bg-indigo-900/20' : 'bg-indigo-200/40'} blur-3xl`}></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
          <div className={`p-8 md:p-12 rounded-xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border shadow-lg max-w-4xl mx-auto`}>
            <h2 className={`text-2xl sm:text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Ready to Transform Your Legal Experience?</h2>
            <p className={`text-lg mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Join thousands of Indian businesses and individuals using Nyaay AI
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-indigo-700 transition-colors shadow-lg">
                Get Started Free
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 ${darkMode ? 'bg-gray-900 text-gray-400' : 'bg-gray-800 text-gray-300'}`}>
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className={`${darkMode ? 'bg-indigo-600' : 'bg-indigo-700'} text-white font-bold text-xl p-2 rounded-md`}>न्या</div>
                <span className="ml-2 text-xl font-bold">Nyaay AI</span>
              </div>
              <p>India's premier AI-powered legal assistant platform</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white">Services</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-amber-400 transition-colors">Document Drafting</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Compliance Check</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Legal Consultation</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Multi-Language Support</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-amber-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-amber-400 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="hover:text-amber-400 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M21.562 8.438a8.21 8.21 0 01-2.357.646 4.113 4.113 0 001.805-2.27 8.23 8.23 0 01-2.606.996 4.109 4.109 0 00-7.003 3.742 11.64 11.64 0 01-8.457-4.287 4.109 4.109 0 001.27 5.478A4.086 4.086 0 012.8 12.3v.052a4.109 4.109 0 003.292 4.022 4.09 4.09 0 01-1.853.07 4.109 4.109 0 003.834 2.85A8.25 8.25 0 012.5 20.25a11.595 11.595 0 006.29 1.844c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0021.563 8.438z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="hover:text-amber-400 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.48 2.94 8.26 6.97 9.53.5.09.68-.22.68-.48v-1.7c-2.84.62-3.44-1.37-3.44-1.37-.45-1.15-1.1-1.46-1.1-1.46-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.1.39-1.99 1.03-2.69a3.6 3.6 0 01.1-2.64s.84-.27 2.75 1.02a9.58 9.58 0 015 0c1.91-1.29 2.75-1.02 2.75-1.02.54 1.25.14 2.3.1 2.64.64.7 1.03 1.6 1.03 2.69 0 3.84-2.33 4.68-4.56 4.93.36.31.68.92.68 1.85v2.72c0 .27.18.57.69.48A10 10 0 0022 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm">
            &copy; {new Date().getFullYear()} Nyaay AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}