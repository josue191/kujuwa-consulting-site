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
import { FileCheck, UserPlus, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { subDays, format, eachDayOfInterval } from 'date-fns';

type DailySubmissions = {
  date: string;
  candidatures: number;
  messages: number;
};

type SubmissionsByDomain = {
  name: string;
  candidatures: number;
}


export default function Dashboard() {
  const [stats, setStats] = useState({
    applications: 0,
    submissions: 0,
  });
  const [submissionsHistory, setSubmissionsHistory] = useState<DailySubmissions[]>([]);
  const [applicationsByDomain, setApplicationsByDomain] = useState<SubmissionsByDomain[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();
  const { toast } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);

      const thirtyDaysAgo = subDays(new Date(), 30);

      const { count: applicationsCount, error: applicationsError } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true });

      const { count: submissionsCount, error: submissionsError } = await supabase
        .from('contactFormSubmissions')
        .select('*', { count: 'exact', head: true });
        
      const { data: applicationsData, error: applicationsDataError } = await supabase
        .from('applications')
        .select('created_at')
        .gte('created_at', thirtyDaysAgo.toISOString());
        
      const { data: contactsData, error: contactsDataError } = await supabase
        .from('contactFormSubmissions')
        .select('created_at')
        .gte('created_at', thirtyDaysAgo.toISOString());

      const { data: jobPostings, error: jobPostingsError } = await supabase
        .from('jobPostings')
        .select('id, domain');

      const { data: allApplications, error: allApplicationsError } = await supabase
        .from('applications')
        .select('job_posting_id');

      if (applicationsError || submissionsError || applicationsDataError || contactsDataError || jobPostingsError || allApplicationsError) {
        const error = applicationsError || submissionsError || applicationsDataError || contactsDataError || jobPostingsError || allApplicationsError;
        console.error('Error fetching dashboard data:', error);
        toast({
          variant: 'destructive',
          title: 'Erreur de chargement du tableau de bord',
          description: error?.message,
        });
      } else {
        // --- Process Total Stats ---
        const totalSubmissions = (applicationsCount || 0) + (submissionsCount || 0);
        setStats({
          applications: applicationsCount || 0,
          submissions: totalSubmissions,
        });

        // --- Process History Chart ---
        const interval = eachDayOfInterval({ start: thirtyDaysAgo, end: new Date() });
        const dailyData = interval.map(day => ({
          date: format(day, 'dd/MM'),
          candidatures: 0,
          messages: 0,
        }));
        
        applicationsData.forEach(app => {
            const dateStr = format(new Date(app.created_at), 'dd/MM');
            const dayData = dailyData.find(d => d.date === dateStr);
            if (dayData) dayData.candidatures++;
        });

        contactsData.forEach(contact => {
            const dateStr = format(new Date(contact.created_at), 'dd/MM');
            const dayData = dailyData.find(d => d.date === dateStr);
            if (dayData) dayData.messages++;
        });

        setSubmissionsHistory(dailyData);

        // --- Process Submissions by Domain Chart ---
        const domainCounts: { [key: string]: number } = {};
        allApplications.forEach(app => {
          const posting = jobPostings.find(p => p.id === app.job_posting_id);
          if (posting && posting.domain) {
            domainCounts[posting.domain] = (domainCounts[posting.domain] || 0) + 1;
          }
        });
        
        const domainChartData = Object.entries(domainCounts).map(([name, count]) => ({
          name,
          candidatures: count,
        }));

        setApplicationsByDomain(domainChartData);

      }

      setIsLoading(false);
    };

    fetchDashboardData();
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
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
            <CardTitle>Soumissions des 30 derniers jours</CardTitle>
            <CardDescription>Candidatures et messages de contact reçus.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
               {isLoading ? (
                 <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                 </div>
                ) : (
              <LineChart data={submissionsHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="candidatures"
                  stroke="hsl(var(--chart-1))"
                  name="Candidatures"
                  strokeWidth={2}
                />
                 <Line
                  type="monotone"
                  dataKey="messages"
                  stroke="hsl(var(--chart-2))"
                  name="Messages"
                  strokeWidth={2}
                />
              </LineChart>
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Candidatures par domaine</CardTitle>
            <CardDescription>
              Répartition des candidatures reçues par domaine d'emploi.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              {isLoading ? (
                 <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                 </div>
                ) : (
              <BarChart data={applicationsByDomain} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip />
                <Legend />
                <Bar dataKey="candidatures" fill="hsl(var(--chart-1))" name="Candidatures"/>
              </BarChart>
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
