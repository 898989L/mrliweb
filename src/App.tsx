import AccessGate from './components/AccessGate'
import VideoBackground from './components/VideoBackground'
import Atmosphere from './components/Atmosphere'
import SkipLink from './components/SkipLink'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Experience from './components/Experience'
import Projects from './components/Projects'
import TechLab from './components/TechLab'
import DeliveryNotes from './components/DeliveryNotes'
import Strengths from './components/Strengths'
import Contact from './components/Contact'
import WaterRipple from './components/WaterRipple'
import './App.css'

export default function App() {
  return (
    <>
      <VideoBackground />
      <AccessGate>
        <Atmosphere />
        <SkipLink />
        <Navbar />
        <main id="main-content" className="main-content" tabIndex={-1}>
          <Hero />
          <About />
          <Experience />
          <Projects />
          <TechLab />
          <DeliveryNotes />
          <Strengths />
          <Contact />
        </main>
        <WaterRipple />
      </AccessGate>
    </>
  )
}
