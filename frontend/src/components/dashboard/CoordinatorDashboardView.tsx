import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  UserPlus,
  CheckSquare,
  Activity,
  ArrowRight,
  CheckCircle2,
  Clock
} from 'lucide-react';
import type { DashboardMetricsResponse, ClinicalTrialListItem } from '../../types';

interface CoordinatorDashboardViewProps {
  metrics: DashboardMetricsResponse | null;
  trials: ClinicalTrialListItem[];
}

export const CoordinatorDashboardView: React.FC<CoordinatorDashboardViewProps> = ({
  metrics
}) => {
  const partStats = metrics?.participant_stats;

  // Operational Screening Workflow candidates
  const SCREENING_CANDIDATES = [
    { candidateId: 'SCR-2026-088', initials: 'K.L.', age: 46, gender: 'Female', morbidity: 'Amavata (RA)', criteriaCheck: '5/5 Criteria Met', icfStatus: 'Verified (Signed)', action: 'Ready for Enrollment' },
    { candidateId: 'SCR-2026-089', initials: 'P.K.', age: 52, gender: 'Male', morbidity: 'Sandhigata Vata (OA)', criteriaCheck: '4/5 Criteria Met', icfStatus: 'Pending Signature', action: 'Complete ICF' },
    { candidateId: 'SCR-2026-090', initials: 'M.J.', age: 39, gender: 'Female', morbidity: 'Madhumeha (DM-2)', criteriaCheck: '5/5 Criteria Met', icfStatus: 'Verified (Signed)', action: 'Ready for Enrollment' },
    { candidateId: 'SCR-2026-091', initials: 'S.R.', age: 61, gender: 'Male', morbidity: 'Sthaulya (Obesity)', criteriaCheck: '3/5 Ineligible', icfStatus: 'Screen Failed', action: 'Log Ineligible' },
  ];

  // Daily Operational Tasks
  const OPERATIONAL_TASKS = [
    { task: 'Verify Informed Consent Form (ICF) for SCR-2026-089', priority: 'High', deadline: 'Today, 1:00 PM', done: false },
    { task: 'Dispense Shallaki Guggulu bottles for 4 enrolled subjects', priority: 'High', deadline: 'Today, 3:30 PM', done: false },
    { task: 'Send WhatsApp & SMS reminder for Week 4 follow-up visit to Cohort A', priority: 'Medium', deadline: 'Today, 5:00 PM', done: true },
    { task: 'Upload signed investigator brochure amendment to document vault', priority: 'Medium', deadline: 'Tomorrow', done: false },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Coordinator Core KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* New Participants */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Pre-Screened</span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <UserPlus className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900 font-serif">18 Candidates</span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              This Week
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            Awaiting screening assessment &amp; ICF verification
          </p>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
        </div>

        {/* Screening Status */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Eligible to Enroll</span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <CheckSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900 font-serif">
              {partStats?.eligible || 7} Subjects
            </span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              GCP Verified
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            All inclusion/exclusion criteria met
          </p>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
        </div>

        {/* Active Enrolled */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Active Enrolled</span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900 font-serif">
              {partStats?.enrolled || 34} Active
            </span>
            <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
              On Schedule
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            Under active trial treatment &amp; visit tracking
          </p>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
        </div>

        {/* Missed Follow-ups */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Pending Follow-ups</span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900 font-serif">3 Visits</span>
            <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              Action Required
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            Requires coordinator outreach for visit rescheduling
          </p>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
        </div>
      </div>

      {/* 2. Screening Table & Daily Operational Task Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Screening & Eligibility Checklist Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckSquare className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Participant Registration &amp; Screening Status
              </h3>
            </div>
            <Link
              to="/participants"
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
            >
              <span>View Screening Log</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Candidate ID</th>
                  <th className="py-3 px-4">Demographics</th>
                  <th className="py-3 px-4">Ayush Morbidity</th>
                  <th className="py-3 px-4">Eligibility Criteria</th>
                  <th className="py-3 px-4">Informed Consent</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {SCREENING_CANDIDATES.map((c, idx) => (
                  <tr key={idx} className="hover:bg-emerald-50/30 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{c.candidateId}</td>
                    <td className="py-3 px-4 text-slate-600">{c.initials}, {c.age}y / {c.gender}</td>
                    <td className="py-3 px-4 font-medium text-slate-800">{c.morbidity}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        c.criteriaCheck.includes('Met')
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}>
                        {c.criteriaCheck}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{c.icfStatus}</td>
                    <td className="py-3 px-4 text-right">
                      {c.action === 'Ready for Enrollment' ? (
                        <Link
                          to="/participants"
                          className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                        >
                          Enroll Now
                        </Link>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium">{c.action}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Daily Coordinator Tasks & Operations */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center space-x-2 text-emerald-800 font-bold text-sm border-b border-slate-100 pb-3">
            <Activity className="w-5 h-5 text-emerald-600" />
            <h3>Daily Operational Checklist</h3>
          </div>

          <div className="space-y-3">
            {OPERATIONAL_TASKS.map((t, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border transition-all ${
                  t.done
                    ? 'bg-slate-50 border-slate-200 opacity-60'
                    : 'bg-emerald-50/50 border-emerald-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className={`w-4 h-4 mt-0.5 ${t.done ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span className={`text-xs font-medium leading-snug ${t.done ? 'line-through text-slate-500' : 'text-slate-800'}`}>
                      {t.task}
                    </span>
                  </div>
                  <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                    t.priority === 'High' ? 'bg-rose-100 text-rose-800' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {t.priority}
                  </span>
                </div>
                <div className="mt-1.5 text-[10px] text-slate-500 pl-6">
                  Due: {t.deadline}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100">
            <Link
              to="/participants"
              className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center space-x-2 transition-colors shadow-sm"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register New Candidate</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
