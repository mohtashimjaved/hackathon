# Helplytics Backend 🛡️

This is the Node.js/Express backend for Helplytics, providing a robust API for authentication, user management, and help request tracking.

## 🚀 Features

- **JWT Authentication**: Secure login and registration.
- **RESTful API**: Clean and documented endpoints for all resources.
- **MongoDB Integration**: Scalable data storage using Mongoose.
- **Security**: Implementation of Helmet.js and password hashing with Bcrypt.

## 🛠️ Tech Stack

- **Node.js**: JavaScript runtime.
- **Express**: Web framework.
- **Mongoose**: MongoDB object modeling.
- **JSON Web Token**: Secure authentication.

## 📁 Directory Structure

```text
backend/
├── config/         # Server configuration
├── db/             # Database connection setup
├── models/         # Mongoose schemas (User, Request)
├── routes/         # API Route definitions
└── index.js        # Main entry point
```

## 🚥 API Endpoints (Planned/Current)

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/requests` - Fetch all help requests
- `POST /api/requests` - Create a new request
- `GET /api/users/:id` - Fetch user profile

## ⚙️ Configuration

Ensure you have a `.env` file with the following:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
```

## 🏃 Running the Server

```bash
npm install
npm run dev
```
