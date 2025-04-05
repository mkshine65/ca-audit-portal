export interface Client {
  id: number;
  name: string;
  companyName: string;
  phoneNumber: string;
  email: string;
  address: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export interface ClientResponse {
  content: Client[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
} 