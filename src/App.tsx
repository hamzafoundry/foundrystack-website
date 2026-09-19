import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { SolutionsSection } from './components/SolutionsSection';
import { EngineeringSection } from './components/EngineeringSection';
import { ApproachSection } from './components/ApproachSection';
import { AboutSection } from './components/AboutSection';
import { CtaBanner } from './components/CtaBanner';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';

export default function App() {
  const [selectedProjectType, setSelectedProjectType] = useState<string>('Websites & Web Apps');

  const scrollToContact = (projectType?: string) => {
    if (projectType) {
      setSelectedProjectType(projectType);
    }
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToCapabilities = () => {
    const el = document.getElementById('capabilities');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectService = (serviceId: string) => {
    let typeName = 'Websites & Web Apps';
    if (serviceId === 'custom-systems') typeName = 'Custom Business Systems';
    if (serviceId === 'cloud-integrations') typeName = 'Cloud & API Integrations';
    if (serviceId === 'ai-automation') typeName = 'Workflow & AI Automation';
    scrollToContact(typeName);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Sticky Header Navigation */}
      <Navbar onOpenContact={() => scrollToContact()} />

      {/* Main Page Sections */}
      <main className="flex-grow">
        {/* 1. Hero Section */}
        <Hero
          onDiscussProject={() => scrollToContact()}
          onExploreCapabilities={scrollToCapabilities}
        />

        {/* 2. Services Section */}
        <ServicesSection onSelectService={handleSelectService} />

        {/* 3. Solutions We Can Build */}
        <SolutionsSection
          onRequestSolution={(solutionTitle) => scrollToContact(solutionTitle)}
        />

        {/* 4. Engineering Capability */}
        <EngineeringSection />

        {/* 5. Our Approach (Process Timeline) */}
        <ApproachSection />

        {/* 6. About Foundry Stack */}
        <AboutSection />

        {/* 7. Call to Action Banner */}
        <CtaBanner onDiscussProject={() => scrollToContact()} />

        {/* 8. Contact Form & Direct Channels */}
        <ContactSection preselectedProjectType={selectedProjectType} />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
