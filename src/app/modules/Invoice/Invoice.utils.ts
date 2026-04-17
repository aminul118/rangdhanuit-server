import PDFDocument from 'pdfkit';
import streamifier from 'streamifier';
import { format } from 'date-fns';
import { IInvoice } from './Invoice.interface';
import { cloudinaryUploads } from '../../config/cloudinary.config';

/**
 * Generates an invoice PDF using PDFKit and uploads it to Cloudinary.
 * Returns the secure URL of the uploaded PDF.
 */
export const generateInvoicePDF = async (
  invoice: IInvoice,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 40,
        bufferPages: true,
      });
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);

        const uploadStream = cloudinaryUploads.uploader.upload_stream(
          {
            folder: 'invoices',
            resource_type: 'image', // Cloudinary handles PDFs as 'image' or 'raw', 'image' + format: 'pdf' is common
            public_id: invoice.invoiceNumber,
            format: 'pdf',
            overwrite: true,
            invalidate: true,
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result?.secure_url as string);
          },
        );

        streamifier.createReadStream(pdfBuffer).pipe(uploadStream);
      });

      /* =========================================================
         HELPERS & COLORS
      ========================================================= */
      const formatTk = (amount: number) =>
        `${Math.round(amount).toLocaleString()} tk`;
      const formatDate = (date: string | number | Date | null | undefined) =>
        date ? format(new Date(date), 'dd MMM, yyyy') : '-';

      const DARK_BLUE = '#0B3A67';
      const EMERALD_600 = '#059669';
      const EMERALD_50 = '#ecfdf5';
      const LIGHT_BLUE = '#EAF4F8';
      const SOFT_GRAY = '#F8FAFC';
      const TEXT_MAIN = '#111827';
      const TEXT_MUTED = '#6B7280';

      /* =========================================================
         HEADER & BRANDING
      ========================================================= */
      // Header Background
      doc.rect(0, 0, doc.page.width, 100).fill(DARK_BLUE);

      // Logo/Brand Text
      doc
        .font('Helvetica-Bold')
        .fontSize(28)
        .fillColor('white')
        .text('INVOICE', 50, 35);

      // Invoice Details (Top Right)
      doc
        .fontSize(9)
        .font('Helvetica-Bold')
        .text('INVOICE NO', 380, 35, { characterSpacing: 1 })
        .text('ISSUE DATE', 380, 50, { characterSpacing: 1 })
        .text('DUE DATE', 380, 65, { characterSpacing: 1 });

      doc
        .font('Helvetica')
        .text(invoice.invoiceNumber || 'N/A', 470, 35)
        .text(formatDate(invoice.issueDate), 470, 50)
        .text(formatDate(invoice.dueDate), 470, 65);

      /* =========================================================
         ADDRESSES
      ========================================================= */
      let y = 130;

      // FROM
      doc
        .font('Helvetica-Bold')
        .fontSize(10)
        .fillColor(DARK_BLUE)
        .text('FROM', 50, y);
      doc
        .font('Helvetica-Bold')
        .fontSize(12)
        .fillColor(TEXT_MAIN)
        .text('Rangdhanu IT', 50, y + 15);
      doc
        .font('Helvetica')
        .fontSize(9)
        .fillColor(TEXT_MUTED)
        .text('Web & Digital Solutions', 50, y + 32)
        .text('+880 1781-082064', 50, y + 45)
        .text('www.rangdhanuit.com', 50, y + 58);

      // BILL TO
      doc
        .font('Helvetica-Bold')
        .fontSize(10)
        .fillColor(DARK_BLUE)
        .text('BILL TO', 330, y, { align: 'right', width: 215 });
      doc
        .font('Helvetica-Bold')
        .fontSize(12)
        .fillColor(TEXT_MAIN)
        .text(invoice.clientName, 330, y + 15, { align: 'right', width: 215 });
      doc
        .font('Helvetica')
        .fontSize(9)
        .fillColor(TEXT_MUTED)
        .text(invoice.clientPhone || '', 330, y + 32, {
          align: 'right',
          width: 215,
        })
        .text(invoice.clientEmail || '', 330, y + 45, {
          align: 'right',
          width: 215,
        })
        .text(invoice.clientAddress || '', 330, y + 58, {
          align: 'right',
          width: 215,
        });

      y += 90;

      // Project Timeline (If exists)
      if (invoice.projectStartTime) {
        doc.rect(50, y, 495, 25).fill(LIGHT_BLUE);
        doc
          .font('Helvetica-Bold')
          .fontSize(8)
          .fillColor(DARK_BLUE)
          .text('PROJECT TIMELINE:', 65, y + 9);
        doc
          .font('Helvetica')
          .fillColor(TEXT_MAIN)
          .text(
            `${formatDate(invoice.projectStartTime)} ${invoice.projectApproximateFinishTime ? ' to ' + formatDate(invoice.projectApproximateFinishTime) : ''}`,
            160,
            y + 9,
          );
        y += 40;
      } else {
        y += 20;
      }

      /* =========================================================
         ITEMS TABLE
      ========================================================= */
      const TABLE_X = 50;
      const TABLE_WIDTH = 495;
      const HEADER_HEIGHT = 30;
      const ROW_HEIGHT = 28;

      const COLUMNS = {
        desc: { x: TABLE_X + 15, width: 240 },
        qty: { x: TABLE_X + 265, width: 60 },
        price: { x: TABLE_X + 335, width: 80 },
        total: { x: TABLE_X + 425, width: 60 },
      };

      // Table Header Background
      doc.rect(TABLE_X, y, TABLE_WIDTH, HEADER_HEIGHT).fill(DARK_BLUE);
      doc.font('Helvetica-Bold').fontSize(9).fillColor('white');

      doc.text('ITEM DESCRIPTION', COLUMNS.desc.x, y + 11);
      doc.text('QTY', COLUMNS.qty.x, y + 11, {
        width: COLUMNS.qty.width,
        align: 'center',
      });
      doc.text('PRICE', COLUMNS.price.x, y + 11, {
        width: COLUMNS.price.width,
        align: 'center',
      });
      doc.text('TOTAL', COLUMNS.total.x, y + 11, {
        width: COLUMNS.total.width,
        align: 'right',
      });

      y += HEADER_HEIGHT;

      // Rows
      invoice.lineItems.forEach((item, index) => {
        // Stripe background
        if (index % 2 === 0) {
          doc.rect(TABLE_X, y, TABLE_WIDTH, ROW_HEIGHT).fill('#F9FAFB');
        }

        doc.font('Helvetica').fontSize(9).fillColor(TEXT_MAIN);
        doc.text(item.description, COLUMNS.desc.x, y + 10);
        doc.text(String(item.quantity), COLUMNS.qty.x, y + 10, {
          width: COLUMNS.qty.width,
          align: 'center',
        });
        doc.text(formatTk(item.unitPrice), COLUMNS.price.x, y + 10, {
          width: COLUMNS.price.width,
          align: 'center',
        });
        doc.text(formatTk(item.total), COLUMNS.total.x, y + 10, {
          width: COLUMNS.total.width,
          align: 'right',
        });

        y += ROW_HEIGHT;

        // Check for page break
        if (y > 700) {
          doc.addPage();
          y = 50;
        }
      });

      /* =========================================================
         TOTALS SECTION (Bottom Right)
      ========================================================= */
      y += 30;
      const TOTALS_W = 220;
      const TOTALS_X = TABLE_X + TABLE_WIDTH - TOTALS_W;

      // Totals Box Background
      doc.rect(TOTALS_X, y, TOTALS_W, 110).fill(SOFT_GRAY);

      doc.font('Helvetica-Bold').fontSize(9).fillColor(TEXT_MUTED);

      const drawRow = (
        label: string,
        value: string,
        currentY: number,
        isGrand = false,
      ) => {
        if (isGrand) {
          doc.rect(TOTALS_X, currentY - 5, TOTALS_W, 35).fill(DARK_BLUE);
          doc.fillColor('white').font('Helvetica-Bold');
        } else {
          doc.fillColor(TEXT_MUTED).font('Helvetica-Bold');
        }

        doc.text(label, TOTALS_X + 15, currentY + 5);
        doc.text(value, TOTALS_X + 15, currentY + 5, {
          width: TOTALS_W - 30,
          align: 'right',
        });
      };

      drawRow('SUB TOTAL', formatTk(invoice.subtotal), y + 10);
      drawRow(
        `TAX (${invoice.tax}%)`,
        formatTk((invoice.subtotal * invoice.tax) / 100),
        y + 30,
      );
      drawRow('DISCOUNT', `-${formatTk(invoice.discount)}`, y + 50);
      drawRow('GRAND TOTAL', formatTk(invoice.total), y + 80, true);

      /* =========================================================
         STATUS SEAL (Left of totals)
      ========================================================= */
      const totalPaid = (invoice.payments || []).reduce(
        (acc, curr) => acc + curr.amount,
        0,
      );
      const remainingDue = Math.max(0, invoice.total - totalPaid);
      const statusText =
        remainingDue < 1 && totalPaid > 0
          ? 'PAID'
          : totalPaid > 0
            ? 'PARTIALLY PAID'
            : invoice.status || 'PENDING';

      const SEAL_COLORS: Record<string, string> = {
        PAID: '#059669',
        'PARTIALLY PAID': '#0B3A67',
        PENDING: '#F59E0B',
        OVERDUE: '#DC2626',
      };

      const sealColor = SEAL_COLORS[statusText] || '#6B7280';

      doc.save();
      doc.translate(TOTALS_X - 120, y + 50);
      doc.rotate(-15);
      doc.opacity(0.4);

      doc.fontSize(20);
      const labelWidth = doc.widthOfString(statusText) + 30;
      doc
        .lineWidth(3)
        .strokeColor(sealColor)
        .roundedRect(-labelWidth / 2, -20, labelWidth, 40, 5)
        .stroke();
      doc
        .fillColor(sealColor)
        .font('Helvetica-Bold')
        .text(statusText, -labelWidth / 2, -12, {
          width: labelWidth,
          align: 'center',
        });
      doc.restore();

      y += 130;

      /* =========================================================
         PAYMENT INFORMATION (Shared Logic)
      ========================================================= */
      if (statusText !== 'PAID') {
        doc
          .rect(50, y, 495, 90)
          .fill(LIGHT_BLUE)
          .strokeColor('#B0CFE0')
          .lineWidth(0.5)
          .stroke();

        doc
          .font('Helvetica-Bold')
          .fontSize(9)
          .fillColor(DARK_BLUE)
          .text('PAYMENT INFORMATION', 65, y + 12);

        // Split Line
        doc
          .moveTo(297, y + 30)
          .lineTo(297, y + 80)
          .strokeColor('#B0CFE0')
          .stroke();

        // Bkash
        doc
          .fontSize(8)
          .fillColor(TEXT_MUTED)
          .text('MOBILE BANKING (BKASH)', 65, y + 35);
        doc
          .font('Helvetica-Bold')
          .fontSize(9)
          .fillColor(TEXT_MAIN)
          .text('Number: 01781082064', 65, y + 50);
        doc.text('Type: Personal', 65, y + 62);
        doc.text(`Reference: ${invoice.invoiceNumber}`, 65, y + 74);

        // Bank
        doc
          .fontSize(8)
          .fillColor(TEXT_MUTED)
          .text('BANK TRANSFER', 315, y + 35);
        doc
          .font('Helvetica-Bold')
          .fontSize(9)
          .fillColor(TEXT_MAIN)
          .text('Bank: BRAC BANK PLC', 315, y + 50);
        doc.text('A/C Name: Rangdhanu IT', 315, y + 62);
        doc.text('A/C No: 105XXXXXXXXX', 315, y + 74);

        y += 110;
      }

      /* =========================================================
         INSTALLMENT HISTORY
      ========================================================= */
      if (invoice.payments && invoice.payments.length > 0) {
        doc
          .font('Helvetica-Bold')
          .fontSize(9)
          .fillColor(DARK_BLUE)
          .text('PAYMENT HISTORY (INSTALLMENTS)', 50, y);
        y += 15;

        // Table Header
        doc.rect(50, y, 495, 20).fill(EMERALD_600);
        doc.font('Helvetica-Bold').fontSize(8).fillColor('white');
        doc.text('DATE', 65, y + 7);
        doc.text('TYPE', 150, y + 7);
        doc.text('NOTES', 250, y + 7);
        doc.text('AMOUNT', 480, y + 7, { align: 'right', width: 50 });

        y += 20;

        invoice.payments.forEach((p, idx) => {
          if (idx % 2 === 0) doc.rect(50, y, 495, 18).fill(EMERALD_50);
          doc.font('Helvetica').fontSize(8).fillColor(TEXT_MAIN);
          doc.text(formatDate(p.paymentDate), 65, y + 5);
          doc.text(p.paymentType, 150, y + 5);
          doc.text(p.notes || '-', 250, y + 5);
          doc.text(formatTk(p.amount), 450, y + 5, {
            align: 'right',
            width: 80,
          });
          y += 18;

          if (y > 750) {
            doc.addPage();
            y = 50;
          }
        });
      }

      /* =========================================================
         FOOTER (Universal)
      ========================================================= */
      const drawStaticFooter = () => {
        const pages = doc.bufferedPageRange();
        for (let i = 0; i < pages.count; i++) {
          doc.switchToPage(i);
          doc.rect(0, doc.page.height - 35, doc.page.width, 35).fill(DARK_BLUE);
          doc
            .font('Helvetica-Bold')
            .fontSize(8)
            .fillColor('white')
            .opacity(0.5)
            .text(
              'ELECTRONIC GENERATED DOCUMENT • NO SIGNATURE REQUIRED',
              0,
              doc.page.height - 22,
              { align: 'center', width: doc.page.width },
            );
        }
      };

      // Wrap up
      drawStaticFooter();
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};
/**
 * Deletes an invoice PDF from Cloudinary using the invoice number.
 */
export const deleteInvoicePDF = async (
  invoiceNumber: string,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Note: Since we use 'folder: invoices' during upload, the public_id is 'invoices/INV-XXXX'
    const publicId = `invoices/${invoiceNumber}`;

    cloudinaryUploads.uploader.destroy(
      publicId,
      { resource_type: 'image', invalidate: true },
      (error, _result) => {
        if (error) {
          // console.error(`Failed to delete PDF ${publicId}:`, error);
          return reject(error);
        }
        // console.log(`Successfully deleted PDF from Cloudinary: ${publicId}`);
        resolve();
      },
    );
  });
};
