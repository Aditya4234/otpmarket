

import Navbar from "../component/Header";
import Hero from "../component/Hero";
import HowToWork from "../component/HowToWork";
import SupportedPlatforms from "../component/SupportedPlatforms";
import UserSay from "../component/UserSay";
import AskedQuestion from "../component/AskedQuestion";
import GetStarted from "../component/GetStarted";
import Footer from "../component/Footer";



export default function Home() {
  return (
    <main className="relative z-0 bg-primary"> 
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
      {/* <Experience /> */}
      {/* <Tech /> */}
      {/* <Projects /> */}
     
    </main>
  );
}
