import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MoreHorizontal } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { iconMap } from '@/lib/icon-map';
import type { Service } from '@/app/nos-services/page';

type ServiceCardProps = {
  service: Service;
};

export default function ServiceCard({ service }: ServiceCardProps) {
  const Icon = iconMap[service.icon as keyof typeof iconMap] || MoreHorizontal;

  return (
    <Card className="group relative flex h-80 flex-col justify-end overflow-hidden rounded-xl text-primary-foreground shadow-lg transition-all duration-300 hover:shadow-2xl">
      {/* Image en arrière-plan */}
      <div className="absolute inset-0 z-0">
        {service.image_url ? (
          <Image
            src={service.image_url}
            alt={service.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <Icon className="h-20 w-20 text-muted-foreground/30" />
          </div>
        )}
        {/* Dégradé pour la lisibilité */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Contenu superposé */}
      <div className="relative z-10 p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary-foreground backdrop-blur-sm border border-white/10">
            <Icon className="h-7 w-7" />
          </div>
          <CardTitle className="font-headline text-2xl drop-shadow-md">
            {service.title}
          </CardTitle>
        </div>
        <CardContent className="p-0 pt-4">
          <CardDescription className="line-clamp-2 text-white/80">
            {service.description}
          </CardDescription>
        </CardContent>
        <CardFooter className="p-0 pt-4">
          <Button
            asChild
            variant="link"
            className="p-0 text-primary-foreground hover:text-primary"
          >
            <Link href={`/nos-services/${service.id}`}>
              Lire plus <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}
