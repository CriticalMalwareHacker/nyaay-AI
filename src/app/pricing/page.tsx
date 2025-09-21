'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Pricing() {
  const [darkMode, setDarkMode] = useState(true);
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: "Starter",
      description: "Perfect for individuals and small businesses",
      monthlyPrice: 999,
      annualPrice: 9990,
      features: [
        "5 documents per month",
        "Basic compliance check",
        "Email support",
        "Hindi & English support",
        "Standard templates"
      ],
      popular: false
    },
    {
      name: "Professional",
      description: "Ideal for growing businesses",
      monthlyPrice: 2499,
      annualPrice: 24990,
      features: [
        "25 documents per month",
        "Advanced compliance check",
        "Priority support",
        "Multi-language support",
        "Custom templates",
        "Legal consultation (2 hours)",
        "Document review"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      description: "For large organizations",
      monthlyPrice: 4999,
      annualPrice: 49990,
      features: [
        "Unlimited documents",
        "Full compliance suite",
        "24/7 dedicated support",
        "All Indian languages",
        "Custom integrations",
        "Legal consultation (10 hours)",
        "Priority document review",
        "Custom training"
      ],
      popular: false
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>

      {/* ✅ Navbar */}
      <header className="py-6 shadow-md bg-white dark:bg-gray-800">
        <nav className="container mx-auto flex justify-between items-center px-6">
          <h1 className="text-xl font-bold text-indigo-600">Nyaay-AI</h1>
          <div className="hidden md:flex space-x-8 justify-center items-center flex-1">
            <Link href="/" className={`hover:text-indigo-500 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Home</Link>
            <Link href="/services" className={`hover:text-indigo-500 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Services</Link>
            <Link href="/pricing" className={`hover:text-indigo-500 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Pricing</Link>
            <Link href="/aboutus" className={`hover:text-indigo-500 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>About Us</Link>
            <Link href="/contactus" className={`hover:text-indigo-500 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Contact Us</Link>
          </div>
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-3 py-2 rounded-md bg-indigo-600 text-white text-sm"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute left-0 top-0 w-96 h-96 rounded-full ${darkMode ? 'bg-indigo-900/20' : 'bg-indigo-100/40'} blur-3xl`}></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 py-16 md:py-24 text-center relative z-10">
          <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Simple, Transparent Pricing
          </h1>
          <p className={`text-lg sm:text-xl md:text-2xl mt-4 max-w-3xl mx-auto mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Choose the perfect plan for your legal needs
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-12">
            <span className={`mr-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Monthly</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isAnnual ? 'bg-indigo-600' : 'bg-gray-300'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isAnnual ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
            <span className={`ml-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Annual 
              <span className="ml-1 px-2 py-1 text-xs bg-amber-500 text-white rounded-full">Save 17%</span>
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-16 md:pb-24 relative">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative p-8 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl ${
                  plan.popular 
                    ? `ring-2 ring-indigo-500 ${darkMode ? 'bg-gray-800' : 'bg-white'}` 
                    : `${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2 text-indigo-600">{plan.name}</h3>
                  <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{plan.description}</p>
                  
                  <div className="mb-4">
                    <span className="text-4xl font-bold">
                      ₹{isAnnual ? Math.floor(plan.annualPrice / 12).toLocaleString() : plan.monthlyPrice.toLocaleString()}
                    </span>
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>/month</span>
                    {isAnnual && (
                      <div className="text-sm text-amber-600 mt-1">
                        Billed annually (₹{plan.annualPrice.toLocaleString()})
                      </div>
                    )}
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                  plan.popular
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : `${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`
                }`}>
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={`py-16 md:py-20 ${darkMode ? 'bg-gray-800' : 'bg-white'} relative`}>
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <h2 className={`text-2xl sm:text-3xl font-bold text-center mb-12 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Frequently Asked Questions
          </h2>
          
          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: "Can I change my plan anytime?",
                answer: "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle."
              },
              {
                question: "Do you offer refunds?",
                answer: "We offer a 30-day money-back guarantee for all plans. If you're not satisfied, we'll provide a full refund."
              },
              {
                question: "Are there any setup fees?",
                answer: "No, there are no setup fees or hidden charges. You only pay the plan price."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards, debit cards, UPI, and net banking for Indian customers."
              }
            ].map((faq, index) => (
              <div key={index} className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <h3 className="font-semibold mb-2 text-indigo-600">{faq.question}</h3>
                <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
