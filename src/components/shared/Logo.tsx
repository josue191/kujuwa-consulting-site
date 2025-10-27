import Link from 'next/link';
import Image from 'next/image';

const Logo = () => {
  return (
    <Link href="/" className="relative flex items-center w-44 h-10">
      <Image
        src="/logo.png"
        alt="Kujuwa Consulting Logo"
        fill
        priority
        className="object-contain"
      />
    </Link>
  );
};

export default Logo;
