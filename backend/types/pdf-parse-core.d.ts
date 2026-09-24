declare module 'pdf-parse/lib/pdf-parse.js' {
  type PdfData = { text: string };
  function pdfParse(buffer: Buffer): Promise<PdfData>;
  export default pdfParse;
}