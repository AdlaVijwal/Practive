import Hero from "./components/Hero";
import About from "./components/About";

import TechUpdates from "./components/TechUpdates";
import Opportunities from "./components/Opportunities";
import Services from "./components/Services";
import Community from "./components/Community";
import Newsletter from "./components/Newsletter";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="min-h-screen bg-black">
      <Hero />
      <About />

      <TechUpdates />
      <Opportunities />
      <Services />
      <Community />
      <Newsletter />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;
