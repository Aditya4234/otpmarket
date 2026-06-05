import Navbar from '@/components/Header';
import Hero from '@/components/Hero';
import HowToWork from '@/components/HowToWork';
import SupportedPlatforms from '@/components/SupportedPlatforms';
import UserSay from '@/components/UserSay';
import AskedQuestion from '@/components/AskedQuestion';
import GetStarted from '@/components/GetStarted';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="relative z-0 bg-primary text-white">
      <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center">
        <Navbar />
        <Hero />
      </div>
      <HowToWork />
      <SupportedPlatforms />
      <UserSay />
      <AskedQuestion />
      <GetStarted />
      <Footer />
    </main>
  );
}
