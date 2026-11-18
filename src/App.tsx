import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { ExamplesSection } from './components/ExamplesSection';
import { ApproachSection } from './components/ApproachSection';
import { AboutSection } from './components/AboutSection';
import { CtaBanner } from './components/CtaBanner';
import { ContactSection, ProjectTypePreselect } from './components/ContactSection';
import { Footer } from './components/Footer';
import { SERVICE_LAYERS, ServiceId } from './components/serviceLayers';

export default function App() {
  const [preselect, setPreselect] = useState<ProjectTypePreselect>({ index: 0, tick: 0 });

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const scrollToContact = (projectTypeIndex?: number) => {
    if (projectTypeIndex !== undefined) {
      setPreselect((p) => ({ index: projectTypeIndex, tick: p.tick + 1 }));
    }
    scrollTo('contact');
  };

  const inquireService = (serviceId: ServiceId) => {
    const layer = SERVICE_LAYERS.find((l) => l.id === serviceId);
    scrollToContact(layer?.projectTypeIndex ?? 0);
  };

  return (
    <div className="min-h-screen bg-ground text-ink flex flex-col">
      <a
        href="#contact"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:start-3 focus:z-[70] focus:bg-surface focus:px-4 focus:py-2 focus:rounded-[3px]"
      >
        Skip to contact
      </a>

      <Navbar onOpenContact={() => scrollToContact()} />

      <main className="flex-grow">
        <Hero onDiscussProject={() => scrollToContact()} />
        <ServicesSection onSelectService={inquireService} />
        <ExamplesSection />
        <ApproachSection />
        <AboutSection />
        <CtaBanner onDiscussProject={() => scrollToContact()} />
        <ContactSection preselect={preselect} />
      </main>

      <Footer />
    </div>
  );
}
