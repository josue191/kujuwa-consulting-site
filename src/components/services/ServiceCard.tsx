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
import { Skeleton } from '../ui/skeleton';


type ServiceCardProps = {
  service: Service;
};

export default function ServiceCard({ service }: ServiceCardProps) {
    const Icon = iconMap[service.icon as keyof typeof iconMap] || MoreHorizontal;

  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="relative h-48 w-full bg-muted">
        {service.image_url ? (
          <Image
            src={service.image_url}
            alt={service.title}
            fill
            className="object-cover"
          />
        ) : (
            <div className="flex items-center justify-center h-full">
                <Icon className="h-12 w-12 text-muted-foreground/50" />
            </div>
        )}
      </div>
      <CardHeader className="flex-row items-start gap-4">
        <div className="mt-1 flex-shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Icon className="h-6 w-6" />
          </div>
        </div>
        <div>
          <CardTitle className="font-headline text-xl">
            {service.title}
          </CardTitle>
          <CardDescription className="mt-2 line-clamp-3">
            {service.description}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow"></CardContent>
      <CardFooter>
        <Button asChild variant="link" className="p-0 text-primary">
          <Link href={`/nos-services/${service.id}`}>
            Lire plus <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
