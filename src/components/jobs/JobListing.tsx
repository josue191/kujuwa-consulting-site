"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type JobOffer = {
  id: string;
  title: string;
  location: string;
  domain: string;
  description: string;
};

type JobListingProps = {
  offer: JobOffer;
};

export default function JobListing({ offer }: JobListingProps) {
  const descriptionText = offer.description || '';

  return (
    <Card className="hover:shadow-lg transition-shadow flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline text-lg">{offer.title}</CardTitle>
        <Badge variant="secondary" className="w-fit">{offer.domain}</Badge>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-muted-foreground flex-grow">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span>{offer.location}</span>
        </div>
        {descriptionText && (
          <CardDescription className="line-clamp-4 whitespace-pre-wrap">
            {descriptionText}
          </CardDescription>
        )}
      </CardContent>
      <CardFooter>
          <Button asChild variant="link" className="p-0">
            <Link href={`/offres-d-emploi/${offer.id}`}>
              Voir les détails <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
      </CardFooter>
    </Card>
  );
}
