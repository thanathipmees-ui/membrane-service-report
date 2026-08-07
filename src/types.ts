export type MembraneStatus = 'PASS' | 'REMARK';

export interface HeaderConfig {
  companyName: string;
  reportTitle: string;
  reportSubtitle: string;
  jobDescription: string;
  servicePeriod: string;
}

export interface TestMetrics {
  inletPressure?: number | null;
  concentratePressure?: number | null;
  inletFlow?: number | null;
  concentrateFlow?: number | null;
  recovery?: number | null;
  permeateConductivity?: number | null;
  rawWaterConductivity?: number | null;
  rejection?: number | null;
}

export interface TestCycle {
  id?: string;
  date: string;
  before: TestMetrics;
  after: TestMetrics;
}

export interface MembraneLocation {
  vessel: number | string;
  position: number | string;
}

export interface MembraneImages {
  before: string[];
  after: string[];
}

export interface MembraneData {
  membraneNo: number;
  serialNumber: string;
  brandModel: string;
  status: MembraneStatus;
  note: string;
  location: MembraneLocation;
  headerConfig?: HeaderConfig;
  cycles: TestCycle[];
  chartImage?: string;
  images: MembraneImages;
}
