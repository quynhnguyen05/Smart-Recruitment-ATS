const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

export async function extractCvText(fileBuffer: Buffer, mimeType: string): Promise<string | null> {
  try {
    if (mimeType === 'application/pdf') {
      const data = await pdfParse(fileBuffer);
      const text = data.text.trim();
      return text.length > 0 ? text : null;
    }

    if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      const text = result.value.trim();
      return text.length > 0 ? text : null;
    }

    return null;
  } catch (err) {
    console.error('[extractCvText] Failed to extract text:', err);
    return null;
  }
}