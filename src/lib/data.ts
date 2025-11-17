import {
  BrainCircuit,
  Truck,
  Building2,
  Construction,
  Printer,
  Wheat,
  Wrench,
  Award,
  ShieldCheck,
  Lightbulb,
  type LucideIcon,
  HardHat,
  Car,
  Home,
  BookOpen,
  ShoppingBag,
  Tractor,
} from 'lucide-react';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export const navLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/qui-sommes-nous', label: 'Qui sommes-nous ?' },
  { href: '/nos-services', label: 'Nos services' },
  { href: '/nos-realisations', label: 'Nos réalisations et recherches' },
  { href: '/offres-d-emploi', label: 'Offres d’emploi' },
  { href: '/admin', label: 'Admin' },
];

export const heroContent = {
  title:
    'Votre partenaire stratégique pour des solutions durables et des résultats mesurables.',
  buttons: {
    primary: {
      label: 'Découvrir nos services',
      href: '/nos-services',
    },
    secondary: {
      label: 'Nous contacter',
      href: '/contact',
    },
  },
  images: PlaceHolderImages.filter((img) => img.id.startsWith('hero-')),
};

export const introContent = {
  paragraph:
    'Kujuwa Consulting est un bureau d’études de la société ELBU Business SARLU, spécialisé dans la consultance, le suivi-évaluation, la recherche, la communication, la construction, le transport, l’immobilier, la papeterie, l’agroalimentaire et la mécanique.',
};

export const serviceIntros = [
  { name: 'Consultance', icon: BrainCircuit },
  { name: 'Transport', icon: Truck },
  { name: 'Immobilier', icon: Building2 },
  { name: 'Construction', icon: Construction },
  { name: 'Papeterie', icon: Printer },
  { name: 'Agroalimentaire', icon: Wheat },
  { name: 'Mécanique', icon: Wrench },
];

export const contactDetails = {
  email: 'elkikabus@gmail.com',
  phones: ['+243 971 594 070', '+243 975 409 370'],
  addresses: [
    {
      city: 'Kinshasa',
      address: 'Av. Lutete n°18, Q. Makelele, C/Bandalungwa',
    },
    {
      city: 'Goma',
      address: 'Av. Salongo II n°126, Q. Mabanga Nord',
    },
  ],
};

export const valuesContent = {
  title: 'Nos valeurs',
  values: [
    { icon: Award, title: 'Excellence technique', id: 'excellence' },
    { icon: ShieldCheck, title: 'Fiabilité des résultats', id: 'fiabilite' },
    {
      icon: Lightbulb,
      title: 'Innovation et satisfaction client',
      id: 'innovation',
    },
  ],
};

export const footerContent = {
  legal: [
    'RCCM: CD/KNG/RCCM/25-B-00821',
    'N° d’identification nationale: 01-H4901-N63778Z',
    'N° d’impôt: A2518222K',
  ],
  copyright: `Copyright © Kujuwa Consulting ${new Date().getFullYear()}`,
};

export const aboutUsContent = {
  history:
    "Kujuwa Consulting a été fondé comme le bureau d'études de la société mère, ELBU Business SARLU, pour répondre à une demande croissante d'expertise multidisciplinaire en République Démocratique du Congo. Depuis notre création, nous nous sommes engagés à fournir des services de haute qualité qui contribuent au développement durable du pays.",
  vision:
    'Devenir un acteur majeur et un cabinet de référence dans la consultance et le développement multisectoriel, reconnu pour notre expertise, notre intégrité et notre impact positif.',
  mission:
    'Offrir des solutions intégrées, innovantes et durables qui répondent aux besoins spécifiques des particuliers, des ONG, des institutions publiques et des entreprises privées, en favorisant la croissance économique et sociale.',
  values: [
    'Rigueur dans l’action',
    'Qualité dans le résultat',
    'Engagement et transparence',
  ],
  motto:
    '“La rigueur dans l’action et la qualité dans le résultat pour une meilleure satisfaction.”',
};

export type Service = {
  id: string;
  title: string;
  description: string;
  icon: string;
  image?: ImagePlaceholder;
  subServices?: { // Made optional for now
    title: string;
    description: string;
    icon: LucideIcon;
  }[];
};

export const realisationsContent = {
  title: 'Nos Réalisations et Recherches',
  description:
    'Découvrez une sélection de nos projets, études et formations qui témoignent de notre expertise et de notre engagement.',
  projects: [
    {
      title: 'Étude de marché pour une ONG internationale',
      category: 'Études et recherches',
      year: 2023,
      image: PlaceHolderImages.find((img) => img.id === 'realisation-1'),
      description:
        'Analyse approfondie du secteur agricole dans la province du Kivu pour identifier les opportunités d’investissement.',
    },
    {
      title: 'Construction d’un centre de santé communautaire',
      category: 'Projets achevés',
      year: 2022,
      image: PlaceHolderImages.find((img) => img.id === 'realisation-2'),
      description:
        'Projet clé en main, de la conception à la livraison, pour un partenaire local, améliorant l’accès aux soins pour 10 000 personnes.',
    },
    {
      title: 'Formation en gestion de projet pour PME',
      category: 'Formations dispensées',
      year: 2024,
      image: PlaceHolderImages.find((img) => img.id === 'realisation-3'),
      description:
        'Renforcement des capacités de 50 entrepreneurs locaux sur les meilleures pratiques en gestion de projet et suivi-évaluation.',
    },
  ],
};

export const jobOffersContent = {
  title: 'Offres d’emploi',
  description:
    'Rejoignez une équipe dynamique et contribuez à des projets impactants. Découvrez nos opportunités de carrière.',
};

export const contactPageContent = {
  title: 'Contactez-nous',
  description:
    "Une question ? Un projet ? N'hésitez pas à nous contacter via le formulaire, par email ou par téléphone. Notre équipe est à votre écoute.",
  openingHours: 'Lundi - Vendredi : 8h00 - 17h00',
};

export const quotePageContent = {
    title: 'Demander un devis',
    description: "Remplissez le formulaire ci-dessous pour nous décrire votre projet. Nous reviendrons vers vous dans les plus brefs délais avec une proposition sur mesure."
}
