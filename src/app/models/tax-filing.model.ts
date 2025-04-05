export interface TaxFiling {
  id: number;
  clientId: number;
  filingType: string;
  taxType: string;
  gstType: string;
  deadline: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  remarks: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaxFilingResponse {
  content: TaxFiling[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
} 