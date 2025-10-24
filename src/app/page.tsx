import Hero from '@/components/home/Hero';
import ServicesIntro from '@/components/home/ServicesIntro';
import ContactCards from '@/components/home/ContactCards';
import ValuesSection from '@/components/home/ValuesSection';

export default function Home() {
  return (
    <>
      <Hero />
      <ServicesIntro />
      <ValuesSection />
      <ContactCards />
    </>
  );
}
