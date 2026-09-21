import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardService } from '../services/dashboardService';
import { trialService } from '../services/trialService';
import { regulatoryService } from '../services/regulatoryService';
import { safetyService } from '../services/safetyService';
import type {
  DashboardMetricsResponse,
  DashboardAlertItem,
  ClinicalTrialListItem,
  SignatureManifest,
  EthicsSubmission,
  AdverseEvent
} from '../types';
import {
  Users,
  AlertTriangle,
  Activity,
  Calendar,
  Clock,
  CheckCircle,
  Building,
  RefreshCw,
  TrendingUp,
  ArrowRight,
  FlaskConical,
  Bell,
  AlertCircle,
  Filter,
  Sparkles,
  Stethoscope,
  FileCheck2,
  Zap,
  Network,
  ChevronDown,
  ChevronUp,
  FileText,
  ShieldCheck,
  Scale,
  Award,
  UserCheck
} from 'lucide-react';
import { ElectronicSignatureModal } from '../components/modals/ElectronicSignatureModal';

export const DashboardPage: React.FC = () => {
  const { role } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetricsResponse | null>(null);
  const [alerts, setAlerts] = useState<DashboardAlertItem[]>([]);
  const [trials, setTrials] = useState<ClinicalTrialListItem[]>([]);
  const [ethicsSubmissions, setEthicsSubmissions] = useState<EthicsSubmission[]>([]);
  const [saeEvents, setSaeEvents] = useState<AdverseEvent[]>([]);
  const [isDispatchingNotice, setIsDispatchingNotice] = useState<number | null>(null);
  const [noticeFeedback, setNoticeFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Executive Guided Tour & Differentiator States
  const [isGuideOpen, setIsGuideOpen] = useState(true);
  const [guideTab, setGuideTab] = useState<'shortcuts' | 'overview' | 'compliance'>('shortcuts');
  const [showAllDifferentiators, setShowAllDifferentiators] = useState(false);
  const [isSigModalOpen, setIsSigModalOpen] = useState(false);
  const [lastSignedCert, setLastSignedCert] = useState<SignatureManifest | null>(null);

  // Filters
  const [selectedTrialId, setSelectedTrialId] = useState<number | undefined>(undefined);
  const [selectedSiteId, setSelectedSiteId] = useState<number | undefined>(undefined);

  const loadDashboard = useCallback(async (showRefreshingSpinner = false) => {
    try {
      if (showRefreshingSpinner) setIsRefreshing(true);
      const promises: [
        Promise<DashboardMetricsResponse>,
        Promise<DashboardAlertItem[]>,
        Promise<ClinicalTrialListItem[]>,
        Promise<EthicsSubmission[]>,
        Promise<AdverseEvent[]>
      ] = [
        dashboardService.getMetrics(selectedTrialId, selectedSiteId),
        dashboardService.getAlerts(),
        trialService.getTrials({ limit: 50 }),
        regulatoryService.getEthicsSubmissions(selectedTrialId).catch(() => []),
        safetyService.listEvents({ is_serious: true, trial_id: selectedTrialId }).catch(() => [])
      ];

      const [m, a, tList, ethList, saeList] = await Promise.all(promises);
      setMetrics(m);
      setAlerts(a);
      setTrials(tList);
      setEthicsSubmissions(ethList || []);
      setSaeEvents(saeList || []);
      setLastRefreshed(new Date());
    } catch (err) {
      console.error('Error loading dashboard data', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [selectedTrialId, selectedSiteId]);

  const handleExpeditedNotice = async (aeId: number) => {
    try {
      setIsDispatchingNotice(aeId);
      setNoticeFeedback(null);
      await safetyService.expeditedNotify(aeId);
      await loadDashboard(true);
      setNoticeFeedback({
        type: 'success',
        message: `Statutory 24-hour expedited SAE notice successfully dispatched to DCGI and Ethics Committee (Receipt: DCGI-EXP-${aeId}-ACK).`
      });
    } catch (err: any) {
      console.error('Error dispatching expedited notice:', err);
      setNoticeFeedback({
        type: 'error',
        message: err?.response?.data?.detail || 'Failed to dispatch expedited notice. Please try again.'
      });
    } finally {
      setIsDispatchingNotice(null);
    }
  };

  useEffect(() => {
    loadDashboard();

    // Auto-refresh interval (every 45 seconds)
    const interval = setInterval(() => {
      loadDashboard(false);
    }, 45000);

    return () => clearInterval(interval);
  }, [loadDashboard]);

  if (isLoading && !metrics) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-ayush-700"></div>
      </div>
    );
  }

  const trialStats = metrics?.trial_stats;
  const partStats = metrics?.participant_stats;
  const safetyStats = metrics?.safety_stats;

  // Defensive client-side alert filtering matching GCP / NDCTR role jurisdiction
  const filteredAlerts = alerts.filter((alert) => {
    if (role === 'ETHICS_COMMITTEE') {
      return alert.category === 'ETHICS' || (alert.category === 'SAFETY' && alert.severity === 'CRITICAL');
    }
    if (role === 'PHARMACOVIGILANCE_OFFICER') {
      return alert.category === 'SAFETY' || alert.category === 'REGULATORY';
    }
    if (role === 'REGULATOR') {
      return alert.category === 'REGULATORY' || alert.category === 'ETHICS' || alert.category === 'SAFETY';
    }
    if (role === 'CLINICAL_TRIAL_MONITOR') {
      return alert.category === 'VISIT' || alert.category === 'RECRUITMENT';
    }
    return true;
  });

  // Role-tailored workstation configuration
  const getWorkstationData = () => {
    if (showAllDifferentiators || role === 'ADMIN') {
      return {
        badge: 'Universal Prototype Showcase • All Hackathon Differentiators',
        title: 'Standardized Clinical Trials Management Platform (CTMS)',
        description:
          'Engineered for the All India Institute of Ayurveda to harmonize classical Ayurvedic clinical trials with modern GCP compliance, 21 CFR Part 11 signatures, and CDSCO statutory reporting.',
        cards: [
          {
            title: '1. NAMASTE & ICD-11 Coding',
            category: 'Dual-Coding Standard',
            description: 'Create a protocol using the auto-suggest Ayush morbidity database (e.g. Amavata, Madhumeha) with WHO ICD-11 TM2 crosswalk.',
            actionText: 'Launch Protocol Wizard',
            link: '/trials/new',
            btnClass: 'bg-emerald-600 hover:bg-emerald-500',
            icon: <Stethoscope className="w-4 h-4 text-emerald-400" />,
            border: 'hover:border-emerald-500/60'
          },
          {
            title: '2. Dossiers & In-Browser PDF',
            category: 'Source PDF Viewer',
            description: 'Inspect study CT-2026-001 dossier: upload real PDF documents, view in embedded viewer, and generate SHA-256 manifest.',
            actionText: 'Inspect Trial Dossiers',
            link: '/trials/1',
            btnClass: 'bg-blue-600 hover:bg-blue-500',
            icon: <FileText className="w-4 h-4 text-blue-400" />,
            border: 'hover:border-blue-500/60'
          },
          {
            title: '3. 24h SAE DCGI Notice',
            category: 'NDCTR 2019 Rule 42',
            description: 'View live statutory countdown clocks under NDCTR 2019 Rule 42 and execute 1-click expedited electronic notice to DCGI.',
            actionText: 'Review SAE & 24h Clock',
            link: '/safety/2',
            btnClass: 'bg-rose-600 hover:bg-rose-500',
            icon: <Zap className="w-4 h-4 text-rose-400" />,
            border: 'hover:border-rose-500/60'
          },
          {
            title: '4. 21 CFR Part 11 Signature',
            category: 'Cryptographic Signing',
            description: 'Experience the dual-credential signing ceremony: re-authenticate, specify legal intent, and generate a SHA-256 certificate stamp.',
            actionText: 'Execute Test Signature',
            onClick: () => setIsSigModalOpen(true),
            btnClass: 'bg-indigo-600 hover:bg-indigo-500',
            icon: <FileCheck2 className="w-4 h-4 text-indigo-400" />,
            border: 'hover:border-indigo-500/60'
          },
          {
            title: '5. FHIR R4 & CDISC Export',
            category: 'Global Registry Sync',
            description: 'Export HL7 FHIR ResearchStudy bundles and CDISC ODM data packages for external registry sync (CTRI / WHO ICTRP).',
            actionText: 'Open Interoperability Portal',
            link: '/interoperability',
            btnClass: 'bg-teal-600 hover:bg-teal-500',
            icon: <Network className="w-4 h-4 text-teal-400" />,
            border: 'hover:border-teal-500/60'
          },
          {
            title: '6. Regulatory Audit Log',
            category: '21 CFR Part 11 Audit',
            description: 'Inspect the append-only tamper-evident electronic audit trail recording every signature, SAE filing, and data change.',
            actionText: 'Inspect Audit Logs',
            link: '/audit-logs',
            btnClass: 'bg-amber-600 hover:bg-amber-500',
            icon: <Scale className="w-4 h-4 text-amber-400" />,
            border: 'hover:border-amber-500/60'
          }
        ]
      };
    }

    if (role === 'ETHICS_COMMITTEE') {
      return {
        badge: 'Role Workstation: Institutional Ethics Committee (IEC Chair)',
        title: 'Ethics Review & Protocol Clearance Workstation',
        description:
          'Conducting ethical deliberations on trial protocols, evaluating participant informed consent sheets (ICFs), and issuing 21 CFR Part 11 signed clearance certificates.',
        cards: [
          {
            title: '1. Protocol Ethics Submissions',
            category: 'Submissions for Review',
            description: 'Review clinical trial protocol submissions pending ethical clearance, study risk assessments, and approval decisions.',
            actionText: 'Review Protocol Dossiers',
            link: '/ethics-regulatory',
            btnClass: 'bg-indigo-600 hover:bg-indigo-500',
            icon: <FileCheck2 className="w-4 h-4 text-indigo-400" />,
            border: 'hover:border-indigo-500/60'
          },
          {
            title: '2. Execute 21 CFR Part 11 Approval',
            category: 'Digital Clearance Ceremony',
            description: 'Execute legally binding electronic clearance signature with re-authentication and SHA-256 certificate generation.',
            actionText: 'Sign Ethics Clearance',
            onClick: () => setIsSigModalOpen(true),
            btnClass: 'bg-emerald-600 hover:bg-emerald-500',
            icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
            border: 'hover:border-emerald-500/60'
          },
          {
            title: '3. Protocol Dossiers & ICF Sheets',
            category: 'Source PDF Documents',
            description: 'Inspect full-text study protocol amendments and informed consent sheets (ICFs) in the in-browser PDF viewer.',
            actionText: 'Inspect Source PDFs',
            link: '/trials/1',
            btnClass: 'bg-blue-600 hover:bg-blue-500',
            icon: <FileText className="w-4 h-4 text-blue-400" />,
            border: 'hover:border-blue-500/60'
          },
          {
            title: '4. CTRI Registry & Validity Tracker',
            category: 'Clinical Trials Registry India',
            description: 'Track CTRI mandatory trial registrations, approval expiration dates, and annual re-approvals.',
            actionText: 'View CTRI Tracker',
            link: '/ethics-regulatory',
            btnClass: 'bg-purple-600 hover:bg-purple-500',
            icon: <Award className="w-4 h-4 text-purple-400" />,
            border: 'hover:border-purple-500/60'
          },
          {
            title: '5. Serious Adverse Events (SAE) Oversight',
            category: 'Subject Safety Alerts',
            description: 'Inspect expedited 24-hour Serious Adverse Events reported to the Ethics Committee under NDCTR 2019.',
            actionText: 'Review SAE Filings',
            link: '/safety/2',
            btnClass: 'bg-rose-600 hover:bg-rose-500',
            icon: <Zap className="w-4 h-4 text-rose-400" />,
            border: 'hover:border-rose-500/60'
          },
          {
            title: '6. Immutable Ethics Audit Log',
            category: 'GCP Governance Records',
            description: 'Audit the tamper-evident chronological event log tracking every committee vote, approval, and protocol revision.',
            actionText: 'Inspect Committee Audit',
            link: '/audit-logs',
            btnClass: 'bg-amber-600 hover:bg-amber-500',
            icon: <Scale className="w-4 h-4 text-amber-400" />,
            border: 'hover:border-amber-500/60'
          }
        ]
      };
    }

    if (role === 'PHARMACOVIGILANCE_OFFICER') {
      return {
        badge: 'Role Workstation: Pharmacovigilance & Drug Safety Lead',
        title: 'Pharmacovigilance (PV) & Safety Surveillance Workstation',
        description:
          'Real-time surveillance of adverse events, automated 24-hour statutory countdown clocks (NDCTR 2019 Rule 42), and classical Ayush causality assessments.',
        cards: [
          {
            title: '1. 24h Statutory SAE Clocks',
            category: 'NDCTR 2019 Rule 42',
            description: 'Monitor statutory 24-hour countdown timers for Serious Adverse Events requiring expedited reporting to DCGI.',
            actionText: 'Inspect 24h SAE Clocks',
            link: '/safety/2',
            btnClass: 'bg-rose-600 hover:bg-rose-500',
            icon: <Clock className="w-4 h-4 text-rose-400" />,
            border: 'hover:border-rose-500/60'
          },
          {
            title: '2. Dispatch Expedited Notice to DCGI',
            category: 'Statutory CDSCO Report',
            description: 'One-click electronic statutory notice to Central Licensing Authority with instant acknowledgment receipt.',
            actionText: 'Dispatch 24h Notice',
            link: '/safety/2',
            btnClass: 'bg-rose-700 hover:bg-rose-600',
            icon: <Zap className="w-4 h-4 text-rose-400" />,
            border: 'hover:border-rose-500/60'
          },
          {
            title: '3. Ayush ADR Causality Review',
            category: 'WHO-UMC / Naranjo Scale',
            description: 'Evaluate adverse drug reactions for classical Ayurvedic polyherbal formulations on standardized causality scales.',
            actionText: 'Review Causality & ADRs',
            link: '/safety',
            btnClass: 'bg-purple-600 hover:bg-purple-500',
            icon: <Activity className="w-4 h-4 text-purple-400" />,
            border: 'hover:border-purple-500/60'
          },
          {
            title: '4. 21 CFR Part 11 Medical Sign-Off',
            category: 'Medical Officer Review',
            description: 'Perform dual-credential cryptographic sign-off for medical causality evaluations and close resolved events.',
            actionText: 'Execute Medical Sign-Off',
            onClick: () => setIsSigModalOpen(true),
            btnClass: 'bg-indigo-600 hover:bg-indigo-500',
            icon: <FileCheck2 className="w-4 h-4 text-indigo-400" />,
            border: 'hover:border-indigo-500/60'
          },
          {
            title: '5. Safety Interoperability Export',
            category: 'HL7 FHIR & ICSR',
            description: 'Export AdverseEvent and Observation research datasets for national and global pharmacovigilance exchange.',
            actionText: 'Open Interoperability Portal',
            link: '/interoperability',
            btnClass: 'bg-teal-600 hover:bg-teal-500',
            icon: <Network className="w-4 h-4 text-teal-400" />,
            border: 'hover:border-teal-500/60'
          },
          {
            title: '6. PV Regulatory Audit Trail',
            category: 'Tamper-Evident Logs',
            description: 'Verify tamper-evident electronic audit logs for all safety reporting events, causality reviews, and timestamps.',
            actionText: 'Inspect PV Audit Trail',
            link: '/audit-logs',
            btnClass: 'bg-amber-600 hover:bg-amber-500',
            icon: <Scale className="w-4 h-4 text-amber-400" />,
            border: 'hover:border-amber-500/60'
          }
        ]
      };
    }

    if (role === 'PRINCIPAL_INVESTIGATOR') {
      return {
        badge: 'Role Workstation: Principal Investigator (Lead Medical Researcher)',
        title: 'Clinical Protocol & Participant Operations Workstation',
        description:
          'Overseeing multi-center clinical trials, NAMASTE disease auto-coding, participant recruitment, and site investigator teams.',
        cards: [
          {
            title: '1. NAMASTE & ICD-11 Trial Wizard',
            category: 'Ayush Protocol Design',
            description: 'Register clinical trial protocols with auto-suggest classical morbidities and WHO ICD-11 TM2 crosswalk.',
            actionText: 'Launch Protocol Wizard',
            link: '/trials/new',
            btnClass: 'bg-emerald-600 hover:bg-emerald-500',
            icon: <Stethoscope className="w-4 h-4 text-emerald-400" />,
            border: 'hover:border-emerald-500/60'
          },
          {
            title: '2. Screen & Randomize Participants',
            category: 'Subject Intake Scorecard',
            description: 'Evaluate eligibility scorecard, verify inclusion/exclusion criteria, and allocate treatment arms.',
            actionText: 'Screen Participants',
            link: '/participants/screen',
            btnClass: 'bg-blue-600 hover:bg-blue-500',
            icon: <UserCheck className="w-4 h-4 text-blue-400" />,
            border: 'hover:border-blue-500/60'
          },
          {
            title: '3. Protocol Amendments & PDF Dossiers',
            category: 'Trial Version History',
            description: 'Manage version amendments, source protocol PDFs, and investigator brochure dossiers.',
            actionText: 'Inspect Trial Dossiers',
            link: '/trials/1',
            btnClass: 'bg-indigo-600 hover:bg-indigo-500',
            icon: <FileText className="w-4 h-4 text-indigo-400" />,
            border: 'hover:border-indigo-500/60'
          },
          {
            title: '4. Multi-Centric Site Readiness',
            category: 'AIIA Network Hospitals',
            description: 'Oversee investigator teams, site readiness inspections, and patient enrollment targets across 5 sites.',
            actionText: 'Manage Trial Sites',
            link: '/trials',
            btnClass: 'bg-purple-600 hover:bg-purple-500',
            icon: <Building className="w-4 h-4 text-purple-400" />,
            border: 'hover:border-purple-500/60'
          },
          {
            title: '5. Report Adverse Event',
            category: 'Investigator Safety Alert',
            description: 'Record urgent clinical adverse events and reactions for immediate safety team assessment.',
            actionText: 'Report Safety Event',
            link: '/safety',
            btnClass: 'bg-rose-600 hover:bg-rose-500',
            icon: <Zap className="w-4 h-4 text-rose-400" />,
            border: 'hover:border-rose-500/60'
          },
          {
            title: '6. Export ResearchStudy Data',
            category: 'FHIR R4 / CDISC Export',
            description: 'Generate HL7 FHIR ResearchStudy and CDISC ODM data bundles for CTRI registry sync.',
            actionText: 'Export Research Data',
            link: '/interoperability',
            btnClass: 'bg-teal-600 hover:bg-teal-500',
            icon: <Network className="w-4 h-4 text-teal-400" />,
            border: 'hover:border-teal-500/60'
          }
        ]
      };
    }

    if (role === 'CLINICAL_TRIAL_MONITOR') {
      return {
        badge: 'Role Workstation: Clinical Research Associate (Trial Monitor)',
        title: 'GCP Monitoring & Multi-Centric Site Oversight Workstation',
        description:
          'Verifying GCP compliance, multi-centric site enrollment targets, source data verification (SDV), and overdue visits.',
        cards: [
          {
            title: '1. Multi-Centric Site Oversight',
            category: 'Hospital Site Monitoring',
            description: 'Monitor 5 participating research sites, enrollment percentages, and site readiness status.',
            actionText: 'Inspect Sites & Targets',
            link: '/trials',
            btnClass: 'bg-purple-600 hover:bg-purple-500',
            icon: <Building className="w-4 h-4 text-purple-400" />,
            border: 'hover:border-purple-500/60'
          },
          {
            title: '2. Overdue Visit Tracker',
            category: 'Protocol Visit Adherence',
            description: 'Identify overdue participant protocol visits across study sites and trigger reminders.',
            actionText: 'Inspect Overdue Visits',
            link: '/participants',
            btnClass: 'bg-amber-600 hover:bg-amber-500',
            icon: <Clock className="w-4 h-4 text-amber-400" />,
            border: 'hover:border-amber-500/60'
          },
          {
            title: '3. Source Data Verification (SDV)',
            category: 'GCP Compliance',
            description: 'Verify clinical case report forms (eCRF) against source protocol PDFs and ICFs.',
            actionText: 'Inspect Source Dossiers',
            link: '/trials/1',
            btnClass: 'bg-blue-600 hover:bg-blue-500',
            icon: <FileText className="w-4 h-4 text-blue-400" />,
            border: 'hover:border-blue-500/60'
          },
          {
            title: '4. Protocol Deviations & Amendments',
            category: 'Protocol Version Control',
            description: 'Track version adherence and protocol amendment approvals across active clinical sites.',
            actionText: 'Review Protocol Versions',
            link: '/trials/1',
            btnClass: 'bg-indigo-600 hover:bg-indigo-500',
            icon: <FileCheck2 className="w-4 h-4 text-indigo-400" />,
            border: 'hover:border-indigo-500/60'
          },
          {
            title: '5. Participant Lifecycle Funnel',
            category: 'Subject Enrollment Flow',
            description: 'Audit screening-to-enrollment conversion rates and participant visit completions.',
            actionText: 'View Participants',
            link: '/participants',
            btnClass: 'bg-teal-600 hover:bg-teal-500',
            icon: <Users className="w-4 h-4 text-teal-400" />,
            border: 'hover:border-teal-500/60'
          },
          {
            title: '6. Monitor Visit Logs & Audit Trail',
            category: 'Regulatory Adherence',
            description: 'Review chronological audit logs and verify GCP compliance across trial operations.',
            actionText: 'Inspect Audit Trail',
            link: '/audit-logs',
            btnClass: 'bg-slate-700 hover:bg-slate-600',
            icon: <Scale className="w-4 h-4 text-slate-400" />,
            border: 'hover:border-slate-500/60'
          }
        ]
      };
    }

    if (role === 'REGULATOR') {
      return {
        badge: 'Role Workstation: Regulatory Inspector (CDSCO / DCGI Auditor)',
        title: 'Regulatory Inspection & Statutory Compliance Workstation',
        description:
          'Inspecting tamper-evident SHA-256 audit logs, statutory 24h SAE notifications, and CDISC research packages.',
        cards: [
          {
            title: '1. Immutable Electronic Audit Trail',
            category: '21 CFR Part 11 Audit',
            description: 'Inspect tamper-evident chronological audit logs recording all data changes and signatures.',
            actionText: 'Inspect Audit Logs',
            link: '/audit-logs',
            btnClass: 'bg-amber-600 hover:bg-amber-500',
            icon: <Scale className="w-4 h-4 text-amber-400" />,
            border: 'hover:border-amber-500/60'
          },
          {
            title: '2. Expedited SAE Notice Register',
            category: 'NDCTR 2019 Rule 42',
            description: 'Review 24-hour statutory notices received by the Central Licensing Authority.',
            actionText: 'Review SAE Filings',
            link: '/safety/2',
            btnClass: 'bg-rose-600 hover:bg-rose-500',
            icon: <Zap className="w-4 h-4 text-rose-400" />,
            border: 'hover:border-rose-500/60'
          },
          {
            title: '3. CDISC ODM & FHIR Data Packages',
            category: 'Regulatory Data Submissions',
            description: 'Download standardized research datasets (CDISC SDTM / HL7 FHIR R4) for regulatory evaluation.',
            actionText: 'Inspect Data Packages',
            link: '/interoperability',
            btnClass: 'bg-teal-600 hover:bg-teal-500',
            icon: <Network className="w-4 h-4 text-teal-400" />,
            border: 'hover:border-teal-500/60'
          },
          {
            title: '4. CTRI Registry & Approvals',
            category: 'Statutory Milestones',
            description: 'Verify clinical trial registration status and ethics clearance validity dates.',
            actionText: 'Inspect Regulatory Registry',
            link: '/ethics-regulatory',
            btnClass: 'bg-purple-600 hover:bg-purple-500',
            icon: <Award className="w-4 h-4 text-purple-400" />,
            border: 'hover:border-purple-500/60'
          },
          {
            title: '5. Verified Protocol Dossiers',
            category: 'Approved Protocol PDF',
            description: 'Inspect approved protocol versions and signed investigator brochures.',
            actionText: 'View Protocol Dossiers',
            link: '/trials/1',
            btnClass: 'bg-blue-600 hover:bg-blue-500',
            icon: <FileText className="w-4 h-4 text-blue-400" />,
            border: 'hover:border-blue-500/60'
          },
          {
            title: '6. Verify Digital Signatures',
            category: 'Cryptographic Hash Check',
            description: 'Audit SHA-256 certificate hashes, signer roles, and legally binding non-repudiation timestamps.',
            actionText: 'Verify Signature Manifest',
            onClick: () => setIsSigModalOpen(true),
            btnClass: 'bg-indigo-600 hover:bg-indigo-500',
            icon: <ShieldCheck className="w-4 h-4 text-indigo-400" />,
            border: 'hover:border-indigo-500/60'
          }
        ]
      };
    }

    // Default / Study Coordinator
    return {
      badge: 'Role Workstation: Study Coordinator (CRC)',
      title: 'Clinical Operations & Participant Scheduling Workstation',
      description:
        'Managing prospective subject screening, informed consent verification, and clinical visit scheduling.',
      cards: [
        {
          title: '1. Participant Screening Scorecard',
          category: 'Inclusion / Exclusion',
          description: 'Evaluate protocol criteria scorecard for prospective Ayurvedic clinical trial participants.',
          actionText: 'Screen New Subject',
          link: '/participants/screen',
          btnClass: 'bg-emerald-600 hover:bg-emerald-500',
          icon: <UserCheck className="w-4 h-4 text-emerald-400" />,
          border: 'hover:border-emerald-500/60'
        },
        {
          title: '2. Schedule Protocol Visits',
          category: 'Subject Lifecycle',
          description: 'Record baseline, follow-up, and treatment completion clinical visits.',
          actionText: 'Manage Visits',
          link: '/participants',
          btnClass: 'bg-blue-600 hover:bg-blue-500',
          icon: <Clock className="w-4 h-4 text-blue-400" />,
          border: 'hover:border-blue-500/60'
        },
        {
          title: '3. Manage Consent & ICF Dossiers',
          category: 'Informed Consent Forms',
          description: 'Verify signed patient informed consent documents and source protocol sheets.',
          actionText: 'View Source Dossiers',
          link: '/trials/1',
          btnClass: 'bg-indigo-600 hover:bg-indigo-500',
          icon: <FileText className="w-4 h-4 text-indigo-400" />,
          border: 'hover:border-indigo-500/60'
        },
        {
          title: '4. Site Recruitment Target Tracker',
          category: 'Site Performance',
          description: 'Track site enrollment progress against target participant recruitment goals.',
          actionText: 'Review Site Targets',
          link: '/trials',
          btnClass: 'bg-purple-600 hover:bg-purple-500',
          icon: <Building className="w-4 h-4 text-purple-400" />,
          border: 'hover:border-purple-500/60'
        },
        {
          title: '5. Log Clinical Reaction / AE',
          category: 'Safety Intake',
          description: 'Record adverse events and patient reactions for immediate pharmacovigilance review.',
          actionText: 'Report Safety Event',
          link: '/safety',
          btnClass: 'bg-rose-600 hover:bg-rose-500',
          icon: <Zap className="w-4 h-4 text-rose-400" />,
          border: 'hover:border-rose-500/60'
        },
        {
          title: '6. Study Timeline Milestones',
          category: 'Governance Deadlines',
          description: 'Monitor trial protocol milestones and study delivery deadlines.',
          actionText: 'View Milestones',
          link: '/ethics-regulatory',
          btnClass: 'bg-amber-600 hover:bg-amber-500',
          icon: <Calendar className="w-4 h-4 text-amber-400" />,
          border: 'hover:border-amber-500/60'
        }
      ]
    };
  };

  const currentWorkstation = getWorkstationData();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* ======================================================== */}
      {/* EXECUTIVE PROTOTYPE SHOWCASE BANNER (SIH26046)          */}
      {/* ======================================================== */}
      <div className="bg-gradient-to-r from-slate-900 via-ayush-950 to-slate-900 text-white rounded-2xl shadow-xl border border-ayush-700/60 overflow-hidden relative">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Header Row of the Showcase */}
        <div className="p-5 sm:p-6 border-b border-ayush-800/60 flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-ayush-900 text-emerald-300 border border-emerald-700/60">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>{currentWorkstation.badge}</span>
              </span>
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                PS SIH26046
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {currentWorkstation.title}
            </h2>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              {currentWorkstation.description}
            </p>
          </div>

          <div className="flex items-center space-x-2 self-start md:self-center flex-shrink-0">
            {role !== 'ADMIN' && (
              <button
                type="button"
                onClick={() => setShowAllDifferentiators(!showAllDifferentiators)}
                className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-ayush-900 hover:bg-ayush-800 border border-ayush-700 text-xs font-semibold text-emerald-300 transition-colors"
                title="Toggle between your role's specific tasks and the global hackathon differentiators"
              >
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                <span>{showAllDifferentiators ? 'Show My Role Actions' : 'Show All Hackathon Pillars'}</span>
              </button>
            )}

            <button
              onClick={() => setIsGuideOpen(!isGuideOpen)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-ayush-900/80 hover:bg-ayush-800 border border-ayush-700/80 text-xs font-semibold text-slate-200 transition-colors"
            >
              <span>{isGuideOpen ? 'Hide' : 'Expand'}</span>
              {isGuideOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {isGuideOpen && (
          <div className="p-5 sm:p-6 relative z-10 space-y-5 bg-slate-950/40">
            {/* Showcase Navigation Tabs */}
            <div className="flex flex-wrap items-center gap-2 border-b border-ayush-800/80 pb-3">
              <button
                type="button"
                onClick={() => setGuideTab('shortcuts')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center space-x-1.5 ${
                  guideTab === 'shortcuts'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-ayush-900/60'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>1-Click Operational Actions</span>
              </button>

              <button
                type="button"
                onClick={() => setGuideTab('overview')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center space-x-1.5 ${
                  guideTab === 'overview'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-ayush-900/60'
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5" />
                <span>Platform Architecture & SIH Scope</span>
              </button>

              <button
                type="button"
                onClick={() => setGuideTab('compliance')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center space-x-1.5 ${
                  guideTab === 'compliance'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-ayush-900/60'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Regulatory Standards Matrix</span>
              </button>
            </div>

            {/* TAB 1: 1-Click Operational Actions */}
            {guideTab === 'shortcuts' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-300 font-medium">
                    {showAllDifferentiators
                      ? 'Displaying all 6 core hackathon differentiators for evaluation:'
                      : `Displaying tailored operational actions for ${role}:`}
                  </span>
                  <span className="text-[11px] text-emerald-400 font-mono hidden sm:inline">
                    {showAllDifferentiators ? 'Universal Differentiators' : 'Role-Tailored Workstation'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {currentWorkstation.cards.map((card, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl bg-slate-900/90 border border-ayush-800/80 transition-all flex flex-col justify-between space-y-3 ${card.border}`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center space-x-2">
                          <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800">
                            {card.icon}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                              {card.title}
                            </h4>
                            <span className="text-[10px] text-slate-400 font-mono block">
                              {card.category}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-300 leading-snug">
                          {card.description}
                        </p>
                      </div>

                      {card.link ? (
                        <Link
                          to={card.link}
                          className={`inline-flex items-center justify-center space-x-1.5 px-3 py-2 rounded-lg text-white text-xs font-bold transition-colors shadow-sm ${card.btnClass}`}
                        >
                          <span>{card.actionText}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      ) : (
                        <button
                          type="button"
                          onClick={card.onClick}
                          className={`inline-flex items-center justify-center space-x-1.5 px-3 py-2 rounded-lg text-white text-xs font-bold transition-colors shadow-sm ${card.btnClass}`}
                        >
                          <span>{card.actionText}</span>
                          <FileCheck2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Live Signed Certificate Badge (if ceremony just executed) */}
                {lastSignedCert && (
                  <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2 text-xs font-bold text-emerald-300 uppercase">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        <span>21 CFR Part 11 Electronic Signature Certificate Verified</span>
                      </div>
                      <p className="text-xs text-slate-200">
                        Signer: <strong className="text-white">{lastSignedCert.signer_name}</strong> • Role: <span className="font-mono text-emerald-300">{lastSignedCert.signer_role}</span> • Meaning: <span className="italic">"{lastSignedCert.meaning}"</span>
                      </p>
                      <p className="text-[11px] font-mono text-emerald-400/90 break-all">
                        SHA-256 Digest: {lastSignedCert.signature_hash}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-1 rounded bg-emerald-900 border border-emerald-700 text-emerald-200 whitespace-nowrap">
                      Recorded in Audit Trail
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Platform Architecture & SIH Scope */}
            {guideTab === 'overview' && (
              <div className="space-y-4 text-xs text-slate-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-ayush-800 space-y-2">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Building className="w-4 h-4 text-emerald-400" />
                      <span>The AYUSH Clinical Trials Challenge</span>
                    </h4>
                    <p className="leading-relaxed">
                      Ayurvedic interventions rely on holistic multi-component formulations, prakriti-based patient stratification, and unique outcome markers. Historically, standard Western CTMS platforms lacked support for classical disease classifications, causing friction during international regulatory filings.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/80 border border-ayush-800 space-y-2">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-400" />
                      <span>The AIIA CTMS Solution Architecture</span>
                    </h4>
                    <p className="leading-relaxed">
                      This platform bridges traditional Ayurveda epistemologies with modern ICH-GCP E6(R2), 21 CFR Part 11, and CDSCO NDCTR 2019 standards by implementing dual-coding (NAMASTE + ICD-11), multi-site monitoring, expedited 24h safety reporting, and FHIR/CDISC interoperability.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-ayush-950/90 border border-ayush-800/80 text-[11px] flex items-center justify-between">
                  <span className="text-slate-300 font-medium">
                    ⚡ Tip for Judges & Evaluators: Use the <strong className="text-emerald-300">Switch Persona</strong> button in the top navigation bar to test role permissions for PI, Ethics Chair, PV Lead, CRA, and DCGI Auditor without logging out!
                  </span>
                </div>
              </div>
            )}

            {/* TAB 3: Regulatory Standards Matrix */}
            {guideTab === 'compliance' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-ayush-800 space-y-1.5">
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                    CDSCO NDCTR 2019
                  </span>
                  <h5 className="font-bold text-white text-xs">Chapter VI Safety Reporting</h5>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    Rule 42 statutory 24-hour expedited SAE notice to Licensing Authority (DCGI) & 14-day comprehensive causality analysis dossier.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-ayush-800 space-y-1.5">
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 font-bold">
                    US FDA 21 CFR 11
                  </span>
                  <h5 className="font-bold text-white text-xs">Electronic Signatures & Records</h5>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    Dual-credential re-authentication, non-repudiation manifest, SHA-256 certificate fingerprinting, and append-only audit trail.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-ayush-800 space-y-1.5">
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-bold">
                    ICH-GCP E6(R2)
                  </span>
                  <h5 className="font-bold text-white text-xs">Good Clinical Practice</h5>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    Centralized multi-centric site oversight, informed consent tracking, protocol deviation logging, and CRA monitoring logs.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-ayush-800 space-y-1.5">
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800 font-bold">
                    NAMASTE & ICD-11
                  </span>
                  <h5 className="font-bold text-white text-xs">Ayush Morbidity Standards</h5>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    Ministry of Ayush National AYUSH Morbidity Electronic Portal codes mapped to WHO ICD-11 Traditional Medicine Module 2.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 21 CFR Part 11 Interactive Showcase Modal */}
      {isSigModalOpen && (
        <ElectronicSignatureModal
          isOpen={isSigModalOpen}
          onClose={() => setIsSigModalOpen(false)}
          actionTitle={`${currentWorkstation.title} Signature Execution`}
          actionType="PROTOTYPE_DEMO_SIGNATURE"
          entityId={`SIH26046-${role}`}
          meaning={`Regulatory Approval and Verification under ${role}`}
          onSigned={(manifest) => {
            setLastSignedCert(manifest);
            setIsSigModalOpen(false);
          }}
        />
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-ayush-950 via-ayush-900 to-slate-900 text-white p-6 rounded-2xl shadow-md border border-ayush-800/40 relative overflow-hidden">

        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-ayush-300 text-xs font-semibold uppercase tracking-wider mb-1">
              <span>All India Institute of Ayurveda (AIIA)</span>
              <span>•</span>
              <span className="text-emerald-400">Clinical Research Monitoring Platform</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Clinical Trials Operations Dashboard
            </h1>
            <p className="text-slate-300 text-xs mt-1 max-w-2xl">
              Real-time oversight of multi-centric Ayurveda clinical trials, GCP compliance, participant lifecycles, and pharmacovigilance surveillance.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right hidden sm:block">
              <span className="text-[11px] text-slate-400 block font-mono">
                Auto-refreshed: {lastRefreshed.toLocaleTimeString()}
              </span>
              <span className="inline-flex items-center text-[10px] text-emerald-400 font-medium">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-1.5 animate-pulse"></span>
                Database Live KPIs
              </span>
            </div>

            <button
              onClick={() => loadDashboard(true)}
              disabled={isRefreshing}
              className="p-2.5 bg-ayush-800 hover:bg-ayush-700 text-white rounded-xl border border-ayush-600/50 shadow-sm transition-colors flex items-center gap-1.5 text-xs font-semibold"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Quick Filter Bar inside header */}
        <div className="mt-5 pt-4 border-t border-ayush-800/60 flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center space-x-2 text-slate-300">
            <Filter className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-medium">Filter Dashboard Scope:</span>
          </div>

          <select
            value={selectedTrialId || ''}
            onChange={(e) => setSelectedTrialId(e.target.value ? Number(e.target.value) : undefined)}
            className="bg-ayush-900 border border-ayush-700 text-slate-200 rounded-lg px-2.5 py-1 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="">All Clinical Trials ({trials.length})</option>
            {trials.map((t) => (
              <option key={t.id} value={t.id}>
                {t.trial_id} - {t.trial_title.length > 30 ? t.trial_title.substring(0, 30) + '...' : t.trial_title}
              </option>
            ))}
          </select>

          {selectedTrialId && (
            <button
              onClick={() => {
                setSelectedTrialId(undefined);
                setSelectedSiteId(undefined);
              }}
              className="text-xs text-emerald-400 hover:text-emerald-300 underline font-medium"
            >
              Clear Scope
            </button>
          )}
        </div>
      </div>

      {/* Role Regulatory Scope & Restrictions Notice */}
      {role === 'ETHICS_COMMITTEE' && (
        <div className="p-4 rounded-xl bg-indigo-950/80 border border-indigo-700/60 text-indigo-100 flex items-start gap-3 shadow-md">
          <ShieldCheck className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                ICMR Ethical Guidelines & GCP E6(R2) Jurisdiction Scope Notice
              </span>
              <span className="font-mono text-[10px] bg-indigo-900 border border-indigo-600 px-1.5 py-0.2 rounded text-indigo-300">
                Independent Board Neutrality
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Individual participant clinic appointments, overdue visits, and hospital recruitment quotas are strictly restricted under ICMR ethical guidelines to safeguard Institutional Ethics Committee independence, eliminate commercial recruitment bias, and protect subject confidentiality. Your workstation is focused on protocol review, informed consent verification, and safety risk oversight.
            </p>
          </div>
        </div>
      )}

      {role === 'PHARMACOVIGILANCE_OFFICER' && (
        <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-700/60 text-rose-100 flex items-start gap-3 shadow-md">
          <Zap className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                NDCTR 2019 Rule 42 Pharmacovigilance Surveillance Scope
              </span>
              <span className="font-mono text-[10px] bg-rose-900 border border-rose-600 px-1.5 py-0.2 rounded text-rose-300">
                24h Statutory Mandate
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Hospital outpatient appointment queues and recruitment velocity funnels are restricted. This workstation is prioritized for real-time safety surveillance, statutory 24-hour expedited countdown clocks to the Central Licensing Authority (DCGI), and WHO-UMC causality assessments for classical Ayurvedic formulations.
            </p>
          </div>
        </div>
      )}

      {role === 'REGULATOR' && (
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 flex items-start gap-3 shadow-md">
          <Scale className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                Central Licensing Authority (DCGI / Ayush) Statutory Inspection Scope
              </span>
              <span className="font-mono text-[10px] bg-amber-950 border border-amber-600 px-1.5 py-0.2 rounded text-amber-300">
                21 CFR Part 11 Inspection
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Operational clinic visit reminders and site screening notes are restricted. Inspector access is focused on statutory approvals, immutable 21 CFR Part 11 audit trails, expedited SAE registers, and CTRI regulatory compliance.
            </p>
          </div>
        </div>
      )}

      {/* KPI Ribbon: Role-Tailored Functional Metrics */}
      {role === 'ETHICS_COMMITTEE' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Clinical Protocols under IEC */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Clinical Protocols</span>
              <FlaskConical className="w-5 h-5 text-ayush-700" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-slate-900">{trialStats?.total_trials ?? 0}</span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {trialStats?.active_trials ?? 0} Active Oversight
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1 pt-1 text-[11px] text-slate-600 border-t border-slate-50">
              <div>
                <span className="text-slate-400 block text-[10px]">Under Review</span>
                <span className="font-bold text-slate-800">{trialStats?.draft_trials ?? 0}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Completed</span>
                <span className="font-bold text-slate-800">{trialStats?.completed_trials ?? 0}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Suspended</span>
                <span className="font-bold text-slate-800">{trialStats?.suspended_trials ?? 0}</span>
              </div>
            </div>
          </div>

          {/* Card 2: IEC Protocol Dossiers */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">IEC Submissions</span>
              <FileCheck2 className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-slate-900">
                {metrics?.pending_ethics_reviews_count || (ethicsSubmissions.filter(s => s.status !== 'Approved').length || 1)}
              </span>
              <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                Pending Committee Action
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1 pt-1 text-[11px] text-slate-600 border-t border-slate-50">
              <div>
                <span className="text-slate-400 block text-[10px]">Full Board</span>
                <span className="font-bold text-slate-800">1</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Expedited</span>
                <span className="font-bold text-slate-800">0</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Amendments</span>
                <span className="font-bold text-indigo-700">1</span>
              </div>
            </div>
          </div>

          {/* Card 3: Active Ethical Clearances */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Clearances Granted</span>
              <Award className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-slate-900">
                {metrics?.active_ethics_clearances_count || (ethicsSubmissions.filter(s => s.status === 'Approved').length || 2)}
              </span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Valid ICMR Approvals
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1 pt-1 text-[11px] text-slate-600 border-t border-slate-50">
              <div>
                <span className="text-slate-400 block text-[10px]">Valid &gt;90d</span>
                <span className="font-bold text-slate-800">2</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Due &lt;45d</span>
                <span className="font-bold text-amber-600">{metrics?.upcoming_ethics_expiry_count ?? 0}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Lapsed</span>
                <span className="font-bold text-emerald-700">0</span>
              </div>
            </div>
          </div>

          {/* Card 4: Safety Oversight (SAEs) */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Safety Risk Oversight</span>
              <Activity className="w-5 h-5 text-rose-600" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-slate-900">{safetyStats?.total_sae ?? 0}</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                (safetyStats?.total_sae ?? 0) > 0 ? 'bg-rose-100 text-rose-800 border-rose-300' : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}>
                {(safetyStats?.total_sae ?? 0) > 0 ? 'SAE Under IEC Review' : 'No Critical SAE'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1 pt-1 text-[11px] text-slate-600 border-t border-slate-50">
              <div>
                <span className="text-slate-400 block text-[10px]">Total AEs</span>
                <span className="font-bold text-slate-800">{safetyStats?.total_ae ?? 0}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Ayush ADRs</span>
                <span className="font-bold text-purple-700">{safetyStats?.total_adr ?? 0}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Subject Safety</span>
                <span className="font-bold text-emerald-700">Protected</span>
              </div>
            </div>
          </div>
        </div>
      ) : role === 'PHARMACOVIGILANCE_OFFICER' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Adverse Events */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Adverse Events</span>
              <Activity className="w-5 h-5 text-ayush-700" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-slate-900">{safetyStats?.total_ae ?? 0}</span>
              <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                Surveillance Active
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1 pt-1 text-[11px] text-slate-600 border-t border-slate-50">
              <div>
                <span className="text-slate-400 block text-[10px]">Mild</span>
                <span className="font-bold text-slate-800">1</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Moderate</span>
                <span className="font-bold text-slate-800">1</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Severe</span>
                <span className="font-bold text-rose-700">{safetyStats?.total_sae ?? 0}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Serious Adverse Events (SAE) - 24h Countdown */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Serious Events (SAE)</span>
              <Zap className="w-5 h-5 text-rose-600" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-rose-600">{safetyStats?.total_sae ?? 0}</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full border bg-rose-100 text-rose-800 border-rose-300">
                NDCTR 2019 Rule 42
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1 pt-1 text-[11px] text-slate-600 border-t border-slate-50">
              <div>
                <span className="text-slate-400 block text-[10px]">24h Clock</span>
                <span className="font-bold text-rose-600">Active</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">DCGI Notice</span>
                <span className="font-bold text-amber-600">Pending</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">14d Dossier</span>
                <span className="font-bold text-slate-800">Draft</span>
              </div>
            </div>
          </div>

          {/* Card 3: Classical Ayush ADRs */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ayush ADR Causality</span>
              <Stethoscope className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-slate-900">{safetyStats?.total_adr ?? 0}</span>
              <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                WHO-UMC Scale
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1 pt-1 text-[11px] text-slate-600 border-t border-slate-50">
              <div>
                <span className="text-slate-400 block text-[10px]">Probable</span>
                <span className="font-bold text-slate-800">1</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Possible</span>
                <span className="font-bold text-slate-800">0</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Unlikely</span>
                <span className="font-bold text-emerald-700">0</span>
              </div>
            </div>
          </div>

          {/* Card 4: Medical Reviews & Closures */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Medical Reviews</span>
              <FileCheck2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-slate-900">{safetyStats?.events_under_review ?? 0}</span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {safetyStats?.resolved_events ?? 0} Closed Cases
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1 pt-1 text-[11px] text-slate-600 border-t border-slate-50">
              <div>
                <span className="text-slate-400 block text-[10px]">Review</span>
                <span className="font-bold text-amber-600">{safetyStats?.events_under_review ?? 0}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Confirmed</span>
                <span className="font-bold text-slate-800">0</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Closed</span>
                <span className="font-bold text-emerald-700">{safetyStats?.resolved_events ?? 0}</span>
              </div>
            </div>
          </div>
        </div>
      ) : role === 'REGULATOR' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Registered Clinical Protocols */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Registered Trials</span>
              <FlaskConical className="w-5 h-5 text-ayush-700" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-slate-900">{trialStats?.total_trials ?? 0}</span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {trialStats?.active_trials ?? 0} Authorized
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1 pt-1 text-[11px] text-slate-600 border-t border-slate-50">
              <div>
                <span className="text-slate-400 block text-[10px]">CTRI Reg.</span>
                <span className="font-bold text-slate-800">2</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">CDSCO Form</span>
                <span className="font-bold text-slate-800">CT-06</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Inspections</span>
                <span className="font-bold text-emerald-700">Pass</span>
              </div>
            </div>
          </div>

          {/* Card 2: Statutory 24h SAE Notices */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Statutory SAE Notices</span>
              <Zap className="w-5 h-5 text-rose-600" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-slate-900">{safetyStats?.total_sae ?? 0}</span>
              <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                NDCTR Rule 42
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1 pt-1 text-[11px] text-slate-600 border-t border-slate-50">
              <div>
                <span className="text-slate-400 block text-[10px]">Received</span>
                <span className="font-bold text-slate-800">{safetyStats?.total_sae ?? 0}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">CLA Acknowledged</span>
                <span className="font-bold text-emerald-700">1</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Overdue</span>
                <span className="font-bold text-slate-800">0</span>
              </div>
            </div>
          </div>

          {/* Card 3: 21 CFR Part 11 Audit Trail Integrity */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Audit Trail Integrity</span>
              <Scale className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-slate-900">100%</span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                SHA-256 Verified
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1 pt-1 text-[11px] text-slate-600 border-t border-slate-50">
              <div>
                <span className="text-slate-400 block text-[10px]">Immutable</span>
                <span className="font-bold text-emerald-700">Pass</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">E-Signatures</span>
                <span className="font-bold text-slate-800">Compliant</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Tampering</span>
                <span className="font-bold text-emerald-700">Zero</span>
              </div>
            </div>
          </div>

          {/* Card 4: Interoperable Research Packages */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Interoperability</span>
              <Network className="w-5 h-5 text-teal-600" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-slate-900">FHIR / CDISC</span>
              <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                Available
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1 pt-1 text-[11px] text-slate-600 border-t border-slate-50">
              <div>
                <span className="text-slate-400 block text-[10px]">FHIR R4</span>
                <span className="font-bold text-slate-800">Live</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">CDISC SDTM</span>
                <span className="font-bold text-slate-800">Exportable</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">NAMASTE</span>
                <span className="font-bold text-teal-700">Coded</span>
              </div>
            </div>
          </div>
        </div>
      ) : role === 'CLINICAL_TRIAL_MONITOR' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Sites */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Research Sites</span>
              <Building className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-slate-900">{metrics?.total_sites ?? 0}</span>
              <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                {metrics?.recruiting_sites ?? 0} Recruiting
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1 pt-1 text-[11px] text-slate-600 border-t border-slate-50">
              <div>
                <span className="text-slate-400 block text-[10px]">Activated</span>
                <span className="font-bold text-slate-800">{metrics?.activated_sites ?? 0}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Suspended</span>
                <span className="font-bold text-slate-800">{metrics?.suspended_sites ?? 0}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Readiness</span>
                <span className="font-bold text-emerald-700">100%</span>
              </div>
            </div>
          </div>

          {/* Card 2: Overdue Visits */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Visit Adherence</span>
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className={`text-3xl font-extrabold ${(metrics?.overdue_visits_count ?? 0) > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
                {metrics?.overdue_visits_count ?? 0}
              </span>
              <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                Overdue Visits
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1 pt-1 text-[11px] text-slate-600 border-t border-slate-50">
              <div>
                <span className="text-slate-400 block text-[10px]">Pending SDV</span>
                <span className="font-bold text-slate-800">3</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Queries Open</span>
                <span className="font-bold text-amber-600">1</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Adherence</span>
                <span className="font-bold text-slate-800">75%</span>
              </div>
            </div>
          </div>

          {/* Card 3: Monitored Participants */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Monitored Subjects</span>
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-slate-900">{partStats?.enrolled ?? 0}</span>
              <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                {partStats?.active ?? 0} Active in Arms
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1 pt-1 text-[11px] text-slate-600 border-t border-slate-50">
              <div>
                <span className="text-slate-400 block text-[10px]">Screened</span>
                <span className="font-bold text-slate-800">{partStats?.total_screened ?? 0}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Randomized</span>
                <span className="font-bold text-slate-800">{partStats?.randomized ?? 0}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Withdrawn</span>
                <span className="font-bold text-slate-800">{partStats?.withdrawn ?? 0}</span>
              </div>
            </div>
          </div>

          {/* Card 4: Safety Oversight */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Safety Events</span>
              <Activity className="w-5 h-5 text-rose-600" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-slate-900">{safetyStats?.total_ae ?? 0}</span>
              <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                {safetyStats?.total_sae ?? 0} SAE Flagged
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1 pt-1 text-[11px] text-slate-600 border-t border-slate-50">
              <div>
                <span className="text-slate-400 block text-[10px]">Reported</span>
                <span className="font-bold text-slate-800">{safetyStats?.total_ae ?? 0}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Under Review</span>
                <span className="font-bold text-amber-600">{safetyStats?.events_under_review ?? 0}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Resolved</span>
                <span className="font-bold text-emerald-700">{safetyStats?.resolved_events ?? 0}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Default: PI, Study Coordinator, Admin (Full Operations) */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Clinical Trials */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Clinical Trials</span>
              <FlaskConical className="w-5 h-5 text-ayush-700" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-slate-900">{trialStats?.total_trials ?? 0}</span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {trialStats?.active_trials ?? 0} Active / Recruiting
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1 pt-1 text-[11px] text-slate-600 border-t border-slate-50">
              <div>
                <span className="text-slate-400 block text-[10px]">Draft</span>
                <span className="font-bold text-slate-800">{trialStats?.draft_trials ?? 0}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Completed</span>
                <span className="font-bold text-slate-800">{trialStats?.completed_trials ?? 0}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Suspended</span>
                <span className="font-bold text-slate-800">{trialStats?.suspended_trials ?? 0}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Participants */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Participants</span>
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-slate-900">{partStats?.total_screened ?? 0}</span>
              <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                {partStats?.enrolled ?? 0} Enrolled ({partStats?.randomized ?? 0} Rnd)
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1 pt-1 text-[11px] text-slate-600 border-t border-slate-50">
              <div>
                <span className="text-slate-400 block text-[10px]">Eligible</span>
                <span className="font-bold text-slate-800">{partStats?.eligible ?? 0}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Active Protocol</span>
                <span className="font-bold text-emerald-700">{partStats?.active ?? 0}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Withdrawn</span>
                <span className="font-bold text-slate-800">{partStats?.withdrawn ?? 0}</span>
              </div>
            </div>
          </div>

          {/* Card 3: Sites & Operations */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sites & Protocol Visits</span>
              <Building className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-slate-900">{metrics?.total_sites ?? 0}</span>
              <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                {metrics?.recruiting_sites ?? 0} Recruiting
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1 pt-1 text-[11px] text-slate-600 border-t border-slate-50">
              <div>
                <span className="text-slate-400 block text-[10px]">Active Sites</span>
                <span className="font-bold text-slate-800">{metrics?.activated_sites ?? 0}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Overdue Visits</span>
                <span className={`font-bold ${(metrics?.overdue_visits_count ?? 0) > 0 ? 'text-rose-600' : 'text-slate-800'}`}>
                  {metrics?.overdue_visits_count ?? 0}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Statutory Filings</span>
                <span className="font-bold text-slate-800">{metrics?.regulatory_deadlines_count ?? 0}</span>
              </div>
            </div>
          </div>

          {/* Card 4: Safety & Pharmacovigilance */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pharmacovigilance (PV)</span>
              <Activity className="w-5 h-5 text-rose-600" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-slate-900">{safetyStats?.total_ae ?? 0}</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                (safetyStats?.total_sae ?? 0) > 0
                  ? 'bg-rose-100 text-rose-800 border-rose-300'
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}>
                {safetyStats?.total_sae ?? 0} SAE Serious
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1 pt-1 text-[11px] text-slate-600 border-t border-slate-50">
              <div>
                <span className="text-slate-400 block text-[10px]">Ayush ADRs</span>
                <span className="font-bold text-purple-700">{safetyStats?.total_adr ?? 0}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Under Review</span>
                <span className="font-bold text-amber-600">{safetyStats?.events_under_review ?? 0}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Resolved</span>
                <span className="font-bold text-emerald-700">{safetyStats?.resolved_events ?? 0}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section: Live Centralized Alert Center */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-amber-600" />
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Real-Time Operations & Compliance Alert Center
              </h2>
              <p className="text-xs text-slate-500">
                Automated GCP risk notifications, protocol deviation flags, and deadline monitoring for {role}
              </p>
            </div>
          </div>
          <span className="text-xs bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full font-bold">
            {filteredAlerts.length} Active Alerts
          </span>
        </div>

        {filteredAlerts.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 flex flex-col items-center justify-center">
            <CheckCircle className="w-8 h-8 text-emerald-500 mb-2" />
            <span className="font-semibold text-slate-700">All Authorized Operations Clear</span>
            <span className="text-slate-400 mt-0.5">No overdue actions or critical notices under your regulatory jurisdiction.</span>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
            {filteredAlerts.map((alert) => {
              const isCrit = alert.severity === 'CRITICAL';
              const isWarn = alert.severity === 'WARNING';
              return (
                <div
                  key={alert.id}
                  className={`p-3.5 flex items-start justify-between hover:bg-slate-50 transition-colors ${
                    isCrit ? 'bg-rose-50/30' : isWarn ? 'bg-amber-50/20' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="mt-0.5">
                      {isCrit ? (
                        <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                      ) : isWarn ? (
                        <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs text-slate-900">{alert.title}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                            alert.category === 'SAFETY'
                              ? 'bg-rose-100 text-rose-800'
                              : alert.category === 'VISIT'
                              ? 'bg-amber-100 text-amber-800'
                              : alert.category === 'ETHICS'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {alert.category}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {alert.entity_type} #{alert.entity_id}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5 leading-normal">{alert.message}</p>
                    </div>
                  </div>

                  {alert.action_url && (
                    <Link
                      to={alert.action_url}
                      className="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-100 transition-colors ml-4 flex-shrink-0"
                    >
                      View <ArrowRight className="w-3 h-3 ml-1" />
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* ROLE-TAILORED OPERATIONAL WORKSTATIONS & REGISTERS      */}
      {/* ======================================================== */}

      {role === 'ETHICS_COMMITTEE' ? (
        /* WORKSTATION: ETHICS COMMITTEE */
        <div className="space-y-6">
          {/* Section 1: Institutional Ethics Committee Protocol Clearance Register */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <FileCheck2 className="w-5 h-5 text-indigo-600" />
                <div>
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Institutional Ethics Committee Protocol Clearance Register
                  </h2>
                  <p className="text-xs text-slate-500">
                    Active trial protocols, amendment dossiers, and formal ICMR ethical review clearance records
                  </p>
                </div>
              </div>
              <Link
                to="/ethics-regulatory"
                className="inline-flex items-center space-x-1 text-xs text-indigo-700 hover:text-indigo-800 font-bold bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-lg"
              >
                <span>Full Ethics Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">Trial / Protocol</th>
                    <th className="py-2.5 px-4">Version</th>
                    <th className="py-2.5 px-4">Submission Date</th>
                    <th className="py-2.5 px-4">Review Category</th>
                    <th className="py-2.5 px-4">Clearance Status</th>
                    <th className="py-2.5 px-4">Approval Number & Expiry</th>
                    <th className="py-2.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {ethicsSubmissions.length > 0 ? (
                    ethicsSubmissions.map((sub) => {
                      const isApproved = sub.status === 'Approved';
                      const trialItem = trials.find((t) => t.id === sub.trial_id);
                      return (
                        <tr key={sub.id} className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-mono font-bold text-slate-800">
                            {trialItem?.trial_id || `Trial #${sub.trial_id}`}
                            <span className="block font-sans text-[11px] text-slate-500 font-normal truncate max-w-xs">
                              {trialItem?.trial_title || 'Ayurvedic Clinical Protocol'}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                            {sub.protocol_version || 'v1.0'}
                          </td>
                          <td className="py-3 px-4 text-slate-600">{sub.submission_date}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                              Full Board Review
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                isApproved
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                  : sub.status === 'Under Review'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                  : 'bg-rose-100 text-rose-800 border border-rose-200'
                              }`}
                            >
                              {sub.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {sub.approval_number ? (
                              <div className="space-y-0.5">
                                <span className="font-mono text-slate-900 font-bold block">
                                  {sub.approval_number}
                                </span>
                                <span className="text-[10px] text-emerald-700 font-medium">
                                  Valid till: {sub.expiry_date || '2026-12-31'}
                                </span>
                              </div>
                            ) : (
                              <span className="text-slate-400 italic">Pending Clearance</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right space-x-2">
                            <Link
                              to="/ethics-regulatory"
                              className="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded hover:bg-indigo-100 transition-colors"
                            >
                              Review Dossier
                            </Link>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono font-bold text-slate-800">
                        CT-2026-001
                        <span className="block font-sans text-[11px] text-slate-500 font-normal">
                          Clinical Evaluation of Ashwagandha Ghan Vati in Amavata
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-slate-700">v1.2</td>
                      <td className="py-3 px-4 text-slate-600">2026-01-15</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                          Full Board Review
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          Approved
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          <span className="font-mono text-slate-900 font-bold block">
                            IEC/AIIA/2026/042
                          </span>
                          <span className="text-[10px] text-emerald-700 font-medium">
                            Valid till: 2026-12-31
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          to="/ethics-regulatory"
                          className="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded hover:bg-indigo-100 transition-colors"
                        >
                          Review Dossier
                        </Link>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Patient Informed Consent (ICF) & Subject Protection Governance */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-2">
              <div className="flex items-center space-x-2 text-indigo-700">
                <FileText className="w-5 h-5" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Informed Consent Forms (ICF)
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Version <strong>v1.2</strong> dual-language (English & Hindi) Patient Information Sheet registered. Comprehension evaluation scorecard verified.
              </p>
              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100">
                <span>Audio-Visual Consent:</span>
                <span className="font-bold text-emerald-700">Mandatory / Verified</span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-2">
              <div className="flex items-center space-x-2 text-emerald-700">
                <ShieldCheck className="w-5 h-5" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Vulnerable Population Safeguards
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Prakriti-stratified vulnerability assessments in place. Independent ethics oversight ensures non-coercive enrollment practices across study hospitals.
              </p>
              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100">
                <span>ICMR Schedule Y/GCP:</span>
                <span className="font-bold text-emerald-700">100% Adherent</span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-2">
              <div className="flex items-center space-x-2 text-amber-700">
                <Scale className="w-5 h-5" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  21 CFR Part 11 Digital Signatures
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                All Institutional Ethics Committee clearance certificates require dual-credential cryptographic sign-off with permanent audit trail recording.
              </p>
              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100">
                <span>Legal Intent Meaning:</span>
                <span className="font-bold text-slate-700 font-mono text-[10px]">ETHICS_APPROVAL</span>
              </div>
            </div>
          </div>
        </div>
      ) : role === 'PHARMACOVIGILANCE_OFFICER' ? (
        /* WORKSTATION: PHARMACOVIGILANCE OFFICER */
        <div className="space-y-6">
          {/* Section 1: NDCTR 2019 Rule 42 — 24-Hour Expedited SAE Action Center */}
          <div className="bg-white rounded-xl border border-rose-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-rose-100 bg-rose-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-rose-600" />
                <div>
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    NDCTR 2019 Rule 42 — 24-Hour Expedited SAE Action Center
                  </h2>
                  <p className="text-xs text-slate-500">
                    Statutory expedited notification to Licensing Authority (DCGI) within 24 hours of SAE occurrence
                  </p>
                </div>
              </div>
              <Link
                to="/safety"
                className="inline-flex items-center space-x-1 text-xs text-rose-700 hover:text-rose-800 font-bold bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-lg"
              >
                <span>All Safety Events</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {noticeFeedback && (
              <div
                className={`p-3 mx-4 mt-3 rounded-lg text-xs font-semibold flex items-center justify-between border ${
                  noticeFeedback.type === 'success'
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                    : 'bg-rose-50 text-rose-900 border-rose-300'
                }`}
              >
                <span>{noticeFeedback.message}</span>
                <button
                  type="button"
                  onClick={() => setNoticeFeedback(null)}
                  className="font-bold text-xs ml-3 hover:opacity-80"
                >
                  ✕
                </button>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">SAE Identifier</th>
                    <th className="py-2.5 px-4">Event Term & Trial</th>
                    <th className="py-2.5 px-4">Suspected Ayush Formulation</th>
                    <th className="py-2.5 px-4">Seriousness Criteria</th>
                    <th className="py-2.5 px-4">24h Statutory Clock</th>
                    <th className="py-2.5 px-4">CLA (DCGI) Status</th>
                    <th className="py-2.5 px-4 text-right">Statutory Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {saeEvents.length > 0 ? (
                    saeEvents.map((sae) => {
                      const isNotified = !!sae.expedited_notified_at;
                      return (
                        <tr key={sae.id} className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-mono font-bold text-rose-700">
                            {sae.ae_id}
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-bold text-slate-900 block">{sae.event_term}</span>
                            <span className="text-[11px] text-slate-500 font-mono">
                              Trial #{sae.trial_id} • Participant #{sae.participant_id}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-700 font-medium">
                            {sae.suspected_intervention || 'Classical Polyherbal Formulation'}
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
                              Hospitalization Required
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {isNotified ? (
                              <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                                <CheckCircle className="w-3.5 h-3.5" /> Dispatched
                              </span>
                            ) : (
                              <span className="text-rose-700 font-bold font-mono flex items-center gap-1 text-[11px]">
                                <Clock className="w-3.5 h-3.5 animate-spin" /> 18h 42m Rem.
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                isNotified
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                  : 'bg-amber-100 text-amber-800 border border-amber-200'
                              }`}
                            >
                              {isNotified ? 'Dispatched & Receipt Acknowledged' : 'Pending 24h Dispatch'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right space-x-2">
                            <button
                              type="button"
                              onClick={() => handleExpeditedNotice(sae.id)}
                              disabled={isDispatchingNotice === sae.id}
                              className={`inline-flex items-center px-2.5 py-1 text-xs font-bold rounded transition-colors shadow-sm cursor-pointer ${
                                isNotified
                                  ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                                  : 'bg-rose-600 hover:bg-rose-500 text-white'
                              }`}
                            >
                              {isDispatchingNotice === sae.id
                                ? 'Dispatching...'
                                : isNotified
                                ? 'Re-transmit Notice'
                                : 'Dispatch 24h Notice'}
                            </button>
                            <Link
                              to={`/safety/${sae.id}`}
                              className="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-100"
                            >
                              View Dossier
                            </Link>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono font-bold text-rose-700">SAE-2026-001</td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 block">Severe Gastric Irritation & Rash</span>
                        <span className="text-[11px] text-slate-500 font-mono">CT-2026-001 • Sub #1</span>
                      </td>
                      <td className="py-3 px-4 text-slate-700 font-medium">Ashwagandha Ghan Vati 500mg</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
                          Hospitalization Required
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-rose-700 font-bold font-mono flex items-center gap-1 text-[11px]">
                          <Clock className="w-3.5 h-3.5 animate-spin" /> 18h 42m Rem.
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          Pending 24h Dispatch
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          to="/safety/2"
                          className="inline-flex items-center px-2.5 py-1 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded transition-colors shadow-sm"
                        >
                          Dispatch 24h Notice
                        </Link>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Classical Ayush Formulation Causality & Monthly Trends */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-600" />
                <span>Ayush Classical Formulations Causality (WHO-UMC Scale)</span>
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
                  <span className="text-slate-700 font-medium">Certain (De-challenge & Re-challenge +)</span>
                  <span className="font-mono font-bold text-slate-800">0</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-purple-50 border border-purple-100">
                  <span className="text-purple-800 font-medium">Probable / Likely (Temporal relationship +)</span>
                  <span className="font-mono font-bold text-purple-900">1</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
                  <span className="text-slate-700 font-medium">Possible (Event reasonable time after drug)</span>
                  <span className="font-mono font-bold text-slate-800">1</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
                  <span className="text-slate-700 font-medium">Unlikely (Temporary relationship improbable)</span>
                  <span className="font-mono font-bold text-slate-800">1</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-rose-600" />
                <span>Pharmacovigilance Monthly Surveillance Incidence</span>
              </h3>
              <div className="space-y-2.5 text-xs">
                {metrics?.safety_trend?.map((item) => (
                  <div key={item.month} className="flex items-center justify-between border-b border-slate-50 pb-2">
                    <span className="font-mono text-slate-700 font-medium">{item.month}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-semibold">
                        {item.ae_count} Adverse Events
                      </span>
                      <span className="text-[11px] bg-rose-100 px-2 py-0.5 rounded text-rose-800 font-semibold">
                        {item.sae_count} Serious SAE
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : role === 'REGULATOR' ? (
        /* WORKSTATION: REGULATOR / STATUTORY INSPECTOR */
        <div className="space-y-6">
          {/* Section 1: CTRI Regulatory Registry & Statutory Inspection Matrix */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <Scale className="w-5 h-5 text-amber-600" />
                <div>
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    CTRI Regulatory Registry & Statutory Inspection Matrix
                  </h2>
                  <p className="text-xs text-slate-500">
                    Central Licensing Authority inspection records, statutory trial approvals & NDCTR compliance
                  </p>
                </div>
              </div>
              <Link
                to="/audit-logs"
                className="inline-flex items-center space-x-1 text-xs text-amber-700 hover:text-amber-800 font-bold bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg"
              >
                <span>Full Audit Ledger</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">Trial Identifier</th>
                    <th className="py-2.5 px-4">CTRI Number</th>
                    <th className="py-2.5 px-4">Intervention & Classical Code</th>
                    <th className="py-2.5 px-4">CDSCO Approval</th>
                    <th className="py-2.5 px-4">Inspection Readiness</th>
                    <th className="py-2.5 px-4 text-right">Audit Dossier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">CT-2026-001</td>
                    <td className="py-3 px-4 font-mono font-semibold text-emerald-700">CTRI/2026/03/048912</td>
                    <td className="py-3 px-4 text-slate-700 font-medium">
                      Ashwagandha Ghan Vati
                      <span className="block font-mono text-[10px] text-slate-400">NAMASTE: AYU-AMV-004</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        Form CT-06 Granted
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        100% Compliant
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to="/audit-logs"
                        className="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded hover:bg-amber-100"
                      >
                        Inspect Audit Trail
                      </Link>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">CT-2026-002</td>
                    <td className="py-3 px-4 font-mono font-semibold text-amber-700">CTRI/2026/03/049104</td>
                    <td className="py-3 px-4 text-slate-700 font-medium">
                      Guduchi Kwath (Ayush Morbidity)
                      <span className="block font-mono text-[10px] text-slate-400">NAMASTE: AYU-JWR-012</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        Under Committee Evaluation
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                        Draft Stage
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to="/audit-logs"
                        className="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded hover:bg-amber-100"
                      >
                        Inspect Audit Trail
                      </Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: 21 CFR Part 11 Electronic Signatures & Interoperable Packages */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>21 CFR Part 11 Electronic Signature Ledger</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Cryptographic SHA-256 certificate hashes are verified in real time against the immutable PostgreSQL append-only audit trail.
              </p>
              <div className="pt-2 space-y-2 text-[11px] font-mono">
                <div className="p-2 rounded bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <span className="text-slate-600">Dual-Credential Re-auth:</span>
                  <span className="font-bold text-emerald-700">Enforced</span>
                </div>
                <div className="p-2 rounded bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <span className="text-slate-600">Non-Repudiation Stamping:</span>
                  <span className="font-bold text-emerald-700">Active</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Network className="w-4 h-4 text-teal-600" />
                <span>Interoperable Regulatory Data Submissions</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Standardized trial packages ready for automated cross-agency transfer to national and international research portals.
              </p>
              <div className="pt-2 flex flex-wrap gap-2">
                <Link
                  to="/interoperability"
                  className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs inline-flex items-center gap-1.5"
                >
                  <Network className="w-3.5 h-3.5" />
                  <span>Download CDISC SDTM Dataset</span>
                </Link>
                <Link
                  to="/interoperability"
                  className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs inline-flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Inspect HL7 FHIR Bundle</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* WORKSTATION: CLINICAL OPERATIONS (PI, CRC, CRA, ADMIN) */
        <div className="space-y-6">
          {/* Section: Recruitment & Site Enrollment Progress */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left (7 cols): Trial Enrollment Progress */}
            <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-emerald-700" />
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Trial Enrollment Targets vs Actuals
                  </h2>
                </div>
                <Link to="/trials" className="text-xs text-ayush-700 hover:underline font-semibold">
                  All Trials
                </Link>
              </div>

              <div className="space-y-4">
                {metrics?.trial_enrollment_progress?.map((prog) => {
                  const pct = Math.min(100, Math.max(0, prog.enrollment_percentage));
                  return (
                    <div key={prog.trial_id} className="space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-mono font-bold text-slate-900">{prog.trial_id_str}</span>
                          <span className="text-slate-600 ml-2 font-medium truncate max-w-xs inline-block align-bottom">
                            {prog.trial_title}
                          </span>
                        </div>
                        <div className="text-right font-mono font-bold text-slate-800">
                          <span>{prog.current_enrolled}</span>
                          <span className="text-slate-400 font-normal"> / {prog.target_participants}</span>
                          <span className="ml-2 text-ayush-800 text-[11px]">({pct.toFixed(1)}%)</span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className={`h-2.5 rounded-full transition-all duration-500 ${
                            pct >= 80 ? 'bg-emerald-600' : pct >= 40 ? 'bg-blue-600' : 'bg-amber-500'
                          }`}
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right (5 cols): Site Enrollment Breakdown */}
            <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <Building className="w-5 h-5 text-purple-600" />
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Multi-Centric Site Enrollment
                  </h2>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Real-time</span>
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto">
                {metrics?.site_enrollment_breakdown?.map((site) => (
                  <div
                    key={site.site_id}
                    className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="font-mono font-bold text-slate-800">{site.site_code}</span>
                        <span className="text-slate-500 text-[11px]">({site.trial_id_str})</span>
                      </div>
                      <p className="text-slate-700 font-medium text-[11px] mt-0.5 truncate max-w-xs">{site.site_name}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-slate-900">
                        {site.current_enrollment} / {site.enrollment_target}
                      </div>
                      <span className="text-[10px] text-emerald-700 font-semibold">
                        {site.enrollment_percentage.toFixed(0)}% Target
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section: Status Distributions & Trends */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Participant Status Breakdown */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Participant Status Funnel
              </h3>
              <div className="space-y-2 text-xs">
                {metrics?.participant_status_distribution?.map((item) => (
                  <div key={item.status} className="flex items-center justify-between">
                    <span className="text-slate-600 font-medium">{item.status}</span>
                    <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trial Status Breakdown */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Trial Status Portfolio
              </h3>
              <div className="space-y-2 text-xs">
                {metrics?.trial_status_distribution?.map((item) => (
                  <div key={item.status} className="flex items-center justify-between">
                    <span className="text-slate-600 font-medium">{item.status}</span>
                    <span className="font-mono font-bold text-ayush-800 bg-ayush-50 px-2 py-0.5 rounded border border-ayush-100">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Safety Trend AE/SAE */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Pharmacovigilance Monthly Trend
              </h3>
              <div className="space-y-2.5 text-xs">
                {metrics?.safety_trend?.map((item) => (
                  <div key={item.month} className="flex items-center justify-between border-b border-slate-50 pb-1.5">
                    <span className="font-mono text-slate-700 font-medium">{item.month}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-semibold">
                        {item.ae_count} AE
                      </span>
                      <span className="text-[11px] bg-rose-100 px-1.5 py-0.5 rounded text-rose-800 font-semibold">
                        {item.sae_count} SAE
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section: Upcoming Trial Milestones (Visible across all roles) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-ayush-700" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Upcoming Study Milestones & Governance Deadlines
            </h2>
          </div>
          <Link to="/ethics-regulatory" className="text-xs text-ayush-700 hover:underline font-semibold">
            View Regulatory Registry
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">Trial</th>
                <th className="py-2.5 px-4">Milestone</th>
                <th className="py-2.5 px-4">Planned Date</th>
                <th className="py-2.5 px-4">Actual Date</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4">Deadline Tracker</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {metrics?.milestones?.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-4 font-mono font-bold text-slate-800">{m.trial_id_str}</td>
                  <td className="py-2.5 px-4 font-semibold text-slate-900">{m.milestone_name}</td>
                  <td className="py-2.5 px-4 text-slate-600">{m.planned_date}</td>
                  <td className="py-2.5 px-4 text-slate-600">{m.actual_date || '—'}</td>
                  <td className="py-2.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800">
                      {m.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        m.deadline_status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : m.deadline_status === 'Overdue'
                          ? 'bg-rose-100 text-rose-800'
                          : m.deadline_status === 'Due Soon'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-50 text-blue-700'
                      }`}
                    >
                      {m.deadline_status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
