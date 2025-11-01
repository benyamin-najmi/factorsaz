# InvoiceCraft - سیستم صدور فاکتور

یک پروژه فول‌استک برای ایجاد و مدیریت فاکتورها با رابط کاربری فارسی و طراحی مدرن.

## ویژگی‌ها

- **فرانت‌اند**: Angular 17 با TailwindCSS
- **بک‌اند**: ASP.NET Core Web API
- **پایگاه داده**: SQLite
- **رابط کاربری**: کاملاً فارسی با فونت Vazir
- **PDF**: تولید فاکتور با پشتیبانی از فونت فارسی
- **طراحی**: RTL و مدرن

## ساختار پروژه

```
InvoiceCraft/
├── client/          # Angular Frontend
├── server/          # ASP.NET Core Backend
└── README.md
```

## نصب و راه‌اندازی

### پیش‌نیازها

- Node.js (نسخه 18 یا بالاتر)
- .NET 8.0 SDK
- Angular CLI

### راه‌اندازی فرانت‌اند (Angular)

```bash
cd client
npm install
ng serve
```

فرانت‌اند روی `http://localhost:4200` اجرا می‌شود.

### راه‌اندازی بک‌اند (ASP.NET Core)

```bash
cd server
dotnet restore
dotnet run
```

بک‌اند روی `http://localhost:5000` اجرا می‌شود.

## استفاده

1. هر دو سرویس را اجرا کنید
2. به `http://localhost:4200` بروید
3. اطلاعات مشتری و کالاها را وارد کنید
4. پیش‌نمایش فاکتور را مشاهده کنید
5. فاکتور را به صورت PDF دانلود کنید

## API Endpoints

- `GET /api/invoices` - دریافت همه فاکتورها
- `POST /api/invoices` - ایجاد فاکتور جدید
- `GET /api/invoices/{id}` - دریافت فاکتور خاص
- `PUT /api/invoices/{id}` - به‌روزرسانی فاکتور
- `DELETE /api/invoices/{id}` - حذف فاکتور

## تکنولوژی‌های استفاده شده

### Frontend
- Angular 17
- TailwindCSS
- TypeScript
- PDFMake
- Vazir Font

### Backend
- ASP.NET Core 8.0
- Entity Framework Core
- SQLite
- Swagger/OpenAPI
