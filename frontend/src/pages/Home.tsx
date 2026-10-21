import Hero from '../components/Hero';
import OurStory from '../components/OurStory';
import CoreValues from '../components/CoreValues';
import CustomerSnapshot from '../components/CustomerSnapshot';
import MasonryGallery from '../components/MasonryGallery';

export default function Home() {
  return (
    <main>
      <Hero />
      <OurStory />
      <CoreValues />
      <CustomerSnapshot />
      <MasonryGallery />
    </main>
  );
}
