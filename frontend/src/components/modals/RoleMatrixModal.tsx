import React from 'react';
import { X, CheckCircle2, ShieldAlert, Sparkles, ChevronDown, Activity, ArrowRight } from 'lucide-react';
import { FIVE_ROLES } from '../../data/rolesConfig';
import { useAuth } from '../../context/AuthContext';

interface RoleMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoleMatrixModal: React.FC<RoleMatrixModalProps> = ({ isOpen, onClose }) => {
  const { user, login } = useAuth();

  if (!isOpen) return null;

  const handleSwitch = async (username: string) => {
    try {
      await login(username, 'Password@AIIA2026!');
      onClose();
    } catch (e) {
      console.error('Failed to switch persona from matrix', e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div className="relative bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-700/80 rounded-2xl w-full max-w-[1400px] shadow-2xl overflow-hidden flex flex-col max-h-[96vh]">
        
        {/* Top Header Banner matching Canva/PPT Infographic */}
        <div className="bg-gradient-to-r from-ayush-950 via-slate-900 to-ayush-950 px-6 py-5 border-b border-slate-700/80 flex flex-col md:flex-row md:items-center justify-between gap-4 relative">
          <div className="flex items-center space-x-4">
            {/* Subtle Ayurveda Lotus Leaf Mark */}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 via-teal-500 to-emerald-500 p-0.5 shadow-lg shadow-teal-900/30 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <svg className="w-7 h-7 text-teal-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                <span className="text-2xl font-black tracking-tight text-white font-serif">AIIA</span>
                <span className="text-slate-500 text-lg">|</span>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Clinical Trials Dashboard
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-teal-300/90 font-medium">
                Role Based Access &amp; Sidebar Components (SIH26046)
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden lg:flex flex-col text-right">
              <span className="text-xs font-semibold text-slate-300 tracking-wide">
                Right Access • Right People • Better Research
              </span>
              <span className="text-[11px] text-teal-400 font-mono tracking-wider">
                Secure | Compliant | Interoperable
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg transition-colors"
              title="Close Matrix Showcase"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 5-Column Side-by-Side Matrix Body */}
        <div className="flex-1 overflow-x-auto overflow-y-auto p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 min-w-[1100px]">
            {FIVE_ROLES.map((roleDef) => {
              const isCurrent = user?.username === roleDef.demoUser.username;

              // Color mappings per canonical role
              const colorStyles: Record<string, {
                headerBg: string;
                activeItem: string;
                border: string;
                pillBg: string;
                accentRing: string;
              }> = {
                researcher: {
                  headerBg: 'bg-purple-700 text-white',
                  activeItem: 'bg-purple-600 text-white shadow-md',
                  border: 'border-purple-500/40',
                  pillBg: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
                  accentRing: 'ring-purple-500/30'
                },
                investigator: {
                  headerBg: 'bg-blue-600 text-white',
                  activeItem: 'bg-blue-600 text-white shadow-md',
                  border: 'border-blue-500/40',
                  pillBg: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
                  accentRing: 'ring-blue-500/30'
                },
                coordinator: {
                  headerBg: 'bg-emerald-600 text-white',
                  activeItem: 'bg-emerald-600 text-white shadow-md',
                  border: 'border-emerald-500/40',
                  pillBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
                  accentRing: 'ring-emerald-500/30'
                },
                ethics: {
                  headerBg: 'bg-violet-700 text-white',
                  activeItem: 'bg-violet-600 text-white shadow-md',
                  border: 'border-violet-500/40',
                  pillBg: 'bg-violet-500/20 text-violet-300 border-violet-500/40',
                  accentRing: 'ring-violet-500/30'
                },
                admin: {
                  headerBg: 'bg-teal-600 text-white',
                  activeItem: 'bg-teal-600 text-white shadow-md',
                  border: 'border-teal-500/40',
                  pillBg: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
                  accentRing: 'ring-teal-500/30'
                }
              };

              const cs = colorStyles[roleDef.canonicalKey] || colorStyles.researcher;

              return (
                <div
                  key={roleDef.id}
                  className={`bg-slate-900/90 rounded-xl border ${cs.border} flex flex-col shadow-xl transition-all hover:scale-[1.01] ${isCurrent ? 'ring-2 ring-teal-400' : ''}`}
                >
                  {/* Card Header */}
                  <div className={`${cs.headerBg} p-3.5 rounded-t-xl`}>
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center font-bold text-sm">
                        {roleDef.title.charAt(0)}
                      </div>
                      <div className="leading-tight">
                        <h3 className="font-bold text-base tracking-tight">{roleDef.title}</h3>
                        <p className="text-[11px] text-white/90 font-medium">{roleDef.purpose}</p>
                      </div>
                    </div>
                  </div>

                  {/* Simulated Dynamic Sidebar Navigation */}
                  <div className="p-3 bg-slate-950/80 border-b border-slate-800">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 pb-2 mb-2 border-b border-slate-800">
                      <div className="flex items-center space-x-1.5 text-slate-300">
                        <Activity className="w-3.5 h-3.5 text-teal-400" />
                        <span className="font-bold">AIIA CTMS</span>
                      </div>
                      <ChevronDown className="w-3 h-3 text-slate-500" />
                    </div>

                    <div className="space-y-1">
                      {roleDef.sidebarItems.map((item, idx) => {
                        const isFirst = idx === 0;
                        return (
                          <div
                            key={item.label}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                              isFirst ? cs.activeItem : 'text-slate-300 hover:bg-slate-800/60'
                            }`}
                          >
                            <span className="truncate">{item.label}</span>
                            {isFirst && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Key Access Box */}
                  <div className="p-3 flex-1 flex flex-col space-y-3 bg-slate-900/60">
                    <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                      <div className="flex items-center space-x-1.5 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Key Access</span>
                      </div>
                      <ul className="space-y-1.5 text-[11px] text-slate-300">
                        {roleDef.keyAccess.map((acc, i) => (
                          <li key={i} className="flex items-start space-x-1.5 leading-relaxed">
                            <span className="text-emerald-400 font-bold mt-0.5">•</span>
                            <span>{acc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Restrictions Box */}
                    <div className="bg-rose-950/30 p-2.5 rounded-lg border border-rose-900/40">
                      <div className="flex items-center space-x-1.5 text-rose-400 text-xs font-bold uppercase tracking-wider mb-2">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>Restrictions</span>
                      </div>
                      <ul className="space-y-1.5 text-[11px] text-rose-200/80">
                        {roleDef.restrictions.map((res, i) => (
                          <li key={i} className="flex items-start space-x-1.5 leading-relaxed">
                            <span className="text-rose-400 font-bold mt-0.5">•</span>
                            <span>{res}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Bottom Action / Switch button */}
                  <div className="p-3 bg-slate-950 border-t border-slate-800">
                    <button
                      onClick={() => handleSwitch(roleDef.demoUser.username)}
                      className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all ${
                        isCurrent
                          ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 cursor-default'
                          : `${cs.headerBg} hover:opacity-90 shadow-sm`
                      }`}
                    >
                      {isCurrent ? (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                          <span>Active Role</span>
                        </>
                      ) : (
                        <>
                          <span>Activate Persona</span>
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </>
                      )}
                    </button>
                    <div className="mt-1.5 text-center text-[10px] font-mono text-slate-500">
                      @{roleDef.demoUser.username}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Banner */}
        <div className="bg-slate-950 px-6 py-3.5 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-white tracking-wide">5 Roles • 1 Unified Platform</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">SIH26046 Clinical Trials Management System</span>
          </div>
          <div className="text-[11px] text-teal-300/80 font-medium">
            AIIA CTMS — Safer Trials . Better Health . A Stronger Future
          </div>
        </div>

      </div>
    </div>
  );
};
