import React, { useState } from 'react';
import { ShieldCheck, Lock, AlertTriangle, CheckCircle2, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { signatureService } from '../../services/signatureService';
import type { SignatureManifest } from '../../types';

interface ElectronicSignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSigned: (manifest: SignatureManifest) => void;
  actionType: string;
  actionTitle: string;
  entityId?: string;
  meaning?: string;
}

export const ElectronicSignatureModal: React.FC<ElectronicSignatureModalProps> = ({
  isOpen,
  onClose,
  onSigned,
  actionType,
  actionTitle,
  entityId,
  meaning = 'I hereby electronically certify and sign this clinical document/decision under 21 CFR Part 11 and Indian GCP guidelines.'
}) => {
  const { user, role } = useAuth();
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('Please enter your account password to confirm electronic signature.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      const manifest = await signatureService.verifySignature({
        password,
        action_type: actionType,
        meaning,
        entity_id: entityId
      });
      setPassword('');
      onSigned(manifest);
    } catch (err: any) {
      console.error('Signature verification failed', err);
      setError(
        err?.response?.data?.detail ||
        'Password verification failed. Electronic signature rejected.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-ayush-950 via-ayush-900 to-ayush-800 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">Electronic Signature Ceremony</h3>
              <p className="text-[10px] text-ayush-200 font-mono">21 CFR Part 11 & GCP Subpart C</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-ayush-200 hover:text-white p-1 rounded-md transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSign} className="p-5 space-y-4">
          {/* Signer Manifest Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs space-y-1.5 font-mono">
            <div className="flex justify-between">
              <span className="text-slate-500">Signatory:</span>
              <span className="font-semibold text-slate-800 font-sans">{user?.full_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Official Role:</span>
              <span className="font-bold text-ayush-800">{role}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Action:</span>
              <span className="text-slate-700 font-semibold">{actionTitle}</span>
            </div>
            {entityId && (
              <div className="flex justify-between">
                <span className="text-slate-500">Entity ID:</span>
                <span className="text-slate-700">{entityId}</span>
              </div>
            )}
          </div>

          {/* Legal Manifestation Statement */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-lg p-3 text-xs text-amber-900 leading-relaxed">
            <p className="font-semibold text-[11px] uppercase tracking-wider text-amber-800 mb-1 flex items-center space-x-1">
              <Lock className="w-3 h-3 text-amber-700 inline" />
              <span>Legal Certification Statement</span>
            </p>
            <p className="text-[11px] text-slate-700 italic">"{meaning}"</p>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Password re-authentication */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-800">
                Re-enter Account Password to Certify:
              </label>
              <button
                type="button"
                onClick={() => setPassword('Password@AIIA2026!')}
                className="text-[11px] font-bold text-ayush-900 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 transition-colors cursor-pointer"
              >
                Auto-fill test password
              </button>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password@AIIA2026!"
              autoFocus
              className="w-full p-2.5 border-2 border-slate-300 rounded-lg text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-ayush-600 focus:border-ayush-600 bg-white"
            />
            <div className="flex items-center justify-between mt-1 text-[11px]">
              <span className="text-slate-600 font-medium">
                Seeded account password: <strong className="font-mono text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-300">Password@AIIA2026!</strong>
              </span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              Verification binds your cryptographic SHA-256 token and timestamp permanently into the audit trail.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !password}
              className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-ayush-800 hover:from-emerald-500 hover:to-ayush-700 rounded-lg shadow-sm transition flex items-center space-x-1.5 disabled:opacity-50"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Verifying...' : 'Authorize & Sign Document'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};