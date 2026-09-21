import React, { useState, useEffect } from 'react';
import { interopService } from '../services/interopService';
import { trialService } from '../services/trialService';
import type { ClinicalTrialListItem } from '../types';
import {
  Network,
  CheckCircle,
  Database,
  Code,
  ArrowDownToLine,
  RefreshCw,
  FileCode,
  FileText,
  Copy,
  Check,
  Loader2
} from 'lucide-react';
import { exportDataToJson, generateClinicalReportPdf } from '../utils/pdfGenerator';

export const InteroperabilityPage: React.FC = () => {
  const [trials, setTrials] = useState<ClinicalTrialListItem[]>([]);
  const [selectedTrialId, setSelectedTrialId] = useState<number>(1);
  const [selectedResourceType, setSelectedResourceType] = useState<string>('Patient');
  const [resourceId, setResourceId] = useState<number>(1);
  const [fhirData, setFhirData] = useState<any>(null);
  const [isFetchingFhir, setIsFetchingFhir] = useState(false);
  const [fhirError, setFhirError] = useState<string | null>(null);

  // CDISC loading states
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [copiedFhir, setCopiedFhir] = useState(false);

  // Load trials once on mount
  useEffect(() => {
    trialService
      .getTrials({ limit: 50 })
      .then((list: ClinicalTrialListItem[]) => {
        setTrials(list);
        if (list.length > 0) setSelectedTrialId(list[0].id);
      })
      .catch(console.error);
  }, []);

  // Re-fetch FHIR resource whenever type or ID changes
  useEffect(() => {
    fetchFhir(selectedResourceType, resourceId);
  }, [selectedResourceType, resourceId]);

  const fetchFhir = async (resType: string, id: number) => {
    try {
      setIsFetchingFhir(true);
      setFhirError(null);
      const data = await interopService.getFhirResource(resType, id);
      setFhirData(data);
    } catch (err: any) {
      console.error('Failed to fetch FHIR resource', err);
      setFhirError(err?.response?.data?.detail || 'Failed to fetch FHIR resource');
      setFhirData(null);
    } finally {
      setIsFetchingFhir(false);
    }
  };

  const parseCsvToRows = (csvText: string): { headers: string[]; rows: string[][] } => {
    const lines = csvText.trim().split('\n').filter(Boolean);
    if (lines.length === 0) return { headers: [], rows: [] };
    const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
    const rows = lines.slice(1).map((l) => l.split(',').map((c) => c.trim().replace(/^"|"$/g, '')));
    return { headers, rows };
  };

  const handleDownloadCdiscCsv = async (domain: string) => {
    const actionKey = `${domain}_csv`;
    try {
      setLoadingAction(actionKey);
      await interopService.downloadCdiscDomain(domain, selectedTrialId);
    } catch (err) {
      alert(`Failed to download CDISC CSV for domain ${domain}`);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDownloadCdiscJson = async (domain: string) => {
    const actionKey = `${domain}_json`;
    try {
      setLoadingAction(actionKey);
      const csvText = await interopService.getCdiscDomainText(domain, selectedTrialId);
      const { headers, rows } = parseCsvToRows(csvText);

      const jsonRecords = rows.map((row) => {
        const obj: Record<string, string> = {};
        headers.forEach((h, idx) => {
          obj[h] = row[idx] ?? '';
        });
        return obj;
      });

      const exportPayload = {
        standard: 'CDISC SDTM v1.7 / ODM-XML v1.3.2 Compatible',
        domain: domain.toUpperCase(),
        trial_id: selectedTrialId,
        exported_at: new Date().toISOString(),
        records_count: jsonRecords.length,
        records: jsonRecords
      };

      exportDataToJson(exportPayload, `CDISC_${domain.toUpperCase()}_Trial_${selectedTrialId}.json`);
    } catch (err) {
      console.error(`Failed to export CDISC JSON for ${domain}`, err);
      alert(`Failed to export CDISC JSON for domain ${domain}`);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDownloadCdiscPdf = async (domain: string, domainName: string) => {
    const actionKey = `${domain}_pdf`;
    try {
      setLoadingAction(actionKey);
      const csvText = await interopService.getCdiscDomainText(domain, selectedTrialId);
      const { headers, rows } = parseCsvToRows(csvText);

      const activeTrial = trials.find((t) => t.id === selectedTrialId);
      const trialCode = activeTrial?.trial_id || `Trial #${selectedTrialId}`;

      await generateClinicalReportPdf(
        `CDISC SDTM TABULATION — DOMAIN ${domain.toUpperCase()} (${domainName.toUpperCase()})`,
        `Study Reference: ${trialCode} • Standard: CDISC SDTM Implementation Guide v3.3`,
        [
          {
            heading: 'Regulatory Dataset Metadata',
            keyValue: {
              'CDISC Domain': domain.toUpperCase(),
              'Domain Full Name': domainName,
              'Study Protocol ID': trialCode,
              'Total Exported Records': rows.length,
              'De-identification Standard': 'HIPAA Safe-Harbor & GCP E6(R2)',
              'Statutory Filing Mode': 'CDSCO / CTRI Electronic Submission'
            }
          },
          {
            heading: `Tabulated ${domain.toUpperCase()} Dataset Records`,
            table: {
              headers: headers.length > 0 ? headers : ['FIELD', 'VALUE'],
              rows: rows.slice(0, 20) // Show up to 20 representative rows in PDF
            }
          }
        ],
        `CDISC_${domain.toUpperCase()}_Trial_${selectedTrialId}.pdf`
      );
    } catch (err) {
      console.error(`Failed to generate CDISC PDF for ${domain}`, err);
      alert(`Failed to generate CDISC PDF for domain ${domain}`);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleExportFhirJson = () => {
    if (!fhirData) return;
    exportDataToJson(fhirData, `HL7_FHIR_${selectedResourceType}_ID_${resourceId}.json`);
  };

  const handleExportFhirPdf = async () => {
    if (!fhirData) return;
    try {
      setLoadingAction('fhir_pdf');
      await generateClinicalReportPdf(
        `HL7 FHIR RELEASE 4 RESOURCE DOSSIER — ${selectedResourceType.toUpperCase()}`,
        `Resource Identifier: ${fhirData.id || resourceId} • FHIR Version: 4.0.1 (Research & Observational Data)`,
        [
          {
            heading: 'FHIR Resource Header & Identity',
            keyValue: {
              'Resource Type': fhirData.resourceType || selectedResourceType,
              'Resource ID': String(fhirData.id || resourceId),
              'FHIR Profile': fhirData.meta?.profile?.[0] || 'http://hl7.org/fhir/StructureDefinition/' + selectedResourceType,
              'Last Updated': fhirData.meta?.lastUpdated || new Date().toISOString(),
              'Status / Active': String(fhirData.status ?? fhirData.active ?? 'Active')
            }
          },
          {
            heading: 'Full Formatted JSON-LD Specification',
            content: JSON.stringify(fhirData, null, 2)
          }
        ],
        `HL7_FHIR_${selectedResourceType}_${resourceId}.pdf`
      );
    } catch (err) {
      console.error('Failed to generate FHIR PDF:', err);
      alert('Failed to generate FHIR PDF. Please try again.');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleCopyFhir = () => {
    if (!fhirData) return;
    navigator.clipboard.writeText(JSON.stringify(fhirData, null, 2));
    setCopiedFhir(true);
    setTimeout(() => setCopiedFhir(false), 2000);
  };

  const fhirResources = [
    { type: 'Patient', desc: 'De-identified demographic & research identity' },
    { type: 'Encounter', desc: 'Clinical study protocol visits & monitoring' },
    { type: 'Condition', desc: 'Study indication & diagnosed disease condition' },
    { type: 'Medication', desc: 'Ayurvedic formulations & botanical intervention' },
    { type: 'Observation', desc: 'Screening evaluation & clinical baseline values' },
    { type: 'Consent', desc: 'Informed consent documentation & approval dates' }
  ];

  const cdiscDomains = [
    { code: 'DM', name: 'Demographics', desc: 'Core subject demographics (AGE, SEX, COUNTRY, ARMCD)' },
    { code: 'SV', name: 'Subject Visits', desc: 'Planned and actual study protocol visits (VISITNUM, SVSTDTC)' },
    { code: 'AE', name: 'Adverse Events', desc: 'Safety surveillance & pharmacovigilance (AETERM, AESEV, AESER, AEREL)' },
    { code: 'TS', name: 'Trial Summary', desc: 'Study metadata, sponsor details, protocol info (TSPARMCD, TSVAL)' },
    { code: 'TV', name: 'Trial Visits', desc: 'Protocol schedule of visit days and timeframes (VISITNUM, VISIT)' }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-slate-500 mb-1">
            <span>Interoperability Standards</span>
            <span>/</span>
            <span className="font-semibold text-slate-800">FHIR R4 & CDISC SDTM</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Network className="w-6 h-6 text-emerald-700" />
            Healthcare Data Interoperability
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Export study data in CDISC SDTM v1.7 format and access synthetic clinical records via HL7 FHIR Release 4 REST endpoints.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1.5 bg-emerald-950/80 border border-emerald-700/70 text-emerald-300 text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            FHIR R4 & CDISC SDTM Ready
          </span>
        </div>
      </div>

      {/* Grid: 2 High-Contrast Modules (CDISC Export on Left, FHIR Viewer on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 cols): CDISC SDTM Export Section */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 rounded-2xl border border-slate-700/90 p-5 sm:p-6 shadow-xl space-y-5 text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-lg bg-emerald-950/80 text-emerald-400 border border-emerald-800/80">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                    CDISC SDTM Dataset Generator
                  </h2>
                  <p className="text-[11px] text-slate-400">Multi-Format Regulatory Data Packages</p>
                </div>
              </div>
              <div className="flex items-center space-x-1 font-mono text-[10px]">
                <span className="bg-slate-800 text-slate-300 border border-slate-700 px-1.5 py-0.5 rounded font-bold">CSV</span>
                <span className="bg-slate-800 text-amber-300 border border-slate-700 px-1.5 py-0.5 rounded font-bold">JSON</span>
                <span className="bg-slate-800 text-emerald-300 border border-slate-700 px-1.5 py-0.5 rounded font-bold">PDF</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Export standard Clinical Data Interchange Standards Consortium (CDISC) Study Data Tabulation Model (SDTM) datasets in <strong>CSV</strong>, <strong>JSON</strong>, and <strong>PDF (HTML to Canvas)</strong> formats for regulatory submissions.
            </p>

            {/* Trial Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Select Clinical Trial</label>
              <select
                value={selectedTrialId}
                onChange={(e) => setSelectedTrialId(Number(e.target.value))}
                className="w-full text-xs p-2.5 border border-slate-700 rounded-lg bg-slate-950 text-white font-medium focus:ring-1 focus:ring-emerald-500"
              >
                {trials.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.trial_id} - {t.trial_title.substring(0, 38)}...
                  </option>
                ))}
              </select>
            </div>

            {/* Domain Download Cards */}
            <div className="space-y-3 pt-1">
              {cdiscDomains.map((domain) => {
                const isCsvLoading = loadingAction === `${domain.code}_csv`;
                const isJsonLoading = loadingAction === `${domain.code}_json`;
                const isPdfLoading = loadingAction === `${domain.code}_pdf`;

                return (
                  <div
                    key={domain.code}
                    className="p-3.5 bg-slate-800/90 hover:bg-slate-800 rounded-xl border border-slate-700/80 transition-all space-y-2.5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-xs bg-slate-950 text-emerald-400 border border-slate-800 px-2 py-0.5 rounded">
                            {domain.code}
                          </span>
                          <span className="text-xs font-bold text-white">{domain.name}</span>
                        </div>
                        <p className="text-[11px] text-slate-400">{domain.desc}</p>
                      </div>
                    </div>

                    {/* 3 Export Options: CSV, JSON, PDF */}
                    <div className="flex items-center space-x-1.5 pt-1 border-t border-slate-700/60">
                      <button
                        type="button"
                        onClick={() => handleDownloadCdiscCsv(domain.code)}
                        disabled={!!loadingAction}
                        className="flex-1 inline-flex items-center justify-center py-1.5 px-2 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                        title="Download standard CSV"
                      >
                        {isCsvLoading ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                        ) : (
                          <ArrowDownToLine className="w-3.5 h-3.5 mr-1 text-slate-300" />
                        )}
                        <span>CSV</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDownloadCdiscJson(domain.code)}
                        disabled={!!loadingAction}
                        className="flex-1 inline-flex items-center justify-center py-1.5 px-2 bg-amber-950/80 hover:bg-amber-900 border border-amber-800/80 text-amber-300 rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                        title="Download structured JSON"
                      >
                        {isJsonLoading ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                        ) : (
                          <FileCode className="w-3.5 h-3.5 mr-1 text-amber-400" />
                        )}
                        <span>JSON</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDownloadCdiscPdf(domain.code, domain.name)}
                        disabled={!!loadingAction}
                        className="flex-1 inline-flex items-center justify-center py-1.5 px-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold shadow-xs transition-colors disabled:opacity-50"
                        title="Generate PDF via HTML-to-Canvas"
                      >
                        {isPdfLoading ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                        ) : (
                          <FileText className="w-3.5 h-3.5 mr-1 text-emerald-200" />
                        )}
                        <span>PDF</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-start space-x-2">
              <span className="text-emerald-400 font-bold">✓ Safe-Harbor:</span>
              <span>All exported SDTM records are synthetic and de-identified per GCP and HIPAA safe-harbor standards.</span>
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): Interactive FHIR R4 Inspector with PDF & JSON Export */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900 rounded-2xl border border-slate-700/90 p-5 sm:p-6 shadow-xl space-y-5 text-slate-100">
            <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-800 gap-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-lg bg-emerald-950/80 text-emerald-400 border border-emerald-800/80">
                  <Code className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                    HL7 FHIR Release 4 Resource Inspector
                  </h2>
                  <p className="text-[11px] text-slate-400">Clinical Data Exchange & Real-Time REST Queries</p>
                </div>
              </div>

              {/* Action Buttons: Export PDF, Export JSON, Copy JSON */}
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleExportFhirPdf}
                  disabled={!fhirData || loadingAction === 'fhir_pdf'}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-sm transition-colors disabled:opacity-50"
                  title="Generate official FHIR clinical document PDF via HTML-to-Canvas"
                >
                  {loadingAction === 'fhir_pdf' ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <FileText className="w-3.5 h-3.5" />
                  )}
                  <span>Export PDF</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportFhirJson}
                  disabled={!fhirData}
                  className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-800/80 rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                  title="Download JSON resource"
                >
                  <FileCode className="w-3.5 h-3.5 text-amber-400" />
                  <span>JSON</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyFhir}
                  disabled={!fhirData}
                  className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                  title="Copy JSON to clipboard"
                >
                  {copiedFhir ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedFhir ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Resource Type Tabs / Selector */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
              {fhirResources.map((res) => (
                <button
                  key={res.type}
                  onClick={() => {
                    setSelectedResourceType(res.type);
                    fetchFhir(res.type, resourceId);
                  }}
                  className={`p-2.5 rounded-xl text-center transition-all border text-xs font-bold ${
                    selectedResourceType === res.type
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-md ring-1 ring-emerald-400'
                      : 'bg-slate-800/90 text-slate-300 border-slate-700 hover:bg-slate-750 hover:text-white'
                  }`}
                >
                  {res.type}
                </button>
              ))}
            </div>

            {/* Request Bar */}
            <div className="flex items-center space-x-2 text-xs bg-slate-950 p-2 rounded-xl border border-slate-800">
              <span className="font-mono bg-emerald-950 text-emerald-300 border border-emerald-800/80 px-2 py-1 rounded font-bold">
                GET
              </span>
              <span className="font-mono text-slate-400 flex-1 truncate">
                /api/v1/fhir/{selectedResourceType}/{resourceId}
              </span>
              <div className="flex items-center space-x-1.5">
                <label className="text-slate-400 font-medium">ID:</label>
                <input
                  type="number"
                  min={1}
                  value={resourceId}
                  onChange={(e) => setResourceId(Number(e.target.value))}
                  className="w-14 p-1 border border-slate-700 rounded-lg text-center text-xs font-mono font-bold bg-slate-900 text-white"
                />
                <button
                  onClick={() => fetchFhir(selectedResourceType, resourceId)}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700"
                  title="Refresh Query"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* JSON Output Viewer */}
            <div className="relative">
              {isFetchingFhir ? (
                <div className="h-96 flex items-center justify-center bg-slate-950 rounded-xl text-emerald-400 text-xs font-mono border border-slate-800">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Loading FHIR R4 schema...
                </div>
              ) : fhirError ? (
                <div className="h-96 p-4 bg-rose-950/40 border border-rose-800 rounded-xl text-rose-300 text-xs font-mono">
                  {fhirError}
                </div>
              ) : (
                <pre className="h-96 p-4 bg-slate-950 text-emerald-400 rounded-xl overflow-auto text-[11px] font-mono leading-relaxed border border-slate-800 shadow-inner">
                  {JSON.stringify(fhirData, null, 2)}
                </pre>
              )}
            </div>

            {/* Specification Footer */}
            <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800">
              <span>Standard: HL7 FHIR v4.0.1 Specification</span>
              <span className="font-mono text-emerald-400">application/fhir+json</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteroperabilityPage;
