import React from 'react'
import Hero from './components/custom/Hero'
import HowItWorks from './components/custom/HowItWorks'
import Advantages from './components/custom/Advantages'
import TrustedBy from './components/custom/TrustedBy'
import Reviews from './components/custom/Reviews'
import Cta from './components/custom/Cta'
import Faq from './components/custom/Faq'
import Footer from './components/custom/Footer'

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <HowItWorks />
      <Advantages />
      <TrustedBy />
      <Cta />
      <Reviews />
      <Faq />
      <div className="flex-grow" />
      <Footer />
    </div>
  )
}

export default App
