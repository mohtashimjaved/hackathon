# Helplytics 🚀

![Helplytics Banner](./assets/helplytics_banner.png)

**Helplytics** is a premium, collaborative problem-solving platform designed for tech enthusiasts and developers. It enables users to seek assistance, share expertise, and build a reputation within a high-performance community.

---

## ✨ Features

- **Live Community Feed**: Real-time access to help requests with category filtering and urgency levels.
- **Dynamic User Profiles**: Personalized profiles featuring black-and-white vector avatars, skill tags, and trust scores.
- **Interactive Dashboard**: Track requests, contributions, and community engagement trends with sleek data visualizations.
- **Trust Score System**: Earn reputation by helping others. High contributors climb the **Global Leaderboard**.
- **Edit & Delete Control**: Full management of your own requests with a seamless, professional experience.
- **Premium UI/UX**: Built with a modern glassmorphism aesthetic, smooth micro-animations, and a responsive layout.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Styling**: Vanilla CSS (Modern Design Tokens)
- **Icons**: Lucide React
- **Charts**: Recharts
- **State Management**: React Context API

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet.js, Bcrypt.js

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local instance or Atlas Cluster)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mohtashimjaved/helplytics.git
   cd helplytics
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   ```
   Create a `.env.local` file in the `frontend` directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

### Running Locally

To run the application, start both the backend and frontend servers:

- **Start Backend**: `cd backend && npm run dev`
- **Start Frontend**: `cd frontend && npm run dev`

The application will be accessible at [http://localhost:3000](http://localhost:3000).

---

## 📁 Project Structure

```text
helplytics/
├── backend/            # Express API with MongoDB
│   ├── config/         # Server configuration
│   ├── db/             # Database connection logic
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API endpoints (Auth, Requests, Users)
│   └── index.js        # Server entry point
├── frontend/           # Next.js Application
│   ├── src/
│   │   ├── app/        # Pages and Layouts
│   │   ├── components/ # Reusable UI components
│   │   ├── context/    # Global state management
│   │   └── styles/     # Design system and global CSS
│   └── public/         # Static assets
└── assets/             # Project documentation assets
```

---

## 📐 Design Philosophy

Helplytics follows a **Premium, State-of-the-Art** design philosophy:
- **Rich Aesthetics**: Vibrant emerald and amber accents on a clean, dark-mode friendly palette.
- **Consistency**: Unified component library using predefined CSS variables.
- **Performance**: Optimized rendering and lazy loading for a snappy user experience.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is licensed under the MIT License.

---

Developed with ❤️ by [Mohtashim Javed](https://github.com/mohtashimjaved).


