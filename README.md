# 📚 Online Store – E-Book System

A full-stack **Online E-Book Store Platform** built using **Node.js, PostgreSQL, and Angular**, designed with a **Monorepo architecture** for scalability, maintainability, and clean separation of concerns.

---

## 🏗️ System Architecture

| Layer | Technology |
|------|-----------|
| Backend API | Node.js + Express |
| Database | PostgreSQL |
| Client Portal | Angular |
| Admin Portal | Angular |

---

## 🌐 Application Domains

| Module 
|------
| Client Portal 
| Admin Portal 
| Backend API 
---


## 🚀 Features
### 📘 Client Portal
- Browse and search e-books
- View book details
- Secure purchase flow
- User authentication

### 🛠️ Admin Portal
- Category & book management
- Price and stock control
- Order management
- Dashboard and reports

### 🔌 Backend API
- RESTful APIs
- JWT-based authentication
- PostgreSQL integration
- Clean modular architecture
- Swagger documentation

## 📁 Monorepo Project Structure

```bash
OnlineStore/
│
├── ebook-api/                     # Backend – Node.js + Express + PostgreSQL
│   ├── src/
│   │   ├── controllers/           # API controllers
│   │   ├── routes/                # REST API routes
│   │   ├── models/                # Database models
│   │   ├── middlewares/           # Authentication & custom middleware
│   │   └── app.js                 # Express app entry
│   │
│   ├── config/                    # Configuration files
│   ├── package.json
│   ├── .env.example               # Environment variables template
│   └── README.md                  # Backend documentation
│
├── ebook-client-app/               # Angular – Client Portal
│   ├── src/
│   ├── angular.json
│   ├── package.json
│   └── README.md                  # Client app documentation
│
├── ebook-admin-app/                # Angular – Admin Portal
│   ├── src/
│   ├── angular.json
│   ├── package.json
│   └── README.md                  # Admin app documentation
│
├── .gitignore
├── docker-compose.yml              # Optional (Docker setup – future use)
└── README.md                       # Project overview

##Testing

