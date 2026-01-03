
import { createClient } from '@/lib/supabase/server';
import type { MetadataRoute } from 'next';

const BASE_URL = 'https://kujuwa-consulting-elbu.com'; // Assurez-vous que c'est votre domaine principal

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient();

  // 1. Pages statiques
  const staticRoutes = [
    '/',
    '/qui-sommes-nous',
    '/nos-services',
    '/nos-services/consultance',
    '/nos-services/transport',
    '/nos-services/immobilier',
    '/nos-services/construction',
    '/nos-services/papeterie',
    '/nos-services/agro-commerce',
    '/nos-services/mecanique',
    '/nos-realisations',
    '/offres-d-emploi',
    '/contact',
    '/login',
  ];

  const staticUrls = staticRoutes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '/' ? 1 : 0.8,
  }));

  // 2. Offres d'emploi dynamiques
  const { data: jobs } = await supabase
    .from('jobPostings')
    .select('id, created_at');

  const jobUrls =
    jobs?.map(({ id, created_at }) => ({
      url: `${BASE_URL}/offres-d-emploi/${id}`,
      lastModified: new Date(created_at),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })) ?? [];
    
   // 3. Projets/Réalisations dynamiques (page principale uniquement, pas de pages de détail)
  const { data: projects } = await supabase
    .from('projects')
    .select('id, created_at');

  // Pas d'URL individuelles pour les projets pour le moment
  const projectUrls: MetadataRoute.Sitemap = [];


  return [...staticUrls, ...jobUrls, ...projectUrls];
}
