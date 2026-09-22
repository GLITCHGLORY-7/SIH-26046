import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { dashboardService } from '../services/dashboardService';
import { trialService } from '../services/trialService';
import { regulatoryService } from '../services/regulatoryService';
import { safetyService } from '../services/safetyService';
import type {
  DashboardMetricsResponse,
  ClinicalTrialListItem,
  EthicsSubmission,
  AdverseEvent
} from '../types';
import { RoleGovernanceCard } from '../components/RoleGovernanceCard';
import { RoleMatrixModal } from '../components/modals/RoleMatrixModal';
import { ResearcherDashboardView } from '../components/dashboard/ResearcherDashboardView';
import { InvestigatorDashboardView } from '../components/dashboard/InvestigatorDashboardView';
import { CoordinatorDashboardView } from '../components/dashboard/CoordinatorDashboardView';
import { EthicsTeamDashboardView } from '../components/dashboard/EthicsTeamDashboardView';
import { AdministratorDashboardView } from '../components/dashboard/AdministratorDashboardView';
import { getRoleDefinition } from '../data/rolesConfig';

export const DashboardPage: React.FC = () => {
  const { role } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetricsResponse | null>(null);
  const [trials, setTrials] = useState<ClinicalTrialListItem[]>([]);
  const [ethicsSubmissions, setEthicsSubmissions] = useState<EthicsSubmission[]>([]);
  const [saeEvents, setSaeEvents] = useState<AdverseEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMatrixModalOpen, setIsMatrixModalOpen] = useState(false);

  const roleDef = getRoleDefinition(role);

  const loadDashboard = useCallback(async () => {
    try {
      const promises: [
        Promise<DashboardMetricsResponse>,
        Promise<ClinicalTrialListItem[]>,
        Promise<EthicsSubmission[]>,
        Promise<AdverseEvent[]>
      ] = [
        dashboardService.getMetrics(),
        trialService.getTrials({ limit: 50 }),
        regulatoryService.getEthicsSubmissions().catch(() => []),
        safetyService.listEvents({ is_serious: true }).catch(() => [])
      ];

      const [m, tList, ethList, saeList] = await Promise.all(promises);
      setMetrics(m);
      setTrials(tList);
      setEthicsSubmissions(ethList || []);
      setSaeEvents(saeList || []);
    } catch (err) {
      console.error('Error loading dashboard data', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  if (isLoading && !metrics) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Prominent Role Governance & RBAC Scope Card (Access vs Restrictions) */}
      <RoleGovernanceCard onOpenMatrixModal={() => setIsMatrixModalOpen(true)} />

      {/* 2. Role-Specific Distinct Dashboard View */}
      {roleDef.canonicalKey === 'researcher' && (
        <ResearcherDashboardView metrics={metrics} trials={trials} />
      )}

      {roleDef.canonicalKey === 'investigator' && (
        <InvestigatorDashboardView
          metrics={metrics}
          trials={trials}
          saeEvents={saeEvents}
        />
      )}

      {roleDef.canonicalKey === 'coordinator' && (
        <CoordinatorDashboardView metrics={metrics} trials={trials} />
      )}

      {roleDef.canonicalKey === 'ethics' && (
        <EthicsTeamDashboardView
          ethicsSubmissions={ethicsSubmissions}
          trials={trials}
        />
      )}

      {roleDef.canonicalKey === 'admin' && (
        <AdministratorDashboardView metrics={metrics} trials={trials} />
      )}

      {/* 5-Role Architectural Matrix Showcase Modal */}
      <RoleMatrixModal
        isOpen={isMatrixModalOpen}
        onClose={() => setIsMatrixModalOpen(false)}
      />
    </div>
  );
};
