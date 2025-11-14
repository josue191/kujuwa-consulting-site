import './globals.css';
import type { Metadata } from 'next';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import MainLayout from '@/components/layout/MainLayout';
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  title: 'Kujuwa Consulting',
  description:
    'Votre partenaire stratégique pour des solutions durables et des résultats mesurables.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn('min-h-screen bg-background font-body antialiased')}
      >
        <FirebaseClientProvider>
          <MainLayout>{children}</MainLayout>
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
