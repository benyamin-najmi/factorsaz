import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Invoice, InvoiceItem } from '../../models/invoice.model';
import { InvoiceService } from '../../services/invoice.service';
import { InvoicePreviewComponent } from '../invoice-preview/invoice-preview.component';

@Component({
  selector: 'app-invoice-form',
  template: `
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Invoice Form -->
      <div class="space-y-6">
        <div class="card">
          <h2 class="text-xl font-bold text-gray-800 mb-6">اطلاعات فاکتور</h2>
          
          <form [formGroup]="invoiceForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <!-- Customer Information -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-700">اطلاعات مشتری</h3>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">نام مشتری</label>
                <input
                  type="text"
                  formControlName="customerName"
                  class="input-field"
                  placeholder="نام مشتری را وارد کنید"
                >
                <div *ngIf="invoiceForm.get('customerName')?.invalid && invoiceForm.get('customerName')?.touched" 
                     class="text-red-500 text-sm mt-1">
                  نام مشتری الزامی است
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">شماره تماس</label>
                <input
                  type="tel"
                  formControlName="phone"
                  class="input-field"
                  placeholder="شماره تماس را وارد کنید"
                >
                <div *ngIf="invoiceForm.get('phone')?.invalid && invoiceForm.get('phone')?.touched" 
                     class="text-red-500 text-sm mt-1">
                  شماره تماس الزامی است
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">آدرس</label>
                <textarea
                  formControlName="address"
                  class="input-field"
                  rows="3"
                  placeholder="آدرس مشتری را وارد کنید"
                ></textarea>
                <div *ngIf="invoiceForm.get('address')?.invalid && invoiceForm.get('address')?.touched" 
                     class="text-red-500 text-sm mt-1">
                  آدرس الزامی است
                </div>
              </div>
            </div>
            
            <!-- Items Section -->
            <div class="space-y-4">
              <div class="flex justify-between items-center">
                <h3 class="text-lg font-semibold text-gray-700">کالاها</h3>
                <button
                  type="button"
                  (click)="addItem()"
                  class="btn-primary text-sm"
                >
                  + افزودن کالا
                </button>
              </div>
              
              <div formArrayName="items" class="space-y-3">
                <div
                  *ngFor="let item of items.controls; let i = index"
                  [formGroupName]="i"
                  class="border border-gray-200 rounded-lg p-4 bg-gray-50"
                >
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">نام کالا</label>
                      <input
                        type="text"
                        formControlName="name"
                        class="input-field text-sm"
                        placeholder="نام کالا"
                      >
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">تعداد</label>
                      <input
                        type="number"
                        formControlName="quantity"
                        class="input-field text-sm persian-number"
                        placeholder="0"
                        min="1"
                        (input)="calculateTotal()"
                      >
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">قیمت واحد (تومان)</label>
                      <input
                        type="number"
                        formControlName="unitPrice"
                        class="input-field text-sm persian-number"
                        placeholder="0"
                        min="0"
                        (input)="calculateTotal()"
                      >
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">مالیات (%)</label>
                      <input
                        type="number"
                        formControlName="tax"
                        class="input-field text-sm persian-number"
                        placeholder="0"
                        min="0"
                        max="100"
                        (input)="calculateTotal()"
                      >
                    </div>
                  </div>
                  
                  <div class="flex justify-end mt-3">
                    <button
                      type="button"
                      (click)="removeItem(i)"
                      class="btn-danger text-sm"
                      [disabled]="items.length === 1"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Total Section -->
            <div class="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <div class="flex justify-between items-center">
                <span class="text-lg font-semibold text-gray-800">مجموع کل:</span>
                <span class="text-2xl font-bold text-primary-600 persian-number">
                  {{ totalAmount | number:'1.0-0' }} تومان
                </span>
              </div>
            </div>
            
            <!-- Action Buttons -->
            <div class="flex justify-end space-x-4 space-x-reverse">
              <button
                type="button"
                (click)="resetForm()"
                class="btn-secondary"
              >
                پاک کردن
              </button>
              <button
                type="submit"
                [disabled]="invoiceForm.invalid || items.length === 0"
                class="btn-primary"
              >
                ذخیره فاکتور
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <!-- Invoice Preview -->
      <div class="lg:sticky lg:top-8">
        <app-invoice-preview
          [invoice]="currentInvoice"
          [totalAmount]="totalAmount"
          (generatePdf)="generatePdf()"
        ></app-invoice-preview>
      </div>
    </div>
  `,
  styles: []
})
export class InvoiceFormComponent implements OnInit {
  invoiceForm: FormGroup;
  totalAmount = 0;
  currentInvoice: Invoice | null = null;

  constructor(
    private fb: FormBuilder,
    private invoiceService: InvoiceService
  ) {
    this.invoiceForm = this.fb.group({
      customerName: ['', Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      items: this.fb.array([this.createItem()])
    });
  }

  ngOnInit() {
    this.calculateTotal();
    this.updateCurrentInvoice();
  }

  get items(): FormArray {
    return this.invoiceForm.get('items') as FormArray;
  }

  createItem(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitPrice: [0, [Validators.required, Validators.min(0)]],
      tax: [0, [Validators.min(0), Validators.max(100)]]
    });
  }

  addItem() {
    this.items.push(this.createItem());
    this.calculateTotal();
    this.updateCurrentInvoice();
  }

  removeItem(index: number) {
    if (this.items.length > 1) {
      this.items.removeAt(index);
      this.calculateTotal();
      this.updateCurrentInvoice();
    }
  }

  calculateTotal() {
    let total = 0;
    this.items.controls.forEach(item => {
      const quantity = item.get('quantity')?.value || 0;
      const unitPrice = item.get('unitPrice')?.value || 0;
      const tax = item.get('tax')?.value || 0;
      
      const subtotal = quantity * unitPrice;
      const taxAmount = (subtotal * tax) / 100;
      total += subtotal + taxAmount;
    });
    
    this.totalAmount = total;
  }

  updateCurrentInvoice() {
    if (this.invoiceForm.valid) {
      this.currentInvoice = {
        customerName: this.invoiceForm.get('customerName')?.value,
        phone: this.invoiceForm.get('phone')?.value,
        address: this.invoiceForm.get('address')?.value,
        items: this.items.value,
        total: this.totalAmount
      };
    } else {
      this.currentInvoice = null;
    }
  }

  onSubmit() {
    if (this.invoiceForm.valid) {
      const invoice: Invoice = {
        customerName: this.invoiceForm.get('customerName')?.value,
        phone: this.invoiceForm.get('phone')?.value,
        address: this.invoiceForm.get('address')?.value,
        items: this.items.value,
        total: this.totalAmount
      };

      this.invoiceService.createInvoice(invoice).subscribe({
        next: (savedInvoice) => {
          alert('فاکتور با موفقیت ذخیره شد!');
          this.resetForm();
        },
        error: (error) => {
          console.error('خطا در ذخیره فاکتور:', error);
          alert('خطا در ذخیره فاکتور. لطفاً دوباره تلاش کنید.');
        }
      });
    }
  }

  resetForm() {
    this.invoiceForm.reset();
    this.items.clear();
    this.addItem();
    this.totalAmount = 0;
    this.currentInvoice = null;
  }

  generatePdf() {
    if (this.currentInvoice) {
      // PDF generation will be handled by the preview component
      console.log('Generating PDF for invoice:', this.currentInvoice);
    }
  }
}
