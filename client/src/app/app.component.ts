import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="min-h-screen bg-gray-50">
      <app-navbar></app-navbar>
      <main class="container mx-auto px-4 py-8">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: []
})
export class AppComponent {
  title = 'InvoiceCraft';
}
