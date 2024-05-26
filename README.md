## Live Links
- Backend: https://iitb-m6cl.onrender.com
- Frontend: https://spontaneous-salamander-50a3b0.netlify.app
- Live Demo: https://drive.google.com/file/d/1qM2P7ekb9DnqmDUB3df7Ph-bYIpQjSRR/view?usp=sharing

Here is the markdown documentation for the provided API controllers:
# Project Documentation

## Overview

This project consists of a Node.js backend server and a React frontend, integrated with authentication, file uploads, and user management features.

## Tech Stack

- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT, Bcrypt, 
- **Frontend**: React, Chakra UI, reCAPTCHA
- **Other Libraries**: Validator, Multer (for file uploads)

## Environment Variables

Create a `.env` file in the root of the project with the following variables:

### Backend

```env
SECRET= Your secret key
MONGO= Your mongo uri
PORT=8000
CAPTCHA_SECRET= Your captcha secret of v2 invisible
```

### Frontend

Create a `.env` file in the root of the frontend directory with the following variable:

```env
VITE_SECRET= Your recaptcha secret
VITE_SERVER= Your server link
```

## Running the Project Locally

### Prerequisites

- Node.js installed on your machine
- MongoDB installed and running locally

### Backend Setup

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/your-repo.git
    ```

2. Navigate to the backend directory:
    ```sh
    cd your-repo/backend
    ```

3. Install dependencies:
    ```sh
    npm install
    ```

4. Set up environment variables as described in the **Environment Variables** section.

5. Start the server:
    ```sh
    npm start
    ```

The backend server should now be running at `http://localhost:8000`.

### Frontend Setup

1. Navigate to the frontend directory:
    ```sh
    cd ../frontend
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Set up environment variables as described in the **Environment Variables** section.

4. Start the frontend development server:
    ```sh
    npm run dev
    ```

The frontend should now be running at `http://localhost:5173`.

# API Documentation

## User Signup

### Endpoint
```
POST /api/auth/signup
```

### Description
Registers a new user in the system.

### Request Body
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "dateOfBirth": "string (date in ISO format)",
  "photo": {
    "data": "Buffer",
    "contentType": "string"
  },
  "cv": {
    "data": "Buffer",
    "contentType": "string"
  },
  "recaptchaToken": "string"
}
```

### Responses

#### Success
```json
{
  "ok": true,
  "message": "Signup successful! Please log in."
}
```

#### Errors
- `400 Bad Request`
  ```json
  {
    "ok": false,
    "message": "reCAPTCHA verification failed"
  }
  ```
  ```json
  {
    "ok": false,
    "message": "All fields are required."
  }
  ```
  ```json
  {
    "ok": false,
    "message": "Password is not strong"
  }
  ```

- `500 Internal Server Error`
  ```json
  {
    "ok": false,
    "message": "Signup failed!"
  }
  ```

## User or Admin Login

### Endpoint
```
POST /api/auth/login
```

### Description
Logs in a user or an admin and returns a JWT token.

### Request Body
```json
{
  "username": "string",
  "password": "string",
  "recaptchaToken": "string"
}
```

### Responses

#### Success
```json
{
  "ok": true,
  "token": "string",
  "isAdmin": "boolean",
  "details": {
    "_id": "string",
    "username": "string",
    "email": "string",
    "dateOfBirth": "string (date in ISO format)",
    "photo": {
      "data": "string (base64)",
      "contentType": "string"
    },
    "cv": {
      "data": "string (base64)",
      "contentType": "string"
    }
  }
}
```

#### Errors
- `400 Bad Request`
  ```json
  {
    "ok": false,
    "message": "reCAPTCHA verification failed"
  }
  ```
  ```json
  {
    "ok": false,
    "message": "Invalid username or password."
  }
  ```

- `401 Unauthorized`
  ```json
  {
    "ok": false,
    "message": "Invalid username or password."
  }
  ```
  ```json
  {
    "ok": false,
    "message": "Wait for admin to verify your account."
  }
  ```

- `500 Internal Server Error`
  ```json
  {
    "ok": false,
    "message": "Server error"
  }
  ```

## Notes

- `photo` and `cv` fields in the request body should be in Buffer format and include the `contentType`.
- The password is hashed before storing in the database.
- The `isStrongPassword` function from the `validator` library is used to ensure password strength.
- The `verifyRecaptcha` service is used to validate the reCAPTCHA token.
- The JWT token is generated using the `jsonwebtoken` library and is valid for 1 day.
- Only verified users can log in. Admin verification is required before a user can log in.

Here is the markdown documentation for the provided API controllers:

## Get All Users

### Endpoint
```
GET /api/users
```

### Description
Retrieves a list of all users. Only accessible by admins. Supports pagination and filtering by verification status.

### Query Parameters
- `page` (optional): Page number for pagination (default: 1).
- `limit` (optional): Number of users per page (default: 10).
- `isVerified` (optional): Filter users by verification status (`true` or `false`).

### Responses

#### Success
```json
{
  "ok": true,
  "users": [
    {
      "_id": "string",
      "username": "string",
      "email": "string",
      "dateOfBirth": "string"
    }
  ],
  "totalPages": "number",
  "currentPage": "number"
}
```

#### Errors
- `403 Forbidden`
  ```json
  {
    "ok": false,
    "message": "Unauthorized: Only admins can access all users"
  }
  ```

- `500 Internal Server Error`
  ```json
  {
    "ok": false,
    "message": "Server error"
  }
  ```

## Get User By ID

### Endpoint
```
GET /api/users/:id
```

### Description
Retrieves the details of a user by their ID. Users can only access their own details, while admins can access any user's details.

### Path Parameters
- `id`: The ID of the user.

### Responses

#### Success
```json
{
  "ok": true,
  "user": {
    "_id": "string",
    "username": "string",
    "email": "string",
    "dateOfBirth": "string",
    "photo": {
      "data": "string (base64)",
      "contentType": "string"
    },
    "cv": {
      "data": "string (base64)",
      "contentType": "string"
    }
  }
}
```

#### Errors
- `403 Forbidden`
  ```json
  {
    "ok": false,
    "message": "Unauthorized: Only admins or its own user can access."
  }
  ```

- `404 Not Found`
  ```json
  {
    "ok": false,
    "message": "User not found"
  }
  ```

- `500 Internal Server Error`
  ```json
  {
    "ok": false,
    "message": "Server error"
  }
  ```

## Update User By ID

### Endpoint
```
PUT /api/users/:id
```

### Description
Updates the details of a user by their ID. Users can update their own details except `isAdmin` and `isVerified`. Admins can update any user's details except `isAdmin`.

### Path Parameters
- `id`: The ID of the user.

### Request Body
```json
{
  "username": "string (optional)",
  "email": "string (optional)",
  "password": "string (optional)",
  "dateOfBirth": "string (optional)",
  "photo": {
    "data": "Buffer (optional)",
    "contentType": "string (optional)"
  },
  "cv": {
    "data": "Buffer (optional)",
    "contentType": "string (optional)"
  },
  "isVerified": "boolean (optional, only for admin)"
}
```

### Responses

#### Success
```json
{
  "ok": true,
  "message": "Updated Successfully"
}
```

#### Errors
- `403 Forbidden`
  ```json
  {
    "ok": false,
    "message": "Unauthorized: You or Admin can only update your own profile"
  }
  ```

- `404 Not Found`
  ```json
  {
    "ok": false,
    "message": "User not found"
  }
  ```

- `400 Bad Request`
  ```json
  {
    "ok": false,
    "message": "Not a strong password"
  }
  ```

- `500 Internal Server Error`
  ```json
  {
    "ok": false,
    "message": "Server error"
  }
  ```

## Delete User By ID

### Endpoint
```
DELETE /api/users/:id
```

### Description
Deletes a user by their ID. Users can delete their own account, while admins can delete any user's account.

### Path Parameters
- `id`: The ID of the user.

### Responses

#### Success
```json
{
  "ok": true,
  "message": "User deleted successfully"
}
```

#### Errors
- `403 Forbidden`
  ```json
  {
    "ok": false,
    "message": "Unauthorized: You can only delete your own account"
  }
  ```

- `404 Not Found`
  ```json
  {
    "ok": false,
    "message": "User not found"
  }
  ```

- `500 Internal Server Error`
  ```json
  {
    "ok": false,
    "message": "Server error"
  }
  ```

## Notes

- The `isStrongPassword` function from the `validator` library is used to ensure password strength.
- Users can only access and update their own details, except for admins who have broader access.
- JWT authentication middleware should be used to protect these routes and ensure only authorized users can access them.