'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

export default function AboutUs() {
  const [darkMode, setDarkMode] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const teamRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    // Team member animations
    if (teamRefs.current.length > 0) {
      gsap.fromTo(teamRefs.current,
        { opacity: 0, y: 50, scale: 0.8 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
          scrollTrigger: {
            trigger: teamRefs.current[0],
            start: "top 80%",
            toggleActions: "play none none none"
          }
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const addToTeamRefs = (el: HTMLDivElement | null) => {
    if (el && !teamRefs.current.includes(el)) {
      teamRefs.current.push(el);
    }
  };

  const teamMembers = [
    {
      name: "Tanay Kumar",
      role: "Co-founder and Technical Head",
      description: "Former legal tech executive with 15+ years of experience in AI and legal systems.",
      image: "tanay.jpeg"
    },
    {
      name: "Pranshu Mangale",
      role: "Founder & CEO",
      description: "AI researcher specializing in natural language processing for legal documents.",
      image: "pranshu.png"
    },
    {
      name: "Neelay Machha",
      role: "Chief Technology Officer",
      description: "Tech visionary with expertise in scalable AI systems and Indian legal compliance.",
      image: "neelay.jpg"
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
      
      {/* Header with Navigation */}
      <header className={`sticky top-0 z-50 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-b shadow-sm`}>
        <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center">
          {/* Left section - Logo */}
          <div className="flex items-center w-1/3">
            <span className="w-20">
              <img src="/LOGO_PNG.png" alt="Logo" />
            </span>
          </div>
          
          {/* Centered Nav */}
          <nav className="hidden md:flex space-x-8 justify-center items-center flex-1">
            <a href="/" className={`hover:text-indigo-500 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Home</a>
            <a href="/#services" className={`hover:text-indigo-500 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Services</a>
            <a href="/pricing" className={`hover:text-indigo-500 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Pricing</a>
            <a href="/aboutus" className={`hover:text-indigo-500 text-indigo-600 font-medium ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>About Us</a>
            <a href="/contactus" className={`hover:text-indigo-500 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Contact Us</a>
          </nav>

          {/* Right section - Dark mode toggle */}
          <div className="flex items-center justify-end space-x-4 w-1/3">
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-800 text-amber-300' : 'bg-gray-200 text-gray-700'}`}
            >
              {darkMode ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                </svg>
              )}
            </button>
            <button 
              className="md:hidden" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'} ${darkMode ? 'bg-gray-800' : 'bg-white'} border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <a href="/" className={`block py-3 px-6 ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}>Home</a>
          <a href="/#services" className={`block py-3 px-6 ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}>Services</a>
          <a href="/pricing" className={`block py-3 px-6 ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}>Pricing</a>
          <a href="/aboutus" className={`block py-3 px-6 text-indigo-600 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>About Us</a>
          <a href="/contactus" className={`block py-3 px-6 ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}>Contact Us</a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute left-0 top-0 w-72 h-72 rounded-full ${darkMode ? 'bg-indigo-900/20' : 'bg-indigo-100/40'} blur-3xl`}></div>
          <div className={`absolute right-0 bottom-0 w-72 h-72 rounded-full ${darkMode ? 'bg-amber-900/20' : 'bg-amber-100/40'} blur-3xl`}></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 py-16 md:py-24 text-center relative z-10">
          <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            About Nyaay AI
          </h1>
          <p className={`text-lg sm:text-xl md:text-2xl mt-4 max-w-3xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Revolutionizing legal services in India through cutting-edge AI technology
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-20 relative">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className={`text-2xl sm:text-3xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Our Mission
            </h2>
            <p className={`text-lg leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              We believe that every Indian business and individual deserves access to high-quality legal assistance. 
              Our AI-powered platform democratizes legal services by making them affordable, accessible, and tailored 
              to Indian laws and regulations. From startups to established enterprises, we're here to empower your legal journey.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className={`py-16 md:py-20 ${darkMode ? 'bg-gray-800' : 'bg-white'} relative`}>
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <h2 className={`text-2xl sm:text-3xl font-bold text-center mb-12 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Meet Our Team
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                ref={addToTeamRefs}
                className={`text-center p-6 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} shadow-lg`}
              >
                {/* Spherical Photo Frame */}
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <div className={`absolute inset-0 rounded-full ${darkMode ? 'bg-gradient-to-br from-indigo-400 to-purple-600' : 'bg-gradient-to-br from-indigo-500 to-purple-700'} p-1`}>
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  {/* Decorative rings */}
                  <div className={`absolute -inset-2 rounded-full border-2 ${darkMode ? 'border-indigo-400/30' : 'border-indigo-500/30'} animate-pulse`}></div>
                  <div className={`absolute -inset-4 rounded-full border ${darkMode ? 'border-purple-400/20' : 'border-purple-500/20'}`}></div>
                </div>
                
                <h3 className="text-xl font-semibold mb-2 text-indigo-600">{member.name}</h3>
                <p className={`font-medium mb-3 ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>{member.role}</p>
                <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-20 relative">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <h2 className={`text-2xl sm:text-3xl font-bold text-center mb-12 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Our Values
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                title: "Accuracy",
                description: "Every document and advice is meticulously crafted to meet Indian legal standards",
                icon: "🎯"
              },
              {
                title: "Accessibility",
                description: "Making legal services affordable and available to every corner of India",
                icon: "🌍"
              },
              {
                title: "Innovation",
                description: "Continuously improving our AI to serve the evolving needs of Indian businesses",
                icon: "🚀"
              }
            ].map((value, index) => (
              <div key={index} className={`text-center p-6 rounded-lg ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border shadow-md`}>
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-indigo-600">{value.title}</h3>
                <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
