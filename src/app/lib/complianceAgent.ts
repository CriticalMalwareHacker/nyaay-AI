// /src/app/lib/complianceAgent.ts

import { GoogleGenerativeAI, GenerationConfig } from "@google/generative-ai";

// Ensure you have your GEMINI_API_KEY in a .env.local file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const systemPrompt = `
You are an expert legal compliance analysis agent for Indian law. Your task is to analyze a given legal document and provide a structured JSON report.

The user will provide document text. You must analyze it based on common legal standards, clarity, fairness, and completeness.

Your response MUST be a single, clean JSON object with no other text or markdown. The JSON object must have the following structure:
{
  "complianceScore": <An integer score from 0 to 100 representing overall compliance and quality. 100 is perfect.>,
  "summary": "<A one-sentence executive summary of the document's legal soundness.>",
  "issues": [
    {
      "severity": "<'High', 'Medium', or 'Low'>",
      "clause": "<The clause number or section, e.g., '5.1' or 'Termination'>",
      "description": "<A clear, concise description of the issue found.>"
    }
  ],
  "recommendations": [
    {
      "action": "<A specific, actionable recommendation to fix an issue.>",
      "priority": "<'High', 'Medium', or 'Low'>"
    }
  ]
}

If the document is perfect, the complianceScore should be 100 and the issues/recommendations arrays should be empty. Do not invent issues for a good document.
If the text is not a legal document or is nonsensical, return a complianceScore of 0 and a relevant summary.
`;

// The function now accepts simple text instead of a file
export async function analyzeDocumentCompliance(documentText: string): Promise<any> {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: systemPrompt,
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.1,
      } as GenerationConfig,
    });

    // The call is now much simpler, just passing the text.
    const result = await model.generateContent(documentText);

    const text = result.response.text();
    return JSON.parse(text);

  } catch (error) {
    console.error("Error in complianceAgent:", error);
    throw new Error("The AI agent failed to analyze the document.");
  }
}
