export interface TaxFiling {
  id: number;
  filingType: string;
  taxType: string;
  gstType: string;
  deadline: string;
  status: string;
  remarks: string;
  clientId: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  updatedBy: string | null;
}

export interface TaxFilingResponse {
  content: TaxFiling[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
} 