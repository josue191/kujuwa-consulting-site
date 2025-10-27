import Link from 'next/link';
import Image from 'next/image';

const Logo = () => {
  return (
    <Link href="/">
      <Image
        src="/logo.png"
        alt="Kujuwa Consulting Logo"
        width={150}
        height={62}
        priority
        className="w-auto h-auto"
      />
    </Link>
  );
};

export default Logo;
