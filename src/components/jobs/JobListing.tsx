import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar } from "lucide-react";

type JobOffer = {
  title: string;
  location: string;
  deadline: string;
  domain: string;
};

type JobListingProps = {
  offer: JobOffer;
};

export default function JobListing({ offer }: JobListingProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="font-headline text-lg">{offer.title}</CardTitle>
        <Badge variant="secondary" className="w-fit">{offer.domain}</Badge>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span>{offer.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>Date limite: {offer.deadline}</span>
        </div>
      </CardContent>
    </Card>
  );
}
