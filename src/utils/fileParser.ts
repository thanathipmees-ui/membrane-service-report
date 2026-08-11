import * as XLSX from 'xlsx';
import { MembraneData, HeaderConfig, TestCycle, MembraneStatus } from '../types';
import { defaultHeaderConfig } from './calculations';
import { extractPhotosFromPdf, PagePhotos } from './pdfPhotoExtractor';

export interface ParsedReportResult {
  companyName: string;
  roName: string;
  membranes: MembraneData[];
  rawSummary?: {
    totalExtracted: number;
    passCount: number;
    remarkCount: number;
  };
}

/**
 * Converts a File object to base64 string
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Calls backend Gemini AI endpoint to parse PDF or Image documents (single or multiple)
 */
export async function parsePdfOrImageDocument(inputFiles: File | File[]): Promise<ParsedReportResult> {
  const filesList = Array.isArray(inputFiles) ? inputFiles : [inputFiles];

  // Convert all files to base64
  const payloadFiles = await Promise.all(
    filesList.map(async (file) => ({
      fileBase64: await fileToBase64(file),
      mimeType: file.type || 'application/pdf',
      fileName: file.name
    }))
  );

  // Send to AI endpoint
  const response = await fetch('/api/parse-document', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      files: payloadFiles
    })
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || 'เกิดข้อผิดพลาดในการวิเคราะห์เอกสาร PDF ด้วย AI');
  }

  const resJson = await response.json();
  if (!resJson.success || !resJson.data) {
    throw new Error('ไม่สามารถประมวลผลโครงสร้างเอกสารได้');
  }

  const data = resJson.data;

  const companyName = data.companyName?.trim() || 'Lion Corporation (Thailand) Limited';
  const roName = data.roName?.trim() || 'RO2';

  const baseHeaderConfig: HeaderConfig = {
    ...defaultHeaderConfig,
    companyName,
    jobDescription: `Cleaning Membrane ${roName}`,
    reportTitle: `${roName} Membrane Cleaning Report`
  };

  // Attempt to extract PDF photos from the per-piece report PDF (the one with multiple pages or >1 page)
  let extractedPagePhotos: PagePhotos[] = [];
  const perPiecePdfFile = filesList.find((f) => f.type.includes('pdf') || f.name.toLowerCase().endsWith('.pdf'));

  if (perPiecePdfFile) {
    try {
      extractedPagePhotos = await extractPhotosFromPdf(perPiecePdfFile);
    } catch (e) {
      console.warn('Could not extract photos directly from PDF canvas:', e);
    }
  }

  const membranes: MembraneData[] = (data.membranes || []).map((m: any, index: number) => {
    const membraneNo = m.membraneNo || index + 1;
    const serialNumber = m.serialNumber || `SN-${membraneNo}`;
    const brandModel = m.brandModel || 'Filmtec / BW30X FR-400 34i';
    const status: MembraneStatus = (m.status === 'REMARK' || m.note?.includes('แตกร้าว') || m.note?.includes('ชำรุด')) ? 'REMARK' : 'PASS';
    const note = m.note || (status === 'PASS' ? 'ผ่านการตรวจสอบตามรายงาน' : 'ตรวจสอบพบข้อสังเกต');

    // Location mapping
    const location = {
      vessel: m.location?.vessel || Math.ceil(membraneNo / 4),
      position: m.location?.position || (((membraneNo - 1) % 4) + 1)
    };

    const cycles: TestCycle[] = (m.cycles && m.cycles.length > 0)
      ? m.cycles.map((c: any) => ({
          date: c.date || '11 February 2026',
          before: c.before || { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 160, recovery: 20, permeateConductivity: 16, rawWaterConductivity: 250, rejection: 93.6 },
          after: c.after || { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 155, recovery: 22.5, permeateConductivity: 6, rawWaterConductivity: 250, rejection: 97.6 }
        }))
      : [
          {
            date: '11 February 2026',
            before: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 160, recovery: 20, permeateConductivity: 16, rawWaterConductivity: 250, rejection: 93.6 },
            after: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 155, recovery: 22.5, permeateConductivity: 6, rawWaterConductivity: 250, rejection: 97.6 }
          }
        ];

    // Find matching Before and After photos for this membrane page
    const pagePhoto = extractedPagePhotos[index] || extractedPagePhotos.find((p) => p.pageNumber === membraneNo);
    const beforeImages: string[] = pagePhoto?.beforeImage ? [pagePhoto.beforeImage] : [];
    const afterImages: string[] = pagePhoto?.afterImage ? [pagePhoto.afterImage] : [];

    return {
      membraneNo,
      serialNumber,
      brandModel,
      status,
      note,
      location,
      headerConfig: baseHeaderConfig,
      cycles,
      images: {
        before: beforeImages,
        after: afterImages
      }
    };
  });

  const passCount = membranes.filter((m) => m.status === 'PASS').length;
  const remarkCount = membranes.filter((m) => m.status === 'REMARK').length;

  return {
    companyName,
    roName,
    membranes,
    rawSummary: {
      totalExtracted: membranes.length,
      passCount,
      remarkCount
    }
  };
}

/**
 * Parses Excel (.xlsx, .xls, .csv) report file
 */
export async function parseExcelReport(file: File): Promise<ParsedReportResult> {
  const dataBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(dataBuffer, { type: 'array' });

  const firstSheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[firstSheetName];
  const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: '' });

  if (!rows || rows.length === 0) {
    throw new Error('ไม่พบข้อมูลในไฟล์ Excel ที่อัปโหลด');
  }

  // Detect metadata from top rows or standard columns
  let extractedCompany = 'Lion Corporation (Thailand) Limited';
  let extractedRo = 'RO4 Pass 1';

  // Check if first row contains Customer or Company header
  rows.slice(0, 5).forEach((row) => {
    const rowStr = JSON.stringify(row).toLowerCase();
    if (rowStr.includes('company') || rowStr.includes('customer') || rowStr.includes('บริษัท')) {
      Object.values(row).forEach((val) => {
        if (typeof val === 'string' && val.length > 5 && !val.toLowerCase().includes('company')) {
          extractedCompany = val;
        }
      });
    }
    if (rowStr.includes('ro') || rowStr.includes('job') || rowStr.includes('ref')) {
      Object.values(row).forEach((val) => {
        if (typeof val === 'string' && val.toLowerCase().includes('ro')) {
          extractedRo = val;
        }
      });
    }
  });

  const baseHeaderConfig: HeaderConfig = {
    ...defaultHeaderConfig,
    companyName: extractedCompany,
    jobDescription: `Cleaning Membrane ${extractedRo}`,
    reportTitle: `${extractedRo} Membrane Cleaning Report`
  };

  const membranes: MembraneData[] = [];

  rows.forEach((row, index) => {
    // Find keys matching common Excel headers
    const membraneNoVal = row['MembraneNo'] || row['No'] || row['ลำดับ'] || row['Quantity'] || index + 1;
    const membraneNo = parseInt(String(membraneNoVal).replace(/\D/g, ''), 10) || index + 1;

    const serialNumber = String(
      row['SerialNumber'] || row['Serial'] || row['Serial No'] || row['ซีเรียล'] || `T999${2200 + membraneNo}`
    ).trim();

    if (!serialNumber || serialNumber.toLowerCase().includes('serial')) return;

    const brandModel = String(row['Brand'] || row['Model'] || row['Brand/Model'] || 'Filmtec / BW30 PRO-400').trim();
    const note = String(row['Note'] || row['Remark'] || row['หมายเหตุ'] || 'ผ่านการตรวจสอบตามรายงาน').trim();
    const statusStr = String(row['Status'] || row['สถานะ'] || '').toUpperCase();

    const status: MembraneStatus =
      statusStr === 'REMARK' || note.includes('แตก') || note.includes('ชำรุด') ? 'REMARK' : 'PASS';

    // Extract numerical readings if present in columns
    const dateStr = String(row['Date'] || row['DateCleaning'] || '10 June 2026');
    const beforeInletP = parseFloat(row['Before_InletPressure'] || row['PressureBefore'] || 100);
    const beforeConcP = parseFloat(row['Before_ConcPressure'] || 90);
    const beforeInletF = parseFloat(row['Before_InletFlow'] || 200);
    const beforeConcF = parseFloat(row['Before_ConcFlow'] || 170);
    const beforeRec = parseFloat(row['Before_Recovery'] || 15);
    const beforePermC = parseFloat(row['Before_PermConductivity'] || 28);
    const beforeRawC = parseFloat(row['Before_RawConductivity'] || 248);
    const beforeRej = parseFloat(row['Before_Rejection'] || 88.71);

    const afterInletP = parseFloat(row['After_InletPressure'] || row['PressureAfter'] || 100);
    const afterConcP = parseFloat(row['After_ConcPressure'] || 90);
    const afterInletF = parseFloat(row['After_InletFlow'] || 200);
    const afterConcF = parseFloat(row['After_ConcFlow'] || 165);
    const afterRec = parseFloat(row['After_Recovery'] || 17.5);
    const afterPermC = parseFloat(row['After_PermConductivity'] || 13);
    const afterRawC = parseFloat(row['After_RawConductivity'] || 248);
    const afterRej = parseFloat(row['After_Rejection'] || 94.76);

    const cycles: TestCycle[] = [
      {
        date: dateStr,
        before: {
          inletPressure: isNaN(beforeInletP) ? 100 : beforeInletP,
          concentratePressure: isNaN(beforeConcP) ? 90 : beforeConcP,
          inletFlow: isNaN(beforeInletF) ? 200 : beforeInletF,
          concentrateFlow: isNaN(beforeConcF) ? 170 : beforeConcF,
          recovery: isNaN(beforeRec) ? 15 : beforeRec,
          permeateConductivity: isNaN(beforePermC) ? 28 : beforePermC,
          rawWaterConductivity: isNaN(beforeRawC) ? 248 : beforeRawC,
          rejection: isNaN(beforeRej) ? 88.71 : beforeRej
        },
        after: {
          inletPressure: isNaN(afterInletP) ? 100 : afterInletP,
          concentratePressure: isNaN(afterConcP) ? 90 : afterConcP,
          inletFlow: isNaN(afterInletF) ? 200 : afterInletF,
          concentrateFlow: isNaN(afterConcF) ? 165 : afterConcF,
          recovery: isNaN(afterRec) ? 17.5 : afterRec,
          permeateConductivity: isNaN(afterPermC) ? 13 : afterPermC,
          rawWaterConductivity: isNaN(afterRawC) ? 248 : afterRawC,
          rejection: isNaN(afterRej) ? 94.76 : afterRej
        }
      }
    ];

    membranes.push({
      membraneNo,
      serialNumber,
      brandModel,
      status,
      note,
      location: { vessel: Math.ceil(membraneNo / 6), position: ((membraneNo - 1) % 6) + 1 },
      headerConfig: baseHeaderConfig,
      cycles,
      images: { before: [], after: [] }
    });
  });

  // Sort by membraneNo ascending
  membranes.sort((a, b) => a.membraneNo - b.membraneNo);

  const passCount = membranes.filter((m) => m.status === 'PASS').length;
  const remarkCount = membranes.filter((m) => m.status === 'REMARK').length;

  return {
    companyName: extractedCompany,
    roName: extractedRo,
    membranes,
    rawSummary: {
      totalExtracted: membranes.length,
      passCount,
      remarkCount
    }
  };
}

/**
 * Downloads a sample pre-formatted Excel template for 30 Membranes
 */
export function downloadSampleExcelTemplate(): void {
  const sampleData = [];

  for (let i = 1; i <= 30; i++) {
    const isRemark = i % 7 === 0;
    sampleData.push({
      Company: 'Lion Corporation (Thailand) Limited',
      RO_System: 'RO4 Pass 1',
      MembraneNo: i,
      SerialNumber: `T999${2240 + i}`,
      Brand_Model: 'Filmtec / BW30 PRO-400',
      Status: isRemark ? 'REMARK' : 'PASS',
      Note: isRemark ? 'ตรวจสอบพบว่า Membrane มีรอยแตกร้าวบริเวณหัว' : 'ผ่านการตรวจสอบตามรายงาน',
      DateCleaning: '10 June 2026',
      Before_InletPressure: 100,
      Before_ConcPressure: 90,
      Before_InletFlow: 200,
      Before_ConcFlow: 170,
      Before_Recovery: 15.0,
      Before_PermConductivity: 28,
      Before_RawConductivity: 248,
      Before_Rejection: 88.71,
      After_InletPressure: 100,
      After_ConcPressure: 90,
      After_InletFlow: 200,
      After_ConcFlow: 165,
      After_Recovery: 17.5,
      After_PermConductivity: 13,
      After_RawConductivity: 248,
      After_Rejection: 94.76
    });
  }

  const worksheet = XLSX.utils.json_to_sheet(sampleData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Membrane_Reports');

  XLSX.writeFile(workbook, 'Sample_Membrane_Report_Template_30Pieces.xlsx');
}
