import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Activity,
  Lock,
  User,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Sparkles,
  Zap,
  Network,
  ArrowRight,
  Eye,
  EyeOff,
  Stethoscope,
  Building2,
  FileCheck2,
  CheckCircle2,
  BarChart3,
  UserCheck
} from 'lucide-react';

interface Persona {
  label: string;
  roleTitle: string;
  username: string;
  duty: string;
  badgeColor: string;
  borderColor: string;
  icon: React.ReactNode;
}

const PERSONAS: Persona[] = [
  {
    label: 'Researcher',
    roleTitle: 'Monitor & Analyze',
    username: 'researcher',
    duty: 'Monitor trial progress, aggregate safety summaries, multicentric site KPIs & research analytics.',
    badgeColor: 'bg-purple-950 text-purple-300 border-purple-800 font-mono',
    borderColor: 'border-purple-800/80 hover:border-purple-500 hover:bg-slate-800/90',
    icon: <BarChart3 className="w-4 h-4 text-purple-400" />
  },
  {
    label: 'Investigator',
    roleTitle: 'Clinical Decisions & Participants',
    username: 'investigator',
    duty: 'Manage assigned participants, schedule & record visits, clinical assessments & AE/SAE.',
    badgeColor: 'bg-blue-950 text-blue-300 border-blue-800 font-mono',
    borderColor: 'border-blue-800/80 hover:border-blue-500 hover:bg-slate-800/90',
    icon: <Stethoscope className="w-4 h-4 text-blue-400" />
  },
  {
    label: 'Coordinator',
    roleTitle: 'Operate Trial Activities',
    username: 'coordinator',
    duty: 'Register participants, screening workflow, eligibility checklist & visit follow-ups.',
    badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-800 font-mono',
    borderColor: 'border-emerald-800/80 hover:border-emerald-500 hover:bg-slate-800/90',
    icon: <UserCheck className="w-4 h-4 text-emerald-400" />
  },
  {
    label: 'Ethics Team',
    roleTitle: 'Review & Approve',
    username: 'ethics',
    duty: 'Review ethics submissions, evaluate consent & execute 21 CFR Part 11 digital approval signatures.',
    badgeColor: 'bg-violet-950 text-violet-300 border-violet-800 font-mono',
    borderColor: 'border-violet-800/80 hover:border-violet-500 hover:bg-slate-800/90',
    icon: <FileCheck2 className="w-4 h-4 text-violet-400" />
  },
  {
    label: 'Administrator',
    roleTitle: 'Manage System & Access',
    username: 'admin',
    duty: 'Role-based access control (RBAC), user directory provisioning, audit logs & system health.',
    badgeColor: 'bg-teal-950 text-teal-300 border-teal-800 font-mono',
    borderColor: 'border-teal-800/80 hover:border-teal-500 hover:bg-slate-800/90',
    icon: <ShieldCheck className="w-4 h-4 text-teal-400" />
  }
];

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeLoggingRole, setActiveLoggingRole] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError('Please enter both username and password.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await login(username.trim(), password);
      navigate(from, { replace: true });
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        'Authentication failed. Please verify your credentials.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInstantPersonaLogin = async (personaUsername: string) => {
    setActiveLoggingRole(personaUsername);
    setError(null);

    try {
      await login(personaUsername, 'Password@AIIA2026!');
      navigate(from, { replace: true });
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        'Persona authentication failed.';
      setError(msg);
    } finally {
      setActiveLoggingRole(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-ayush-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-600 selection:text-white relative overflow-hidden">
      {/* Subtle Background Glow Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-ayush-700/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Official National Header */}
      <header className="bg-slate-950/90 text-white shadow-xl border-b border-slate-800/80 backdrop-blur-md relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-ayush-800 flex items-center justify-center border border-emerald-500/40 shadow-inner">
                <Activity className="w-5 h-5 text-emerald-200" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Ministry of Ayush • Govt. of India
                  </span>
                  <span className="text-[10px] bg-slate-900 border border-slate-700 px-1.5 py-0.2 rounded text-emerald-300 font-mono">
                    GCP CTMS
                  </span>
                </div>
                <h1 className="text-sm sm:text-base font-black text-white tracking-tight">
                  All India Institute of Ayurveda (AIIA) — Clinical Trials Dashboard
                </h1>
              </div>
            </div>

            <div className="hidden sm:flex items-center space-x-2">
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>SIH 2024 • PS SIH26046</span>
              </span>
              <span className="px-2.5 py-1 rounded text-xs font-mono font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                21 CFR Part 11 & CDSCO
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area: 2-Column Institutional Presentation */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 flex flex-col justify-center relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Problem Statement & Solution Showcase (7 Cols on desktop) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Institute Overview Hero */}
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-2xl p-6 sm:p-7 space-y-3.5 backdrop-blur-md">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                  <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>National Center of Excellence</span>
                </span>
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-950/80 text-emerald-300 border border-emerald-700/60">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>ICH-GCP E6(R2) Certified</span>
                </span>
              </div>

              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
                  Standardized Digital Clinical Trials Management System
                </h2>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Developed for the <strong className="text-white font-bold">All India Institute of Ayurveda (AIIA)</strong> to
                  harmonize ancient Ayurvedic clinical evidence (<em className="text-emerald-300 font-serif">Tridosha</em>, <em className="text-emerald-300 font-serif">Prakriti</em>, classical polyherbal formulations) with
                  modern GCP rigor, 21 CFR Part 11 cryptographic signatures, and CDSCO statutory reporting.
                </p>
              </div>
            </div>

            {/* 4 Core Problem Statement Differentiators */}
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 px-1">
                <span>Core Problem Statement Differentiators (SIH26046)</span>
                <div className="h-px flex-1 bg-slate-800"></div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Differentiator 1 */}
                <div className="p-4 rounded-xl bg-slate-900/85 border border-slate-800 hover:border-emerald-500/60 hover:bg-slate-850 transition-all shadow-lg space-y-2 group">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 rounded-lg bg-emerald-950/80 text-emerald-400 border border-emerald-800/80">
                      <Stethoscope className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider group-hover:text-emerald-300 transition-colors">
                        NAMASTE & WHO ICD-11
                      </h3>
                      <span className="text-[11px] text-emerald-400 font-mono font-medium">Dual-Coding Standard</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Standardized Ayurvedic morbidities (e.g. <em>Amavata</em>, <em>Madhumeha</em>) cross-walked to WHO ICD-11 Traditional Medicine Module 2 with pre-populated formulation registries.
                  </p>
                </div>

                {/* Differentiator 2 */}
                <div className="p-4 rounded-xl bg-slate-900/85 border border-slate-800 hover:border-indigo-500/60 hover:bg-slate-850 transition-all shadow-lg space-y-2 group">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 rounded-lg bg-indigo-950/80 text-indigo-400 border border-indigo-800/80">
                      <FileCheck2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider group-hover:text-indigo-300 transition-colors">
                        21 CFR Part 11 Signatures
                      </h3>
                      <span className="text-[11px] text-indigo-400 font-mono font-medium">Cryptographic SHA-256</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Dual-credential signing ceremony generating immutable SHA-256 digital certificates for Ethics clearances, safety sign-offs, and protocol authorizations.
                  </p>
                </div>

                {/* Differentiator 3 */}
                <div className="p-4 rounded-xl bg-slate-900/85 border border-slate-800 hover:border-rose-500/60 hover:bg-slate-850 transition-all shadow-lg space-y-2 group">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 rounded-lg bg-rose-950/80 text-rose-400 border border-rose-800/80">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider group-hover:text-rose-300 transition-colors">
                        24-Hour Expedited SAE Notice
                      </h3>
                      <span className="text-[11px] text-rose-400 font-mono font-medium">NDCTR 2019 Rule 42</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Automated statutory countdown clocks with 1-click electronic dispatch of Serious Adverse Event dossiers to the DCGI and Ethics Committee.
                  </p>
                </div>

                {/* Differentiator 4 */}
                <div className="p-4 rounded-xl bg-slate-900/85 border border-slate-800 hover:border-teal-500/60 hover:bg-slate-850 transition-all shadow-lg space-y-2 group">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 rounded-lg bg-teal-950/80 text-teal-400 border border-teal-800/80">
                      <Network className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider group-hover:text-teal-300 transition-colors">
                        FHIR R4 & CDISC Interop
                      </h3>
                      <span className="text-[11px] text-teal-400 font-mono font-medium">Global Registry Sync</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    One-click export of HL7 FHIR ResearchStudy bundles and CDISC ODM-XML data packages for seamless CTRI and WHO ICTRP registry integration.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom: Regulatory Compliance Standards Strip */}
            <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-4 shadow-md space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Statutory & Regulatory Standards Met
              </span>
              <div className="flex flex-wrap gap-2 text-xs font-mono">
                <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-200 font-medium">
                  ✓ CDSCO NDCTR 2019
                </span>
                <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-200 font-medium">
                  ✓ US FDA 21 CFR Part 11
                </span>
                <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-200 font-medium">
                  ✓ ICH-GCP E6(R2)
                </span>
                <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-200 font-medium">
                  ✓ Ayush GCP Guidelines
                </span>
                <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-200 font-medium">
                  ✓ HL7 FHIR R4
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: 1-Click Persona Launcher & Sign In (5 Cols on desktop) */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900/95 rounded-2xl border border-slate-800 shadow-2xl p-6 sm:p-7 space-y-5 backdrop-blur-md">
              {/* Header */}
              <div>
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-950/80 text-amber-300 border border-amber-700/60 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Interactive Evaluation Mode</span>
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Instant 1-Click Role Showcase
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Select any stakeholder role to experience their tailored permissions, views, and operational responsibilities:
                </p>
              </div>

              {error && (
                <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800 flex items-start space-x-3 text-rose-200 text-xs shadow-md">
                  <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Authentication Notice:</span> {error}
                  </div>
                </div>
              )}

              {/* 1-Click Role Cards */}
              <div className="space-y-2.5">
                {PERSONAS.map((p) => {
                  const isLoggingThis = activeLoggingRole === p.username;
                  return (
                    <button
                      key={p.username}
                      type="button"
                      onClick={() => handleInstantPersonaLogin(p.username)}
                      disabled={isSubmitting || !!activeLoggingRole}
                      className={`w-full text-left p-3.5 rounded-xl border bg-slate-800/90 hover:bg-slate-800 text-white transition-all flex items-center justify-between group ${p.borderColor} disabled:opacity-50 shadow-sm`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="p-2 rounded-lg bg-slate-900 border border-slate-700 mt-0.5 group-hover:border-emerald-500/60 transition-colors">
                          {p.icon}
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-xs text-white group-hover:text-emerald-300 transition-colors">
                              {p.label}
                            </span>
                            <span
                              className={`text-[10px] font-mono px-1.5 py-0.2 rounded border font-medium ${p.badgeColor}`}
                            >
                              @{p.username}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-300 leading-snug max-w-xs sm:max-w-sm">
                            {p.duty}
                          </p>
                        </div>
                      </div>

                      <div className="ml-3 flex-shrink-0">
                        {isLoggingThis ? (
                          <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                        ) : (
                          <span className="inline-flex items-center text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 rounded-lg shadow-sm transition-all group-hover:scale-105">
                            Launch <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Collapsible Manual Credentials Form */}
              <div className="pt-3.5 border-t border-slate-800">
                <details className="group">
                  <summary className="cursor-pointer text-xs font-bold text-slate-400 hover:text-white uppercase tracking-wider flex items-center justify-between">
                    <span>Or Sign In with Manual Credentials</span>
                    <span className="text-[11px] text-slate-500 group-open:rotate-180 transition-transform">
                      ▼
                    </span>
                  </summary>

                  <form className="mt-4 space-y-3.5" onSubmit={handleManualLogin}>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Username or Email
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                          <User className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          required
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="e.g. investigator or admin"
                          className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-950 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                          <Lock className="w-4 h-4" />
                        </div>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full pl-9 pr-9 py-2 text-xs rounded-lg border border-slate-700 bg-slate-950 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 font-medium"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
                        >
                          {showPassword ? (
                            <EyeOff className="w-3.5 h-3.5" />
                          ) : (
                            <Eye className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Verifying Credentials...</span>
                        </>
                      ) : (
                        <span>Sign In</span>
                      )}
                    </button>
                  </form>
                </details>
              </div>

              {/* Standard Password Notice Box */}
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-center text-xs text-slate-400">
                <span className="text-[11px] block text-slate-500">Standardized AYUSH CTMS • National Institute Prototype</span>
                <span>All test accounts password: </span>
                <span className="font-mono font-bold text-amber-300 selection:bg-amber-400 selection:text-slate-950">Password@AIIA2026!</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Official National Footer */}
      <footer className="bg-slate-950/95 border-t border-slate-800/90 text-slate-400 text-xs py-4 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div>
            © 2026 All India Institute of Ayurveda (AIIA) • Ministry of Ayush, Govt. of India
          </div>
          <div className="flex flex-wrap justify-center sm:justify-end gap-x-4 gap-y-1 text-[11px] text-slate-400">
            <span>ICH-GCP E6(R2)</span>
            <span>•</span>
            <span>21 CFR Part 11</span>
            <span>•</span>
            <span>CDSCO NDCTR 2019</span>
            <span>•</span>
            <span>HL7 FHIR R4</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
