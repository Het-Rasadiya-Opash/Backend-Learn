# Backend API Documentation

## Models Description

### User Model

```javascript
{
  _id: ObjectId,
  username: String (required, unique, lowercase, indexed),
  email: String (required, unique, lowercase),
  fullName: String (required, indexed),
  avatar: String (required),
  coverImage: String,
  watchHistory: [ObjectId] (ref: Video),
  password: String (required, hashed),
  refreshToken: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Video Model

```javascript
{
  _id: ObjectId,
  videoFile: String (required),
  thumbnail: String (required),
  title: String (required),
  description: String (required),
  duration: Number,
  views: Number (default: 0),
  isPublished: Boolean (default: true),
  owner: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### Comment Model

```javascript
{
  _id: ObjectId,
  content: String (required),
  video: ObjectId (ref: Video),
  owner: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### Like Model

```javascript
{
  _id: ObjectId,
  video: ObjectId (ref: Video),
  comment: ObjectId (ref: Comment),
  tweet: ObjectId (ref: Tweet),
  likedBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### Playlist Model

```javascript
{
  _id: ObjectId,
  name: String (required),
  description: String (required),
  videos: [ObjectId] (ref: Video),
  owner: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### Subscription Model

```javascript
{
  _id: ObjectId,
  subscriber: ObjectId (ref: User),
  channel: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### Tweet Model

```javascript
{
  _id: ObjectId,
  content: String (required),
  owner: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints & Controller Responses

### User Management

**Base URL:** `/api/v1/users`

#### POST /register

- **Description:** Register new user
- **Authentication:** None
- **Body:** `multipart/form-data`
  - `fullName`: String
  - `username`: String
  - `email`: String
  - `password`: String
  - `avatar`: File (required)
  - `coverImage`: File (optional)
- **Response:**

```json
{
  "statusCode": 200,
  "data": {
    "_id": "user_id",
    "username": "john_doe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "avatar": "cloudinary_url",
    "coverImage": "cloudinary_url",
    "watchHistory": [],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "User registered successfully",
  "success": true
}
```

#### POST /login

- **Description:** User login
- **Authentication:** None
- **Body:**

```json
{
  "email": "john@example.com", // or username
  "password": "password123"
}
```

- **Response:**

```json
{
  "statusCode": 200,
  "data": {
    "user": {
      "_id": "user_id",
      "username": "john_doe",
      "email": "john@example.com",
      "fullName": "John Doe",
      "avatar": "cloudinary_url",
      "coverImage": "cloudinary_url",
      "watchHistory": []
    },
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token"
  },
  "message": "User LoggedIn Successfully",
  "success": true
}
```

#### POST /logout

- **Description:** User logout
- **Authentication:** Required (JWT)
- **Response:**

```json
{
  "statusCode": 200,
  "data": {},
  "message": "User Logged Out Successfully",
  "success": true
}
```

#### POST /refresh-token

- **Description:** Refresh access token
- **Authentication:** None
- **Body:**

```json
{
  "refreshToken": "jwt_refresh_token"
}
```

- **Response:**

```json
{
  "statusCode": 200,
  "data": {
    "accessToken": "new_jwt_access_token",
    "refreshToken": "new_jwt_refresh_token"
  },
  "message": "Access Token Refreshed",
  "success": true
}
```

#### POST /change-password

- **Description:** Change user password
- **Authentication:** Required (JWT)
- **Body:**

```json
{
  "oldPassword": "old_password",
  "newPassword": "new_password"
}
```

- **Response:**

```json
{
  "statusCode": 200,
  "data": {},
  "message": "Password Changed Successfully",
  "success": true
}
```

#### GET /current-user

- **Description:** Get current user details
- **Authentication:** Required (JWT)
- **Response:**

```json
{
  "statusCode": 200,
  "data": {
    "_id": "user_id",
    "username": "john_doe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "avatar": "cloudinary_url",
    "coverImage": "cloudinary_url",
    "watchHistory": []
  },
  "message": "Current User Fetched Successfully..",
  "success": true
}
```

#### PATCH /update-account

- **Description:** Update user account details
- **Authentication:** Required (JWT)
- **Body:**

```json
{
  "fullName": "Updated Name",
  "email": "updated@example.com"
}
```

- **Response:**

```json
{
  "statusCode": 200,
  "data": {
    "_id": "user_id",
    "username": "john_doe",
    "email": "updated@example.com",
    "fullName": "Updated Name",
    "avatar": "cloudinary_url",
    "coverImage": "cloudinary_url"
  },
  "message": "User Account Detailes Updated",
  "success": true
}
```

#### PATCH /avatar

- **Description:** Update user avatar
- **Authentication:** Required (JWT)
- **Body:** `multipart/form-data`
  - `avatar`: File
- **Response:**

```json
{
  "statusCode": 200,
  "data": {
    "_id": "user_id",
    "username": "john_doe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "avatar": "new_cloudinary_url",
    "coverImage": "cloudinary_url"
  },
  "message": "Avatar Changed Successfully",
  "success": true
}
```

#### PATCH /cover-image

- **Description:** Update user cover image
- **Authentication:** Required (JWT)
- **Body:** `multipart/form-data`
  - `coverImage`: File
- **Response:**

```json
{
  "statusCode": 200,
  "data": {
    "_id": "user_id",
    "username": "john_doe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "avatar": "cloudinary_url",
    "coverImage": "new_cloudinary_url"
  },
  "message": "Cover Image Changed..",
  "success": true
}
```

#### GET /c/:username

- **Description:** Get user channel profile
- **Authentication:** Required (JWT)
- **Response:**

```json
{
  "statusCode": 200,
  "data": {
    "_id": "user_id",
    "fullName": "John Doe",
    "username": "john_doe",
    "email": "john@example.com",
    "subscribersCount": 150,
    "channelsSubscribedToCount": 25,
    "isSubscribed": false,
    "avatar": "cloudinary_url",
    "coverImage": "cloudinary_url"
  },
  "message": "User Channel Fetched Successfully",
  "success": true
}
```

#### GET /history

- **Description:** Get user watch history
- **Authentication:** Required (JWT)
- **Response:**

```json
{
  "statusCode": 200,
  "data": [
    {
      "_id": "video_id",
      "videoFile": "cloudinary_url",
      "thumbnail": "cloudinary_url",
      "title": "Video Title",
      "description": "Video Description",
      "duration": 300,
      "views": 1000,
      "owner": {
        "_id": "owner_id",
        "fullName": "Owner Name",
        "username": "owner_username",
        "avatar": "cloudinary_url"
      }
    }
  ],
  "message": "WatchHistory Fetched Successfully",
  "success": true
}
```

### Video Management

**Base URL:** `/api/v1/videos`

#### GET /

- **Description:** Get all videos with pagination
- **Authentication:** Required (JWT)
- **Query Parameters:**
  - `page`: Number (default: 1)
  - `limit`: Number (default: 10)
  - `query`: String (search term)
  - `sortBy`: String (field to sort by)
  - `sortType`: String (asc/desc)
  - `userId`: String (filter by user)
- **Response:**

```json
{
  "statusCode": 200,
  "data": {
    "docs": [
      {
        "_id": "video_id",
        "videoFile": "cloudinary_url",
        "thumbnail": "cloudinary_url",
        "title": "Video Title",
        "description": "Video Description",
        "duration": 300,
        "views": 1000,
        "isPublished": true,
        "owner": {
          "_id": "owner_id",
          "fullName": "Owner Name",
          "username": "owner_username",
          "avatar": "cloudinary_url"
        },
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "totalDocs": 50,
    "limit": 10,
    "page": 1,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "message": "Videos fetched successfully",
  "success": true
}
```

#### POST /

- **Description:** Upload a new video
- **Authentication:** Required (JWT)
- **Body:** `multipart/form-data`
  - `title`: String
  - `description`: String
  - `videoFile`: File
  - `thumbnail`: File
- **Response:**

```json
{
  "statusCode": 201,
  "data": {
    "_id": "video_id",
    "videoFile": "cloudinary_url",
    "thumbnail": "cloudinary_url",
    "title": "Video Title",
    "description": "Video Description",
    "duration": 300,
    "views": 0,
    "isPublished": true,
    "owner": "user_id",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Video uploaded successfully",
  "success": true
}
```

#### GET /:videoId

- **Description:** Get video by ID
- **Authentication:** Required (JWT)
- **Response:**

```json
{
  "statusCode": 200,
  "data": {
    "_id": "video_id",
    "videoFile": "cloudinary_url",
    "thumbnail": "cloudinary_url",
    "title": "Video Title",
    "description": "Video Description",
    "duration": 300,
    "views": 1001,
    "isPublished": true,
    "owner": {
      "_id": "owner_id",
      "fullName": "Owner Name",
      "username": "owner_username",
      "avatar": "cloudinary_url"
    },
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Video fetched successfully",
  "success": true
}
```

#### PATCH /:videoId

- **Description:** Update video details
- **Authentication:** Required (JWT)
- **Body:** `multipart/form-data`
  - `title`: String (optional)
  - `description`: String (optional)
  - `thumbnail`: File (optional)
- **Response:**

```json
{
  "statusCode": 200,
  "data": {
    "_id": "video_id",
    "videoFile": "cloudinary_url",
    "thumbnail": "new_cloudinary_url",
    "title": "Updated Title",
    "description": "Updated Description",
    "duration": 300,
    "views": 1000,
    "isPublished": true,
    "owner": "user_id"
  },
  "message": "Video updated successfully",
  "success": true
}
```

#### DELETE /:videoId

- **Description:** Delete video
- **Authentication:** Required (JWT)
- **Response:**

```json
{
  "statusCode": 200,
  "data": {},
  "message": "Video deleted successfully",
  "success": true
}
```

#### PATCH /toggle/publish/:videoId

- **Description:** Toggle video publish status
- **Authentication:** Required (JWT)
- **Response:**

```json
{
  "statusCode": 200,
  "data": {
    "_id": "video_id",
    "isPublished": false
  },
  "message": "Video publish status toggled successfully",
  "success": true
}
```

### Comment Management

**Base URL:** `/api/v1/comments`

#### GET /:videoId

- **Description:** Get comments for a video
- **Authentication:** Required (JWT)
- **Query Parameters:**
  - `page`: Number (default: 1)
  - `limit`: Number (default: 10)
- **Response:**

```json
{
  "statusCode": 200,
  "data": {
    "docs": [
      {
        "_id": "comment_id",
        "content": "Great video!",
        "video": "video_id",
        "owner": {
          "_id": "user_id",
          "fullName": "John Doe",
          "username": "john_doe",
          "avatar": "cloudinary_url"
        },
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "totalDocs": 25,
    "limit": 10,
    "page": 1,
    "totalPages": 3
  },
  "message": "Comments fetched successfully",
  "success": true
}
```

#### POST /:videoId

- **Description:** Add comment to video
- **Authentication:** Required (JWT)
- **Body:**

```json
{
  "content": "This is a great video!"
}
```

- **Response:**

```json
{
  "statusCode": 201,
  "data": {
    "_id": "comment_id",
    "content": "This is a great video!",
    "video": "video_id",
    "owner": "user_id",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Comment added successfully",
  "success": true
}
```

#### PATCH /c/:commentId

- **Description:** Update comment
- **Authentication:** Required (JWT)
- **Body:**

```json
{
  "content": "Updated comment content"
}
```

- **Response:**

```json
{
  "statusCode": 200,
  "data": {
    "_id": "comment_id",
    "content": "Updated comment content",
    "video": "video_id",
    "owner": "user_id",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Comment updated successfully",
  "success": true
}
```

#### DELETE /c/:commentId

- **Description:** Delete comment
- **Authentication:** Required (JWT)
- **Response:**

```json
{
  "statusCode": 200,
  "data": {},
  "message": "Comment deleted successfully",
  "success": true
}
```

### Like Management

**Base URL:** `/api/v1/likes`

#### POST /toggle/v/:videoId

- **Description:** Toggle like on video
- **Authentication:** Required (JWT)
- **Response:**

```json
{
  "statusCode": 200,
  "data": {
    "isLiked": true,
    "likesCount": 150
  },
  "message": "Video like toggled successfully",
  "success": true
}
```

#### POST /toggle/c/:commentId

- **Description:** Toggle like on comment
- **Authentication:** Required (JWT)
- **Response:**

```json
{
  "statusCode": 200,
  "data": {
    "isLiked": false,
    "likesCount": 25
  },
  "message": "Comment like toggled successfully",
  "success": true
}
```

#### POST /toggle/t/:tweetId

- **Description:** Toggle like on tweet
- **Authentication:** Required (JWT)
- **Response:**

```json
{
  "statusCode": 200,
  "data": {
    "isLiked": true,
    "likesCount": 75
  },
  "message": "Tweet like toggled successfully",
  "success": true
}
```

#### GET /videos

- **Description:** Get liked videos by user
- **Authentication:** Required (JWT)
- **Response:**

```json
{
  "statusCode": 200,
  "data": [
    {
      "_id": "video_id",
      "videoFile": "cloudinary_url",
      "thumbnail": "cloudinary_url",
      "title": "Liked Video",
      "description": "Video Description",
      "duration": 300,
      "views": 1000,
      "owner": {
        "_id": "owner_id",
        "fullName": "Owner Name",
        "username": "owner_username",
        "avatar": "cloudinary_url"
      }
    }
  ],
  "message": "Liked videos fetched successfully",
  "success": true
}
```

### Playlist Management

**Base URL:** `/api/v1/playlist`

#### POST /

- **Description:** Create new playlist
- **Authentication:** Required (JWT)
- **Body:**

```json
{
  "name": "My Playlist",
  "description": "Collection of my favorite videos"
}
```

- **Response:**

```json
{
  "statusCode": 201,
  "data": {
    "_id": "playlist_id",
    "name": "My Playlist",
    "description": "Collection of my favorite videos",
    "videos": [],
    "owner": "user_id",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Playlist created successfully",
  "success": true
}
```

#### GET /:playlistId

- **Description:** Get playlist by ID
- **Authentication:** Required (JWT)
- **Response:**

```json
{
  "statusCode": 200,
  "data": {
    "_id": "playlist_id",
    "name": "My Playlist",
    "description": "Collection of my favorite videos",
    "videos": [
      {
        "_id": "video_id",
        "title": "Video Title",
        "thumbnail": "cloudinary_url",
        "duration": 300,
        "views": 1000
      }
    ],
    "owner": {
      "_id": "user_id",
      "fullName": "John Doe",
      "username": "john_doe"
    },
    "totalVideos": 5,
    "totalViews": 5000
  },
  "message": "Playlist fetched successfully",
  "success": true
}
```

#### PATCH /:playlistId

- **Description:** Update playlist
- **Authentication:** Required (JWT)
- **Body:**

```json
{
  "name": "Updated Playlist Name",
  "description": "Updated description"
}
```

- **Response:**

```json
{
  "statusCode": 200,
  "data": {
    "_id": "playlist_id",
    "name": "Updated Playlist Name",
    "description": "Updated description",
    "videos": [],
    "owner": "user_id"
  },
  "message": "Playlist updated successfully",
  "success": true
}
```

#### DELETE /:playlistId

- **Description:** Delete playlist
- **Authentication:** Required (JWT)
- **Response:**

```json
{
  "statusCode": 200,
  "data": {},
  "message": "Playlist deleted successfully",
  "success": true
}
```

#### PATCH /add/:videoId/:playlistId

- **Description:** Add video to playlist
- **Authentication:** Required (JWT)
- **Response:**

```json
{
  "statusCode": 200,
  "data": {
    "_id": "playlist_id",
    "name": "My Playlist",
    "videos": ["video_id_1", "video_id_2", "new_video_id"]
  },
  "message": "Video added to playlist successfully",
  "success": true
}
```

#### PATCH /remove/:videoId/:playlistId

- **Description:** Remove video from playlist
- **Authentication:** Required (JWT)
- **Response:**

```json
{
  "statusCode": 200,
  "data": {
    "_id": "playlist_id",
    "name": "My Playlist",
    "videos": ["video_id_1", "video_id_2"]
  },
  "message": "Video removed from playlist successfully",
  "success": true
}
```

#### GET /user/:userId

- **Description:** Get user playlists
- **Authentication:** Required (JWT)
- **Response:**

```json
{
  "statusCode": 200,
  "data": [
    {
      "_id": "playlist_id",
      "name": "My Playlist",
      "description": "Collection of videos",
      "totalVideos": 5,
      "totalViews": 5000,
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "message": "User playlists fetched successfully",
  "success": true
}
```

### Subscription Management

**Base URL:** `/api/v1/subscriptions`

#### GET /c/:channelId

- **Description:** Get channel subscribers
- **Authentication:** Required (JWT)
- **Response:**

```json
{
  "statusCode": 200,
  "data": {
    "subscribers": [
      {
        "_id": "user_id",
        "fullName": "John Doe",
        "username": "john_doe",
        "avatar": "cloudinary_url",
        "subscribedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "subscribersCount": 150
  },
  "message": "Channel subscribers fetched successfully",
  "success": true
}
```

#### POST /c/:channelId

- **Description:** Toggle subscription to channel
- **Authentication:** Required (JWT)
- **Response:**

```json
{
  "statusCode": 200,
  "data": {
    "isSubscribed": true,
    "subscribersCount": 151
  },
  "message": "Subscription toggled successfully",
  "success": true
}
```

#### GET /u/:subscriberId

- **Description:** Get subscribed channels
- **Authentication:** Required (JWT)
- **Response:**

```json
{
  "statusCode": 200,
  "data": [
    {
      "_id": "channel_id",
      "fullName": "Channel Name",
      "username": "channel_username",
      "avatar": "cloudinary_url",
      "subscribersCount": 1000,
      "subscribedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "message": "Subscribed channels fetched successfully",
  "success": true
}
```

### Tweet Management

**Base URL:** `/api/v1/tweets`

#### POST /

- **Description:** Create new tweet
- **Authentication:** Required (JWT)
- **Body:**

```json
{
  "content": "This is my first tweet!"
}
```

- **Response:**

```json
{
  "statusCode": 201,
  "data": {
    "_id": "tweet_id",
    "content": "This is my first tweet!",
    "owner": "user_id",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Tweet created successfully",
  "success": true
}
```

#### GET /user/:userId

- **Description:** Get user tweets
- **Authentication:** Required (JWT)
- **Query Parameters:**
  - `page`: Number (default: 1)
  - `limit`: Number (default: 10)
- **Response:**

```json
{
  "statusCode": 200,
  "data": {
    "docs": [
      {
        "_id": "tweet_id",
        "content": "This is my tweet!",
        "owner": {
          "_id": "user_id",
          "fullName": "John Doe",
          "username": "john_doe",
          "avatar": "cloudinary_url"
        },
        "likesCount": 25,
        "isLiked": false,
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "totalDocs": 50,
    "limit": 10,
    "page": 1,
    "totalPages": 5
  },
  "message": "User tweets fetched successfully",
  "success": true
}
```

#### PATCH /:tweetId

- **Description:** Update tweet
- **Authentication:** Required (JWT)
- **Body:**

```json
{
  "content": "Updated tweet content"
}
```

- **Response:**

```json
{
  "statusCode": 200,
  "data": {
    "_id": "tweet_id",
    "content": "Updated tweet content",
    "owner": "user_id",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Tweet updated successfully",
  "success": true
}
```

#### DELETE /:tweetId

- **Description:** Delete tweet
- **Authentication:** Required (JWT)
- **Response:**

```json
{
  "statusCode": 200,
  "data": {},
  "message": "Tweet deleted successfully",
  "success": true
}
```

### Dashboard

**Base URL:** `/api/v1/dashboard`

#### GET /stats/:channelId

- **Description:** Get channel statistics
- **Authentication:** Required (JWT)
- **Response:**

```json
{
  "statusCode": 200,
  "data": {
    "totalVideos": 25,
    "totalViews": 50000,
    "totalSubscribers": 1500,
    "totalLikes": 2500,
    "totalComments": 750
  },
  "message": "Channel stats fetched successfully",
  "success": true
}
```

#### GET /videos/:channelId

- **Description:** Get channel videos
- **Authentication:** Required (JWT)
- **Query Parameters:**
  - `page`: Number (default: 1)
  - `limit`: Number (default: 10)
- **Response:**

```json
{
  "statusCode": 200,
  "data": {
    "docs": [
      {
        "_id": "video_id",
        "title": "Video Title",
        "thumbnail": "cloudinary_url",
        "views": 1000,
        "likes": 50,
        "comments": 15,
        "isPublished": true,
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "totalDocs": 25,
    "limit": 10,
    "page": 1,
    "totalPages": 3
  },
  "message": "Channel videos fetched successfully",
  "success": true
}
```

## Error Response Format

All error responses follow this format:

```json
{
  "statusCode": 400,
  "data": null,
  "message": "Error message describing what went wrong",
  "success": false,
  "errors": []
}
```

## Authentication

Most endpoints require JWT authentication. Include the access token in:

- **Cookie:** `accessToken=your_jwt_token`
- **Header:** `Authorization: Bearer your_jwt_token`

## File Upload

File uploads use `multipart/form-data` encoding and are processed through Multer middleware with Cloudinary storage.

## Pagination

Paginated responses include:

- `docs`: Array of documents
- `totalDocs`: Total number of documents
- `limit`: Number of documents per page
- `page`: Current page number
- `totalPages`: Total number of pages
- `hasNextPage`: Boolean indicating if next page exists
- `hasPrevPage`: Boolean indicating if previous page exists
