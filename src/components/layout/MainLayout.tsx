'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useUser } from '@/firebase';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, isUserLoading } = useUser();
  const isAdminPage = pathname?.startsWith('/admin');
  const isLoginPage = pathname === '/login';

  if (isUserLoading && (isAdminPage || isLoginPage)) {
    return <div className="flex h-screen items-center justify-center"><p>Chargement...</p></div>;
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <>
      {isAdminPage ? (
        <>{children}</>
      ) : (
        <div className="relative flex min-h-dvh flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      )}
    </>
  );
}
