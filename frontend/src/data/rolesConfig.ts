import type { RoleDefinition } from '../types';

export const FIVE_ROLES: RoleDefinition[] = [
  {
    id: 'researcher',
    name: 'RESEARCHER',
    canonicalKey: 'researcher',
    title: 'Researcher',
    purpose: 'Monitor and analyze clinical trials.',
    themeColor: {
      primary: '#7C3AED',
      accent: 'purple',
      bgLight: 'bg-purple-50',
      border: 'border-purple-300',
      text: 'text-purple-700',
      badge: 'bg-purple-100 text-purple-800 border-purple-200',
      activeSidebar: 'bg-purple-600 text-white shadow-sm',
    },
    sidebarItems: [
      { label: 'Dashboard', path: '/dashboard', iconName: 'LayoutDashboard' },
      { label: 'Trials', path: '/trials', iconName: 'FlaskConical' },
      { label: 'Participants', path: '/participants', iconName: 'Users' },
      { label: 'Sites', path: '/trials', iconName: 'Building2' },
      { label: 'Reports & Analytics', path: '/interoperability', iconName: 'BarChart3' },
      { label: 'Safety Overview', path: '/safety', iconName: 'ShieldAlert' },
      { label: 'My Profile', path: '/profile', iconName: 'UserCircle' },
    ],
    keyAccess: [
      'View all trials and their status',
      'View participants and sites (overview only)',
      'Access KPIs and analytics',
      'View reports (clinical, safety, trial progress)',
      'Monitor safety summaries (aggregated view)'
    ],
    restrictions: [
      'Cannot modify participant or safety records',
      'Cannot manage users or roles',
      'Cannot change trial configuration',
      'Cannot approve ethics/regulatory submissions'
    ],
    demoUser: {
      username: 'researcher',
      fullName: 'Dr. Ananya Roy (Clinical Researcher)',
      email: 'dr.ananya@aiia.gov.in'
    }
  },
  {
    id: 'investigator',
    name: 'PRINCIPAL_INVESTIGATOR',
    canonicalKey: 'investigator',
    title: 'Investigator',
    purpose: 'Clinical Decisions & Participants',
    themeColor: {
      primary: '#2563EB',
      accent: 'blue',
      bgLight: 'bg-blue-50',
      border: 'border-blue-300',
      text: 'text-blue-700',
      badge: 'bg-blue-100 text-blue-800 border-blue-200',
      activeSidebar: 'bg-blue-600 text-white shadow-sm',
    },
    sidebarItems: [
      { label: 'Dashboard', path: '/dashboard', iconName: 'LayoutDashboard' },
      { label: 'My Participants', path: '/participants', iconName: 'Users' },
      { label: 'Visits & Assessments', path: '/participants', iconName: 'CalendarCheck' },
      { label: 'Safety Events', path: '/safety', iconName: 'ShieldAlert' },
      { label: 'Clinical Data', path: '/trials', iconName: 'Stethoscope' },
      { label: 'Reports', path: '/interoperability', iconName: 'FileText' },
      { label: 'My Profile', path: '/profile', iconName: 'UserCircle' },
    ],
    keyAccess: [
      'Manage assigned participants',
      'Screening & enrollment',
      'Randomization (assigned only)',
      'Schedule and record visits',
      'Enter clinical assessments',
      'Record AE/SAE',
      'View trial reports (assigned)'
    ],
    restrictions: [
      'Cannot manage system users',
      'Cannot change trial configuration',
      'Cannot access other investigators\' records (only assigned)',
      'Cannot approve ethics/regulatory items'
    ],
    demoUser: {
      username: 'investigator',
      fullName: 'Dr. Rajesh Sharma (Principal Investigator)',
      email: 'dr.sharma@aiia.gov.in'
    }
  },
  {
    id: 'coordinator',
    name: 'STUDY_COORDINATOR',
    canonicalKey: 'coordinator',
    title: 'Coordinator',
    purpose: 'Operate Trial Activities',
    themeColor: {
      primary: '#059669',
      accent: 'green',
      bgLight: 'bg-emerald-50',
      border: 'border-emerald-300',
      text: 'text-emerald-700',
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      activeSidebar: 'bg-emerald-600 text-white shadow-sm',
    },
    sidebarItems: [
      { label: 'Dashboard', path: '/dashboard', iconName: 'LayoutDashboard' },
      { label: 'Participant Registration', path: '/participants', iconName: 'UserPlus' },
      { label: 'Screening', path: '/participants', iconName: 'CheckSquare' },
      { label: 'Enrollment', path: '/participants', iconName: 'UserCheck' },
      { label: 'Visits & Follow-ups', path: '/participants', iconName: 'Calendar' },
      { label: 'Trial Activities', path: '/trials', iconName: 'Activity' },
      { label: 'My Profile', path: '/profile', iconName: 'UserCircle' },
    ],
    keyAccess: [
      'Register and screen participants',
      'Manage enrollment and randomization (as allowed)',
      'Schedule visits and follow-ups',
      'Update basic trial records',
      'Track trial activities and timelines',
      'View participant status'
    ],
    restrictions: [
      'Cannot approve ethics/regulatory documents',
      'Cannot change randomization settings',
      'Cannot manage users or roles',
      'Cannot access full clinical data (only operational view)'
    ],
    demoUser: {
      username: 'coordinator',
      fullName: 'Priya Verma (Study Coordinator)',
      email: 'coordinator.priya@aiia.gov.in'
    }
  },
  {
    id: 'ethics',
    name: 'ETHICS_COMMITTEE',
    canonicalKey: 'ethics',
    title: 'Ethics Team',
    purpose: 'Review & Approve',
    themeColor: {
      primary: '#8B5CF6',
      accent: 'violet',
      bgLight: 'bg-violet-50',
      border: 'border-violet-300',
      text: 'text-violet-700',
      badge: 'bg-violet-100 text-violet-800 border-violet-200',
      activeSidebar: 'bg-violet-600 text-white shadow-sm',
    },
    sidebarItems: [
      { label: 'Dashboard', path: '/dashboard', iconName: 'LayoutDashboard' },
      { label: 'Ethics Submissions', path: '/ethics-regulatory', iconName: 'FileCheck2' },
      { label: 'Documents', path: '/trials', iconName: 'FolderGit2' },
      { label: 'Compliance Tracking', path: '/ethics-regulatory', iconName: 'ShieldCheck' },
      { label: 'Trial Overview', path: '/trials', iconName: 'FileText' },
      { label: 'My Profile', path: '/profile', iconName: 'UserCircle' },
    ],
    keyAccess: [
      'View assigned trial documents',
      'Review ethics submissions',
      'Update approval / status',
      'Track compliance (CTRI, NDCT rules, etc.)',
      'View trial overview and history'
    ],
    restrictions: [
      'Cannot modify participant clinical data',
      'Cannot change trial configuration',
      'Cannot manage users or roles',
      'Cannot access system settings or audit logs'
    ],
    demoUser: {
      username: 'ethics',
      fullName: 'Prof. Meenakshi Sundaram (Ethics Committee)',
      email: 'iec.chair@aiia.gov.in'
    }
  },
  {
    id: 'admin',
    name: 'ADMIN',
    canonicalKey: 'admin',
    title: 'Administrator',
    purpose: 'Manage System & Access',
    themeColor: {
      primary: '#0D9488',
      accent: 'teal',
      bgLight: 'bg-teal-50',
      border: 'border-teal-300',
      text: 'text-teal-700',
      badge: 'bg-teal-100 text-teal-800 border-teal-200',
      activeSidebar: 'bg-teal-600 text-white shadow-sm',
    },
    sidebarItems: [
      { label: 'Dashboard', path: '/dashboard', iconName: 'LayoutDashboard' },
      { label: 'User Management', path: '/users', iconName: 'Users' },
      { label: 'Roles & Permissions', path: '/users', iconName: 'ShieldCheck' },
      { label: 'Trials', path: '/trials', iconName: 'FlaskConical' },
      { label: 'Sites', path: '/trials', iconName: 'Building2' },
      { label: 'Audit Logs', path: '/audit-logs', iconName: 'ScrollText' },
      { label: 'System Settings', path: '/profile', iconName: 'Settings' },
      { label: 'My Profile', path: '/profile', iconName: 'UserCircle' },
    ],
    keyAccess: [
      'Manage all users and roles',
      'Configure permissions (RBAC)',
      'Manage trials and sites',
      'View audit logs',
      'Configure system settings',
      'Monitor system health'
    ],
    restrictions: [
      'Should not alter clinical records unnecessarily',
      'All administrative actions should be auditable',
      'Critical changes must be logged'
    ],
    demoUser: {
      username: 'admin',
      fullName: 'AIIA System Administrator',
      email: 'admin@aiia.gov.in'
    }
  }
];

export function getRoleDefinition(roleName?: string | null): RoleDefinition {
  if (!roleName) return FIVE_ROLES[0];
  const r = roleName.toUpperCase();
  if (r === 'RESEARCHER') return FIVE_ROLES[0];
  if (r === 'INVESTIGATOR' || r === 'PRINCIPAL_INVESTIGATOR') return FIVE_ROLES[1];
  if (r === 'COORDINATOR' || r === 'STUDY_COORDINATOR') return FIVE_ROLES[2];
  if (r === 'ETHICS' || r === 'ETHICS_TEAM' || r === 'ETHICS_COMMITTEE') return FIVE_ROLES[3];
  if (r === 'ADMIN' || r === 'ADMINISTRATOR') return FIVE_ROLES[4];
  
  // Fallbacks for secondary roles:
  if (r === 'CLINICAL_TRIAL_MONITOR') return FIVE_ROLES[0]; // maps to Researcher/Monitor view
  if (r === 'PHARMACOVIGILANCE_OFFICER') return FIVE_ROLES[1]; // maps to Investigator/Safety view
  if (r === 'REGULATOR') return FIVE_ROLES[3]; // maps to Ethics/Compliance view
  
  return FIVE_ROLES[0];
}
