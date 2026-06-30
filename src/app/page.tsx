import Hero from '@/components/home/Hero';
import ServicesIntro from '@/components/home/ServicesIntro';
import ContactCards from '@/components/home/ContactCards';
import ValuesSection from '@/components/home/ValuesSection';
import RealisationsGallery from '@/components/home/RealisationsGallery';

export default function Home() {
  return (
    <>
      <Hero />
      <ServicesIntro />
      <RealisationsGallery />
      <ValuesSection />
      <ContactCards />
    </>
  );
}
