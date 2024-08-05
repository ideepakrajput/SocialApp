# Social Media Platform

A full-stack social media application with a React frontend and Node.js backend.

## Features

- User authentication (registration and login)
- Friend requests (send, accept, reject)
- Create and view posts
- Comment on posts
- User feed
- User profiles

## Tech Stack

### Frontend
- React
- React Router
- Create React App
- React app is live on `https://social-app-two-bice.vercel.app/`

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- JSON Web Tokens (JWT) for authentication
- Server is live on `https://socialapp-oo8u.onrender.com`

## Getting Started

### Prerequisites

- Node.js
- npm
- MongoDB

### Installation

1. Clone the repository
  - git clone https://github.com/ideepakrajput/SocialApp.git
2. Install backend dependencies
- cd backend
- npm install
3. Install frontend dependencies
- cd frontend
- npm install

4. Create a `.env` file in the server directory and add your MongoDB URI and JWT secret:
- MONGODB_URI=your-mongodb-uri
- JWT_SECRET=your-jwt-secret

### Running the application

1. Start the backend server
- cd server 
- npm start
- The server will run on `http://localhost:3000` by default.

2. Start the frontend development server
- cd frontend 
- npm start
- The React app will run on `http://localhost:3001` by default.

## API Endpoints

- POST /api/users/register - Register a new user
- POST /api/users/login - User login
- POST /api/users/friend-request - Send a friend request
- POST /api/posts - Create a new post
- POST /api/posts/:id/comment - Add a comment to a post
- GET /api/feed - Get user feed

For more details, please refer to the API documentation.
