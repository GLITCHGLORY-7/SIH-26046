import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  ScrollText,
  UserCircle,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Building2,
  ChevronRight,
  Activity,
  FlaskConical,
  UserCheck,
  FileCheck2,
  Network,
  Zap,
  Check,
  Loader2,
  Stethoscope,
  Scale
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';

interface PersonaOption {
  username: string;
  roleName: string;
  label: string;
  duty: string;
  color: string;
  icon: React.ReactNode;
}

const SWITCHER_PERSONAS: PersonaOption[] = [
  {
    username: 'investigator',
    roleName: 'PRINCIPAL_INVESTIGATOR',
    label: 'Principal Investigator',
    duty: 'Manage protocols, multi-centric sites, visits & NAMASTE auto-coding.',
    color: 'border-blue-200 bg-blue-50 text-blue-800',
    icon: <Stethoscope className="w-4 h-4 text-blue-600" />
  },
  {
    username: 'ethics',
    roleName: 'ETHICS_COMMITTEE',
    label: 'Ethics Committee Chair',
    duty: 'Review protocol dossiers & execute 21 CFR Part 11 digital approval signatures.',
    color: 'border-indigo-200 bg-indigo-50 text-indigo-800',
    icon: <FileCheck2 className="w-4 h-4 text-indigo-600" />
  },
  {
    username: 'pharmacovigilance',
    roleName: 'PHARMACOVIGILANCE_OFFICER',
    label: 'Pharmacovigilance Lead',
    duty: 'Monitor 24h statutory SAE countdown & 1-click DCGI notice dispatch.',
    color: 'border-rose-200 bg-rose-50 text-rose-800',
    icon: <Zap className="w-4 h-4 text-rose-600" />
  },
  {
    username: 'coordinator',
    roleName: 'STUDY_COORDINATOR',
    label: 'Study Coordinator',
    duty: 'Subject screening, consent verification & clinical visit scheduling.',
    color: 'border-teal-200 bg-teal-50 text-teal-800',
    icon: <UserCheck className="w-4 h-4 text-teal-600" />
  },
  {
    username: 'monitor',
    roleName: 'CLINICAL_TRIAL_MONITOR',
    label: 'Clinical Trial Monitor',
    duty: 'Source data verification (SDV), monitor visit reports & GCP adherence.',
    color: 'border-amber-200 bg-amber-50 text-amber-800',
    icon: <Activity className="w-4 h-4 text-amber-600" />
  },
  {
    username: 'regulator',
    roleName: 'REGULATOR',
    label: 'Regulatory Inspector',
    duty: 'Inspect tamper-evident audit trails, regulatory filings & CDSCO compliance.',
    color: 'border-slate-300 bg-slate-100 text-slate-800',
    icon: <Scale className="w-4 h-4 text-slate-700" />
  },
  {
    username: 'admin',
    roleName: 'ADMIN',
    label: 'System Administrator',
    duty: 'Full system RBAC, user management, audit logs & system health.',
    color: 'border-purple-200 bg-purple-50 text-purple-800',
    icon: <ShieldCheck className="w-4 h-4 text-purple-600" />
  }
];

export const DashboardLayout: React.FC = () => {
  const { user, role, hasPermission, logout, login } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPersonaModalOpen, setIsPersonaModalOpen] = useState(false);
  const [switchingTo, setSwitchingTo] = useState<string | null>(null);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleSwitchPersona = async (targetUsername: string) => {
    if (user?.username === targetUsername) {
      setIsPersonaModalOpen(false);
      return;
    }
    setSwitchingTo(targetUsername);
    try {
      await login(targetUsername, 'Password@AIIA2026!');
      setIsPersonaModalOpen(false);
    } catch (err) {
      console.error('Failed to switch persona:', err);
    } finally {
      setSwitchingTo(null);
    }
  };

  const isAdmin = role === 'ADMIN';
  const isEthics = role === 'ETHICS_COMMITTEE';
  const isPV = role === 'PHARMACOVIGILANCE_OFFICER';
  const isRegulator = role === 'REGULATOR';

  // Strict GCP / Regulatory segregation of duties:
  // Subject operational scheduling is restricted for Ethics, PV, and Regulators
  const canViewTrials = hasPermission('trial.view') || isAdmin;
  const canViewParticipants =
    (hasPermission('participant.view') || isAdmin) && !isEthics && !isPV && !isRegulator;
  const canViewEthics = (hasPermission('ethics.view') || isAdmin) && !isPV;
  const canViewSafety = (hasPermission('safety.view') || isAdmin) && !isEthics;
  const canViewInterop = hasPermission('interop.fhir') || hasPermission('interop.export') || isAdmin;
  const canViewAudit = hasPermission('audit.view') || hasPermission('VIEW_AUDIT_LOG') || isAdmin || role === 'REGULATOR';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Government/Institute Header */}
      <header className="bg-ayush-950 text-white shadow-md border-b border-ayush-800 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left branding */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-ayush-200 hover:text-white hover:bg-ayush-900 focus:outline-none"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-ayush-600 to-ayush-800 flex items-center justify-center border border-ayush-500/30 shadow-inner">
                  <Activity className="w-6 h-6 text-emerald-300" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-ayush-300">Ministry of Ayush</span>
                    <span className="text-[10px] bg-ayush-900 border border-ayush-700 px-1.5 py-0.2 rounded text-ayush-200">GCP CTMS</span>
                  </div>
                  <h1 className="text-sm sm:text-base font-bold text-white tracking-tight">
                    AIIA Clinical Trials Dashboard
                  </h1>
                </div>
              </div>
            </div>

            {/* Right user & session status & 1-Click Persona Switcher */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* 1-Click Persona Switcher button */}
              <button
                type="button"
                onClick={() => setIsPersonaModalOpen(true)}
                className="inline-flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-emerald-300 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 rounded-lg transition-all shadow-sm group"
                title="Instantly switch perspective between PI, Ethics, PV, CRA, Auditor, or Admin"
              >
                <Zap className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline">Switch Persona</span>
                <span className="sm:hidden text-[10px] font-mono">Role</span>
              </button>

              <div className="hidden md:flex flex-col text-right">
                <span className="text-xs font-medium text-slate-200">{user?.full_name}</span>
                <span className="text-[11px] text-ayush-300 font-mono">@{user?.username}</span>
              </div>
              {role && <StatusBadge status={role} type="role" />}
              
              <button
                onClick={handleLogout}
                title="Log Out"
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-ayush-900 hover:bg-rose-900/60 hover:text-rose-200 border border-ayush-700 rounded-lg transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>


      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Navigation Sidebar */}
        <aside
          className={`
            fixed md:static inset-y-0 left-0 z-20 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out md:translate-x-0 flex flex-col justify-between pt-16 md:pt-0
            ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
          `}
        >
          <div className="p-4 space-y-6">
            {/* Institute badge */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-center space-x-3">
              <Building2 className="w-5 h-5 text-ayush-700 flex-shrink-0" />
              <div className="text-xs">
                <p className="font-semibold text-slate-800">All India Institute of Ayurveda</p>
                <p className="text-slate-500 text-[11px]">New Delhi, India</p>
              </div>
            </div>

            {/* Main Menu Links */}
            <div>
              <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Navigation
              </p>
              <nav className="space-y-1">
                <NavLink
                  to="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-ayush-50 text-ayush-900 font-semibold border-l-4 border-ayush-700'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`
                  }
                >
                  <div className="flex items-center space-x-3">
                    <LayoutDashboard className="w-4 h-4 text-ayush-600" />
                    <span>Dashboard</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </NavLink>

                {canViewTrials && (
                  <NavLink
                    to="/trials"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-ayush-50 text-ayush-900 font-semibold border-l-4 border-ayush-700'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`
                    }
                  >
                    <div className="flex items-center space-x-3">
                      <FlaskConical className="w-4 h-4 text-ayush-600" />
                      <span>Clinical Trials</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </NavLink>
                )}

                {canViewParticipants && (
                  <NavLink
                    to="/participants"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-ayush-50 text-ayush-900 font-semibold border-l-4 border-ayush-700'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`
                    }
                  >
                    <div className="flex items-center space-x-3">
                      <UserCheck className="w-4 h-4 text-ayush-600" />
                      <span>Participants</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </NavLink>
                )}

                {canViewEthics && (
                  <NavLink
                    to="/ethics-regulatory"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-ayush-50 text-ayush-900 font-semibold border-l-4 border-ayush-700'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`
                    }
                  >
                    <div className="flex items-center space-x-3">
                      <FileCheck2 className="w-4 h-4 text-ayush-600" />
                      <span>Ethics & CTRI</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </NavLink>
                )}

                {canViewSafety && (
                  <NavLink
                    to="/safety"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-ayush-50 text-ayush-900 font-semibold border-l-4 border-ayush-700'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`
                    }
                  >
                    <div className="flex items-center space-x-3">
                      <Activity className="w-4 h-4 text-rose-600" />
                      <span>Safety & PV</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </NavLink>
                )}

                {canViewInterop && (
                  <NavLink
                    to="/interoperability"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-ayush-50 text-ayush-900 font-semibold border-l-4 border-ayush-700'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`
                    }
                  >
                    <div className="flex items-center space-x-3">
                      <Network className="w-4 h-4 text-emerald-600" />
                      <span>FHIR / CDISC</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </NavLink>
                )}

                {isAdmin && (
                  <NavLink
                    to="/users"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-ayush-50 text-ayush-900 font-semibold border-l-4 border-ayush-700'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`
                    }
                  >
                    <div className="flex items-center space-x-3">
                      <Users className="w-4 h-4 text-ayush-600" />
                      <span>Users</span>
                    </div>
                    <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-mono font-medium">Admin</span>
                  </NavLink>
                )}

                {canViewAudit && (
                  <NavLink
                    to="/audit-logs"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-ayush-50 text-ayush-900 font-semibold border-l-4 border-ayush-700'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`
                    }
                  >
                    <div className="flex items-center space-x-3">
                      <ScrollText className="w-4 h-4 text-ayush-600" />
                      <span>Audit Log</span>
                    </div>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  </NavLink>
                )}

                <NavLink
                  to="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-ayush-50 text-ayush-900 font-semibold border-l-4 border-ayush-700'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`
                  }
                >
                  <div className="flex items-center space-x-3">
                    <UserCircle className="w-4 h-4 text-ayush-600" />
                    <span>My Profile</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </NavLink>
              </nav>
            </div>
          </div>

          {/* Role Jurisdiction & Restriction Scope Box */}
          <div className="mx-4 mb-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
            <div className="flex items-center justify-between font-bold text-slate-700 text-[11px] mb-1">
              <span>Jurisdiction Scope</span>
              <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold uppercase">Active</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-tight">
              {role === 'ETHICS_COMMITTEE' && 'Protocol ethics clearance & ICF compliance. Subject operational visit queues restricted.'}
              {role === 'PHARMACOVIGILANCE_OFFICER' && 'Drug safety surveillance, 24h SAE countdown & Ayush ADR causality. Hospital visit queues restricted.'}
              {role === 'REGULATOR' && 'Statutory compliance, CTRI approvals & 21 CFR Part 11 audit trails. Internal clinic ops restricted.'}
              {role === 'CLINICAL_TRIAL_MONITOR' && 'Site GCP monitoring, source data verification (SDV) & visit adherence tracking.'}
              {role === 'STUDY_COORDINATOR' && 'Participant screening scorecards, ICF verification & clinical visit scheduling.'}
              {role === 'PRINCIPAL_INVESTIGATOR' && 'Full protocol leadership, site investigator teams & clinical trial operations.'}
              {role === 'ADMIN' && 'Universal system administration, security controls & RBAC user management.'}
            </p>
          </div>

          {/* Bottom user footer bar */}
          <div className="p-4 border-t border-slate-200 bg-slate-50/80">
            <div className="text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">User:</span>
                <span className="font-semibold text-slate-800 truncate max-w-[120px]">{user?.username}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Role:</span>
                <span className="font-semibold text-ayush-800 text-[11px] truncate max-w-[130px]">{role}</span>
              </div>
              <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                <span>Compliance:</span>
                <span className="text-emerald-700 font-mono">GCP / 21 CFR 11</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Footer bar */}
      <footer className="bg-white border-t border-slate-200 py-3 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>All India Institute of Ayurveda (AIIA) — Clinical Trial Management System</span>
          <span className="text-slate-400 text-[11px]">PS SIH26046 • Phase 1 Foundation & RBAC</span>
        </div>
      </footer>

      {/* 1-Click Interactive Persona Switcher Modal */}
      {isPersonaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-ayush-950 via-slate-900 to-ayush-900 text-white flex items-center justify-between border-b border-ayush-800">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <Zap className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                    <span>Instant Persona Switcher</span>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/60 font-semibold">
                      SIH26046 Prototype
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Select any role to test real-time RBAC permissions and customized operational views.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsPersonaModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Persona Cards Grid */}
            <div className="p-5 overflow-y-auto space-y-2.5 divide-y-0">
              {SWITCHER_PERSONAS.map((p) => {
                const isActive = user?.username === p.username;
                const isThisSwitching = switchingTo === p.username;

                return (
                  <button
                    key={p.username}
                    type="button"
                    onClick={() => handleSwitchPersona(p.username)}
                    disabled={!!switchingTo}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between group ${
                      isActive
                        ? 'border-emerald-500 bg-emerald-50/50 shadow-sm ring-1 ring-emerald-500/40'
                        : 'border-slate-200 bg-white hover:border-ayush-600 hover:shadow-sm'
                    } disabled:opacity-50`}
                  >
                    <div className="flex items-start space-x-3.5">
                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 mt-0.5 group-hover:bg-slate-100 transition-colors">
                        {p.icon}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-xs text-slate-900 group-hover:text-ayush-900 transition-colors">
                            {p.label}
                          </span>
                          <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border font-semibold ${p.color}`}>
                            @{p.username}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-snug max-w-md">
                          {p.duty}
                        </p>
                      </div>
                    </div>

                    <div className="ml-3 flex-shrink-0">
                      {isThisSwitching ? (
                        <div className="flex items-center space-x-1.5 text-xs text-ayush-700 font-bold">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Switching...</span>
                        </div>
                      ) : isActive ? (
                        <span className="inline-flex items-center space-x-1 px-2 py-1 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Active View</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-xs font-bold text-slate-400 group-hover:text-ayush-800 transition-colors">
                          Switch ➔
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono text-[11px]">
                Active User: <strong className="text-slate-700">@{user?.username}</strong> ({role})
              </span>
              <button
                type="button"
                onClick={() => setIsPersonaModalOpen(false)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

