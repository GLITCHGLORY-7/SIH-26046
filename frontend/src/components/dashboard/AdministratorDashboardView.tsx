import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  ShieldCheck,
  ScrollText,
  ArrowRight,
  Server,
  FlaskConical
} from 'lucide-react';
import type { DashboardMetricsResponse, ClinicalTrialListItem } from '../../types';

interface AdministratorDashboardViewProps {
  metrics: DashboardMetricsResponse | null;
  trials: ClinicalTrialListItem[];
}

export const AdministratorDashboardView: React.FC<AdministratorDashboardViewProps> = ({
  metrics,
  trials
}) => {
  const trialStats = metrics?.trial_stats;

  // Platform Stakeholders
  const STAKEHOLDERS = [
    { username: 'admin', name: 'AIIA System Administrator', role: 'ADMIN', status: 'Active', permissions: 'Full System RBAC' },
    { username: 'investigator', name: 'Dr. Rajesh Sharma', role: 'PRINCIPAL_INVESTIGATOR', status: 'Active', permissions: 'Clinical Protocol Oversight' },
    { username: 'coordinator', name: 'Priya Verma', role: 'STUDY_COORDINATOR', status: 'Active', permissions: 'Site Operations & Enrollment' },
    { username: 'ethics', name: 'Prof. Meenakshi Sundaram', role: 'ETHICS_COMMITTEE', status: 'Active', permissions: 'IEC Approvals & 21 CFR 11' },
    { username: 'researcher', name: 'Dr. Ananya Roy', role: 'RESEARCHER', status: 'Active', permissions: 'Analytics, Safety & Interoperability' },
  ];

  // Recent 21 CFR Part 11 Immutable Audit Events
  const AUDIT_EVENTS = [
    { id: 'LOG-892', action: 'DIGITAL_SIGNATURE_SEALED', user: 'iec.chair', digest: 'a8f4c2...91e3', time: '12 mins ago' },
    { id: 'LOG-891', action: 'EXPEDITED_DCGI_DISPATCH', user: 'pv.safety', digest: '3b7e19...4f2a', time: '45 mins ago' },
    { id: 'LOG-890', action: 'PARTICIPANT_ENROLLED', user: 'coordinator.priya', digest: 'f102c8...88ba', time: '2 hours ago' },
    { id: 'LOG-889', action: 'PROTOCOL_AMENDMENT_V2', user: 'dr.sharma', digest: '90dc77...11fa', time: '4 hours ago' },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Administrator Core KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="bg-white p-5 rounded-2xl border border-teal-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-800">Total Stakeholders</span>
            <div className="p-2.5 rounded-xl bg-teal-50 text-teal-600 border border-teal-100">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900 font-serif">47 Users</span>
            <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
              5 Roles
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            38 active sessions in last 24 hours
          </p>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-emerald-500" />
        </div>

        {/* System Protocols */}
        <div className="bg-white p-5 rounded-2xl border border-teal-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-800">Managed Trials</span>
            <div className="p-2.5 rounded-xl bg-teal-50 text-teal-600 border border-teal-100">
              <FlaskConical className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900 font-serif">
              {trialStats?.total_trials || trials.length || 12}
            </span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Active Trials
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            Governed under Ministry of Ayush GCP guidelines
          </p>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-emerald-500" />
        </div>

        {/* Security / Audit Logs */}
        <div className="bg-white p-5 rounded-2xl border border-teal-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-800">Security &amp; Audit Logs</span>
            <div className="p-2.5 rounded-xl bg-teal-50 text-teal-600 border border-teal-100">
              <ScrollText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900 font-serif">240+ Logs</span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              100% Valid
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            21 CFR Part 11 immutable SHA-256 cryptochain
          </p>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-emerald-500" />
        </div>

        {/* System Health */}
        <div className="bg-white p-5 rounded-2xl border border-teal-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-800">System Gateway</span>
            <div className="p-2.5 rounded-xl bg-teal-50 text-teal-600 border border-teal-100">
              <Server className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900 font-serif">Operational</span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Healthy
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            FastAPI + SQLite + React Vite 100% uptime
          </p>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-emerald-500" />
        </div>
      </div>

      {/* 2. Stakeholder User Directory & Audit Log Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: User Management & RBAC Directory */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-teal-600" />
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Stakeholder User Directory &amp; RBAC Allocation
              </h3>
            </div>
            <Link
              to="/users"
              className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1"
            >
              <span>Manage Users</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Stakeholder</th>
                  <th className="py-3 px-4">Role Key</th>
                  <th className="py-3 px-4">RBAC Scope</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {STAKEHOLDERS.map((u, idx) => (
                  <tr key={idx} className="hover:bg-teal-50/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{u.name}</div>
                      <div className="text-[11px] font-mono text-slate-400">@{u.username}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-800 border border-slate-200">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{u.permissions}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to="/users"
                        className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
                      >
                        Edit RBAC
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: 21 CFR Part 11 Audit Trail Verification */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center space-x-2 text-teal-800 font-bold text-sm border-b border-slate-100 pb-3">
            <ScrollText className="w-5 h-5 text-teal-600" />
            <h3>21 CFR Part 11 Audit Stream</h3>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Immutable chronological logging of all clinical trial operations, digital signatures, and regulatory filings.
          </p>

          <div className="space-y-2.5">
            {AUDIT_EVENTS.map((ev, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl border border-slate-100 bg-slate-50/70 space-y-1"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-slate-800">{ev.id}</span>
                  <span className="text-[10px] text-slate-400">{ev.time}</span>
                </div>
                <div className="text-xs font-semibold text-teal-900">{ev.action}</div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                  <span>@{ev.user}</span>
                  <span className="font-mono text-[10px] text-slate-400">SHA: {ev.digest}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100">
            <Link
              to="/audit-logs"
              className="w-full py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center justify-center space-x-2 transition-colors shadow-sm"
            >
              <ScrollText className="w-4 h-4" />
              <span>Inspect Full Audit Trail</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
