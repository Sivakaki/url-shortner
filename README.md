# URL Shortener API

A RESTful backend service for link shortening, click analytics, and user access management built with Node.js, Express.js, and MongoDB.

---

## Overview

The URL Shortener API provides a scalable backend infrastructure for generating short aliases for long URLs, tracking link click metrics, and handling user registration and authentication.

---

## Key Features

- **Authentication & Security**: JWT-based session handling with password hashing via `bcrypt`.
- **URL Shortening**: Generates unique short keys for target URLs using cryptographically secure random values.
- **Analytics**: Tracks redirection frequency per shortened URL.
- **URL Management**: Complete CRUD capabilities for authenticated user-owned links.
- **HTTP Redirection**: Direct redirection service from short codes to original target URLs.
- **Standardized Response Schema**: Consistent JSON API response formats and error handling middleware.

---

## Technology Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js 5
- **Database**: MongoDB (via Mongoose ODM)
- **Authentication**: JSON Web Tokens (JWT) & bcrypt
- **Utilities**: Nodemon, dotenv

---

## Project Structure

```
urlShortner/
├── public/                 # Static public files
├── src/
│   ├── controllers/        # Request handlers and business logic
│   │   ├── url.controller.js
│   │   └── user.controller.js
│   ├── db/                 # Database configuration and connection
│   │   └── index.js
│   ├── middlewares/        # Custom Express middlewares
│   │   └── auth.middleware.js
│   ├── models/             # Mongoose schemas
│   │   ├── url.model.js
│   │   └── user.model.js
│   ├── routes/             # Express router modules
│   │   ├── redirect.route.js
│   │   ├── url.route.js
│   │   └── user.route.js
│   ├── utils/              # Helper modules and error handlers
│   │   ├── apiError.js
│   │   ├── apiResponse.js
│   │   ├── asyncHandler.js
│   │   └── generateShortCode.js
│   ├── app.js              # Application entry and middleware configuration
│   ├── constants.js        # Application constants
│   └── index.js            # Server startup entry point
├── .env.sample             # Environment configuration template
├── package.json
└── README.md
```

---

## Configuration

Environment variables must be configured in a `.env` file at the root directory:

```env
PORT=8000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net
BASE_URL=http://localhost:8000
ACCESS_TOKEN_SECRET=your_jwt_secret_key
ACCESS_TOKEN_EXPIRY=1d
```

---

## Installation & Setup

### Prerequisites

- Node.js (v18.0.0 or higher)
- MongoDB instance (local or MongoDB Atlas)

### Steps

1. Clone the repository:
   ```bash
   git clone <repository_url>
   cd urlShortner
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.sample .env
   ```

4. Start the application:
   - **Development Mode**:
     ```bash
     npm run dev
     ```
   - **Production Mode**:
     ```bash
     npm start
     ```

---

## API Specification

### User Authentication Endpoints (`/api/v1/users`)

| Method | Endpoint | Description | Authentication |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/v1/users/register` | Register a new user account | No |
| `POST` | `/api/v1/users/login` | Authenticate user and issue access token | No |
| `GET` | `/api/v1/users/current-user` | Retrieve authenticated user profile | Required |
| `POST` | `/api/v1/users/change-password` | Update current user password | Required |

### URL Management Endpoints (`/api/v1/url`)

All requests require `Authorization: Bearer <token>` in headers.

| Method | Endpoint | Description | Authentication |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/v1/url` | Create a shortened URL | Required |
| `GET` | `/api/v1/url` | List all URLs owned by user | Required |
| `GET` | `/api/v1/url/:shortCode` | Get details for a specific short code | Required |
| `PATCH` | `/api/v1/url/:shortCode` | Update destination URL | Required |
| `DELETE` | `/api/v1/url/:shortCode` | Remove a shortened URL | Required |

### Redirection Endpoint (`/`)

| Method | Endpoint | Description | Authentication |
| :--- | :--- | :--- | :---: |
| `GET` | `/:shortCode` | Redirect to destination URL and record analytics | No |

---

## Response Formats

### Success Response Example

`POST /api/v1/url`

**Request Body**:
```json
{
  "originalUrl": "https://example.com/target-page"
}
```

**Response (201 Created)**:
```json
{
  "statusCode": 201,
  "data": {
    "originalUrl": "https://example.com/target-page",
    "shortCode": "aB3x9Q",
    "shortUrl": "http://localhost:8000/aB3x9Q"
  },
  "message": "Short url created successfully",
  "success": true
}
```

### Error Response Example

```json
{
  "statusCode": 400,
  "success": false,
  "message": "Not valid url",
  "errors": [],
  "data": null
}
