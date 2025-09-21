"use client";
import Link from "next/link";
import { useState, useMemo } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

// Define document fields and placeholders
const documentFields: { [key: string]: { label: string; type: "text" | "radio"; placeholder?: string; options?: string[] }[] } = {
  "Non-Disclosure Agreement": [
    { label: "Party A Name", type: "text", placeholder: "Enter full legal name of Party A" },
    { label: "Party A Address", type: "text", placeholder: "Enter complete address of Party A" },
    { label: "Party A shares confidential information", type: "radio", options: ["Yes", "No"] },
    { label: "Party B Name", type: "text", placeholder: "Enter full legal name of Party B" },
    { label: "Party B Address", type: "text", placeholder: "Enter complete address of Party B" },
    { label: "Party B shares confidential information", type: "radio", options: ["Yes", "No"] },
    { label: "Confidential Information Definition", type: "radio", options: ["Standard", "Specific"] },
    { label: "Specific Confidential Information Details", type: "text", placeholder: "Provide details if 'Specific' selected" },
    { label: "Effective Date", type: "text", placeholder: "Enter effective date (YYYY-MM-DD)" },
    { label: "Specific Effective Date", type: "text", placeholder: "Provide specific date if applicable" },
    { label: "Term Duration", type: "text", placeholder: "e.g., 5 years" },
    { label: "Include Penalty Clause", type: "radio", options: ["Yes", "No"] },
    { label: "Penalty Amount", type: "text", placeholder: "Enter penalty amount if applicable" },
    { label: "Governing Law", type: "text", placeholder: "e.g., Maharashtra, India" },
    { label: "Jurisdiction", type: "text", placeholder: "Enter the jurisdiction" },
  ],
  "Memorandum of Understanding": [
    { label: "First Party Name", type: "text", placeholder: "Enter name of first party" },
    { label: "Second Party Name", type: "text", placeholder: "Enter name of second party" },
    { label: "Objective of MOU", type: "text", placeholder: "State the objective/purpose of MOU" },
    { label: "Jurisdiction", type: "text", placeholder: "e.g., Delhi, India" },
    { label: "Term of MOU", type: "text", placeholder: "e.g., 2 years" },
    { label: "Include Confidentiality Clause", type: "radio", options: ["Yes", "No"] },
  ],
  "Privacy Policy": [
    { label: "Company Name", type: "text", placeholder: "Enter your company name" },
    { label: "Website/App Name", type: "text", placeholder: "Enter website or app name" },
    { label: "Jurisdiction", type: "text", placeholder: "e.g., India" },
    { label: "Contact Email for Privacy Inquiries", type: "text", placeholder: "Enter support email" },
    { label: "Types of Data Collected", type: "text", placeholder: "e.g., name, email, usage data" },
  ],
  "Employment Agreement": [
    { label: "Company Name", type: "text", placeholder: "Enter company name" },
    { label: "Employee Name", type: "text", placeholder: "Enter employee full name" },
    { label: "Job Title", type: "text", placeholder: "Enter job position/title" },
    { label: "Annual Salary (INR)", type: "text", placeholder: "Enter salary in INR" },
    { label: "Notice Period (in days)", type: "text", placeholder: "e.g., 30" },
    { label: "Probation Period (in days)", type: "text", placeholder: "e.g., 90" },
    { label: "Jurisdiction", type: "text", placeholder: "e.g., Karnataka, India" },
    { label: "Include Non-Compete Clause", type: "radio", options: ["Yes", "No"] },
  ],
  "Investor Agreement": [
    { label: "Company Name", type: "text", placeholder: "Enter company name" },
    { label: "Investor Name", type: "text", placeholder: "Enter investor full name" },
    { label: "Investment Amount (INR)", type: "text", placeholder: "Enter amount in INR" },
    { label: "Equity Percentage (%)", type: "text", placeholder: "Enter equity percentage" },
    { label: "Number of Board Seats", type: "text", placeholder: "Enter number of seats" },
    { label: "Vesting Cliff", type: "text", placeholder: "e.g., 1 year" },
    { label: "Total Vesting Period", type: "text", placeholder: "e.g., 4 years" },
    { label: "Jurisdiction", type: "text", placeholder: "e.g., Bangalore, India" },
    { label: "Include Right of First Refusal", type: "radio", options: ["Yes", "No"] },
  ],
  "Vendor Contract": [
    { label: "Client Name", type: "text", placeholder: "Enter client name" },
    { label: "Vendor Name", type: "text", placeholder: "Enter vendor name" },
    { label: "Detailed Service Description", type: "text", placeholder: "Describe the services provided" },
    { label: "Payment Amount (INR)", type: "text", placeholder: "Enter payment amount" },
    { label: "Term of Contract", type: "text", placeholder: "e.g., 12 months" },
    { label: "Payment Schedule", type: "text", placeholder: "e.g., Net 30" },
    { label: "Jurisdiction", type: "text", placeholder: "e.g., Haryana, India" },
    { label: "Include Late Payment Penalty", type: "radio", options: ["Yes", "No"] },
  ],
};

export default function GeneratorPage() {
  const { data: session, status } = useSession();

  const [documentType, setDocumentType] = useState("Non-Disclosure Agreement");
  const [language, setLanguage] = useState("English");
  const [formData, setFormData] = useState<{ [key: string]: string }>({});
  const [generatedHtml, setGeneratedHtml] = useState("");
  const [isCreatingDoc, setIsCreatingDoc] = useState(false);
  const [docUrl, setDocUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const currentFields = useMemo(() => documentFields[documentType], [documentType]);

  const handleDocumentTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value;
    setDocumentType(newType);

    const newFormData = documentFields[newType].reduce((acc, field) => {
      acc[field.label] = "";
      return acc;
    }, {} as { [key: string]: string });

    setFormData(newFormData);
    setGeneratedHtml("");
    setDocUrl("");
    setError("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setGeneratedHtml("");
    setDocUrl("");

    try {
      const response = await fetch("/api/generate-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          document_type: documentType,
          language: language,
          ...formData,
          "Effective Date": new Date().toISOString().split("T")[0],
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.details || "An unknown API error occurred");
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
    setError("");
    setDocUrl("");

    try {
      const response = await fetch("/api/create-doc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `${documentType} - ${language}`,
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
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center">
        <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-600 drop-shadow-lg">
          Welcome to Nyaay AI
        </h1>
        <button
          onClick={() => signIn("google")}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-2xl font-semibold shadow-md transition-all duration-200"
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white relative overflow-hidden p-6">
      {/* floating blobs */}
      <div className="absolute -top-32 -left-32 w-72 h-72 bg-purple-700/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-700/20 rounded-full blur-3xl" />
      
      <main className="relative z-10 max-w-5xl mx-auto">
        {/* header */}
<div className="flex justify-between items-center mb-10">
  <div className="bg-gray-800/50 backdrop-blur-md px-5 py-3 rounded-2xl shadow-lg border border-gray-700">
    <p className="text-gray-400 text-sm">Signed in as</p>
    <p className="font-semibold">{session.user?.email}</p>
  </div>

  {/* right actions */}
  <div className="flex items-center gap-3">
    <Link
      href="/"
      className="px-5 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl font-semibold shadow-md border border-gray-700 transition-colors"
    >
      Return to Home
    </Link>

    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="px-5 py-2 bg-red-600 hover:bg-red-700 rounded-xl font-semibold shadow-md transition-colors"
    >
      Sign Out
    </button>
  </div>
</div>
        <h1 className="text-4xl sm:text-5xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-600 drop-shadow-md">
          Nyaay AI Document Generator
        </h1>
        
        {/* form card */}
        <div className="bg-gray-900/60 backdrop-blur-md border border-gray-800 rounded-2xl shadow-xl p-8">
          <form onSubmit={handleGenerateSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="document_type"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Document Type
                </label>
                <select
                  id="document_type"
                  name="document_type"
                  value={documentType}
                  onChange={handleDocumentTypeChange}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500"
                >
                  {Object.keys(documentFields).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="language"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Language
                </label>
                <select
                  id="language"
                  name="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Marathi">Marathi</option>
                  <option value="Telugu">Telugu</option>
                </select>
              </div>
            </div>

            {/* dynamic fields */}
            {currentFields.map((field) => {
              if (field.type === "radio") {
                return (
                  <div key={field.label}>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      {field.label}
                    </label>
                    <div className="flex gap-6">
                      {field.options?.map((option) => (
                        <label key={option} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={field.label}
                            value={option}
                            checked={formData[field.label] === option}
                            onChange={handleInputChange}
                            className="accent-indigo-500"
                            required
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <div key={field.label}>
                  <label
                    htmlFor={field.label}
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    {field.label}
                  </label>
                  <input
                    type="text"
                    id={field.label}
                    name={field.label}
                    value={formData[field.label] || ""}
                    onChange={handleInputChange}
                    placeholder={field.placeholder}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              );
            })}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-semibold shadow-md transition-all duration-200 disabled:bg-gray-600"
            >
              {isLoading ? "Generating..." : "Generate Document"}
            </button>
          </form>
        </div>

        {/* error */}
        {error && (
          <div className="mt-10 bg-red-900/40 border border-red-600 rounded-2xl p-6 text-center shadow-md">
            <h2 className="text-xl font-semibold mb-2 text-red-300">
              An Error Occurred
            </h2>
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {/* preview */}
        {generatedHtml && !error && (
          <div className="mt-10 bg-gray-900/60 backdrop-blur-md border border-gray-800 rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-semibold mb-6 text-green-400 text-center">
              Document Preview
            </h2>
            <div
              className="p-6 bg-white text-gray-800 rounded-xl shadow-inner space-y-4 max-h-[500px] overflow-auto"
              dangerouslySetInnerHTML={{ __html: generatedHtml }}
            />

            <div className="text-center mt-8">
              {!docUrl ? (
                <button
                  onClick={handleCreateDoc}
                  disabled={isCreatingDoc}
                  className="inline-block py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-md transition-all disabled:bg-gray-600"
                >
                  {isCreatingDoc ? "Creating Google Doc..." : "Create Google Doc"}
                </button>
              ) : (
                <a
                  href={docUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block py-3 px-6 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold shadow-md transition-all"
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

