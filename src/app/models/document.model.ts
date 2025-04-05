export interface Document {
  id: number;
  clientId: number;
  documentsRequired: string;
  documentsPending: string;
  remarks: string;
  createdAt: string;
  lastUpdated: string;
}

export interface DocumentResponse {
  content: Document[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
} 