export interface InvoiceItem {
  name: string;
  quantity: number;
  unitPrice: number;
  tax: number;
}

export interface Invoice {
  id?: number;
  customerName: string;
  phone: string;
  address: string;
  items: InvoiceItem[];
  total: number;
  createdAt?: Date;
}
