import { NextResponse } from "next/server";
import { google } from 'googleapis';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.accessToken) {
        return new NextResponse(JSON.stringify({ error: "Not authenticated or access token missing" }), { status: 401 });
    }

    try {
        const body = await request.json();
        const { title, htmlContent } = body;

        const auth = new google.auth.OAuth2();
        auth.setCredentials({ access_token: session.accessToken });
        
        // **THE DEFINITIVE FIX: Use the Google Drive API to upload and convert the HTML.**
        const drive = google.drive({ version: 'v3', auth });

        const fileMetadata = {
            name: title,
            mimeType: 'application/vnd.google-apps.document', // This tells Drive to create a Google Doc
        };

        const media = {
            mimeType: 'text/html', // We are telling Drive the source format is HTML
            body: htmlContent,
        };

        console.log("Uploading to Google Drive and converting to Google Doc to preserve formatting...");
        const response = await drive.files.create({
            requestBody: fileMetadata,
            media: media,
            fields: 'webViewLink, id',
        });
        
        const documentUrl = response.data.webViewLink;

        if (!documentUrl) {
            throw new Error("Failed to get Google Doc URL after creation.");
        }

        console.log(`Successfully created Google Doc with formatting: ${documentUrl}`);
        return NextResponse.json({ documentUrl });

    } catch (error: any) {
        console.error("Error creating Google Doc:", error.response?.data?.error || error.message);
        return new NextResponse(JSON.stringify({ error: "Failed to create Google Doc", details: error.response?.data?.error?.message || error.message }), { status: 500 });
    }
}
