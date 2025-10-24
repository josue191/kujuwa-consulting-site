import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { contactDetails } from '@/lib/data';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MapSection() {
  const mapImage = PlaceHolderImages.find((img) => img.id === 'map-placeholder');

  const locations = [
    {
      ...contactDetails.addresses[0],
      position: 'top-1/3 left-1/4',
      link: 'https://maps.google.com/?q=Kinshasa',
    },
    {
      ...contactDetails.addresses[1],
      position: 'bottom-1/4 right-1/4',
      link: 'https://maps.google.com/?q=Goma',
    },
  ];

  return (
    <section className="relative w-full h-[500px]">
      {mapImage && (
        <Image
          src={mapImage.imageUrl}
          alt="Carte des locations"
          fill
          className="object-cover"
          data-ai-hint={mapImage.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-black/40" />

      {locations.map((loc) => (
        <div
          key={loc.city}
          className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${loc.position}`}
        >
          <div className="group relative flex flex-col items-center">
            <MapPin className="h-12 w-12 text-primary drop-shadow-lg" />
            <div className="absolute bottom-full mb-2 w-64 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-background text-foreground p-4 rounded-lg shadow-xl text-center">
                    <h4 className="font-bold font-headline">{loc.city}</h4>
                    <p className="text-sm text-muted-foreground">{loc.address}</p>
                    <Button variant="link" asChild className="mt-2 p-0 h-auto">
                        <a href={loc.link} target="_blank" rel="noopener noreferrer">
                            Voir sur Google Maps
                        </a>
                    </Button>
                </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
