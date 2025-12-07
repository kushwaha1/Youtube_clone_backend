# YouTube Clone - Backend Documentation

## Project Overview

Complete **MERN Stack YouTube Clone Backend** with user authentication, video management, channel system, comments, likes/dislikes, subscriptions, and real-time features.

**Tech Stack:**
- **Node.js** – Backend runtime
- **Express.js** – Web framework
- **MongoDB Atlas** – Cloud database
- **Mongoose** – MongoDB ODM
- **JWT** – Authentication & authorization
- **Cloudinary** – Cloud media storage (images & videos)
- **Multer** – File upload handling
- **Morgan** – API request logging
- **CORS** – Cross-origin support
---

## Features

### Authentication System
- User Registration with validation
- User Login with JWT tokens
- Password hashing with bcrypt
- Protected routes middleware

### Video Management
- Upload videos with thumbnails
- CRUD operations on videos
- Video search and filtering
- Category-based filtering
- View count tracking
- Like/Dislike system with user tracking
- Get like status for users

### Channel System
- Create/Update/Delete channels
- Channel profile with banner
- Subscribe/Unsubscribe functionality
- Subscription status checking
- Channel video management
- Subscriber count tracking

### Comments System
- Add comments to videos
- Edit own comments
- Delete own comments
- Fetch Comment

## File Upload System

This project uses **Multer + Cloudinary** for handling uploads.

### Multer
- Handles multipart/form-data requests
- Validates file type and size
- Supports:
  - Video uploads (up to **200MB**)
  - Thumbnails
  - Channel banners
  - User avatars

### Cloudinary
- Stores media files securely in the cloud
- Saves `url` and `public_id` in MongoDB
- Old media is automatically deleted when updating files

No file is permanently stored on the server

## Database

- MongoDB is hosted on **MongoDB Atlas**
- Fully cloud-based (live database)
- Database credentials are present in env file
- Schema-based data handling using Mongoose

### Setup Instructions

```bash
1. Clone the repository 
    (`git clone https://github.com/kushwaha1/Youtube_clone_backend.git`).
2. Run command in vscode terminal `npm i` for installing packages.
3. Open vscode terminal and run `npm run start`.
4. The app will now be running at `http://localhost:5000/`.
5. Also run command `npm run seed` for adding sample data in db to fetch list.
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `PUT /api/auth/avatar` - Update avatar

### Videos
- `GET /api/videos` - Get all videos
- `POST /api/videos/upload` - Upload video
- `GET /api/videos/:id` - Get single video
- `PUT /api/videos/:id` - Update video
- `DELETE /api/videos/:id` - Delete video
- `POST /api/videos/:id/like` - Toggle like
- `POST /api/videos/:id/dislike` - Toggle dislike
- `GET /api/videos/:id/like-status` - Get like status
- `POST /api/videos/:id/view` - Increase views
- `GET /api/videos/search` - Search videos by title
- `GET /api/videos/category/:category` - Filter videos by category

### Channels
- `GET /api/channel` - Get all channels
- `POST /api/channel` - Create channel
- `GET /api/channel/me` - Get my channel
- `GET /api/channel/:id` - Get single channel
- `GET /api/channel/:id/videos` - Get channel videos
- `PUT /api/channel/:id` - Update channel
- `DELETE /api/channel/:id` - Delete channel
- `POST /api/channel/:id/subscribe` - Subscribe
- `POST /api/channel/:id/unsubscribe` - Unsubscribe
- `GET /api/channel/:id/subscription-status` - Check subscription status

### Comments
- `GET /api/comment/video/:videoId` - Get video comments
- `POST /api/comment/video/:videoId` - Add comment
- `PUT /api/comment/:id` - Update comment
- `DELETE /api/comment/:id` - Delete comment

## Middleware

**auth.js** – Verifies JWT token and adds user info to req.user
**morgan** – Logs HTTP requests
**cors** – Enables cross-origin requests
**multer.js** – Handles file uploads & validation
**videoMulter.js** - Handle video uploads a& validation

## Important Notes
**For Image Upload** - Used cloudinary (cloud) and credentials already in env file
**For Database** - Used MongoDB atlas (cloud) and credentials already in env file