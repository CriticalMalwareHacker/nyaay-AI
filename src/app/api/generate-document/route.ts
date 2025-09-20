import { NextResponse } from "next/server";
import { invokeLegalAgent } from "@/app/lib/legalAgent"; 

// FIX: Renamed and updated the function to create a real, viewable document link.
// This function now creates a "data URI" which embeds the HTML directly in the link.
async function createShareableDocument(title: string, content: string): Promise<string> {
    console.log("Creating a shareable document link...");
    // By encoding the HTML, we can create a link that opens the document in a new tab.
    const encodedHtml = encodeURIComponent(content);
    const dataUrl = `data:text/html;charset=utf-8,${encodedHtml}`;
    console.log(`Generated data URI for the document.`);
    return dataUrl;
}


export async function POST(request: Request) {
  try {
    const body = await request.json();

    const userPrompt = `
      Please draft a ${body.document_type}.
      Here are the details:
      ${Object.entries(body)
        .map(([key, value]) => `- ${key.replace(/_/g, " ")}: ${value}`)
        .join("\n")}
    `;

    // The agent returns a well-formatted HTML string.
    let htmlContent = await invokeLegalAgent(userPrompt);

    // Add a cleanup function as a safety net to remove markdown fences from the AI's output.
    const cleanupRegex = /^```html\n?([\s\S]*?)\n?```$/;
    const match = htmlContent.match(cleanupRegex);
    if (match) {
      console.log("Cleaned up markdown fences from AI output.");
      htmlContent = match[1];
    }

    // FIX: Call the updated function to get the new shareable link.
    const documentUrl = await createShareableDocument(body.document_type, htmlContent);

    // Return the correct JSON structure { documentUrl, htmlContent } that the frontend expects.
    return NextResponse.json({ documentUrl, htmlContent });

  } catch (error) {
    console.error("Error in generate-document API:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new NextResponse(
        JSON.stringify({ error: "Failed to generate document", details: errorMessage }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

