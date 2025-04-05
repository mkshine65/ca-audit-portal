export interface Payment {
  id: number;
  clientId: number;
  paymentId: string | null;
  totalAmount: number;
  pendingAmount: number;
  receivedAmount: number;
  paymentStatus: string;
  paymentDate: string;
  financialYear: string;
  remarks: string;
  createdAt: string;
  lastUpdated: string;
}

export interface PaymentResponse {
  content: Payment[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
} 