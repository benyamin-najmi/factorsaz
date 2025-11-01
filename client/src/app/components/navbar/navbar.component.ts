import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  template: `
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-primary-600">InvoiceCraft</h1>
            <span class="mr-3 text-gray-500 text-sm">سیستم صدور فاکتور</span>
          </div>
          <div class="flex items-center space-x-4 space-x-reverse">
            <span class="text-gray-600 text-sm">خوش آمدید</span>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: []
})
export class NavbarComponent { }
