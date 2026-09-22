import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  CalendarCheck,
  AlertTriangle,
  Stethoscope,
  Activity,
  ArrowRight,
  Sparkles,
  Clock
} from 'lucide-react';
import type { DashboardMetricsResponse, ClinicalTrialListItem, AdverseEvent } from '../../types';

interface InvestigatorDashboardViewProps {
  metrics: DashboardMetricsResponse | null;
  trials: ClinicalTrialListItem[];
  saeEvents: AdverseEvent[];
  onOpenAssessmentModal?: () => void;
}

export const InvestigatorDashboardView: React.FC<InvestigatorDashboardViewProps> = ({
  metrics,
  trials,
  saeEvents
}) => {
  const partStats = metrics?.participant_stats;

  // Sample assigned participants under Dr. Rajesh Sharma
  const ASSIGNED_VISITS = [
    { participantId: 'AIIA-P-101', subjectInitials: 'A.K.', condition: 'Amavata (Rheumatoid Arthritis)', visitNumber: 'Visit 4 (Week 8)', date: 'Today, 2:30 PM', status: 'Due Today', isOverdue: false },
    { participantId: 'AIIA-P-104', subjectInitials: 'R.M.', condition: 'Sandhigata Vata (Osteoarthritis)', visitNumber: 'Visit 2 (Week 2)', date: 'Tomorrow, 10:00 AM', status: 'Scheduled', isOverdue: false },
    { participantId: 'AIIA-P-109', subjectInitials: 'S.P.', condition: 'Madhumeha (Type-2 Diabetes)', visitNumber: 'Visit 6 (Week 12)', date: '21-Sep-2026', status: 'Overdue (1 Day)', isOverdue: true },
    { participantId: 'AIIA-P-112', subjectInitials: 'V.D.', condition: 'Sthaulya (Metabolic Obesity)', visitNumber: 'Visit 1 (Baseline)', date: '23-Sep-2026', status: 'Scheduled', isOverdue: false },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Investigator Core KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Assigned Participants */}
        <div className="bg-white p-5 rounded-2xl border border-blue-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Assigned Cohort</span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900 font-serif">
              {partStats?.enrolled || 48} Subjects
            </span>
            <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
              Site 01 (AIIA)
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            Active under Principal Investigator oversight
          </p>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
        </div>

        {/* Upcoming Protocol Visits */}
        <div className="bg-white p-5 rounded-2xl border border-blue-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Upcoming Visits</span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900 font-serif">9 Scheduled</span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Next 7 Days
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            Includes clinical outcome assessments &amp; vitals
          </p>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
        </div>

        {/* Overdue Visits */}
        <div className="bg-white p-5 rounded-2xl border border-blue-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Missed / Overdue</span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900 font-serif">2 Visits</span>
            <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              Follow-up Required
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            GCP protocol adherence alerts for study coordinator
          </p>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
        </div>

        {/* Safety Events */}
        <div className="bg-white p-5 rounded-2xl border border-blue-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Recent Safety Alerts</span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900 font-serif">
              {saeEvents.length || 3} Events
            </span>
            <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
              Reviewed
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            Causality assessed by medical investigator
          </p>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
        </div>
      </div>

      {/* 2. Scheduled Clinical Assessments Table & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Upcoming Clinical Visits & Protocol Assessments */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CalendarCheck className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Upcoming Visits &amp; Clinical Assessments
              </h3>
            </div>
            <Link
              to="/participants"
              className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1"
            >
              <span>Manage Participants</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Subject ID</th>
                  <th className="py-3 px-4">Clinical Morbidity</th>
                  <th className="py-3 px-4">Visit Protocol</th>
                  <th className="py-3 px-4">Scheduled Date</th>
                  <th className="py-3 px-4 text-right">Clinical Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ASSIGNED_VISITS.map((v, idx) => (
                  <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {v.participantId} <span className="text-slate-400 font-normal">({v.subjectInitials})</span>
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium">{v.condition}</td>
                    <td className="py-3 px-4 text-slate-600">{v.visitNumber}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        v.isOverdue
                          ? 'bg-rose-50 text-rose-800 border border-rose-200'
                          : 'bg-blue-50 text-blue-800 border border-blue-200'
                      }`}>
                        {v.date}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to="/participants"
                        className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                      >
                        Record Vitals
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Protocol Leadership & Randomization Launcher */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center space-x-2 text-blue-700 font-bold text-sm border-b border-slate-100 pb-3">
            <Stethoscope className="w-5 h-5 text-blue-600" />
            <h3>Investigator Clinical Tools</h3>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Record standardized Ayurvedic clinical outcome measures, WOMAC scores, and polyherbal dosage records under GCP guidelines.
          </p>

          <div className="space-y-2.5 pt-2">
            <Link
              to="/participants"
              className="w-full p-3 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-50 flex items-center justify-between text-xs font-semibold text-blue-900 transition-colors group"
            >
              <div className="flex items-center space-x-2.5">
                <Users className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
                <span>My Assigned Participants Roster</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-blue-500" />
            </Link>

            <Link
              to="/trials/new"
              className="w-full p-3 rounded-xl border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 flex items-center justify-between text-xs font-semibold text-indigo-900 transition-colors group"
            >
              <div className="flex items-center space-x-2.5">
                <Sparkles className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
                <span>NAMASTE Protocol Wizard (Auto-Coding)</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-indigo-500" />
            </Link>

            <Link
              to="/safety"
              className="w-full p-3 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-50 flex items-center justify-between text-xs font-semibold text-rose-900 transition-colors group"
            >
              <div className="flex items-center space-x-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 group-hover:scale-110 transition-transform" />
                <span>Record Adverse Event (AE / SAE)</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-rose-500" />
            </Link>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Primary Study:</span>
              <strong className="text-slate-800">
                {trials[0]?.trial_title || 'AIIA-AMAVATA-2026'}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
