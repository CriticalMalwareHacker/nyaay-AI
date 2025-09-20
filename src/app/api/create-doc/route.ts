import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { google } from "googleapis";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !(session as any).accessToken) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    const { title, htmlContent } = await request.json();

    if (!title || !htmlContent) {
      return new NextResponse(
        JSON.stringify({ error: "Missing title or htmlContent" }),
        { status: 400 }
      );
    }

    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: (session as any).accessToken });

    const docs = google.docs({ version: "v1", auth });

    // FIX: A more robust, two-step process is used to prevent blank documents.
    // STEP 1: Create a new, blank Google Doc with only a title.
    const createResponse = await docs.documents.create({
      requestBody: {
        title: title,
      },
    });

    const documentId = createResponse.data.documentId;
    if (!documentId) {
      throw new Error("Failed to get document ID after creation.");
    }

    // This method preserves paragraph breaks for better formatting.
    const formattedText = htmlContent
      .replace(/<\/p>|<\/h[1-6]>|<br\/?>/gi, "\n") // Replace block tags with newlines
      .replace(/<[^>]*>/g, "") // Strip remaining HTML
      .replace(/\n\s*\n/g, "\n\n") // Consolidate multiple newlines
      .trim();

    // STEP 2: Insert the formatted text into the newly created document.
    await docs.documents.batchUpdate({
      documentId: documentId,
      requestBody: {
        requests: [
          {
            insertText: {
              text: formattedText,
              // Insert at the beginning of the document body.
              location: {
                index: 1,
              },
            },
          },
        ],
      },
    });

    const documentUrl = `https://docs.google.com/document/d/${documentId}/edit`;

    return NextResponse.json({ documentUrl });
  } catch (error) {
    console.error("Error creating Google Doc:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to create Google Doc" }),
      { status: 500 }
    );
  }
}

