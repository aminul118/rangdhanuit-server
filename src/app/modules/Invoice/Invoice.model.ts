import { model, Schema } from 'mongoose';
import {
  InvoiceModel,
  IInvoiceLineItem,
  IPayment,
  InvoiceDocument,
} from './Invoice.interface';

const InvoiceLineItemSchema = new Schema<IInvoiceLineItem>({
  description: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  unitPrice: { type: Number, required: true, default: 0 },
  total: { type: Number, required: true, default: 0 },
});

const PaymentSchema = new Schema<IPayment>({
  amount: { type: Number, required: true },
  paymentDate: { type: Date, required: true, default: Date.now },
  paymentType: {
    type: String,
    enum: [
      '1st Installment',
      '2nd Installment',
      'Partial Payment',
      'Full Payment',
      'Others',
    ],
    required: true,
  },
  notes: { type: String },
});

const invoiceSchema = new Schema<InvoiceDocument, InvoiceModel>(
  {
    quotationId: { type: Schema.Types.ObjectId, ref: 'Quotation' },
    clientName: { type: String, required: true },
    clientEmail: { type: String },
    clientPhone: { type: String },
    clientAddress: { type: String },
    projectStartTime: { type: Date },
    projectApproximateFinishTime: { type: Date },
    invoiceNumber: { type: String, required: true, unique: true },
    issueDate: { type: Date, required: true, default: Date.now },
    dueDate: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    },
    lineItems: { type: [InvoiceLineItemSchema], required: true },
    payments: { type: [PaymentSchema], default: [] },
    subtotal: { type: Number, required: true, default: 0 },
    tax: { type: Number, required: true, default: 0 },
    discount: { type: Number, required: true, default: 0 },
    total: { type: Number, required: true, default: 0 },
    status: {
      type: String,
      enum: ['PENDING', 'PAID', 'OVERDUE', 'CANCELLED'],
      default: 'PENDING',
    },
    notes: { type: String },
    pdfUrl: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

// Auto-generate sequential invoice number and perform financial calculations
invoiceSchema.pre('validate', async function (next) {
  // 1. Calculate Line Item Totals and Subtotal
  let calculatedSubtotal = 0;
  if (this.lineItems && this.lineItems.length > 0) {
    this.lineItems.forEach((item) => {
      item.total = (item.quantity || 0) * (item.unitPrice || 0);
      calculatedSubtotal += item.total;
    });
  }
  this.subtotal = calculatedSubtotal;

  // 2. Calculate Grand Total
  // Formula: Subtotal + (Subtotal * Tax%) - Discount
  const taxAmount = (this.subtotal * (this.tax || 0)) / 100;
  this.total = Math.max(0, this.subtotal + taxAmount - (this.discount || 0));

  // 3. Sequential Invoice Number Generation
  if (!this.invoiceNumber) {
    const lastInvoice = await (this.constructor as InvoiceModel).findOne(
      {}, // Look at all invoices (including deleted) to ensure absolute uniqueness
      { invoiceNumber: 1 },
      { sort: { invoiceNumber: -1 } }, // Sort by invoiceNumber to get the highest one
    );

    const currentYear = new Date().getFullYear();
    let nextNumber = 1;

    if (lastInvoice && lastInvoice.invoiceNumber) {
      const parts = lastInvoice.invoiceNumber.split('-');
      // Expected format: INV-YYYY-XXXX
      if (parts.length === 3) {
        const lastYear = parts[1];
        const lastSerial = parseInt(parts[2]);
        if (lastYear === currentYear.toString()) {
          nextNumber = isNaN(lastSerial) ? 1 : lastSerial + 1;
        }
      }
    }

    this.invoiceNumber = `INV-${currentYear}-${String(nextNumber).padStart(4, '0')}`;
  }
  next();
});

export const Invoice = model<InvoiceDocument, InvoiceModel>(
  'Invoice',
  invoiceSchema,
);
