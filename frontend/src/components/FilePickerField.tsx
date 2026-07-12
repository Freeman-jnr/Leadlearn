/**
 * FilePickerField — a styled drag-and-drop / click-to-upload field.
 *
 * Props:
 *  - label        : Field label text
 *  - bucket       : Supabase bucket to upload to
 *  - accept       : MIME types string (e.g. "application/pdf,image/*")
 *  - value        : Current URL (if already uploaded or provided externally)
 *  - onChange     : Called with the final public URL after successful upload
 *  - uploading    : External uploading flag so the parent can disable submit
 *  - optional     : If true, shows "(optional)" next to label
 *  - hint         : Small helper text shown below the field
 */
import { useRef, useState, useCallback } from 'react';
import { Upload, FileCheck2, AlertCircle, Loader2, X } from 'lucide-react';
import { useFileUpload, type UploadBucket } from '@/hooks/useFileUpload';

interface FilePickerFieldProps {
  label: string;
  bucket: UploadBucket;
  accept?: string;
  value?: string;
  onChange: (url: string) => void;
  onUploadStateChange?: (uploading: boolean) => void;
  optional?: boolean;
  hint?: string;
}

export function FilePickerField({
  label,
  bucket,
  accept = '*',
  value,
  onChange,
  onUploadStateChange,
  optional = false,
  hint,
}: FilePickerFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const { uploading, progress, error, uploadFile } = useFileUpload();

  const handleFile = useCallback(async (file: File) => {
    setFileName(file.name);
    onUploadStateChange?.(true);
    const url = await uploadFile(file, bucket);
    onUploadStateChange?.(false);
    if (url) onChange(url);
  }, [bucket, uploadFile, onChange, onUploadStateChange]);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const clear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFileName(null);
    onChange('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div>
      <label className="block text-sm font-semibold mb-1.5">
        {label}
        {optional && <span className="ml-1 text-xs font-normal text-muted-foreground">(optional)</span>}
      </label>

      {/* Drop Zone */}
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`relative flex flex-col items-center justify-center gap-2 px-4 py-5 rounded-xl border-2 border-dashed cursor-pointer transition-all select-none
          ${dragOver ? 'border-primary bg-primary/5 scale-[1.01]' : 'border-border hover:border-primary/50 hover:bg-secondary/40'}
          ${uploading ? 'cursor-not-allowed opacity-80' : ''}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={onInputChange}
        />

        {uploading ? (
          <>
            <Loader2 className="h-6 w-6 text-primary animate-spin" />
            <div className="w-full max-w-xs">
              <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${progress}%`, background: 'var(--gradient-brand)' }}
                />
              </div>
              <p className="text-xs text-center text-muted-foreground mt-1">Uploading… {progress}%</p>
            </div>
          </>
        ) : (value || fileName) ? (
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <FileCheck2 className="h-5 w-5 shrink-0" />
            <span className="truncate max-w-[200px]">{fileName ?? 'File uploaded ✓'}</span>
            <button
              type="button"
              onClick={clear}
              className="ml-1 h-5 w-5 rounded-full grid place-items-center hover:bg-red-100 text-red-500 shrink-0"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <>
            <Upload className="h-6 w-6 text-muted-foreground/60" />
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">Click to choose file</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">or drag and drop here</p>
            </div>
          </>
        )}
      </div>

      {/* Error */}
      {error && (
        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" /> {error}
        </p>
      )}

      {/* Hint */}
      {hint && !error && (
        <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}
