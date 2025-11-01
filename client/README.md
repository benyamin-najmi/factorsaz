# InvoiceCraft Frontend

فرانت‌اند Angular برای سیستم صدور فاکتور InvoiceCraft.

## ویژگی‌ها

- رابط کاربری کاملاً فارسی با فونت Vazir
- طراحی RTL و مدرن با TailwindCSS
- فرم ایجاد فاکتور با اعتبارسنجی
- پیش‌نمایش زنده فاکتور
- تولید PDF با پشتیبانی از فونت فارسی
- محاسبه خودکار مجموع و مالیات

## نصب

```bash
npm install
```

## اجرا

```bash
ng serve
```

## ساخت

```bash
ng build
```

## ساختار کامپوننت‌ها

- `InvoiceFormComponent`: فرم ایجاد فاکتور
- `InvoicePreviewComponent`: پیش‌نمایش و تولید PDF
- `NavbarComponent`: نوار بالای صفحه
- `InvoiceService`: سرویس ارتباط با API
