import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Invoice } from '../../models/invoice.model';
declare var pdfMake: any;

@Component({
  selector: 'app-invoice-preview',
  template: `
    <div class="card">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold text-gray-800">پیش‌نمایش فاکتور</h2>
        <button
          (click)="generatePdf()"
          [disabled]="!invoice"
          class="btn-primary"
        >
          دانلود PDF
        </button>
      </div>
      
      <div *ngIf="invoice" class="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
        <!-- Header -->
        <div class="text-center border-b border-gray-200 pb-4">
          <h1 class="text-2xl font-bold text-primary-600 mb-2">InvoiceCraft</h1>
          <p class="text-gray-600">سیستم صدور فاکتور</p>
        </div>
        
        <!-- Invoice Info -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 class="font-semibold text-gray-800 mb-2">اطلاعات مشتری</h3>
            <div class="space-y-1 text-sm text-gray-600">
              <p><strong>نام:</strong> {{ invoice.customerName }}</p>
              <p><strong>تلفن:</strong> {{ invoice.phone }}</p>
              <p><strong>آدرس:</strong> {{ invoice.address }}</p>
            </div>
          </div>
          
          <div>
            <h3 class="font-semibold text-gray-800 mb-2">اطلاعات فاکتور</h3>
            <div class="space-y-1 text-sm text-gray-600">
              <p><strong>تاریخ:</strong> {{ currentDate | date:'yyyy/MM/dd' }}</p>
              <p><strong>شماره فاکتور:</strong> #{{ generateInvoiceNumber() }}</p>
            </div>
          </div>
        </div>
        
        <!-- Items Table -->
        <div>
          <h3 class="font-semibold text-gray-800 mb-3">کالاها</h3>
          <div class="overflow-x-auto">
            <table class="table">
              <thead>
                <tr>
                  <th class="text-right">نام کالا</th>
                  <th class="text-center">تعداد</th>
                  <th class="text-left">قیمت واحد</th>
                  <th class="text-left">مالیات</th>
                  <th class="text-left">جمع</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let item of invoice.items; let i = index">
                  <td>{{ item.name }}</td>
                  <td class="text-center persian-number">{{ item.quantity }}</td>
                  <td class="text-left persian-number">{{ item.unitPrice | number:'1.0-0' }}</td>
                  <td class="text-left persian-number">{{ item.tax }}%</td>
                  <td class="text-left persian-number">{{ calculateItemTotal(item) | number:'1.0-0' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <!-- Total -->
        <div class="border-t border-gray-200 pt-4">
          <div class="flex justify-end">
            <div class="w-64">
              <div class="flex justify-between items-center py-2">
                <span class="text-lg font-semibold text-gray-800">مجموع کل:</span>
                <span class="text-xl font-bold text-primary-600 persian-number">
                  {{ totalAmount | number:'1.0-0' }} تومان
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="text-center text-sm text-gray-500 border-t border-gray-200 pt-4">
          <p>با تشکر از انتخاب شما</p>
          <p>InvoiceCraft - سیستم صدور فاکتور</p>
        </div>
      </div>
      
      <div *ngIf="!invoice" class="text-center py-12 text-gray-500">
        <div class="text-6xl mb-4">📄</div>
        <p>لطفاً اطلاعات فاکتور را تکمیل کنید</p>
      </div>
    </div>
  `,
  styles: []
})
export class InvoicePreviewComponent implements OnInit {
  @Input() invoice: Invoice | null = null;
  @Input() totalAmount: number = 0;
  @Output() generatePdf = new EventEmitter<void>();
  
  currentDate = new Date();

  ngOnInit() {
    // Initialize any required setup
  }

  calculateItemTotal(item: any): number {
    const subtotal = item.quantity * item.unitPrice;
    const taxAmount = (subtotal * item.tax) / 100;
    return subtotal + taxAmount;
  }

  generateInvoiceNumber(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${year}${month}${day}${random}`;
  }

  generatePdf() {
    if (!this.invoice) return;

    const docDefinition = {
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 60],
      content: [
        // Header
        {
          text: 'InvoiceCraft',
          style: 'header',
          alignment: 'center',
          margin: [0, 0, 0, 20]
        },
        {
          text: 'سیستم صدور فاکتور',
          style: 'subheader',
          alignment: 'center',
          margin: [0, 0, 0, 30]
        },
        
        // Invoice Info
        {
          columns: [
            {
              width: '*',
              text: [
                { text: 'اطلاعات مشتری:\n', style: 'label' },
                { text: `نام: ${this.invoice.customerName}\n` },
                { text: `تلفن: ${this.invoice.phone}\n` },
                { text: `آدرس: ${this.invoice.address}` }
              ]
            },
            {
              width: '*',
              text: [
                { text: 'اطلاعات فاکتور:\n', style: 'label' },
                { text: `تاریخ: ${this.currentDate.toLocaleDateString('fa-IR')}\n` },
                { text: `شماره فاکتور: #${this.generateInvoiceNumber()}` }
              ]
            }
          ],
          margin: [0, 0, 0, 20]
        },
        
        // Items Table
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', 'auto', 'auto'],
            body: [
              [
                { text: 'نام کالا', style: 'tableHeader' },
                { text: 'تعداد', style: 'tableHeader' },
                { text: 'قیمت واحد', style: 'tableHeader' },
                { text: 'مالیات (%)', style: 'tableHeader' },
                { text: 'جمع', style: 'tableHeader' }
              ],
              ...this.invoice.items.map(item => [
                item.name,
                { text: item.quantity.toString(), alignment: 'center' },
                { text: item.unitPrice.toLocaleString('fa-IR'), alignment: 'left' },
                { text: `${item.tax}%`, alignment: 'left' },
                { text: this.calculateItemTotal(item).toLocaleString('fa-IR'), alignment: 'left' }
              ])
            ]
          },
          margin: [0, 0, 0, 20]
        },
        
        // Total
        {
          columns: [
            { width: '*', text: '' },
            {
              width: 'auto',
              table: {
                body: [
                  [
                    { text: 'مجموع کل:', style: 'totalLabel' },
                    { text: `${this.totalAmount.toLocaleString('fa-IR')} تومان`, style: 'totalValue' }
                  ]
                ]
              },
              layout: 'noBorders'
            }
          ]
        },
        
        // Footer
        {
          text: 'با تشکر از انتخاب شما\nInvoiceCraft - سیستم صدور فاکتور',
          style: 'footer',
          alignment: 'center',
          margin: [0, 30, 0, 0]
        }
      ],
      styles: {
        header: {
          fontSize: 24,
          bold: true,
          color: '#2563eb'
        },
        subheader: {
          fontSize: 14,
          color: '#6b7280'
        },
        label: {
          fontSize: 12,
          bold: true,
          color: '#374151'
        },
        tableHeader: {
          fontSize: 12,
          bold: true,
          color: '#374151',
          fillColor: '#f9fafb'
        },
        totalLabel: {
          fontSize: 16,
          bold: true,
          color: '#374151'
        },
        totalValue: {
          fontSize: 18,
          bold: true,
          color: '#2563eb'
        },
        footer: {
          fontSize: 10,
          color: '#6b7280'
        }
      },
      defaultStyle: {
        font: 'Vazir'
      }
    };

    // Generate and download PDF
    if (typeof pdfMake !== 'undefined') {
      pdfMake.createPdf(docDefinition).download(`فاکتور_${this.invoice.customerName}_${this.generateInvoiceNumber()}.pdf`);
    } else {
      console.error('pdfMake is not loaded');
      alert('خطا در بارگذاری کتابخانه PDF. لطفاً صفحه را مجدداً بارگذاری کنید.');
    }
  }
}
