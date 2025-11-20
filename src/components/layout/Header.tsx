'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { navLinks as allNavLinks } from '@/lib/data';
import Logo from '@/components/shared/Logo';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';

const useUser = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();
  
    useEffect(() => {
      const getSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        setLoading(false);
      };
      getSession();
  
      const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
          setUser(session?.user ?? null);
      });
      
      return () => {
          authListener.subscription.unsubscribe();
      };
  
    }, [supabase]);

    return { user, loading };
}

export default function Header() {
  const pathname = usePathname();
  const { user, loading } = useUser();
  
  // Hide admin link if user is not logged in
  const navLinks = allNavLinks.filter(link => {
      if (link.href === '/admin') {
          return !!user;
      }
      return true;
  });

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background">
      <div className="container flex h-16 max-w-7xl items-center px-4">
        <div className="flex-1 md:flex-none">
          <Logo />
        </div>

        <div className="flex flex-1 items-center justify-end md:justify-center">
            <div className="md:hidden">
                <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle Menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] p-0">
                    <SheetHeader className="p-4 border-b">
                        <SheetTitle><Logo /></SheetTitle>
                        <SheetDescription className="sr-only">Menu de navigation principal</SheetDescription>
                    </SheetHeader>
                    <div className="flex flex-col gap-4 p-4">
                    <nav className="grid gap-2">
                        {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                            'flex items-center rounded-lg p-2 text-lg font-semibold',
                            pathname === link.href
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:bg-muted'
                            )}
                        >
                            {link.label}
                        </Link>
                        ))}
                    </nav>
                    </div>
                </SheetContent>
                </Sheet>
            </div>

            {!loading && (
                <nav className="hidden items-center gap-6 text-sm md:flex">
                {navLinks.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                    'font-medium transition-colors hover:text-primary',
                    pathname === link.href
                        ? 'text-primary'
                        : 'text-muted-foreground'
                    )}
                >
                    {link.label}
                </Link>
                ))}
            </nav>
            )}
        </div>

        <div className="hidden flex-1 items-center justify-end md:flex">
          <Button asChild>
            <Link href="/contact">Nous contacter</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
