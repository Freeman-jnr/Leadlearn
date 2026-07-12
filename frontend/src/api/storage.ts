/**
 * Supabase Storage utility for profile pictures, materials, PDFs, certificates.
 * Cloudinary for lesson images, AWS S3 for lesson videos.
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export async function uploadToSupabase(
  file: File,
  bucket: 'avatars' | 'materials' | 'assignments' | 'thumbnails' | 'certificates'
): Promise<string> {
  const ext = file.name.split('.').pop();
  const filename = `${bucket}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${bucket}/${filename}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': file.type,
      'x-upsert': 'true',
    },
    body: file,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Supabase upload failed');
  }

  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${filename}`;
}

export async function uploadVideoToS3(file: File): Promise<string> {
  // Get a pre-signed URL from the backend (to keep AWS credentials server-side)
  const { apiClient } = await import('./axios');
  const { data } = await apiClient.post('/uploads/s3-presign', {
    filename: file.name,
    contentType: file.type,
    bucket: 'videos',
  });

  await fetch(data.uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  });

  return data.publicUrl;
}

export async function uploadImageToCloudinary(file: File): Promise<string> {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string;

  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', uploadPreset);
  fd.append('folder', 'leadlearnhub/lessons');

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: fd,
  });

  if (!res.ok) throw new Error('Cloudinary upload failed');
  const data = await res.json();
  return data.secure_url;
}
