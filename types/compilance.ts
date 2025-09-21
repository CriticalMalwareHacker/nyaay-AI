export interface ComplianceItem {
  id: string;
  title: string;
  description: string;
  status: 'compliant' | 'non-compliant' | 'checking' | 'unknown';
  lastChecked?: Date;
}

export interface ComplianceCheckProps {
  items: ComplianceItem[];
  onCheckCompliance?: (itemId: string) => void;
  onViewDetails?: (itemId: string) => void;
}