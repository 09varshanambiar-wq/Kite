import React from 'react';
import { Nav } from './components/navigation/Nav';
import { Hero } from './components/sections/Hero';
import { Ticker } from './components/sections/Ticker';
import { Introduction } from './components/sections/Introduction';
import { TransitionalStatement } from './components/sections/TransitionalStatement';
import { VoiceIntelligence } from './components/sections/VoiceIntelligence';
import { LiveProducts } from './components/sections/LiveProducts';
import { Experiments } from './components/sections/Experiments';
import { Footer } from './components/sections/Footer';

export default function App() {
  return (
    <div className="page-wrapper">
      <Nav />
      <main>
        <Hero />
        <Ticker />
        <Introduction />
        <TransitionalStatement />
        <VoiceIntelligence />
        <LiveProducts />
        <Experiments />
      </main>
      <Footer />
    </div>
  );
}
