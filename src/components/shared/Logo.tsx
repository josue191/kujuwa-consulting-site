import Link from 'next/link';

const Logo = () => {
  return (
    <Link href="/">
      <div className="font-headline text-2xl font-bold text-foreground">
        Kujuwa Consulting
      </div>
    </Link>
  );
};

export default Logo;
