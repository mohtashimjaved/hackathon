# Helplytics 🚀

**Helplytics** is a premium, collaborative problem-solving platform designed for tech enthusiasts and developers to seek assistance, share expertise, and build a reputation within a high-performance community.

![Helplytics Preview](https://api.dicebear.com/7.x/notionists/svg?seed=Helplytics&backgroundColor=f8fafc)

## ✨ Features

- **Live Community Feed**: Real-time access to help requests with category filtering and urgency levels.
- **Dynamic User Profiles**: Personalized profiles featuring black-and-white vector avatars, skill tags, and trust scores.
- **Interactive Dashboard**: Track your requests, contributions, and community engagement trends with sleek data visualizations.
- **Trust Score System**: Earn reputation by helping others. High contributors climb the **Global Leaderboard**.
- **Edit & Delete Control**: Full management of your own requests with a seamless, professional editing experience.
- **Premium UI/UX**: Built with a modern glassmorphism aesthetic, smooth micro-animations, and a responsive layout.

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js (App Router)
- **Styling**: Vanilla CSS with modern Design Tokens
- **Icons**: Lucide React
- **Charts**: Recharts
- **State Management**: React Context API

### Backend
- **Runtime**: Node.js
- **Framework**: Express
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JWT (JSON Web Tokens)
- **Avatars**: DiceBear API (Notionists style)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd helplytics
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` folder:
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
   Create a `.env.local` file in the `frontend` folder:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

### Running Locally

- **Start Backend**: `cd backend && npm run dev`
- **Start Frontend**: `cd frontend && npm run dev`

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📐 Design Philosophy

Helplytics follows a **Premium, State-of-the-Art** design philosophy:
- **Rich Aesthetics**: Vibrant emerald and amber accents on a clean, dark-mode friendly palette.
- **Consistency**: Unified component library using predefined CSS variables.
- **Performance**: Optimized rendering and lazy loading for a snappy user experience.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
