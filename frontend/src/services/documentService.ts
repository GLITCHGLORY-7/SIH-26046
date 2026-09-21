import api from './api';
import type { DocumentUploadResponse } from '../types';

export const documentService = {
  async uploadDocument(file: File, category: string = 'PROTOCOL_DOSSIER'): Promise<DocumentUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);

    const res = await api.post<DocumentUploadResponse>('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return res.data;
  },

  getDocumentUrl(filename: string): string {
    return `/api/v1/documents/${filename}`;
  }
};