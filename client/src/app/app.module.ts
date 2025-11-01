import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InvoiceFormComponent } from './components/invoice-form/invoice-form.component';
import { InvoicePreviewComponent } from './components/invoice-preview/invoice-preview.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { InvoiceService } from './services/invoice.service';

@NgModule({
  declarations: [
    AppComponent,
    InvoiceFormComponent,
    InvoicePreviewComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule
  ],
  providers: [InvoiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
