import { Document, Model, Types } from 'mongoose';

export type InvoiceStatus = 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';

export interface IInvoiceLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface IPayment {
  amount: number;
  paymentDate: Date;
  paymentType:
    | '1st Installment'
    | '2nd Installment'
    | 'Partial Payment'
    | 'Full Payment'
    | 'Others';
  notes?: string;
}

export interface IInvoice {
  quotationId?: Types.ObjectId;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  clientAddress?: string;
  projectStartTime?: Date;
  projectApproximateFinishTime?: Date;
  invoiceNumber?: string;
  issueDate: Date;
  dueDate: Date;
  lineItems: IInvoiceLineItem[];
  payments: IPayment[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: InvoiceStatus;
  notes?: string;
  pdfUrl?: string;
  isDeleted: boolean;
}

export type InvoiceDocument = IInvoice & Document;

export type InvoiceModel = Model<IInvoice>;
