'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { Eye, FileCheck, UserPlus, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const visitsData = [
  { name: 'Jan', visits: 4000 },
  { name: 'Feb', visits: 3000 },
  { name: 'Mar', visits: 5000 },
  { name: 'Apr', visits: 4500 },
  { name: 'May', visits: 6000 },
  { name: 'Jun', visits: 5500 },
];

const submissionsData = [
  { name: 'Consultance', devis: 40, contact: 24, candidatures: 5 },
  { name: 'Transport', devis: 30, contact: 13, candidatures: 2 },
  { name: 'Immobilier', devis: 20, contact: 98, candidatures: 1 },
  { name: 'Construction', devis: 27, contact: 39, candidatures: 8 },
  { name: 'Papeterie', devis: 18, contact: 48, candidatures: 0 },
];

export default function Dashboard() {
  const [stats, setStats] = useState({
    applications: 0,
    submissions: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();
  const { toast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);

      const { count: applicationsCount, error: applicationsError } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true });

      const { count: submissionsCount, error: submissionsError } = await supabase
        .from('contactFormSubmissions')
        .select('*', { count: 'exact', head: true });

      if (applicationsError || submissionsError) {
        console.error('Error fetching stats:', applicationsError || submissionsError);
        toast({
          variant: 'destructive',
          title: 'Erreur de chargement des statistiques',
          description: applicationsError?.message || submissionsError?.message,
        });
      } else {
        const totalSubmissions = (applicationsCount || 0) + (submissionsCount || 0);
        setStats({
          applications: applicationsCount || 0,
          submissions: totalSubmissions,
        });
      }

      setIsLoading(false);
    };

    fetchStats();
  }, [supabase, toast]);

  const StatCard = ({ title, value, icon: Icon, description, loading }: { title: string, value: string | number, icon: React.ElementType, description?: string, loading?: boolean }) => (
     <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            {loading ? (
                 <div className="h-10 flex items-center">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                 </div>
            ) : (
                <>
                <div className="text-2xl font-bold">{value}</div>
                {description && <p className="text-xs text-muted-foreground">{description}</p>}
                </>
            )}
        </CardContent>
    </Card>
  )

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard 
            title="Visiteurs (30j)"
            value="12,234"
            icon={Eye}
            description="+20.1% depuis le mois dernier"
            loading={false}
        />
        <StatCard 
            title="Formulaires soumis"
            value={stats.submissions}
            icon={FileCheck}
            description="Candidatures et messages"
            loading={isLoading}
        />
         <StatCard 
            title="Candidatures"
            value={stats.applications}
            icon={UserPlus}
            description="Total des candidatures reçues"
            loading={isLoading}
        />
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Visites du site</CardTitle>
            <CardDescription>Visites uniques des 6 derniers mois.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={visitsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="visits"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Soumissions de formulaires par service</CardTitle>
            <CardDescription>
              Données statiques. Peut être dynamisé à l'avenir.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={submissionsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="devis" fill="hsl(var(--chart-1))" name="Devis"/>
                <Bar dataKey="contact" fill="hsl(var(--chart-2))" name="Contact"/>
                <Bar dataKey="candidatures" fill="hsl(var(--chart-3))" name="Candidatures"/>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

    