# ME10XLUXE - Full Stack E-Commerce Platform

A modern, scalable full-stack e-commerce application built with **ASP.NET Core Web API** and **React**, delivering a secure, responsive, and feature-rich online shopping experience.

---

## Overview

ME10XLUXE is a production-ready e-commerce platform featuring secure authentication, product and category management, cloud-based image storage, shopping cart functionality, order processing, and transactional email notifications.

The application follows clean architecture principles using the **Repository Pattern**, **Service Layer Pattern**, **DTOs**, and **Entity Framework Core Code-First** development.

---

## Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* Axios
* React Router DOM
* Context API
* Framer Motion

### Backend

* ASP.NET Core Web API
* Entity Framework Core
* SQL Server
* AutoMapper
* FluentValidation
* JWT Authentication
* BCrypt Password Hashing

### Cloud & External Services

* Cloudinary (Image Storage)
* SMTP Email Service (Transactional Emails)

### Development Tools

* Git & GitHub
* Swagger / OpenAPI
* Visual Studio
* Visual Studio Code
* Postman

---

## Key Features

### Authentication & User Management

* User Registration and Login
* JWT-based Authentication and Authorization
* Role-Based Access Control (Admin & Customer)
* Email Verification
* Forgot Password & Password Reset via Email
* Secure Password Hashing with BCrypt
* Protected API Endpoints

### Product & Category Management

* Create, Read, Update, and Delete Products
* Category Management
* Product Search and Filtering
* Product Image Upload via Cloudinary
* Admin Product Dashboard

### Shopping Experience

* Browse Products by Category
* Product Search Functionality
* Shopping Cart Management
* Update Cart Item Quantities
* Remove Items from Cart
* Responsive User Interface
* Dark Mode Support

### Order Management

* Place Orders
* Order History
* Order Tracking
* Order Confirmation Emails
* Admin Order Management Dashboard

### Notifications & Communication

* Automated Welcome Emails
* Password Reset Emails
* Order Confirmation Notifications

---

## Architecture & Design Patterns

* Repository Pattern
* Service Layer Pattern
* Dependency Injection
* DTO-Based API Design
* Entity Framework Core Code-First Approach
* Global Exception Handling
* Input Validation with FluentValidation

---

## Project Structure

```text
ME10XLUXE/
│
├── Ecommerce.API/          # ASP.NET Core Web API Backend
│   ├── Controllers/
│   ├── Services/
│   ├── Repositories/
│   ├── DTOs/
│   ├── Models/
│   ├── Data/
│   ├── Validators/
│   └── Migrations/
│
└── ecommerce-client/       # React + TypeScript Frontend
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── context/
    │   ├── services/
    │   └── routes/
```

---

## Getting Started

### Prerequisites

* Node.js (v18 or later)
* .NET SDK (v8 or later)
* SQL Server
* Cloudinary Account
* SMTP Email Provider

---

## Installation & Setup

### Clone the Repository

```bash
git clone https://github.com/your-username/ME10XLUXE.git

cd ME10XLUXE
```

### Backend Setup

```bash
cd Ecommerce.API
```

Create an `appsettings.json` file:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "YOUR_SQL_SERVER_CONNECTION"
  },
  "Jwt": {
    "Key": "YOUR_SECRET_KEY",
    "Issuer": "YOUR_ISSUER",
    "Audience": "YOUR_AUDIENCE"
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

Apply database migrations:

```bash
dotnet ef database update
```

Run the API:

```bash
dotnet run
```

The API will be available at:

```text
https://localhost:xxxx/swagger
```

### Frontend Setup

```bash
cd ecommerce-client

npm install

npm run dev
```

The frontend will be available at:

```text
http://localhost:5173
```

---

## API Features

* RESTful API Architecture
* Swagger/OpenAPI Documentation
* JWT Authentication & Authorization
* DTO Mapping with AutoMapper
* Request Validation with FluentValidation
* Entity Framework Core Migrations
* Global Exception Handling
* Transactional Email Integration

---

## Environment Variables & Security

> **Important:** Never commit secrets or API keys to source control.

Use:

* `appsettings.Development.json`
* User Secrets (`dotnet user-secrets`)
* Environment Variables

Ensure the following sensitive values are excluded from Git:

* Database Connection Strings
* JWT Secret Keys
* Cloudinary Credentials
* SMTP Credentials

---

## Future Enhancements

* Wishlist Functionality
* Payment Gateway Integration
* Product Reviews and Ratings
* Inventory Management
* Coupon & Discount System
* Analytics Dashboard
* Docker Support
* CI/CD Pipeline

---

## Author

**Melvin P Manoj**

If you found this project helpful, consider giving the repository a ⭐.
