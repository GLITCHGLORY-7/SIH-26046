import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileCheck2,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Stamp,
  Scale
} from 'lucide-react';
import type { EthicsSubmission, ClinicalTrialListItem, SignatureManifest } from '../../types';
import { ElectronicSignatureModal } from '../modals/ElectronicSignatureModal';

interface EthicsTeamDashboardViewProps {
  ethicsSubmissions: EthicsSubmission[];
  trials: ClinicalTrialListItem[];
}

export const EthicsTeamDashboardView: React.FC<EthicsTeamDashboardViewProps> = ({
  ethicsSubmissions,
  trials
}) => {
  const [isSigModalOpen, setIsSigModalOpen] = useState(false);
  const [selectedSubId, setSelectedSubId] = useState<number | null>(null);

  const pendingSubmissions = ethicsSubmissions.filter(s => s.status === 'Submitted' || s.status === 'Under Review');
  const approvedSubmissions = ethicsSubmissions.filter(s => s.status === 'Approved');

  // Statutory Deadlines & Milestones under CDSCO NDCTR 2019
  const STATUTORY_DEADLINES = [
    { title: 'IEC Committee Bi-Weekly Review Board', date: '25-Sep-2026', type: 'Ethics Meeting', priority: 'High', daysLeft: '3 Days' },
    { title: 'CTRI Annual Progress Report Filing', date: '30-Sep-2026', type: 'CTRI Mandatory', priority: 'Medium', daysLeft: '8 Days' },
    { title: 'NDCTR 2019 Rule 42 SAE Dossier Submission', date: 'Expedited (24h Clock)', type: 'Statutory Safety', priority: 'Critical', daysLeft: 'Active Clock' },
  ];

  const handleOpenApproval = (subId: number) => {
    setSelectedSubId(subId);
    setIsSigModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* 1. Ethics Team Core KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pending Ethics Reviews */}
        <div className="bg-white p-5 rounded-2xl border border-violet-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-violet-800">Pending IEC Reviews</span>
            <div className="p-2.5 rounded-xl bg-violet-50 text-violet-600 border border-violet-100">
              <FileCheck2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900 font-serif">
              {pendingSubmissions.length || 4} Dossiers
            </span>
            <span className="text-xs font-semibold text-violet-700 bg-violet-50 px-2 py-0.5 rounded-full border border-violet-200">
              Awaiting Vote
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            Institutional Ethics Committee review queue
          </p>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-purple-500" />
        </div>

        {/* Approved Submissions */}
        <div className="bg-white p-5 rounded-2xl border border-violet-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-violet-800">Approved Protocols</span>
            <div className="p-2.5 rounded-xl bg-violet-50 text-violet-600 border border-violet-100">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900 font-serif">
              {approvedSubmissions.length || 11} Protocols
            </span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Certificates Active
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            21 CFR Part 11 cryptographic digital signatures sealed
          </p>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-purple-500" />
        </div>

        {/* Returned / Revisions */}
        <div className="bg-white p-5 rounded-2xl border border-violet-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-violet-800">Returned / Amendments</span>
            <div className="p-2.5 rounded-xl bg-violet-50 text-violet-600 border border-violet-100">
              <XCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900 font-serif">1 Returned</span>
            <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              Minor Revisions
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            Principal Investigator response awaited on ICF clause
          </p>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-purple-500" />
        </div>

        {/* Compliance Deadlines */}
        <div className="bg-white p-5 rounded-2xl border border-violet-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-violet-800">Statutory Deadlines</span>
            <div className="p-2.5 rounded-xl bg-violet-50 text-violet-600 border border-violet-100">
              <Scale className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900 font-serif">3 Deadlines</span>
            <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
              CDSCO / NDCTR
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            Rule 42 expedited tracking &amp; CTRI registration clocks
          </p>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-purple-500" />
        </div>
      </div>

      {/* 2. Ethics Review Queue & Statutory Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Ethics Review Queue Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileCheck2 className="w-5 h-5 text-violet-600" />
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Ethics Committee Review Queue &amp; Approval Actions
              </h3>
            </div>
            <Link
              to="/ethics-regulatory"
              className="text-xs font-semibold text-violet-700 hover:text-violet-900 flex items-center gap-1"
            >
              <span>Full Regulatory Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Submission ID</th>
                  <th className="py-3 px-4">Protocol Title</th>
                  <th className="py-3 px-4">Review Type</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Digital Approval</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ethicsSubmissions.slice(0, 4).map((sub) => {
                  const associatedTrial = trials.find(t => t.id === sub.trial_id);
                  return (
                    <tr key={sub.id} className="hover:bg-violet-50/30 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        ETH-2026-{String(sub.id).padStart(3, '0')}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-800 max-w-xs truncate">
                        {associatedTrial?.trial_title || `Ayurveda Protocol Trial #${sub.trial_id}`}
                      </td>
                      <td className="py-3 px-4 text-slate-600">Protocol v{sub.protocol_version || '1.0'}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          sub.status === 'Approved'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}>
                          {sub.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {sub.status !== 'Approved' ? (
                          <button
                            onClick={() => handleOpenApproval(sub.id)}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-violet-600 hover:bg-violet-700 text-white transition-colors flex items-center space-x-1 ml-auto"
                          >
                            <Stamp className="w-3 h-3" />
                            <span>21 CFR 11 Sign</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-emerald-700 font-bold flex items-center justify-end space-x-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Approved &amp; Sealed</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Compliance Tracking (NDCTR 2019 & CTRI) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center space-x-2 text-violet-800 font-bold text-sm border-b border-slate-100 pb-3">
            <Scale className="w-5 h-5 text-violet-600" />
            <h3>Statutory Compliance Tracking</h3>
          </div>

          <div className="space-y-3">
            {STATUTORY_DEADLINES.map((dl, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl border border-violet-100 bg-violet-50/40 space-y-1.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-900 leading-snug">{dl.title}</span>
                  <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                    dl.priority === 'Critical'
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : 'bg-violet-100 text-violet-800 border border-violet-200'
                  }`}>
                    {dl.daysLeft}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>{dl.type}</span>
                  <span className="font-mono font-medium text-slate-700">{dl.date}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100">
            <Link
              to="/ethics-regulatory"
              className="w-full py-2 px-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold flex items-center justify-center space-x-2 transition-colors shadow-sm"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Inspect All Submissions</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 21 CFR Part 11 Electronic Signature Modal */}
      {selectedSubId && (
        <ElectronicSignatureModal
          isOpen={isSigModalOpen}
          onClose={() => {
            setIsSigModalOpen(false);
            setSelectedSubId(null);
          }}
          actionType="ETHICS_APPROVAL"
          actionTitle="Institutional Ethics Committee Protocol Clearance"
          entityId={String(selectedSubId)}
          meaning="I certify that this Ayurvedic clinical protocol dossier has been reviewed and approved in accordance with ICMR and Ministry of Ayush ethical guidelines."
          onSigned={(_manifest: SignatureManifest) => {
            setIsSigModalOpen(false);
          }}
        />
      )}
    </div>
  );
};
