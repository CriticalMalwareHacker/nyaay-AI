'use client';

import { useState, FormEvent, FC } from 'react';
import FileUpload from '../components/FileUpload';
import { FileCheck, AlertTriangle, CheckCircle, Loader2, ShieldCheck, ShieldAlert, BarChart, Upload } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

// --- Type Definitions ---
interface UploadedFile {
  file: File;
  id: string; // Add an id for key purposes
}

interface AnalysisIssue {
  severity: 'High' | 'Medium' | 'Low';
  clause: string;
  description: string;
}

interface AnalysisRecommendation {
  action: string;
  priority: 'High' | 'Medium' | 'Low';
}

interface AnalysisResult {
  complianceScore: number;
  summary: string;
  issues: AnalysisIssue[];
  recommendations: AnalysisRecommendation[];
}

// --- Analysis Display Component ---
const AnalysisReport: FC<{ result: AnalysisResult }> = ({ result }) => {
  const pieData = [
    { name: 'Compliant', value: result.complianceScore },
    { name: 'Risks', value: 100 - result.complianceScore },
  ];
  const COLORS = ['#10B981', '#EF4444']; // Green for compliant, Red for risks

  const getSeverityColor = (severity: string) => {
    if (severity === 'High') return 'bg-red-500';
    if (severity === 'Medium') return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="mt-12 p-8 rounded-2xl bg-gray-800/50 border border-gray-700 shadow-xl max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8 text-white">Compliance Analysis Report</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        <div className="md:col-span-1 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="md:col-span-2 text-center md:text-left">
          <h3 className="text-5xl font-bold text-white">{result.complianceScore}<span className="text-3xl text-gray-400">/100</span></h3>
          <p className="text-xl text-gray-300 mt-2">Overall Compliance Score</p>
          <p className="mt-4 text-gray-400 italic">"{result.summary}"</p>
        </div>
      </div>

      {result.issues.length > 0 && (
        <div className="mt-12">
          <h3 className="text-2xl font-semibold flex items-center gap-3 text-red-400 mb-4"><ShieldAlert />Identified Issues</h3>
          <div className="space-y-4">
            {result.issues.map((issue, index) => (
              <div key={index} className="p-4 bg-gray-900/70 rounded-lg border border-gray-700">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-2 py-1 text-xs font-bold rounded-full text-white ${getSeverityColor(issue.severity)}`}>{issue.severity}</span>
                  <span className="font-mono text-gray-400">Clause: {issue.clause}</span>
                </div>
                <p className="text-gray-300">{issue.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {result.recommendations.length > 0 && (
        <div className="mt-12">
          <h3 className="text-2xl font-semibold flex items-center gap-3 text-green-400 mb-4"><ShieldCheck />Actionable Recommendations</h3>
          <ul className="space-y-3 list-disc list-inside text-gray-300">
            {result.recommendations.map((rec, index) => (
              <li key={index}><span className="font-bold mr-2">[{rec.priority} Priority]</span>{rec.action}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};


// --- Main Page Component ---
export default function CompliancePage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalysis = async (e: FormEvent) => {
    e.preventDefault();
    if (files.length === 0) {
      setError("Please upload a document to analyze.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    const formData = new FormData();
    formData.append('file', files[0].file); // Analyze the first file

    try {
      const response = await fetch('/api/analyze-compliance', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.details || 'The analysis failed.');
      }
      
      setAnalysisResult(result);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-900/50 rounded-full mb-4 ring-1 ring-blue-500">
            <FileCheck className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Agentic AI Compliance Analysis
          </h1>
          <p className="text-gray-400">
            Upload a legal document (PDF, DOCX) to receive an instant compliance report.
          </p>
        </div>

        <form onSubmit={handleAnalysis} className="bg-gray-800/50 rounded-xl shadow-lg p-8 space-y-6 border border-gray-700">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-200 mb-4">
              <Upload className="w-5 h-5" />
              Upload Document for Analysis
            </h2>
            <FileUpload onFilesChange={setFiles} maxFiles={1} maxSize={10} />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isAnalyzing || files.length === 0}
              className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" />
                  Analyzing Document...
                </>
              ) : (
                <>
                  <BarChart className="w-5 h-5" />
                  Analyze Compliance
                </>
              )}
            </button>
          </div>
        </form>

        {error && (
            <div className="mt-8 bg-red-900/40 border border-red-600 rounded-2xl p-6 text-center max-w-4xl mx-auto">
                <h3 className="font-bold text-xl text-red-300">An Error Occurred</h3>
                <p className="text-red-400 mt-2">{error}</p>
            </div>
        )}

        {analysisResult && <AnalysisReport result={analysisResult} />}

      </div>
    </div>
  );
}
