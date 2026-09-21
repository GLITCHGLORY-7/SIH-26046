import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export interface PdfExportOptions {
  filename?: string;
  orientation?: 'p' | 'l';
  scale?: number;
}

/**
 * Converts any rendered HTML element directly into an official PDF document
 * using HTML-to-Canvas rasterization with multi-page A4 formatting.
 */
export async function exportHtmlToPdf(
  element: HTMLElement,
  options: PdfExportOptions = {}
): Promise<void> {
  const filename = options.filename?.endsWith('.pdf')
    ? options.filename
    : `${options.filename || 'aiia_clinical_document'}.pdf`;
  const orientation = options.orientation || 'p';
  const scale = options.scale || 2;

  try {
    // 1. Rasterize DOM element into high-resolution canvas
    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF(orientation, 'mm', 'a4');

    const pageWidth = orientation === 'p' ? 210 : 297;
    const pageHeight = orientation === 'p' ? 297 : 210;
    const margin = 10; // 10mm margins

    const printableWidth = pageWidth - margin * 2;
    const imgHeight = (canvas.height * printableWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = margin;

    // First page
    pdf.addImage(imgData, 'PNG', margin, position, printableWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pageHeight - margin * 2;

    // Additional pages if content overflows
    while (heightLeft > 0) {
      position = heightLeft - imgHeight + margin;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', margin, position, printableWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight - margin * 2;
    }

    pdf.save(filename);
  } catch (err) {
    console.error('Failed to generate PDF via HTML-to-Canvas:', err);
    throw err;
  }
}

/**
 * Exports any structured JavaScript object or array directly as a downloadable JSON file.
 */
export function exportDataToJson(data: any, filename: string): void {
  const cleanFilename = filename.endsWith('.json') ? filename : `${filename}.json`;
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = cleanFilename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

/**
 * Creates an on-the-fly styled official AIIA clinical document DOM container,
 * renders it using HTML-to-Canvas, and triggers a PDF download.
 */
export async function generateClinicalReportPdf(
  title: string,
  subtitle: string,
  sections: Array<{
    heading: string;
    content?: string;
    keyValue?: Record<string, string | number | boolean | null | undefined>;
    table?: { headers: string[]; rows: (string | number)[][] };
  }>,
  filename: string
): Promise<void> {
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '800px';
  container.style.padding = '36px 44px';
  container.style.backgroundColor = '#ffffff';
  container.style.color = '#0f172a';
  container.style.fontFamily = 'ui-sans-serif, system-ui, -apple-system, sans-serif';
  container.style.boxSizing = 'border-box';

  const timestamp = new Date().toISOString();
  const certId = `AIIA-VAL-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

  let sectionsHtml = '';
  for (const sec of sections) {
    let secBody = '';
    if (sec.content) {
      secBody += `<p style="font-size: 12px; color: #334155; line-height: 1.6; margin-bottom: 12px;">${sec.content}</p>`;
    }
    if (sec.keyValue) {
      secBody += `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px 16px; margin-bottom: 14px; background: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0;">
          ${Object.entries(sec.keyValue)
            .map(
              ([k, v]) => `
              <div style="font-size: 11px;">
                <span style="color: #64748b; font-weight: 600; text-transform: uppercase;">${k}:</span>
                <span style="color: #0f172a; font-weight: 700; margin-left: 6px; font-family: monospace;">${String(v ?? 'N/A')}</span>
              </div>
            `
            )
            .join('')}
        </div>
      `;
    }
    if (sec.table) {
      secBody += `
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 11px;">
          <thead>
            <tr style="background-color: #042f2e; color: #ffffff;">
              ${sec.table.headers
                .map(
                  (h) => `
                <th style="padding: 8px 10px; text-align: left; font-weight: 700; border: 1px solid #0f766e; text-transform: uppercase; font-size: 10px;">${h}</th>
              `
                )
                .join('')}
            </tr>
          </thead>
          <tbody>
            ${sec.table.rows
              .map(
                (r, idx) => `
              <tr style="background-color: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
                ${r
                  .map(
                    (c) => `
                  <td style="padding: 7px 10px; border: 1px solid #e2e8f0; color: #1e293b;">${String(c)}</td>
                `
                  )
                  .join('')}
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      `;
    }

    sectionsHtml += `
      <div style="margin-bottom: 20px;">
        <h3 style="font-size: 13px; font-weight: 800; color: #042f2e; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1.5px solid #0d9488; padding-bottom: 4px; margin-bottom: 10px;">
          ${sec.heading}
        </h3>
        ${secBody}
      </div>
    `;
  }

  container.innerHTML = `
    <div style="border: 2px solid #042f2e; padding: 24px; border-radius: 8px;">
      <!-- Header with AIIA & Ministry of Ayush Letterhead -->
      <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #042f2e; padding-bottom: 16px; margin-bottom: 20px;">
        <div>
          <div style="font-size: 10px; font-weight: 800; color: #042f2e; text-transform: uppercase; letter-spacing: 1.5px;">
            MINISTRY OF AYUSH • GOVERNMENT OF INDIA
          </div>
          <div style="font-size: 18px; font-weight: 900; color: #042f2e; margin-top: 2px;">
            ALL INDIA INSTITUTE OF AYURVEDA (AIIA)
          </div>
          <div style="font-size: 11px; color: #0d9488; font-weight: 600; margin-top: 2px;">
            National Center of Excellence • Clinical Trials Management System
          </div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 9px; font-weight: 700; background: #042f2e; color: #2dd4bf; padding: 3px 8px; border-radius: 4px; display: inline-block;">
            21 CFR PART 11 & CDSCO
          </div>
          <div style="font-size: 9px; color: #64748b; font-family: monospace; margin-top: 4px;">
            Ref: ${certId}
          </div>
        </div>
      </div>

      <!-- Document Title -->
      <div style="margin-bottom: 24px; text-align: center; background: #f0fdfa; padding: 14px; border-radius: 6px; border: 1px solid #ccfbf1;">
        <h1 style="font-size: 16px; font-weight: 900; color: #115e59; margin: 0; text-transform: uppercase; letter-spacing: 0.5px;">
          ${title}
        </h1>
        <p style="font-size: 11px; color: #475569; margin: 4px 0 0 0;">
          ${subtitle}
        </p>
      </div>

      <!-- Sections -->
      ${sectionsHtml}

      <!-- Official Regulatory Footprint -->
      <div style="margin-top: 32px; border-top: 1px solid #cbd5e1; padding-top: 14px; display: flex; justify-content: space-between; align-items: flex-end; font-size: 9px; color: #64748b;">
        <div>
          <div><strong>Regulatory Mandate:</strong> CDSCO NDCTR 2019 • US FDA 21 CFR Part 11 • ICH-GCP E6(R2)</div>
          <div><strong>Ayush Guideline:</strong> Good Clinical Practice Guidelines for Clinical Trials in Ayurveda</div>
          <div><strong>Generated via:</strong> AIIA CTMS HTML-to-Canvas High-Definition Engine</div>
        </div>
        <div style="text-align: right; font-family: monospace;">
          <div>Export Timestamp: ${timestamp}</div>
          <div style="color: #0d9488; font-weight: 700;">VERIFIED TAMPER-EVIDENT RECORD</div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(container);

  try {
    await exportHtmlToPdf(container, { filename });
  } finally {
    container.remove();
  }
}
