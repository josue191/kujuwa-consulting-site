"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

type JobOffer = {
  title: string;
  location: string;
  domain: string;
  description: string;
};

type JobListingProps = {
  offer: JobOffer;
};

export default function JobListing({ offer }: JobListingProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const descriptionText = offer.description || '';
  const isLongDescription = descriptionText.length > 150;

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
          <div>
            <p className={`whitespace-pre-wrap ${!isExpanded && isLongDescription ? 'line-clamp-4' : ''}`}>
              {descriptionText}
            </p>
            {isLongDescription && (
               <Button 
                  variant="link" 
                  size="sm" 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-0 h-auto mt-2"
               >
                  {isExpanded ? 'Voir moins' : 'Voir plus'}
               </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
