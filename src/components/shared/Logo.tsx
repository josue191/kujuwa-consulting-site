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
        className="object-contain"
        priority
      />
    </Link>
  );
};

export default Logo;
