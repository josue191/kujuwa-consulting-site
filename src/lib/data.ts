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
  icon: LucideIcon;
  image?: ImagePlaceholder;
  subServices: {
    title: string;
    description: string;
    icon: LucideIcon;
  }[];
};

export const services: Service[] = [
  {
    id: 'consultance',
    title: 'Consultance et Mentorat',
    description:
      'Expertise en suivi, évaluation, recherche, et renforcement des capacités pour garantir le succès de vos projets.',
    icon: BrainCircuit,
    image: PlaceHolderImages.find((img) => img.id === 'service-consultance'),
    subServices: [
      {
        title: 'Suivi & Évaluation des projets',
        description: 'Mise en place de systèmes de S&E robustes.',
        icon: ShieldCheck,
      },
      {
        title: 'Recherche et étude',
        description: 'Études de marché, enquêtes socio-économiques.',
        icon: BookOpen,
      },
      {
        title: 'Collecte, analyse et traitement des données',
        description:
          'Outils quantitatifs et qualitatifs pour des données fiables.',
        icon: BrainCircuit,
      },
    ],
  },
  {
    id: 'transport',
    title: 'Transport Routier',
    description:
      'Solutions de transport fiables pour marchandises et passagers, ainsi que vente et location de véhicules.',
    icon: Truck,
    image: PlaceHolderImages.find((img) => img.id === 'service-transport'),
    subServices: [
      {
        title: 'Transport de marchandises ou passagers',
        description: 'Flotte de camions, bus et taxis modernes.',
        icon: Truck,
      },
      {
        title: 'Location de véhicules',
        description: 'Véhicules neufs et usagés pour tous besoins.',
        icon: Car,
      },
      {
        title: 'Vente et commercialisation de véhicules',
        description: 'Catalogue varié de véhicules à vendre.',
        icon: Car,
      },
    ],
  },
  {
    id: 'immobilier',
    title: 'Services Immobiliers',
    description:
      "Gestion complète de vos besoins immobiliers : location, hébergement, achat et vente de propriétés.",
    icon: Building2,
    image: PlaceHolderImages.find((img) => img.id === 'service-immobilier'),
    subServices: [
      {
        title: 'Location diverse',
        description: 'Maisons, meubles, salles et espaces événementiels.',
        icon: Home,
      },
      {
        title: 'Hébergement et hôtellerie',
        description: 'Solutions d’hébergement confortables et sécurisées.',
        icon: Building2,
      },
      {
        title: 'Achat & vente de propriétés',
        description: 'Parcelles, terrains et champs pour vos projets.',
        icon: Home,
      },
    ],
  },
  {
    id: 'construction',
    title: 'Construction & Réhabilitation',
    description:
      'De la conception à la supervision, nous construisons et réhabilitons des édifices publics et privés.',
    icon: Construction,
    image: PlaceHolderImages.find((img) => img.id === 'service-construction'),
    subServices: [
      {
        title: 'Consultance en conception et travaux publics',
        description: 'Expertise technique pour des plans solides.',
        icon: HardHat,
      },
      {
        title: 'Supervision & contrôle de chantiers',
        description: 'Garantir la qualité et le respect des délais.',
        icon: Construction,
      },
      {
        title: 'Vente de matériaux de construction',
        description: 'Quincaillerie complète pour tous vos chantiers.',
        icon: ShoppingBag,
      },
    ],
  },
  {
    id: 'papeterie',
    title: 'Papeterie & Reprographie',
    description:
      "Fourniture de matériel de bureau et services d'impression professionnels pour toutes vos exigences.",
    icon: Printer,
    image: PlaceHolderImages.find((img) => img.id === 'service-papeterie'),
    subServices: [
      {
        title: 'Vente de matériels de papeterie',
        description: 'Catalogue complet de fournitures de bureau.',
        icon: ShoppingBag,
      },
      {
        title: 'Impression couleur / noir et blanc',
        description: 'Services de reprographie haute qualité tout format.',
        icon: Printer,
      },
    ],
  },
  {
    id: 'agro-commerce',
    title: 'Commerce Agricole & Habillement',
    description:
      "Vente d'aliments, semences agricoles, et une sélection de tissus et habits de qualité.",
    icon: Wheat,
    image: PlaceHolderImages.find((img) => img.id === 'service-agro'),
    subServices: [
      {
        title: "Vente d'aliments de première nécessité",
        description: 'Produits alimentaires de base accessibles.',
        icon: ShoppingBag,
      },
      {
        title: 'Vente de produits agricoles',
        description: 'Engrais et semences pour optimiser vos récoltes.',
        icon: Tractor,
      },
      {
        title: 'Vente de tissus et habits',
        description: 'Super wax, bazin et autres textiles pour dames.',
        icon: ShoppingBag,
      },
    ],
  },
  {
    id: 'mecanique',
    title: 'Réparation Mécanique',
    description:
      'Diagnostic, réparation et entretien de véhicules avec vente de pièces de rechange d’origine.',
    icon: Wrench,
    image: PlaceHolderImages.find((img) => img.id === 'service-mecanique'),
    subServices: [
      {
        title: 'Diagnostic mécanique et électrique',
        description: 'Technologie de pointe pour une détection précise.',
        icon: Wrench,
      },
      {
        title: 'Réparation & remplacement de pièces',
        description: 'Interventions rapides et fiables.',
        icon: Wrench,
      },
      {
        title: 'Entretien des systèmes',
        description:
          'Maintenance préventive pour la longévité de votre véhicule.',
        icon: Car,
      },
    ],
  },
];

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
  offers: [
    {
      id: 'chef-de-projet-en-construction',
      title: 'Chef de Projet en Construction',
      location: 'Kinshasa',
      domain: 'Construction',
    },
    {
      id: 'specialiste-en-suivi-evaluation',
      title: 'Spécialiste en Suivi & Évaluation',
      location: 'Goma',
      domain: 'Consultance',
    },
    {
      id: 'gestionnaire-de-flotte-de-transport',
      title: 'Gestionnaire de Flotte de Transport',
      location: 'Kinshasa',
      domain: 'Transport',
    },
  ],
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
