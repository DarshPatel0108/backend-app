# VideoTube Backend

A Node.js/Express backend for a video-sharing platform (YouTube-style), providing user authentication, file uploads, and the data models needed for videos and watch history.

## Tech Stack

- **Runtime:** Node.js (ES Modules)
- **Framework:** Express 5
- **Database:** MongoDB with Mongoose
- **Auth:** JSON Web Tokens (access + refresh tokens), bcrypt for password hashing
- **File Uploads:** Multer (local temp storage) → Cloudinary (cloud storage)
- **Dev Tools:** nodemon, prettier

## Project Structure

```
src/
├── app.js                     # Express app setup (middleware, routes)
├── index.js                   # Entry point — loads env, connects DB, starts server
├── constants.js                # App-wide constants (DB name, etc.)
├── db/
│   └── index.js                # MongoDB connection logic
├── models/
│   ├── user.model.js            # User schema (auth, profile, watch history)
│   └── video.model.js           # Video schema (with aggregate pagination plugin)
├── controllers/
│   └── user.controller.js       # Register, login, logout, refresh-token logic
├── routes/
│   └── user.routes.js           # /api/v1/users routes
├── middlewares/
│   ├── auth.middleware.js       # JWT verification middleware
│   └── multer.middleware.js     # Multer disk-storage config
└── utils/
    ├── ApiError.js               # Standardized error class
    ├── ApiResponse.js            # Standardized success response class
    ├── asyncHandler.js           # Wraps async route handlers for error forwarding
    └── cloudinary.js             # Cloudinary upload helper

public/temp/                   # Temporary local storage for uploads before Cloudinary push
```

## Features

- **User registration** with avatar (required) and cover image (optional) upload to Cloudinary
- **Login** via username or email, with hashed password verification
- **JWT-based auth** — short-lived access tokens + long-lived refresh tokens stored as httpOnly cookies
- **Logout** that clears cookies and invalidates the stored refresh token
- **Access token refresh** endpoint to issue new tokens without re-login
- **Video model** ready for a videos feature, with pagination support via `mongoose-aggregate-paginate-v2`

## Prerequisites

- Node.js (v18+ recommended, since the project uses ES Modules)
- A MongoDB instance (local or Atlas)
- A Cloudinary account (for file uploads)

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create a `.env` file** in the project root with the following variables:
   ```env
   PORT=8000
   CORS_ORIGIN=*

   MONGODB_URI=your_mongodb_connection_string

   ACCESS_TOKEN_SECRET=your_access_token_secret
   ACCESS_TOKEN_EXPIRY=1d
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   REFRESH_TOKEN_EXPIRY=10d

   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

3. **Run the dev server**
   ```bash
   npm run dev
   ```
   The server starts on `http://localhost:8000` (or your configured `PORT`).

## API Endpoints

Base path: `/api/v1/users`

| Method | Endpoint                | Auth required | Description                              |
|--------|--------------------------|----------------|--------------------------------------------|
| POST   | `/register`             | No             | Register a new user (multipart form: `avatar`, optional `coverImage`) |
| POST   | `/login`                | No             | Log in with `username` or `email` + `password` |
| POST   | `/logout`                | Yes            | Log out the current user, clear tokens   |
| POST   | `/refresh-access-token` | No (needs refresh token cookie/body) | Issue a new access token |

### Response Format

All responses follow a consistent shape via `ApiResponse` / `ApiError`:

```json
{
  "statusCode": 200,
  "data": { ... },
  "message": "Success",
  "success": true
}
```

## Notes

- Uploaded files are temporarily stored in `public/temp` before being pushed to Cloudinary.
- Passwords are hashed with bcrypt before saving (via a Mongoose pre-save hook).
- This README reflects the current state of the codebase — the video/feed-related routes and controllers (beyond the data model) are not yet implemented.
