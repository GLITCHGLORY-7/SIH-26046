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
  Zap,
  Check,
  Loader2,
  Stethoscope,
  BarChart3,
  ShieldAlert,
  CalendarCheck,
  UserPlus,
  CheckSquare,
  Calendar,
  FolderGit2,
  Settings,
  Layers,
  FileText
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { RoleMatrixModal } from '../components/modals/RoleMatrixModal';
import { getRoleDefinition } from '../data/rolesConfig';

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
    username: 'researcher',
    roleName: 'RESEARCHER',
    label: 'Researcher',
    duty: 'Monitor and analyze clinical trials, aggregate safety & analytics.',
    color: 'border-purple-300 bg-purple-50 text-purple-800',
    icon: <BarChart3 className="w-4 h-4 text-purple-600" />
  },
  {
    username: 'investigator',
    roleName: 'PRINCIPAL_INVESTIGATOR',
    label: 'Investigator',
    duty: 'Clinical decisions, assigned participants, visits & assessments.',
    color: 'border-blue-300 bg-blue-50 text-blue-800',
    icon: <Stethoscope className="w-4 h-4 text-blue-600" />
  },
  {
    username: 'coordinator',
    roleName: 'STUDY_COORDINATOR',
    label: 'Coordinator',
    duty: 'Operate trial activities, registration, screening & visits.',
    color: 'border-emerald-300 bg-emerald-50 text-emerald-800',
    icon: <UserCheck className="w-4 h-4 text-emerald-600" />
  },
  {
    username: 'ethics',
    roleName: 'ETHICS_COMMITTEE',
    label: 'Ethics Team',
    duty: 'Review ethics submissions, documents & compliance tracking.',
    color: 'border-violet-300 bg-violet-50 text-violet-800',
    icon: <FileCheck2 className="w-4 h-4 text-violet-600" />
  },
  {
    username: 'admin',
    roleName: 'ADMIN',
    label: 'Administrator',
    duty: 'Manage the CTMS platform, users, permissions and system settings.',
    color: 'border-teal-300 bg-teal-50 text-teal-800',
    icon: <ShieldCheck className="w-4 h-4 text-teal-600" />
  }
];

export const DashboardLayout: React.FC = () => {
  const { user, role, logout, login } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPersonaModalOpen, setIsPersonaModalOpen] = useState(false);
  const [isMatrixModalOpen, setIsMatrixModalOpen] = useState(false);
  const [switchingTo, setSwitchingTo] = useState<string | null>(null);

  const roleDef = getRoleDefinition(role);

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

  // Helper to render dynamic Lucide icons for role sidebars
  const renderSidebarIcon = (iconName: string, className = "w-4 h-4") => {
    switch (iconName) {
      case 'LayoutDashboard': return <LayoutDashboard className={className} />;
      case 'FlaskConical': return <FlaskConical className={className} />;
      case 'Users': return <Users className={className} />;
      case 'Building2': return <Building2 className={className} />;
      case 'BarChart3': return <BarChart3 className={className} />;
      case 'ShieldAlert': return <ShieldAlert className={className} />;
      case 'UserCircle': return <UserCircle className={className} />;
      case 'CalendarCheck': return <CalendarCheck className={className} />;
      case 'Stethoscope': return <Stethoscope className={className} />;
      case 'FileText': return <FileText className={className} />;
      case 'UserPlus': return <UserPlus className={className} />;
      case 'CheckSquare': return <CheckSquare className={className} />;
      case 'UserCheck': return <UserCheck className={className} />;
      case 'Calendar': return <Calendar className={className} />;
      case 'Activity': return <Activity className={className} />;
      case 'FileCheck2': return <FileCheck2 className={className} />;
      case 'FolderGit2': return <FolderGit2 className={className} />;
      case 'ShieldCheck': return <ShieldCheck className={className} />;
      case 'ScrollText': return <ScrollText className={className} />;
      case 'Settings': return <Settings className={className} />;
      default: return <LayoutDashboard className={className} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Top Government/Institute Header */}
      <header className="bg-slate-950 text-white shadow-lg border-b border-slate-800 z-30 sticky top-0">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left branding */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              
              <div className="flex items-center space-x-3">
                {/* Subtle Ayurveda Lotus/Leaf symbol */}
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-teal-500 to-emerald-500 p-0.5 shadow-md flex items-center justify-center flex-shrink-0">
                  <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                    <svg className="w-5 h-5 text-teal-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2C6.5 2 2 6.5 2 12c0 5 3.5 9 8.5 9.8" />
                      <path d="M12 2c5.5 0 10 4.5 10 10 0 5-3.5 9-8.5 9.8" />
                      <path d="M12 2v20" />
                      <path d="M12 7a5 5 0 0 1 5 5c0 3-2 5-5 5" />
                      <path d="M12 7a5 5 0 0 0-5 5c0 3 2 5 5 5" />
                    </svg>
                  </div>
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-base font-black tracking-tight text-white font-serif">AIIA</span>
                    <span className="text-slate-600 text-xs">|</span>
                    <span className="text-xs font-semibold text-teal-300 tracking-wide">
                      Clinical Trials Dashboard
                    </span>
                    <span className="hidden sm:inline-block text-[10px] bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded text-slate-300 font-mono">
                      CTMS • SIH26046
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 hidden sm:block">
                    Right Access • Right People • Better Research
                  </p>
                </div>
              </div>
            </div>

            {/* Right Action Tools & User Profile */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* 5-Role Matrix Showcase button */}
              <button
                type="button"
                onClick={() => setIsMatrixModalOpen(true)}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold text-teal-200 bg-teal-950/80 hover:bg-teal-900 border border-teal-700/70 rounded-lg transition-all shadow-sm hover:scale-[1.02]"
                title="View 5-Role Architecture & Sidebar Infographic Matrix"
              >
                <Layers className="w-3.5 h-3.5 text-teal-400" />
                <span className="hidden sm:inline">5-Role Architecture</span>
                <span className="sm:hidden text-[11px]">Matrix</span>
              </button>

              {/* 1-Click Persona Switcher button */}
              <button
                type="button"
                onClick={() => setIsPersonaModalOpen(true)}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold text-indigo-200 bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/70 rounded-lg transition-all shadow-sm hover:scale-[1.02]"
                title="Switch between Researcher, Investigator, Coordinator, Ethics, Admin"
              >
                <Zap className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">Switch Role</span>
                <span className="sm:hidden text-[11px]">Role</span>
              </button>

              {/* User Profile & Role Pill */}
              <div className="hidden lg:flex flex-col text-right pl-2 border-l border-slate-800">
                <span className="text-xs font-semibold text-slate-200">{user?.full_name}</span>
                <span className="text-[11px] text-slate-400 font-mono">@{user?.username}</span>
              </div>
              
              {role && <StatusBadge status={role} type="role" />}
              
              <button
                onClick={handleLogout}
                title="Log Out"
                className="inline-flex items-center space-x-1 px-2.5 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-rose-950 hover:text-rose-200 border border-slate-800 hover:border-rose-800/60 rounded-lg transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout Container */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* Modern Enterprise Dark Navy Sidebar Navigation */}
        <aside
          className={`
            fixed md:static inset-y-0 left-0 z-20 w-64 bg-slate-950 text-slate-200 border-r border-slate-800 transform transition-transform duration-200 ease-in-out md:translate-x-0 flex flex-col justify-between pt-16 md:pt-0 shadow-xl
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <div className="p-3.5 space-y-4 overflow-y-auto">
            {/* Institute & Role Identifier Banner */}
            <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800/80 shadow-inner">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-teal-400" />
                  <span>AIIA CTMS</span>
                </span>
                <span className="font-mono text-[9px] bg-slate-800 text-teal-300 px-1.5 py-0.5 rounded border border-slate-700">
                  v1.0
                </span>
              </div>
              <div className="flex items-center space-x-2.5">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${roleDef.themeColor.activeSidebar}`}>
                  {roleDef.title.charAt(0)}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">{roleDef.title}</h4>
                  <p className="text-[10px] text-slate-400 truncate">{roleDef.purpose}</p>
                </div>
              </div>
            </div>

            {/* Dynamic Role-Specific Navigation Links */}
            <div>
              <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                {roleDef.title} Navigation
              </p>
              <nav className="space-y-1">
                {roleDef.sidebarItems.map((item) => (
                  <NavLink
                    key={item.label}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? `${roleDef.themeColor.activeSidebar}`
                          : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                      }`
                    }
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      {renderSidebarIcon(item.iconName, 'w-4 h-4 flex-shrink-0')}
                      <span className="truncate">{item.label}</span>
                    </div>
                    <ChevronRight className="w-3 h-3 text-slate-400 opacity-60" />
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* Role Governance & RBAC Scope Pill */}
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-300">RBAC Governance</span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  Enforced
                </span>
              </div>
              <div className="text-[10px] text-slate-400 space-y-1">
                <div className="flex items-center justify-between">
                  <span>Authorized Modules:</span>
                  <strong className="text-emerald-400">{roleDef.keyAccess.length}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Restricted Actions:</span>
                  <strong className="text-rose-400">{roleDef.restrictions.length}</strong>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMatrixModalOpen(true)}
                className="w-full mt-1 py-1 px-2 text-[10px] font-bold text-teal-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded transition-colors flex items-center justify-center space-x-1"
              >
                <Layers className="w-3 h-3" />
                <span>View 5-Role Matrix</span>
              </button>
            </div>
          </div>

          {/* Bottom user footer bar */}
          <div className="p-3.5 border-t border-slate-800 bg-slate-950">
            <div className="text-xs space-y-1 text-slate-400">
              <div className="flex items-center justify-between">
                <span>Account:</span>
                <span className="font-semibold text-slate-200 truncate max-w-[120px] font-mono text-[11px]">
                  @{user?.username}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Compliance:</span>
                <span className="text-teal-400 font-mono text-[10px]">21 CFR Part 11</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto min-w-0">
          <Outlet />
        </main>
      </div>

      {/* Global Government Notice Footer */}
      <footer className="bg-white border-t border-slate-200 py-3.5 text-center text-xs text-slate-500">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-700">All India Institute of Ayurveda (AIIA)</span>
            <span className="text-slate-300">•</span>
            <span>Clinical Trials Management System</span>
          </div>
          <div className="text-slate-400 text-[11px] font-mono">
            Smart India Hackathon SIH26046 • 5 Canonical Roles Architecture
          </div>
        </div>
      </footer>

      {/* 1-Click Interactive Persona Switcher Modal */}
      {isPersonaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-ayush-950 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  <Zap className="w-5 h-5 text-teal-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                    <span>Switch Role Persona</span>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-teal-950 text-teal-300 border border-teal-700/60 font-semibold">
                      5 Roles
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Experience the platform through each of the 5 canonical stakeholder perspectives.
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
            <div className="p-5 overflow-y-auto space-y-2.5">
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
                        ? 'border-teal-500 bg-teal-50/50 shadow-sm ring-1 ring-teal-500/40'
                        : 'border-slate-200 bg-white hover:border-slate-400 hover:shadow-sm'
                    } disabled:opacity-50`}
                  >
                    <div className="flex items-start space-x-3.5">
                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 mt-0.5 group-hover:bg-slate-100 transition-colors">
                        {p.icon}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-xs text-slate-900 group-hover:text-teal-900 transition-colors">
                            {p.label}
                          </span>
                          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border font-semibold ${p.color}`}>
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
                        <div className="flex items-center space-x-1.5 text-xs text-teal-700 font-bold">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Activating...</span>
                        </div>
                      ) : isActive ? (
                        <span className="inline-flex items-center space-x-1 px-2 py-1 rounded-md text-[11px] font-bold bg-teal-100 text-teal-800 border border-teal-200">
                          <Check className="w-3.5 h-3.5 text-teal-600" />
                          <span>Active Role</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-xs font-bold text-slate-400 group-hover:text-teal-700 transition-colors">
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
                Active: <strong className="text-slate-700">@{user?.username}</strong> ({role})
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

      {/* 5-Role Architectural Matrix Showcase Modal */}
      <RoleMatrixModal
        isOpen={isMatrixModalOpen}
        onClose={() => setIsMatrixModalOpen(false)}
      />
    </div>
  );
};
