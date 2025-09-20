import { NextResponse } from "next/server";
import { invokeLegalAgent } from "@/app/lib/legalAgent";
import { LRUCache } from 'lru-cache';

const cache = new LRUCache<string, string>({ max: 50, ttl: 1000 * 60 * 5 });

// **THE FIX: A more robust function to strip all variations of markdown fences.**
function cleanAiOutput(html: string): string {
  // This regex is designed to find ``````htmlhtml, ```
  return html.replace(/^`{3,}(html)?\s*|\s*`{3,}$/g, '').trim();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const cacheKey = JSON.stringify(body);

    if (cache.has(cacheKey)) {
      console.log("Serving response from cache.");
      return NextResponse.json({ htmlContent: cache.get(cacheKey) });
    }

    console.log("Cache miss. Calling AI agent...");
    const { document_type, ...details } = body;

    const detailsString = Object.entries(details).map(([key, value]) => `- ${key}: ${value}`).join("\n");
    const userPrompt = `Draft a complete and professional "${document_type}" for Indian jurisdiction. Use the following details:\n${detailsString}\n\nCRITICAL INSTRUCTIONS: Generate a full document with all standard legal clauses written out completely. Your final output MUST be a single, clean, valid HTML string with proper legal formatting (bolding, alignment). DO NOT use placeholders or CSS.`;

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
