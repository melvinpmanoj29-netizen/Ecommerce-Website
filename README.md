# ME10XLUXE - Full Stack E-Commerce Platform

A modern full-stack e-commerce application built with a robust ASP.NET Core backend and a responsive React frontend, delivering a seamless online shopping experience.

## Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* Axios
* React Router

### Backend

* ASP.NET Core Web API
* Entity Framework Core
* SQL Server
* AutoMapper
* FluentValidation
* JWT Authentication

### Cloud & Services

* Cloudinary (Image Storage)
* Email Service Integration (Transactional Emails)

---

## Features

### Authentication & User Management

* User Registration and Login
* JWT-based Authentication and Authorization
* Email Verification
* Forgot Password & Password Reset via Email
* Secure Password Management

### Product Management

* Create, Read, Update, and Delete Products
* Category Management
* Product Image Upload with Cloudinary

### Shopping Experience

* Browse Products by Category
* Shopping Cart Management
* Update Item Quantities
* Remove Cart Items
* Responsive User Interface

### Order Management

* Place Orders
* Order Tracking
* Order History
* Admin Order Management Dashboard

### Notifications & Communication

* Automated Account Emails
* Password Reset Emails
* Order Confirmation Notifications

---

## Project Structure

```text
ME10XLUXE/
├── Ecommerce.API/       # ASP.NET Core Web API Backend
└── ecommerce-client/    # React + TypeScript Frontend
```

---

## Getting Started

### Prerequisites

* Node.js
* .NET SDK
* SQL Server
* Cloudinary Account

### Installation

#### Clone the Repository

```bash
git clone https://github.com/your-username/ME10XLUXE.git
cd ME10XLUXE
```

#### Backend Setup

```bash
cd Ecommerce.API
```

1. Configure `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "YOUR_SQL_SERVER_CONNECTION"
  },
  "Jwt": {
    "Key": "YOUR_SECRET_KEY"
  },
  "Cloudinary": {
    "CloudName": "YOUR_CLOUD_NAME",
    "ApiKey": "YOUR_API_KEY",
    "ApiSecret": "YOUR_API_SECRET"
  },
  "EmailSettings": {
    "Host": "YOUR_SMTP_HOST",
    "Port": "YOUR_SMTP_PORT",
    "Username": "YOUR_EMAIL",
    "Password": "YOUR_EMAIL_PASSWORD"
  }
}
```

2. Apply migrations:

```bash
dotnet ef database update
```

3. Run the API:

```bash
dotnet run
```

#### Frontend Setup

```bash
cd ecommerce-client
npm install
npm run dev
```

---

## API Features

* RESTful API Architecture
* Entity Framework Core Code-First Approach
* DTO Mapping with AutoMapper
* Request Validation with FluentValidation
* Secure JWT Authentication
* Email Service Integration
* Global Exception Handling

---

## Author

**Melvin P Manoj**

If you found this project helpful, feel free to star the repository.
