import './globals.css';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'Helplytics | Community Support & Skill Sharing',
  description: 'A modern, professional platform for students to get help and experts to share their skills.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <div className="app-container">
            <Navbar />
            <main className="main-content">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
