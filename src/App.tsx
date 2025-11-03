import Hero from "./components/Hero";
import About from "./components/About";
import StudentHub from "./components/StudentHub";
import Opportunities from "./components/Opportunities";
import Services from "./components/Services";
import Community from "./components/Community";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="min-h-screen bg-black">
      <Hero />
      <Services />
      <StudentHub />
      <Opportunities />
      <Community />
      <About />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;
