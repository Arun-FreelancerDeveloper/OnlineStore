# Node.js API Service Using Swagger (OpenAPI)

This document explains **how to build a Node.js REST API with Swagger**, including **concepts, folder structure, and well-documented code** so you (or future you 🙂) can easily understand the logic.

---

## 1. What is Swagger / OpenAPI?

**Swagger** is a toolset built around the **OpenAPI Specification (OAS)**.

It allows you to:
- Describe your API in a standard format (YAML/JSON)
- Auto-generate interactive API documentation
- Test APIs directly from the browser
- Help frontend, backend, and QA teams stay aligned

**In short:**
> Swagger = API documentation + testing + contract

---

## 2. Tech Stack Used

- **Node.js** – Runtime
- **Express.js** – Web framework
- **swagger-ui-express** – Serve Swagger UI
- **swagger-jsdoc** – Generate OpenAPI spec from comments

---

## 3. Project Folder Structure

```text
node-swagger-api/
ebook-api/
├── src/
│   ├── config/              # DB, Mail, Env configs
│   │   ├── db.js
│   │   ├── mail.js
│   │   └── index.js
│   │
│   ├── modules/             # Feature-based modules
│   │   ├── auth/
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.service.js
│   │   │   ├── auth.repository.js
│   │   │   ├── auth.routes.js
│   │   │   └── auth.validation.js
│   │   │
│   │   ├── book/
│   │   └── order/
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   └── validate.middleware.js
│   │
│   ├── utils/               # Helpers
│   │   ├── logger.js
│   │   ├── response.js
│   │   └── constants.js
│   │
│   ├── routes/              # Route Aggregator
│   │   └── index.js
│   │
│   ├── app.js               # Express config
│   └── docs/                # Swagger config
│       └── swagger.js
│
├── server.js                # ENTRY POINT ✅
├── .env.development
├── .env.production
├── package.json
└── README.md
```

---

## 4. Install Dependencies

```bash
npm init -y
npm install express swagger-ui-express swagger-jsdoc
```

---

## 5. Swagger Configuration (`swagger.js`)

```js
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'User API Service',
      version: '1.0.0',
      description: 'Simple Node.js API with Swagger documentation',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  },
  // Files where Swagger will look for documentation comments
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
```

### Concept
- `openapi`: Version of OpenAPI spec
- `info`: Metadata about your API
- `servers`: Where the API is hosted
- `apis`: Files containing Swagger comments

---

## 6. Express App Setup (`app.js`)

```js
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const userRoutes = require('./routes/user.routes');

const app = express();

// Middleware to parse JSON
app.use(express.json());

// API Routes
app.use('/api/users', userRoutes);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = app;
```

### Concept
- `/api/users` → Actual API
- `/api-docs` → Swagger UI (interactive docs)

---

## 7. Server Startup (`server.js`)

```js
const app = require('./app');

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Swagger docs on http://localhost:${PORT}/api-docs`);
});
```

---

## 8. Route with Swagger Documentation (`user.routes.js`)

```js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management APIs
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 name: John Doe
 */
router.get('/', userController.getUsers);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Jane Doe
 *     responses:
 *       201:
 *         description: User created successfully
 */
router.post('/', userController.createUser);

module.exports = router;
```

### Concept
- Swagger comments use **JSDoc format**
- Paths must match real routes
- `tags` group APIs in Swagger UI

---

## 9. Controller Logic (`user.controller.js`)

```js
// In-memory data (for demo only)
let users = [{ id: 1, name: 'John Doe' }];

exports.getUsers = (req, res) => {
  res.status(200).json(users);
};

exports.createUser = (req, res) => {
  const { name } = req.body;

  const newUser = {
    id: users.length + 1,
    name,
  };

  users.push(newUser);

  res.status(201).json(newUser);
};
```

---

## 10. How to Run

```bash
node src/server.js
```

Open:
- API: `http://localhost:3000/api/users`
- Swagger Docs: `http://localhost:3000/api-docs`

---

## 11. Key Concepts Recap

- **Swagger is a contract** between backend & consumers
- **swagger-jsdoc** reads comments and builds OpenAPI spec
- **swagger-ui-express** displays interactive docs
- Keep routes clean, logic in controllers

---

## 12. Next Improvements (Optional)

- Add request validation
- Add authentication (JWT + Swagger security)
- Use YAML instead of JSDoc
- Connect database (MongoDB / PostgreSQL)
- Version APIs (`/api/v1`)

---

If you want, I can:
- Convert this to **TypeScript**
- Add **JWT auth in Swagger**
- Use **Swagger YAML instead of comments**
- Create a **production-ready boilerplate**

Just tell me 👍



---

# README.md (Project Instructions)

Below is a **production-style README.md** you can copy directly into your project. It explains setup, usage, and Swagger clearly for future understanding.

---

## 📌 Project: Node.js API Service with Swagger (OpenAPI)

This project is a simple **Node.js REST API** built with **Express.js** and documented using **Swagger (OpenAPI 3.0)**.

The goal of this project is to demonstrate:
- Clean API architecture
- Swagger-based API documentation
- Clear separation of routes and business logic
- Easy onboarding for future developers

---

## 🛠 Tech Stack

- Node.js
- Express.js
- Swagger (OpenAPI 3.0)
- swagger-jsdoc
- swagger-ui-express

---

## 📁 Project Structure

```
node-swagger-api/
│
├── src/
│   ├── app.js            # Express app configuration
│   ├── server.js         # Application entry point
│   ├── swagger.js        # Swagger/OpenAPI configuration
│   ├── routes/
│   │   └── user.routes.js    # API routes + Swagger docs
│   └── controllers/
│       └── user.controller.js # Business logic
│
├── package.json
└── README.md
```

---

## ⚙️ Installation

1. Clone the repository

```bash
git clone <repository-url>
cd node-swagger-api
```

2. Install dependencies

```bash
npm install
```

---

## ▶️ Running the Application

Start the server using:

```bash
node src/server.js
```

Server will run on:
```
http://localhost:3000
```

---

## 📄 Swagger API Documentation

Swagger UI is available at:

```
http://localhost:3000/api-docs
```

### What you can do in Swagger UI:
- View all available APIs
- Read request/response schemas
- Test APIs directly from the browser

---

## 🔗 API Endpoints

### Get All Users

```
GET /api/users
```

Response:
```json
[
  {
    "id": 1,
    "name": "John Doe"
  }
]
```

---

### Create User

```
POST /api/users
```

Request Body:
```json
{
  "name": "Jane Doe"
}
```

Response:
```json
{
  "id": 2,
  "name": "Jane Doe"
}
```

---

## 🧠 Swagger Documentation Concept

Swagger documentation is written using **JSDoc comments** inside route files.

Example:

```js
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Successful response
 */
```

These comments are automatically converted into interactive documentation by **swagger-jsdoc**.

---

## 🚀 Future Improvements

- Add authentication (JWT)
- Add request validation
- Connect database (MongoDB / PostgreSQL)
- API versioning (`/api/v1`)
- Convert project to TypeScript

---

## 👨‍💻 Author

Your Name

---

## 📄 License

This project is licensed under the MIT License.

---

✅ This README is designed so **any developer can understand the project without extra explanation**.



JavaScript Naming Conventions (Quick Guide)
camelCase     → variables, functions
PascalCase   → classes, constructors
UPPER_CASE   → constants / env values
kebab-case   → file names (sometimes)
snake_case   → NOT common in JS
 
---

## Module Overview (Pages)

This section explains each major module/page in the `ebook-api` service so developers can quickly understand responsibilities and where to find code.

- **`auth`**: Authentication flows and password management.
  - Files: `src/modules/auth/auth.controller.js`, `auth.service.js`, `auth.repository.js`, `auth.routes.js`, `auth.validation.js`
  - Responsibilities: Login, logout, change password, forgot password, token handling, JWT generation/validation.

- **`user`**: User management APIs.
  - Files: `src/modules/user/user.controller.js`, `user.service.js`, `user.repository.js`, `user.routes.js`, `user.validation.js`
  - Responsibilities: Create user (with password hashing), login (password comparison), pagination for users, update and soft-delete. Sensitive fields (`passwordhash`) are removed before returning user objects.

- **`products`**: Product CRUD and listing.
  - Files: `src/modules/products/*` (controller, service, repository, routes, validation)
  - Responsibilities: Create/update/delete products, upload images, list products with pagination and search.

- **`orders`**: Order management and status updates.
  - Files: `src/modules/orders/*`
  - Responsibilities: Create orders, fetch orders (by id/user/invoice), update order status, order history retrieval.

- **`carts`**: Shopping cart operations.
  - Files: `src/modules/carts/*`
  - Responsibilities: Add to cart, update quantities, bulk updates, delete cart items, get user cart.

- **`categorygroup` / `category`**: Category and category group management.
  - Files: `src/modules/categorygroup/*`, `src/modules/category/*`
  - Responsibilities: CRUD operations for category groups and categories, list with pagination and search.

- **`shipping`**: User shipping addresses.
  - Files: `src/modules/shipping/*`
  - Responsibilities: Create, update, delete, and list addresses by user.

- **`insights`**: Small read-only endpoints for featured/recommended/flash-sale products.
  - Files: `src/modules/insights/*` (featured, recommended, flashsalestoday)
  - Responsibilities: Return curated product lists for home screens.

- **`services`**: Utilities that provide cross-cutting features.
  - Files: `src/services/email.service.js`, `file-upload.service.js`, `payment-gateway.service.js`, `sms.service.js`
  - Responsibilities: Send emails (welcome/order/reset), manage file uploads, interact with payment gateway and SMS provider. These are asynchronous and return Promises; controllers call them without blocking responses when appropriate.

- **`utils`**: Helper utilities used across the app.
  - Files: `src/utils/logger.js`, `mailer.js`, `apiResponse.js`, `validation.util.js`
  - Responsibilities: Centralized logging, wrapper around mailing library, standardized API response format (see `ApiResponse.success|failure|error`) and validation helpers.

- **`middlewares`**: Express middleware.
  - Files: `src/middlewares/auth.middleware.js`, `error.middleware.js`, `upload.middleware.js`
  - Responsibilities: Request authentication/authorization, global error handling, file upload parsing. Controllers must forward errors to the global handler via `next(err)`.

- **`config`**: Environment and external service configuration.
  - Files: `src/config/database.js`, `mail.config.js`, `payment.config.js`, `sms.config.js`, `swagger.js`
  - Responsibilities: DB connection pooling (`pg` Pool), mail/ payment/ SMS credentials, Swagger/OpenAPI settings.

## Coding Conventions & Error Handling

- Controllers: Keep controllers thin. They should do: parse/validate request, call service, return ApiResponse, and forward unexpected errors to `next(err)`.
- Services: Implement business logic and call repositories. Throw errors (with `err.statusCode` when appropriate) to be handled by the global error middleware.
- Repositories: Interact with the database, return raw rows/objects. Avoid throwing custom HTTP errors here; let the service layer decide.
- Error middleware: `src/middlewares/error.middleware.js` now respects `err.statusCode` and returns a consistent JSON payload. Stack traces are included only in non-production.
- Responses: Use `ApiResponse.success(data, message)`, `ApiResponse.failure(message)`, or `ApiResponse.error(message, code)` for error-style JSON responses.

## Recent Fixes Applied

- Login flow: `user.service.js` now correctly `await`s DB lookup, compares hashed passwords using bcrypt, and strips `passwordhash` from returned user.
- Global error handler: improved logging and status code handling.
- Controllers: several controllers updated to forward errors using `next(error)`.
- API response helper: `ApiResponse.error` added.

If you'd like, I can now:
- Generate per-module README files under `src/modules/<module>/README.md` (complete page-by-page docs), or
- Continue and add JSDoc headers/comments to every controller/service/repository file (I can do this in batches and run quick checks).

Tell me which of the two you prefer and I'll continue accordingly.