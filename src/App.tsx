import { MotionConfig, useReducedMotion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { CustomCursor } from './components/CustomCursor'
import { Footer } from './components/Footer'
import { Intro } from './components/Intro'
import { Navbar } from './components/Navbar'
import { Overlays } from './components/Overlays'
import { PortfolioBadge } from './components/PortfolioBadge'
import { SectionProgress } from './components/SectionProgress'
import { hero } from './data/content'
import { img } from './lib/image'
import { UIContext, type Overlay, type UI } from './lib/ui'
import { Arrival } from './sections/Arrival'
import { ArchitectureStory } from './sections/ArchitectureStory'
import { CinematicHero } from './sections/CinematicHero'
import { DestinationExplorer } from './sections/DestinationExplorer'
import { EnterHome } from './sections/EnterHome'
import { EstateScroller } from './sections/EstateScroller'
import { ExperienceExplorer } from './sections/ExperienceExplorer'
import { FeaturedEstate } from './sections/FeaturedEstate'
import { FinalCTA } from './sections/FinalCTA'
import { InteriorExperience } from './sections/InteriorExperience'
import { LifestyleSection } from './sections/LifestyleSection'
import { PrivateCollection } from './sections/PrivateCollection'

const MIN_INTRO = 2100
const MAX_INTRO = 3400

export default function App() {
  const reduce = useReducedMotion()
  const [introDone, setIntroDone] = useState(!!reduce)
  const [overlay, setOverlay] = useState<Overlay>(null)

  // Title card: hold for a beat, wait for the hero photograph — but never longer than MAX_INTRO.
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
    if (reduce) {
      setIntroDone(true)
      return
    }
    document.body.style.overflow = 'hidden'
    const loaded = new Promise<void>((res) => {
      const i = new Image()
      i.onload = i.onerror = () => res()
      i.src = img(hero.photo.id, 1600)
    })
    const minTime = new Promise((r) => setTimeout(r, MIN_INTRO))
    const cap = new Promise((r) => setTimeout(r, MAX_INTRO))
    let live = true
    Promise.race([Promise.all([loaded, minTime]), cap]).then(() => {
      if (!live) return
      document.body.style.overflow = ''
      setIntroDone(true)
    })
    return () => {
      live = false
      document.body.style.overflow = ''
    }
  }, [reduce])

  const open = useCallback((o: Exclude<Overlay, null>) => setOverlay(o), [])
  const close = useCallback(() => setOverlay(null), [])
  const ui: UI = useMemo(() => ({ overlay, open, close, introDone }), [overlay, open, close, introDone])

  return (
    <MotionConfig reducedMotion="user">
      <UIContext.Provider value={ui}>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[300] focus:bg-champagne focus:px-4 focus:py-2 focus:text-ink">
          Skip to content
        </a>
        <Intro show={!introDone} />
        <Navbar />
        <SectionProgress />
        <main id="main">
          <CinematicHero />
          <Arrival />
          <EstateScroller />
          <EnterHome />
          <InteriorExperience />
          <LifestyleSection />
          <FeaturedEstate />
          <ArchitectureStory />
          <ExperienceExplorer />
          <DestinationExplorer />
          <PrivateCollection />
          <FinalCTA />
        </main>
        <Footer />
        <Overlays />
        <PortfolioBadge />
        <CustomCursor />
      </UIContext.Provider>
    </MotionConfig>
  )
}
