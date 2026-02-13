# Backend API

Node.js/Express backend with MongoDB, authentication, and file upload capabilities.

## Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT + bcrypt
- **File Upload**: Multer + Cloudinary
- **Dev Tools**: Prettier

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

3. Run development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── controllers/    # Request handlers
├── models/         # Mongoose schemas
├── routes/         # API routes
├── middlewares/    # Custom middleware
├── utils/          # Helper functions
├── db/             # Database connection
├── uploads/        # Local file storage
├── app.js          # Express app config
└── index.js        # Entry point
```

## Features

- JWT authentication
- Password hashing (bcrypt)
- File uploads (Multer + Cloudinary)
- CORS enabled
- Cookie parsing
- Pagination support

## API Documentation

For comprehensive API documentation including all endpoints, models, and controller responses, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

### Quick API Overview

- **User Management:** `/api/v1/users` - Registration, login, logout, profile management
- **Video Management:** `/api/v1/videos` - Upload, update, delete, fetch videos
- **Comment System:** `/api/v1/comments` - Add, update, delete comments
- **Like System:** `/api/v1/likes` - Like/unlike videos, comments, tweets
- **Playlist Management:** `/api/v1/playlist` - Create, manage playlists
- **Subscription System:** `/api/v1/subscriptions` - Subscribe/unsubscribe to channels
- **Tweet System:** `/api/v1/tweets` - Create, update, delete tweets
- **Dashboard Analytics:** `/api/v1/dashboard` - Channel statistics and analytics
