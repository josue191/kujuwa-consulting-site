import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Service } from '@/lib/data';

type ServiceCardProps = {
  service: Service;
};

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {service.image && (
        <div className="relative h-48 w-full">
          <Image
            src={service.image.imageUrl}
            alt={service.title}
            fill
            className="object-cover"
            data-ai-hint={service.image.imageHint}
          />
        </div>
      )}
      <CardHeader className="flex-row items-start gap-4">
        <div className="mt-1">
          <service.icon className="h-8 w-8 text-primary" />
        </div>
        <div>
          <CardTitle className="font-headline text-xl">
            {service.title}
          </CardTitle>
          <CardDescription className="mt-2">
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
