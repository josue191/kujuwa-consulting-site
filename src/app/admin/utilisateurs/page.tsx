
'use client'
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
import {
  Briefcase,
  Users,
  BarChart,
  FileText,
  Settings,
  Building,
} from 'lucide-react';
import { usePathname } from 'next/navigation';

function AdminLayout({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  const pathname = usePathname();
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader>
            <Logo />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton href="/admin" isActive={pathname === '/admin'}>
                  <BarChart />
                  Tableau de bord
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  href="/admin/contenu"
                  isActive={pathname === '/admin/contenu'}
                >
                  <FileText />
                  Contenu
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  href="/admin/candidatures"
                  isActive={pathname === '/admin/candidatures'}
                >
                  <Briefcase />
                  Candidatures
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  href="/admin/services"
                  isActive={pathname === '/admin/services'}
                >
                  <Building />
                  Services
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  href="/admin/utilisateurs"
                  isActive={pathname === '/admin/utilisateurs'}
                >
                  <Users />
                  Utilisateurs
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton href="#">
                  <Settings />
                  Paramètres
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="flex-1">
          <header className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="md:hidden" />
              <h1 className="text-2xl font-bold font-headline">{title}</h1>
            </div>
            <div>{/* User menu can go here */}</div>
          </header>
          <div className="p-4 lg:p-8">{children}</div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

export default function UtilisateursPage() {
    return (
        <AdminLayout title="Utilisateurs">
            <div className="text-center">
                <h2 className="text-2xl font-bold">Gestion des utilisateurs</h2>
                <p className="text-muted-foreground mt-2">Cette page est en cours de construction.</p>
            </div>
        </AdminLayout>
    );
}
