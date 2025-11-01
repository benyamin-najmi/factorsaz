# InvoiceCraft Backend

بک‌اند ASP.NET Core Web API برای سیستم صدور فاکتور InvoiceCraft.

## ویژگی‌ها

- API RESTful برای مدیریت فاکتورها
- پایگاه داده SQLite
- Entity Framework Core
- پشتیبانی از CORS
- اعتبارسنجی داده‌ها
- محاسبه خودکار مجموع فاکتور

## نصب

```bash
dotnet restore
```

## اجرا

```bash
dotnet run
```

## API Documentation

پس از اجرا، مستندات API در `https://localhost:5001/swagger` در دسترس است.

## مدل‌های داده

### Invoice
- Id: شناسه فاکتور
- CustomerName: نام مشتری
- Phone: شماره تماس
- Address: آدرس
- Items: لیست کالاها
- Total: مجموع کل
- CreatedAt: تاریخ ایجاد

### InvoiceItem
- Id: شناسه کالا
- Name: نام کالا
- Quantity: تعداد
- UnitPrice: قیمت واحد
- Tax: درصد مالیات
- InvoiceId: شناسه فاکتور مربوطه
