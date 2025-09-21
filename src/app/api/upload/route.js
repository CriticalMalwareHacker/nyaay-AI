import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request) {
  try {
    const formData = await request.formData();
    
    const companyName = formData.get('companyName');
    const complianceType = formData.get('complianceType');
    const effectiveDate = formData.get('effectiveDate');
    const description = formData.get('description');
    
    if (!companyName || !complianceType || !effectiveDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const files = formData.getAll('files');
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files uploaded' },
        { status: 400 }
      );
    }

    // Create upload directory
    const uploadDir = path.join(process.cwd(), 'uploads', companyName.replace(/\s+/g, '_'));
    await mkdir(uploadDir, { recursive: true });

    const uploadedFiles = [];

    for (const file of files) {
      if (file instanceof File) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Validate file type
        const allowedTypes = [
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'text/plain'
        ];
        
        if (!allowedTypes.includes(file.type)) {
          return NextResponse.json(
            { error: `Invalid file type: ${file.name}` },
            { status: 400 }
          );
        }

        // Validate file size (10MB max)
        if (file.size > 10 * 1024 * 1024) {
          return NextResponse.json(
            { error: `File too large: ${file.name}` },
            { status: 400 }
          );
        }

        // Generate unique filename
        const timestamp = Date.now();
        const originalName = file.name;
        const extension = path.extname(originalName);
        const baseName = path.basename(originalName, extension);
        const uniqueFilename = `${baseName}_${timestamp}${extension}`;
        const filePath = path.join(uploadDir, uniqueFilename);

        // Save file
        await writeFile(filePath, buffer);

        uploadedFiles.push({
          originalName,
          savedName: uniqueFilename,
          size: file.size,
          type: file.type,
          path: filePath
        });
      }
    }

    const complianceRecord = {
      companyName,
      complianceType,
      effectiveDate,
      description,
      uploadDate: new Date().toISOString(),
      files: uploadedFiles
    };

    console.log('Compliance upload successful:', complianceRecord);

    return NextResponse.json({
      success: true,
      message: 'Files uploaded successfully',
      data: {
        companyName,
        complianceType,
        effectiveDate,
        fileCount: uploadedFiles.length,
        uploadedFiles: uploadedFiles.map(f => ({
          name: f.originalName,
          size: f.size,
          type: f.type
        }))
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}