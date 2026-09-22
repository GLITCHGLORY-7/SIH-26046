import React from 'react';
import { CheckCircle2, ShieldAlert, Sparkles, Layers } from 'lucide-react';
import { FIVE_ROLES, getRoleDefinition } from '../data/rolesConfig';
import { useAuth } from '../context/AuthContext';

interface RoleGovernanceCardProps {
  onOpenMatrixModal?: () => void;
}

export const RoleGovernanceCard: React.FC<RoleGovernanceCardProps> = ({ onOpenMatrixModal }) => {
  const { role, login, user } = useAuth();
  const currentRoleDef = getRoleDefinition(role);

  const handleQuickSwitch = async (username: string) => {
    if (user?.username === username) return;
    try {
      await login(username, 'Password@AIIA2026!');
    } catch (e) {
      console.error('Quick switch error', e);
    }
  };

  // Color configurations per canonical role
  const roleTheme = {
    researcher: {
      border: 'border-purple-200',
      bgHeader: 'bg-gradient-to-r from-purple-700 to-indigo-800 text-white',
      badge: 'bg-purple-100 text-purple-800 border-purple-200',
      accentColor: 'text-purple-600',
      cardBg: 'bg-purple-50/40'
    },
    investigator: {
      border: 'border-blue-200',
      bgHeader: 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white',
      badge: 'bg-blue-100 text-blue-800 border-blue-200',
      accentColor: 'text-blue-600',
      cardBg: 'bg-blue-50/40'
    },
    coordinator: {
      border: 'border-emerald-200',
      bgHeader: 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white',
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      accentColor: 'text-emerald-600',
      cardBg: 'bg-emerald-50/40'
    },
    ethics: {
      border: 'border-violet-200',
      bgHeader: 'bg-gradient-to-r from-violet-700 to-purple-800 text-white',
      badge: 'bg-violet-100 text-violet-800 border-violet-200',
      accentColor: 'text-violet-600',
      cardBg: 'bg-violet-50/40'
    },
    admin: {
      border: 'border-teal-200',
      bgHeader: 'bg-gradient-to-r from-teal-700 to-slate-800 text-white',
      badge: 'bg-teal-100 text-teal-800 border-teal-200',
      accentColor: 'text-teal-600',
      cardBg: 'bg-teal-50/40'
    }
  }[currentRoleDef.canonicalKey] || {
    border: 'border-slate-200',
    bgHeader: 'bg-slate-800 text-white',
    badge: 'bg-slate-100 text-slate-800 border-slate-200',
    accentColor: 'text-slate-600',
    cardBg: 'bg-slate-50'
  };

  return (
    <div className={`rounded-2xl border ${roleTheme.border} bg-white shadow-sm overflow-hidden mb-6 transition-all`}>
      {/* Header bar */}
      <div className={`${roleTheme.bgHeader} px-5 py-4 flex flex-col md:flex-row md:items-center justify-between gap-3`}>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center font-bold text-lg text-white shadow-inner">
            {currentRoleDef.title.charAt(0)}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <span>{currentRoleDef.title} Dashboard</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/20 text-white font-semibold">
                  Role {FIVE_ROLES.findIndex(r => r.canonicalKey === currentRoleDef.canonicalKey) + 1} of 5
                </span>
              </h2>
            </div>
            <p className="text-xs text-white/90 font-medium mt-0.5">
              Purpose: {currentRoleDef.purpose}
            </p>
          </div>
        </div>

        {/* 1-Click Interactive Switcher Tabs across the 5 canonical roles */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0">
          {FIVE_ROLES.map((r) => {
            const isSelected = r.canonicalKey === currentRoleDef.canonicalKey;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => handleQuickSwitch(r.demoUser.username)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-1 ${
                  isSelected
                    ? 'bg-white text-slate-900 shadow-md font-bold'
                    : 'bg-white/10 hover:bg-white/20 text-white/90'
                }`}
                title={`Switch perspective to ${r.title}`}
              >
                {isSelected && <Sparkles className="w-3 h-3 text-amber-500" />}
                <span>{r.title}</span>
              </button>
            );
          })}

          {onOpenMatrixModal && (
            <button
              type="button"
              onClick={onOpenMatrixModal}
              className="ml-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-white/20 hover:bg-white/30 text-white border border-white/30 flex items-center space-x-1"
              title="Open full 5-role architecture comparison matrix"
            >
              <Layers className="w-3 h-3 text-teal-200" />
              <span className="hidden lg:inline">Matrix View</span>
            </button>
          )}
        </div>
      </div>

      {/* Access vs. Restrictions Governance Grid */}
      <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/50">
        {/* Key Access Box */}
        <div className="bg-white p-4 rounded-xl border border-emerald-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Authorized Key Access &amp; Modules</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-700">
              {currentRoleDef.keyAccess.map((acc, i) => (
                <li key={i} className="flex items-start space-x-2">
                  <span className="text-emerald-500 font-bold mt-0.5">•</span>
                  <span>{acc}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-emerald-700 font-medium">
            <span>Status: Full Access Granted</span>
            <span className="font-mono bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {currentRoleDef.keyAccess.length} Modules Permitted
            </span>
          </div>
        </div>

        {/* Restrictions Box */}
        <div className="bg-white p-4 rounded-xl border border-rose-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-rose-800 text-xs font-bold uppercase tracking-wider mb-3">
              <ShieldAlert className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>Restricted &amp; Prohibited Actions (RBAC Security)</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-700">
              {currentRoleDef.restrictions.map((res, i) => (
                <li key={i} className="flex items-start space-x-2">
                  <span className="text-rose-500 font-bold mt-0.5">•</span>
                  <span>{res}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-rose-700 font-medium">
            <span>Segregation of Duties: Strict GCP / 21 CFR 11</span>
            <span className="font-mono bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
              {currentRoleDef.restrictions.length} Guardrails Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
