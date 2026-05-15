# Helplytics Frontend 🎨

The user-facing application for Helplytics, built with **Next.js 14+** and **Vanilla CSS**.

## 🚀 Features

- **Responsive Dashboard**: Personalized view of help requests and trust scores.
- **Community Feed**: Filterable list of live help requests.
- **Real-time Notifications**: Custom toast system for instant feedback.
- **Styled Dialogs**: Custom confirmation and alert modals.
- **Glassmorphism UI**: High-end aesthetic with blur effects and smooth animations.

## 🛠️ Tech Stack

- **Next.js**: React framework with App Router.
- **Vanilla CSS**: Custom design system using CSS variables.
- **Lucide React**: Premium icon set.
- **Recharts**: Data visualizations for trust score trends.
- **Context API**: State management for Auth, Toast, and Dialogs.

## 📁 Directory Structure

```text
frontend/
├── src/
│   ├── app/            # App Router (Pages & Layouts)
│   ├── components/     # Reusable UI components
│   ├── context/        # State Management (Auth, Toast, Dialog)
│   ├── lib/            # API services and helpers
│   └── styles/         # Design tokens and global CSS
└── public/             # Static assets
```

## ⚙️ Configuration

Ensure you have a `.env.local` file with the following:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 🏃 Running the App

```bash
npm install
npm run dev
```
