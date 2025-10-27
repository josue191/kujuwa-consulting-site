import Link from 'next/link';
import Image from 'next/image';

const Logo = () => {
  return (
    <Link href="/" className="flex items-center">
      <Image
        src="/logo.png"
        alt="Kujuwa Consulting Logo"
        width={180}
        height={40}
        priority
        className="h-auto w-44"
      />
    </Link>
  );
};

export default Logo;
