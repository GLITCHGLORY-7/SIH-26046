import React from 'react';
import { Link } from 'react-router-dom';
import {
  FlaskConical,
  Activity,
  Users,
  Building,
  ShieldCheck,
  ArrowRight,
  FileText,
  BarChart3,
  Network
} from 'lucide-react';
import type { DashboardMetricsResponse, ClinicalTrialListItem } from '../../types';

interface ResearcherDashboardViewProps {
  metrics: DashboardMetricsResponse | null;
  trials: ClinicalTrialListItem[];
}

export const ResearcherDashboardView: React.FC<ResearcherDashboardViewProps> = ({
  metrics,
  trials
}) => {
  const trialStats = metrics?.trial_stats;
  const partStats = metrics?.participant_stats;
  const safetyStats = metrics?.safety_stats;

  // Multi-centric Ayurvedic research sites benchmark
  const SITES_PERFORMANCE = [
    { name: 'All India Institute of Ayurveda (AIIA)', location: 'New Delhi', target: 120, enrolled: 114, adherence: '98.2%', status: 'Active' },
    { name: 'Institute of Teaching & Research in Ayurveda (ITRA)', location: 'Jamnagar, Gujarat', target: 90, enrolled: 82, adherence: '96.5%', status: 'Active' },
    { name: 'National Institute of Ayurveda (NIA)', location: 'Jaipur, Rajasthan', target: 80, enrolled: 71, adherence: '94.8%', status: 'Active' },
    { name: 'Faculty of Ayurveda, IMS, BHU', location: 'Varanasi, UP', target: 70, enrolled: 63, adherence: '97.1%', status: 'Active' },
    { name: 'Government Ayurveda College', location: 'Thiruvananthapuram, Kerala', target: 60, enrolled: 52, adherence: '95.4%', status: 'Active' },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Researcher Core KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Trials */}
        <div className="bg-white p-5 rounded-2xl border border-purple-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700">Total Protocols</span>
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
              <FlaskConical className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900 font-serif">
              {trialStats?.total_trials || trials.length || 12}
            </span>
            <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
              Ayush Formulations
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            {trialStats?.active_trials || 8} actively recruiting across multicentric sites
          </p>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-500" />
        </div>

        {/* Enrollment Progress */}
        <div className="bg-white p-5 rounded-2xl border border-purple-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700">Enrollment Target</span>
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900 font-serif">
              {partStats?.total_screened || 382}
            </span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              91.4% Target
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            {partStats?.enrolled || 240} enrolled, {partStats?.completed || 78} completed
          </p>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-500" />
        </div>

        {/* Aggregate Safety Summary */}
        <div className="bg-white p-5 rounded-2xl border border-purple-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700">Aggregate Safety Rate</span>
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900 font-serif">98.6%</span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              High Tolerability
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            {safetyStats?.total_ae || 6} mild AEs reported; 0 formulation toxicities
          </p>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-500" />
        </div>

        {/* Participating Sites */}
        <div className="bg-white p-5 rounded-2xl border border-purple-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700">Participating Sites</span>
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
              <Building className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900 font-serif">5 Sites</span>
            <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
              All Activated
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            National multi-centric coverage across 4 Indian states
          </p>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-500" />
        </div>
      </div>

      {/* 2. Trial Status Breakdown & Research Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Multicentric Site Performance Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Building className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Multi-Centric Site Recruitment &amp; Performance
              </h3>
            </div>
            <Link
              to="/trials"
              className="text-xs font-semibold text-purple-700 hover:text-purple-900 flex items-center gap-1"
            >
              <span>View All Sites</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Research Center</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Target vs Enrolled</th>
                  <th className="py-3 px-4">Protocol Adherence</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {SITES_PERFORMANCE.map((site, idx) => (
                  <tr key={idx} className="hover:bg-purple-50/30 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900">{site.name}</td>
                    <td className="py-3 px-4 text-slate-600">{site.location}</td>
                    <td className="py-3 px-4 font-mono">
                      <div className="flex items-center space-x-2">
                        <span>{site.enrolled} / {site.target}</span>
                        <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-purple-600 h-full rounded-full"
                            style={{ width: `${Math.min(100, (site.enrolled / site.target) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-emerald-700 font-semibold">{site.adherence}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {site.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Scientific Research Reports & Interoperability */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center space-x-2 text-purple-700 font-bold text-sm border-b border-slate-100 pb-3">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            <h3>Scientific Reports &amp; Analytics</h3>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Generate standardized clinical trial exports for peer review, Ministry of Ayush regulatory dossiers, and WHO ICTRP submissions.
          </p>

          <div className="space-y-2.5 pt-2">
            <Link
              to="/interoperability"
              className="w-full p-3 rounded-xl border border-purple-200 bg-purple-50/50 hover:bg-purple-50 flex items-center justify-between text-xs font-semibold text-purple-900 transition-colors group"
            >
              <div className="flex items-center space-x-2.5">
                <Network className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
                <span>HL7 FHIR R4 Research Study Bundle</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-purple-500" />
            </Link>

            <Link
              to="/interoperability"
              className="w-full p-3 rounded-xl border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 flex items-center justify-between text-xs font-semibold text-indigo-900 transition-colors group"
            >
              <div className="flex items-center space-x-2.5">
                <FileText className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
                <span>CDISC SDTM Tabulation Datasets (DM, AE)</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-indigo-500" />
            </Link>

            <Link
              to="/safety"
              className="w-full p-3 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-50 flex items-center justify-between text-xs font-semibold text-rose-900 transition-colors group"
            >
              <div className="flex items-center space-x-2.5">
                <Activity className="w-4 h-4 text-rose-600 group-hover:scale-110 transition-transform" />
                <span>Ayush Pharmacovigilance Safety Summary</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-rose-500" />
            </Link>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Nomenclature:</span>
              <strong className="text-slate-800">NAMASTE &amp; WHO ICD-11 TM2</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
