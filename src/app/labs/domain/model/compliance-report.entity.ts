export interface ComplianceReport {
  id: number;
  name: string;
  type: string;
  period: string;
  size: string;
  generatedAt: string;
  status: 'READY' | 'GENERATING';
}
