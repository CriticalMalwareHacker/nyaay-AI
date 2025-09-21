// /src/app/api/analyze-compliance/route.ts

import { NextResponse } from "next/server";
import { analyzeDocumentCompliance } from "@/app/lib/complianceAgent";
import mammoth from "mammoth"; // Import the new library

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    // Convert the file to a Buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    let documentText: string;

    // Check the file type and process accordingly
    if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      // If it's a DOCX file, use mammoth to extract text
      const { value } = await mammoth.extractRawText({ buffer: fileBuffer });
      documentText = value;
    } else if (file.type === "application/pdf" || file.type === "text/plain") {
      // For PDF and TXT, we can try to send it directly (or use a PDF parser for better results)
      // For now, we will handle it as simple text, which may not work well for complex PDFs.
      // A more robust solution for PDFs would use a library like 'pdf-parse'.
      // For simplicity, we are assuming text-based PDFs.
      documentText = fileBuffer.toString('utf-8');
    } else {
        return NextResponse.json({ error: "Unsupported file type." }, { status: 400 });
    }

    if (!documentText) {
        throw new Error("Could not extract text from the document.");
    }

    // Call the AI agent with the extracted plain text
    const analysisResult = await analyzeDocumentCompliance(documentText);

    return NextResponse.json(analysisResult);

  } catch (error: any) {
    console.error("Error in analyze-compliance API:", error);
    return NextResponse.json(
      { error: "Failed to analyze document", details: error.message },
      { status: 500 }
    );
  }
}
