import Nav from './components/Nav/Nav.jsx';
import Hero from './components/Hero/Hero.jsx';
import Ticker from './components/Ticker/Ticker.jsx';
import WorkStrip from './components/WorkStrip/WorkStrip.jsx';
import SkillsSection from './components/SkillsSection/SkillsSection.jsx';
import ExperienceSection from './components/ExperienceSection/ExperienceSection.jsx';
import AboutSection from './components/AboutSection/AboutSection.jsx';
import WritingSection from './components/WritingSection/WritingSection.jsx';
import Footer from './components/Footer/Footer.jsx';
import Cursor from './components/Cursor/Cursor.jsx';
import { TECH_ITEMS, CLIENT_ITEMS } from './data/marquee.js';

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Ticker items={TECH_ITEMS} separator="/" speed={22} label="Tech stack" />
        <WorkStrip />
        <SkillsSection />
        <Ticker items={CLIENT_ITEMS} separator="·" speed={25} reverse label="Industries" />
        <ExperienceSection />
        <AboutSection />
        <WritingSection />
      </main>
      <Footer />
      <Cursor />
    </>
  );
}
