import { Facebook, Linkedin, Twitter, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from '@/components/shared/Logo';
import { footerContent } from '@/lib/data';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-card">
      <div className="container mx-auto max-w-7xl px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="space-y-4 text-center md:text-left">
            <div className="flex justify-center md:justify-start">
              <Logo />
            </div>
            <p className="text-sm text-muted-foreground">
              Votre partenaire stratégique pour des solutions durables et des
              résultats mesurables.
            </p>
          </div>
          <div className="text-center md:text-left">
            <h3 className="font-headline text-lg font-semibold">Mentions Légales</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {footerContent.legal.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="text-center md:text-left">
            <h3 className="font-headline text-lg font-semibold">Suivez-nous</h3>
            <div className="mt-4 flex justify-center space-x-2 md:justify-start">
              <Button variant="ghost" size="icon" asChild>
                <a href="#" aria-label="Facebook">
                  <Facebook className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="#" aria-label="LinkedIn">
                  <Linkedin className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="#" aria-label="Twitter">
                  <Twitter className="h-5 w-5" />
                </a>
              </Button>
               <Button variant="ghost" size="icon" asChild>
                <a href="#" aria-label="Youtube">
                  <Youtube className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>{footerContent.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
