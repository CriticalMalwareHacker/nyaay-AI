# Nyaay AI - Legal Document Analyzer & Generator

### 🏛️ AI-Powered Legal Assistant for Access to Justice

Generate legal documents and analyze compliance with advanced AI technology

[![Next.js](https://img.shields.io/badge/Next.js-13+-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

## 🎯 About

Nyaay AI democratizes access to legal services in India by combining document generation with intelligent compliance analysis. Create legally sound documents and analyze existing ones for risks and improvements.

## ✨ Features

### 📝 Document Generator
- **Multi-language Support**: English, Hindi, Marathi, Telugu
- **6 Document Types**: NDAs, MOUs, Privacy Policies, Employment Agreements, Investor Agreements, Vendor Contracts
- **Google Docs Integration**: Direct export to Google Docs
- **Smart Validation**: Context-aware forms with helpful placeholders

### 🔍 Compliance Analyzer
- **AI-Powered Analysis**: Google Gemini for intelligent document review
- **Compliance Scoring**: 0-100 score based on legal soundness
- **Visual Reports**: Interactive charts and risk breakdown
- **Actionable Recommendations**: Specific improvement suggestions
- **Multi-format Support**: PDF and DOCX files

## 🛠 Tech Stack

- **Frontend**: Next.js 13+, TypeScript, Tailwind CSS, Recharts
- **Backend**: Next.js API Routes, Google Gemini AI
- **Authentication**: NextAuth.js with Google OAuth
- **APIs**: Google Drive, Google Docs

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Google Cloud Project with Gemini, Drive, and Docs APIs enabled
- Google OAuth 2.0 credentials

### Installation

Clone and install
git clone https://github.com/yourusername/nyaay-ai.git
cd nyaay-ai
npm install

Set up environment
cp .env.example .env.local

Add your API keys
Run development server
npm run dev

text

Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Environment Variables

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GEMINI_API_KEY=your-gemini-api-key

text

## 📱 Usage

### Document Generation
1. Sign in → Select document type → Choose language → Fill form → Generate → Export to Google Docs

### Document Analysis  
1. Upload legal document → Wait for AI analysis → Review compliance score → Examine issues → Implement recommendations

## 🛣 API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/generate-document` | POST | Generate legal documents |
| `/api/create-doc` | POST | Export to Google Docs |
| `/api/analyze-compliance` | POST | Analyze document compliance |

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request
  <p><strong>Made with ❤️ for accessible legal technology</strong></p>
  <p>Made by Tanay Kumar, Pranshu Mangale & Neelay Machha</p>
</div>
