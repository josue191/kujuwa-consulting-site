import Link from 'next/link';

const Logo = () => {
  return (
    <Link href="/" className="font-headline text-2xl font-bold tracking-tight">
      <span className="text-primary">Kujuwa</span>
      <span className="text-foreground">Consulting</span>
    </Link>
  );
};

export default Logo;
