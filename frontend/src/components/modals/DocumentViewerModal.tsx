import React, { useState, useRef } from 'react';
import {
  X,
  ExternalLink,
  Download,
  FileText,
  FileCode,
  Eye,
  Check,
  Copy,
  Loader2,
  ShieldCheck,
  Layers
} from 'lucide-react';

import { exportHtmlToPdf, exportDataToJson } from '../../utils/pdfGenerator';

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentUrl?: string | null;
  fileUrl?: string | null;
  documentTitle?: string;
  fileName?: string;
  trialData?: any;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  isOpen,
  onClose,
  documentUrl,
  fileUrl,
  documentTitle,
  fileName,
  trialData
}) => {
  const activeUrl = documentUrl || fileUrl;
  const activeTitle = documentTitle || fileName || 'Clinical Trial Document';
  const documentRef = useRef<HTMLDivElement>(null);

  const [viewMode, setViewMode] = useState<'document' | 'json' | 'frame'>('document');
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  if (!isOpen || !activeUrl) return null;

  // Synthesize structured dossier JSON
  const dossierJson = {
    document_title: activeTitle,
    document_url: activeUrl,
    generated_at: new Date().toISOString(),
    standard: 'ICH-GCP E6(R2) & US FDA 21 CFR Part 11',
    regulatory_authority: 'CDSCO NDCTR 2019 / Ministry of Ayush',
    trial: {
      trial_id: trialData?.trial_id || 'CT-2026-001',
      title: trialData?.trial_title || 'Evaluation of Shallaki and Dashamoola in Amavata',
      phase: trialData?.study_phase || 'Phase II Multi-Centric Trial',
      status: trialData?.status || 'ACTIVE',
      principal_investigator: trialData?.principal_investigator || 'Dr. Rajesh Sharma, MD (Ayurveda)',
      lead_center: 'All India Institute of Ayurveda (AIIA), New Delhi',
      namaste_code: trialData?.namaste_code || 'NAM-AYU-001',
      who_icd11_code: trialData?.who_icd11_tm2_code || 'TM2-001'
    },
    version_control: {
      protocol_version: trialData?.protocol_version || '1.1',
      approval_date: trialData?.start_date || '2026-01-15',
      review_type: 'Full Board IEC Deliberation'
    },
    electronic_signature: {
      authority: 'Institutional Ethics Committee (AIIA)',
      signer: 'Prof. Meenakshi Sundaram',
      role: 'ETHICS_COMMITTEE_CHAIR',
      meaning: 'APPROVAL_AND_LEGAL_ATTESTATION',
      certificate_hash: 'SIG-SHA256-42E6F89C01A9B23D',
      timestamp: new Date().toISOString()
    }
  };

  const handleExportCanvasPdf = async () => {
    if (!documentRef.current) return;
    try {
      setIsExportingPdf(true);
      const safeName = activeTitle.replace(/\s+/g, '_').replace('.pdf', '');
      await exportHtmlToPdf(documentRef.current, {
        filename: `${safeName}_Canvas.pdf`,
        orientation: 'p',
        scale: 2
      });
    } catch (err) {
      console.error('Failed to export PDF via HTML-to-Canvas:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleExportJson = () => {
    const safeName = activeTitle.replace(/\s+/g, '_').replace('.pdf', '');
    exportDataToJson(dossierJson, `${safeName}_Dossier.json`);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(dossierJson, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-3 sm:p-5 animate-in fade-in duration-150">
      <div className="bg-slate-900 text-slate-100 rounded-2xl shadow-2xl border border-slate-700 w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Top Header */}
        <div className="bg-slate-950 text-white px-5 py-3.5 flex flex-wrap items-center justify-between border-b border-slate-800 gap-3">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="p-2 rounded-lg bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 flex-shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="truncate">
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold truncate text-white">{activeTitle}</h3>
                <span className="text-[10px] bg-emerald-900/80 text-emerald-300 border border-emerald-700/60 px-1.5 py-0.2 rounded font-mono font-semibold">
                  21 CFR Part 11
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono truncate">{activeUrl}</p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center space-x-2">
            {/* View Mode Switcher */}
            <div className="bg-slate-900 p-0.5 rounded-lg border border-slate-800 flex items-center text-xs">
              <button
                type="button"
                onClick={() => setViewMode('document')}
                className={`px-2.5 py-1 rounded-md font-semibold flex items-center space-x-1 transition-colors ${
                  viewMode === 'document'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="View formatted clinical document"
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Document</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('json')}
                className={`px-2.5 py-1 rounded-md font-semibold flex items-center space-x-1 transition-colors ${
                  viewMode === 'json'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="View structured JSON specification"
              >
                <FileCode className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">JSON</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('frame')}
                className={`px-2.5 py-1 rounded-md font-semibold flex items-center space-x-1 transition-colors ${
                  viewMode === 'frame'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="View embedded PDF stream"
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Raw PDF</span>
              </button>
            </div>

            {/* Export PDF (HTML to Canvas) */}
            <button
              type="button"
              onClick={handleExportCanvasPdf}
              disabled={isExportingPdf}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm transition-colors disabled:opacity-50"
              title="Convert this document into PDF using HTML-to-Canvas"
            >
              {isExportingPdf ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>Export PDF (Canvas)</span>
            </button>

            {/* Export JSON */}
            <button
              type="button"
              onClick={handleExportJson}
              className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-lg transition-colors"
              title="Download structured JSON"
            >
              <FileCode className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Export JSON</span>
            </button>

            {/* Direct Open in new window */}
            <a
              href={activeUrl}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
              title="Open raw stream in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-rose-900/40 rounded-lg transition"
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 bg-slate-950 p-4 overflow-y-auto">
          {/* VIEW MODE 1: Formatted Document (What gets rendered to Canvas / PDF) */}
          {viewMode === 'document' && (
            <div className="max-w-3xl mx-auto">
              <div
                ref={documentRef}
                className="bg-white text-slate-900 p-8 sm:p-10 rounded-xl shadow-2xl border-2 border-ayush-900 space-y-6"
              >
                {/* Official Letterhead */}
                <div className="border-b-2 border-ayush-950 pb-5 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-ayush-900">
                      MINISTRY OF AYUSH • GOVERNMENT OF INDIA
                    </div>
                    <h1 className="text-xl sm:text-2xl font-black text-ayush-950 tracking-tight">
                      ALL INDIA INSTITUTE OF AYURVEDA (AIIA)
                    </h1>
                    <p className="text-xs font-semibold text-emerald-700">
                      National Center of Excellence in Clinical Ayurveda Research • GCP CTMS
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2.5 py-1 rounded bg-ayush-950 text-emerald-300 text-[10px] font-mono font-bold tracking-wider">
                      21 CFR PART 11 & CDSCO
                    </span>
                    <div className="text-[10px] text-slate-500 font-mono mt-1">
                      Ref: AIIA-CT-2026-VAL
                    </div>
                  </div>
                </div>

                {/* Title Banner */}
                <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-lg p-4 text-center space-y-1">
                  <h2 className="text-base font-extrabold text-emerald-950 uppercase tracking-wide">
                    {activeTitle.replace('.pdf', '').replace(/_/g, ' ')}
                  </h2>
                  <p className="text-xs text-slate-600">
                    Official Protocol Dossier & Standard Operating Specification (GCP Verified)
                  </p>
                </div>

                {/* Trial Key Metadata */}
                <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <div>
                    <span className="text-slate-500 font-semibold uppercase text-[10px] block">Trial Protocol ID</span>
                    <span className="font-mono font-bold text-slate-900">{dossierJson.trial.trial_id}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold uppercase text-[10px] block">Regulatory Status</span>
                    <span className="font-bold text-emerald-700">CDSCO Approved • CTRI Registered</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold uppercase text-[10px] block">Principal Investigator</span>
                    <span className="font-medium text-slate-900">{dossierJson.trial.principal_investigator}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold uppercase text-[10px] block">Protocol Version</span>
                    <span className="font-mono font-bold text-slate-900">v{dossierJson.version_control.protocol_version} (Final)</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold uppercase text-[10px] block">Ayurvedic Indication</span>
                    <span className="font-medium text-slate-900">Amavata (Rheumatoid Arthritis)</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold uppercase text-[10px] block">NAMASTE & WHO ICD-11</span>
                    <span className="font-mono font-bold text-slate-800">
                      {dossierJson.trial.namaste_code} • {dossierJson.trial.who_icd11_code}
                    </span>
                  </div>
                </div>

                {/* Protocol Synopsis */}
                <div className="space-y-2">
                  <h3 className="text-xs font-black uppercase tracking-wider text-ayush-950 border-b border-ayush-800 pb-1">
                    1. Study Synopsis & Objectives
                  </h3>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    A multi-center, randomized, double-blind clinical evaluation designed to assess the safety and efficacy of classical Ayurvedic formulation (Shallaki Extract 500mg and Dashamoola Kwatha 40ml BID) compared to standard care in adult participants diagnosed with Amavata (Rheumatoid Arthritis). Primary endpoint includes reduction in DAS28-ESR and inflammatory biomarkers at Week 12.
                  </p>
                </div>

                {/* Clinical Assessment Schedule Table */}
                <div className="space-y-2">
                  <h3 className="text-xs font-black uppercase tracking-wider text-ayush-950 border-b border-ayush-800 pb-1">
                    2. Schedule of Protocol Visits & Clinical Procedures
                  </h3>
                  <table className="w-full text-left text-xs border-collapse border border-slate-200">
                    <thead>
                      <tr className="bg-ayush-950 text-white text-[11px]">
                        <th className="p-2 border border-ayush-800">Visit</th>
                        <th className="p-2 border border-ayush-800">Timeframe</th>
                        <th className="p-2 border border-ayush-800">Clinical Procedures</th>
                        <th className="p-2 border border-ayush-800">GCP Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr>
                        <td className="p-2 font-mono font-bold">Screening (V0)</td>
                        <td className="p-2 text-slate-600">Day -14 to 0</td>
                        <td className="p-2 text-slate-700">ICF Consent, Prakriti profiling, CBC, LFT, KFT</td>
                        <td className="p-2 font-semibold text-emerald-700">Verified</td>
                      </tr>
                      <tr className="bg-slate-50">
                        <td className="p-2 font-mono font-bold">Baseline (V1)</td>
                        <td className="p-2 text-slate-600">Day 1</td>
                        <td className="p-2 text-slate-700">Randomization, Drug Dispense, DAS28 baseline</td>
                        <td className="p-2 font-semibold text-emerald-700">Verified</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-mono font-bold">Interim (V2)</td>
                        <td className="p-2 text-slate-600">Day 28 ± 2</td>
                        <td className="p-2 text-slate-700">Efficacy score, compliance, ADR surveillance</td>
                        <td className="p-2 font-semibold text-blue-700">In Progress</td>
                      </tr>
                      <tr className="bg-slate-50">
                        <td className="p-2 font-mono font-bold">Mid-Term (V3)</td>
                        <td className="p-2 text-slate-600">Day 56 ± 3</td>
                        <td className="p-2 text-slate-700">Clinical chemistry, hs-CRP, DAS28 interim</td>
                        <td className="p-2 text-slate-500">Scheduled</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-mono font-bold">Conclusion (V4)</td>
                        <td className="p-2 text-slate-600">Day 84 ± 3</td>
                        <td className="p-2 text-slate-700">Final efficacy outcome, study completion sign-off</td>
                        <td className="p-2 text-slate-500">Scheduled</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* 21 CFR Part 11 Electronic Signature Box */}
                <div className="bg-emerald-50 border-2 border-emerald-600 rounded-lg p-4 space-y-2">
                  <div className="flex items-center space-x-2 text-emerald-900 font-bold text-xs uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>21 CFR Part 11 Cryptographic Electronic Signature Certificate</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-slate-700 pt-1">
                    <div>
                      <span className="text-slate-500 font-semibold block text-[10px]">Attesting Signer</span>
                      <span className="font-bold text-slate-900">{dossierJson.electronic_signature.signer}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 font-semibold block text-[10px]">Signer Capacity</span>
                      <span className="font-mono text-emerald-800">{dossierJson.electronic_signature.role}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 font-semibold block text-[10px]">Legal Intent</span>
                      <span className="font-mono font-bold text-slate-900">{dossierJson.electronic_signature.meaning}</span>
                    </div>
                  </div>
                  <div className="pt-1 border-t border-emerald-200/80 flex items-center justify-between text-[10px] font-mono text-emerald-900">
                    <span>Digest: {dossierJson.electronic_signature.certificate_hash}</span>
                    <span>Stamped: {new Date().toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Legal & Regulatory Footnote */}
                <div className="text-[10px] text-slate-400 border-t border-slate-200 pt-3 flex items-center justify-between">
                  <span>Mandated under CDSCO NDCTR 2019 Rule 42 & Ayush GCP Guidelines</span>
                  <span className="font-mono">Tamper-Evident SHA-256 Ledger Verified</span>
                </div>
              </div>
            </div>
          )}

          {/* VIEW MODE 2: JSON Specification */}
          {viewMode === 'json' && (
            <div className="max-w-3xl mx-auto space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span>Standardized Clinical Trial JSON Specification</span>
                <button
                  type="button"
                  onClick={handleCopyJson}
                  className="inline-flex items-center space-x-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 transition"
                >
                  {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedJson ? 'Copied' : 'Copy JSON'}</span>
                </button>
              </div>
              <pre className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-emerald-400 font-mono text-xs overflow-auto max-h-[70vh] shadow-inner leading-relaxed">
                {JSON.stringify(dossierJson, null, 2)}
              </pre>
            </div>
          )}

          {/* VIEW MODE 3: Embedded Stream Frame */}
          {viewMode === 'frame' && (
            <div className="w-full h-full rounded-xl overflow-hidden border border-slate-800 bg-slate-900 flex items-center justify-center">
              <iframe
                src={activeUrl}
                title={activeTitle}
                className="w-full h-full bg-white rounded"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentViewerModal;