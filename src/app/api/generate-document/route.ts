import { NextResponse } from "next/server";
import { invokeLegalAgent } from "@/app/lib/legalAgent";
import { LRUCache } from 'lru-cache';

const cache = new LRUCache<string, string>({ max: 50, ttl: 1000 * 60 * 5 });

// **THE FINAL FIX: A more aggressive cleanup function.**
function cleanAiOutput(html: string): string {
  // This regex finds markdown fences (with or without 'html') at the start or end of the string.
  return html.replace(/^`{3,}(html)?\s*|\s*`{3,}$/g, '').trim();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const cacheKey = JSON.stringify(body);

    if (cache.has(cacheKey)) {
      return NextResponse.json({ htmlContent: cache.get(cacheKey) });
    }

    const { document_type, language, ...details } = body;

    const detailsString = Object.entries(details).map(([key, value]) => `- ${key}: ${value}`).join("\n");

    const userPrompt = `
      You are an expert legal document generator for Indian law. Your task is to draft a complete, professional, and fully-written "${document_type}" in the ${language} language.

      You MUST use the following specific details to write the document:
      ${detailsString}

      CRITICAL INSTRUCTIONS:
      1.  The entire document, including all headings and clauses, MUST be in ${language}.
      2.  Generate the full, complete document.
      3.  Write out the full text for all standard legal clauses, translated accurately into ${language}.
      4.  Your final output **MUST** be a single, clean, valid HTML string with proper legal formatting (bolding, alignment).
      5.  **DO NOT** use placeholders. This is a critical failure.
      6.  **DO NOT** include any CSS or markdown. This is a critical failure.
    `;

    const rawHtmlContent = await invokeLegalAgent(userPrompt);
    const cleanedHtml = cleanAiOutput(rawHtmlContent);
    
    cache.set(cacheKey, cleanedHtml);
    return NextResponse.json({ htmlContent: cleanedHtml });

  } catch (error) {
    console.error("Error in generate-document API:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new NextResponse(
        JSON.stringify({ error: "Failed to generate document", details: errorMessage }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
