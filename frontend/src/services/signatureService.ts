import api from './api';
import type { SignatureManifest, VerifySignaturePayload } from '../types';

export const signatureService = {
  async verifySignature(payload: VerifySignaturePayload): Promise<SignatureManifest> {
    const res = await api.post<SignatureManifest>('/auth/verify-signature', payload);
    return res.data;
  }
};