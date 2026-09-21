import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle, Loader2, X } from 'lucide-react';
import { documentService } from '../services/documentService';
import type { DocumentUploadResponse } from '../types';

interface DocumentUploadProps {
  onUploadSuccess: (response: DocumentUploadResponse) => void;
  category?: string;
  label?: string;
  description?: string;
  accept?: string;
  maxSizeMB?: number;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  onUploadSuccess,
  category = 'PROTOCOL_DOSSIER',
  label = 'Upload Official Clinical Document (PDF / DOCX)',
  description = 'Supports signed protocols, ICFs, or IEC approval letters up to 25 MB',
  accept = '.pdf,.docx,.doc',
  maxSizeMB = 25
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedDoc, setUploadedDoc] = useState<DocumentUploadResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File exceeds the ${maxSizeMB} MB maximum limit.`);
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      const res = await documentService.uploadDocument(file, category);
      setUploadedDoc(res);
      onUploadSuccess(res);
    } catch (err: any) {
      console.error('File upload failed', err);
      setError(err?.response?.data?.detail || 'Failed to upload document.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClear = () => {
    setUploadedDoc(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-slate-700">{label}</label>

      {uploadedDoc ? (
        <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs">
          <div className="flex items-center space-x-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-emerald-900">{uploadedDoc.original_filename}</p>
              <p className="text-[10px] text-emerald-700">
                {(uploadedDoc.file_size / 1024).toFixed(1)} KB • Stored & attached
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-md"
            title="Remove document"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition ${
            isUploading
              ? 'bg-slate-50 border-slate-300 pointer-events-none'
              : 'border-slate-300 hover:border-ayush-600 hover:bg-ayush-50/30'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
          />
          {isUploading ? (
            <div className="flex flex-col items-center justify-center space-y-1.5 py-1">
              <Loader2 className="w-5 h-5 text-ayush-600 animate-spin" />
              <p className="text-xs text-slate-600 font-medium">Uploading & verifying checksum...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-1">
              <UploadCloud className="w-6 h-6 text-ayush-600" />
              <p className="text-xs font-medium text-slate-700">
                Click or drag & drop dossier here
              </p>
              <p className="text-[11px] text-slate-400">{description}</p>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="p-2 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center space-x-1.5">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};