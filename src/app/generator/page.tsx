"use client";

import { useState, useMemo } from 'react';
import { useSession, signIn, signOut } from "next-auth/react";

// **FIX: Radically expanded and more specific fields for each document type**
const documentFields: { [key: string]: string[] } = {
  'Non-Disclosure Agreement': ['Disclosing Party Name', 'Receiving Party Name', 'Term (e.g., 5 years)', 'Jurisdiction (e.g., Maharashtra, India)', 'Description of Confidential Information'],
  'Memorandum of Understanding': ['First Party Name', 'Second Party Name', 'Objective of MOU', 'Jurisdiction (e.g., Delhi, India)', 'Term of MOU'],
  'Privacy Policy': ['Company Name', 'Website/App Name', 'Jurisdiction (e.g., India)', 'Contact Email for Privacy Inquiries', 'Types of Data Collected (e.g., name, email, usage data)'],
  'Employment Agreement': ['Company Name', 'Employee Name', 'Job Title', 'Annual Salary (INR)', 'Notice Period (in days)', 'Probation Period (in days)', 'Jurisdiction (e.g., Karnataka, India)'],
  'Investor Agreement': ['Company Name', 'Investor Name', 'Investment Amount (INR)', 'Equity Percentage (%)', 'Number of Board Seats', 'Vesting Cliff (e.g., 1 year)', 'Total Vesting Period (e.g., 4 years)', 'Jurisdiction (e.g., Bangalore, India)'],
  'Vendor Contract': ['Client Name', 'Vendor Name', 'Detailed Service Description', 'Payment Amount (INR)', 'Term of Contract', 'Payment Schedule (e.g., Net 30)', 'Jurisdiction (e.g., Haryana, India)'],
};

export default function GeneratorPage() {
  const { data: session, status } = useSession();
  
  const [documentType, setDocumentType] = useState('Non-Disclosure Agreement');
  const [formData, setFormData] = useState<{[key: string]: string}>({
    'Disclosing Party Name': '',
    'Receiving Party Name': '',
    'Term (e.g., 5 years)': '',
    'Jurisdiction (e.g., Maharashtra, India)': '',
    'Description of Confidential Information': ''
  });
  
  const [generatedHtml, setGeneratedHtml] = useState('');
  const [isCreatingDoc, setIsCreatingDoc] = useState(false);
  const [docUrl, setDocUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const currentFields = useMemo(() => documentFields[documentType], [documentType]);

  const handleDocumentTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value;
    setDocumentType(newType);
    
    const newFields = documentFields[newType];
    const newFormData = newFields.reduce((acc, field) => {
      acc[field] = '';
      return acc;
    }, {} as {[key: string]: string});
    setFormData(newFormData);
    setGeneratedHtml('');
    setDocUrl('');
    setError('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setGeneratedHtml('');
    setDocUrl('');

    try {
      const response = await fetch('/api/generate-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ document_type: documentType, ...formData, "Effective Date": new Date().toISOString().split('T')[0] }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.details || 'An unknown API error occurred');
      }
      setGeneratedHtml(result.htmlContent);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCreateDoc = async () => {
    if (!generatedHtml) {
      setError("Please generate a document first.");
      return;
    }
    setIsCreatingDoc(true);
    setError('');
    setDocUrl('');

    try {
      const response = await fetch('/api/create-doc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `${documentType} - ${Object.values(formData)[0]} and ${Object.values(formData)[1]}`,
          htmlContent: generatedHtml,
        }),
      });

      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.details || "Failed to create Google Doc.");
      }

      const result = await response.json();
      setDocUrl(result.documentUrl);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsCreatingDoc(false);
    }
  };

  if (status === "loading") {
    return <p className="text-center text-gray-400 mt-10">Loading session...</p>;
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-600">Welcome to Nyayal AI</h1>
        <p className="text-gray-400 mb-8">Sign in with your Google account to continue.</p>
        <button onClick={() => signIn("google")} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-md font-semibold transition-colors">Sign in with Google</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8">
      <main className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="text-gray-400">Signed in as</p>
            <p className="font-semibold">{session.user?.email}</p>
          </div>
          <button onClick={() => signOut()} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md font-semibold transition-colors">Sign Out</button>
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-600">Nyayal AI Document Generator</h1>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 sm:p-8">
          <form onSubmit={handleGenerateSubmit} className="space-y-4">
            <div>
              <label htmlFor="document_type" className="block text-sm font-medium text-gray-400 mb-1">Document Type</label>
              <select id="document_type" name="document_type" value={documentType} onChange={handleDocumentTypeChange} className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md">
                {Object.keys(documentFields).map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>
            
            {currentFields.map(field => (
              <div key={field}>
                <label htmlFor={field} className="block text-sm font-medium text-gray-400 mb-1">{field}</label>
                <input type="text" id={field} name={field} value={formData[field] || ''} onChange={handleInputChange} className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md" required />
              </div>
            ))}

            <button type="submit" disabled={isLoading} className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-md font-semibold transition-colors disabled:bg-gray-500">
              {isLoading ? 'Generating...' : 'Generate Document'}
            </button>
          </form>
        </div>

        {error && <div className="mt-8 bg-red-900/50 border border-red-500 rounded-lg p-4 text-center"><h2 className="text-xl font-semibold mb-2 text-red-300">An Error Occurred</h2><p className="text-red-400">{error}</p></div>}

        {generatedHtml && !error && (
          <div className="mt-8 bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-green-400 text-center">Document Preview</h2>
            <div className="p-6 bg-white text-gray-800 rounded-md shadow-inner space-y-4" dangerouslySetInnerHTML={{ __html: generatedHtml }} />
            
            <div className="text-center mt-6">
              {!docUrl ? (
                <button onClick={handleCreateDoc} disabled={isCreatingDoc} className="inline-block py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold transition-colors disabled:bg-gray-500">
                  {isCreatingDoc ? 'Creating Google Doc...' : 'Create Google Doc'}
                </button>
              ) : (
                <a href={docUrl} target="_blank" rel="noopener noreferrer" className="inline-block py-3 px-6 bg-green-600 hover:bg-green-700 text-white rounded-md font-semibold transition-colors">
                  Open Google Doc
                </a>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
