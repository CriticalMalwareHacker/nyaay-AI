"use client";

import { useState } from 'react';
import { useSession, signIn, signOut } from "next-auth/react";

export default function GeneratorPage() {
  const { data: session, status } = useSession();

  const [formData, setFormData] = useState({
    document_type: 'Non-Disclosure Agreement',
    disclosing_party_name: 'Innovate Corp',
    receiving_party_name: 'Builder LLC',
    effective_date: new Date().toISOString().split('T')[0],
    term: '5 years',
  });
  
  const [generatedHtml, setGeneratedHtml] = useState('');
  const [isCreatingDoc, setIsCreatingDoc] = useState(false);
  const [docUrl, setDocUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || `An API error occurred`);
      }

      const result = await response.json();
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
          title: `${formData.document_type} - ${formData.disclosing_party_name} and ${formData.receiving_party_name}`,
          htmlContent: generatedHtml,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create Google Doc.");
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
          <h1 className="text-4xl sm:text-5xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-600">
            Welcome to Nyaan AI
          </h1>
          <p className="text-gray-400 mb-8">Sign in with your Google account to continue.</p>
          <button
              onClick={() => signIn("google")}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-md font-semibold transition-colors"
          >
              Sign in with Google
          </button>
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
          <button
            onClick={() => signOut()}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md font-semibold transition-colors"
          >
            Sign Out
          </button>
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-600">
          Nyayal AI Document Generator
        </h1>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 sm:p-8">
          <form onSubmit={handleGenerateSubmit} className="space-y-4">
            <div>
              <label htmlFor="document_type" className="block text-sm font-medium text-gray-400 mb-1">
                Document Type
              </label>
              <select
                id="document_type"
                name="document_type"
                value={formData.document_type}
                onChange={handleInputChange}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md"
              >
                <option>Non-Disclosure Agreement</option>
                <option>Memorandum of Understanding</option>
              </select>
            </div>
            <div>
              <label htmlFor="disclosing_party_name" className="block text-sm font-medium text-gray-400 mb-1">
                Disclosing Party Name
              </label>
              <input
                type="text"
                id="disclosing_party_name"
                name="disclosing_party_name"
                value={formData.disclosing_party_name}
                onChange={handleInputChange}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="receiving_party_name" className="block text-sm font-medium text-gray-400 mb-1">
                Receiving Party Name
              </label>
              <input
                type="text"
                id="receiving_party_name"
                name="receiving_party_name"
                value={formData.receiving_party_name}
                onChange={handleInputChange}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-md font-semibold transition-colors disabled:bg-gray-500 flex items-center justify-center"
            >
              {isLoading ? 'Generating...' : 'Generate Document Preview'}
            </button>
          </form>
        </div>

        {error && (
            <div className="mt-8 bg-gray-800 border border-red-500/50 rounded-lg p-6 text-center">
                <h2 className="text-xl font-semibold mb-2 text-red-400">An Error Occurred</h2>
                <p className="text-red-300">{error}</p>
            </div>
        )}

        {generatedHtml && !error && (
            <div className="mt-8 bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-4 text-green-400 text-center">Document Preview</h2>
                <div
                    className="p-6 bg-white text-gray-800 rounded-md shadow-inner space-y-4"
                    dangerouslySetInnerHTML={{ __html: generatedHtml }}
                />
                
                <div className="text-center mt-6">
                  {!docUrl ? (
                    <button
                      onClick={handleCreateDoc}
                      disabled={isCreatingDoc}
                      className="inline-block py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold transition-colors disabled:bg-gray-500"
                    >
                      {isCreatingDoc ? 'Creating...' : 'Create Google Doc'}
                    </button>
                  ) : (
                    <a
                      href={docUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block py-3 px-6 bg-green-600 hover:bg-green-700 text-white rounded-md font-semibold transition-colors"
                    >
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

