/**
 * useFileUpload — uploads a file to Supabase Storage and returns the public URL.
 * Falls back gracefully if VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are not set
 * (shows a warning but doesn't crash the app).
 */
import { useState, useCallback } from 'react';

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string) || '';
const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '';

export type UploadBucket = 'materials' | 'assignments' | 'avatars' | 'thumbnails' | 'videos' | 'certificates';

export interface UseFileUploadReturn {
  uploading: boolean;
  progress: number; // 0-100
  error: string | null;
  uploadFile: (file: File, bucket: UploadBucket) => Promise<string | null>;
}

export function useFileUpload(): UseFileUploadReturn {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = useCallback(async (file: File, bucket: UploadBucket): Promise<string | null> => {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.warn('[useFileUpload] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY not set. File upload unavailable.');
      setError('Storage not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
      return null;
    }

    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      const ext = file.name.split('.').pop() ?? 'bin';
      const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const path = `${bucket}/${uniqueName}`;

      // Simulate progress since fetch doesn't expose upload progress
      const progressInterval = setInterval(() => {
        setProgress(p => Math.min(p + 15, 85));
      }, 200);

      const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${bucket}/${uniqueName}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': file.type || 'application/octet-stream',
          'x-upsert': 'true',
        },
        body: file,
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.error ?? `Upload failed (${res.status})`);
      }

      const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${uniqueName}`;
      return publicUrl;
    } catch (err: any) {
      setError(err.message ?? 'Upload failed');
      return null;
    } finally {
      setUploading(false);
    }
  }, []);

  return { uploading, progress, error, uploadFile };
}
