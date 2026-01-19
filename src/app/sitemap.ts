import type { MetadataRoute } from 'next';

// This file is temporarily disabled to prevent server errors.
// It returns an empty sitemap.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [];
}
