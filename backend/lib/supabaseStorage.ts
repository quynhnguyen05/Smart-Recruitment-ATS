import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

const BUCKET_NAME = 'cv-uploads';
const ALLOWED_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export class FileValidationError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export async function uploadCV(file: File, applicationId: string): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new FileValidationError('Chỉ chấp nhận file PDF hoặc DOCX');
  }

  if (file.size > MAX_SIZE_BYTES) {
    throw new FileValidationError('File vượt quá giới hạn 5MB');
  }

  const ext = (file.name.includes('.') ? file.name.split('.').pop() : 'bin') || 'bin';
  const path = `${applicationId}.${ext.toLowerCase()}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(path, buffer, {
      contentType: file.type,
      upsert: true,
    });

  if (error) {
    throw new Error(`Lỗi upload CV: ${error.message}`);
  }

  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);
  return data.publicUrl;
}