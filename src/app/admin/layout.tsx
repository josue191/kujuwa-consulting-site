'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import {
  Briefcase,
  Users,
  BarChart,
  FileText,
  Settings,
  Building,
  LogOut,
  Mail,
  FilePlus2,
} from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarFooter,
} from '@/components/ui/sidebar';
import Logo from '@/components/shared/Logo';

const navItems = [
  { href: '/admin', icon: BarChart, label: 'Tableau de bord' },
  { href: '/admin/contenu', icon: FileText, label: 'Contenu' },
  { href: '/admin/offres', icon: FilePlus2, label: 'Offres d\'emploi' },
  { href: '/admin/candidatures', icon: Briefcase, label: 'Candidatures' },
  { href: '/admin/messages', icon: Mail, label: 'Messages' },
  { href: '/admin/services', icon: Building, label: 'Services' },
  { href: '/admin/utilisateurs', icon: Users, label: 'Utilisateurs' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const getTitle = () => {
    if (pathname === '/admin') return 'Tableau de bord';
    const activeItem = navItems.find(item => pathname.startsWith(item.href) && item.href !== '/admin');
    return activeItem ? activeItem.label : 'Tableau de bord';
  };
  
  const title = getTitle();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader>
            <Logo />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={pathname === item.href}>
                        <Link href={item.href}>
                            <item.icon />
                            {item.label}
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Settings />
                  Paramètres
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                 <SidebarMenuButton>
                    <Link href="/" className='flex items-center gap-2'>
                        <LogOut />
                        Quitter l'admin
                    </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="flex flex-1 flex-col">
          <header className="flex items-center justify-between p-4 border-b sticky top-0 bg-background z-10">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="md:hidden" />
              <h1 className="text-2xl font-bold font-headline">{title}</h1>
            </div>
            <div>
               <p className="text-sm text-muted-foreground">admin@example.com</p>
            </div>
          </header>
          <div className="p-4 lg:p-8 flex-1">
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
