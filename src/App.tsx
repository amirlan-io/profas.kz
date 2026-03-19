import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Stats } from './components/Stats';
import { Audience } from './components/Audience';
import { Courses } from './components/Courses';
import { ConsultationCTA } from './components/ConsultationCTA';
import { Benefits } from './components/Benefits';
import { Process } from './components/Process';
import { Accreditation } from './components/Accreditation';
import { FAQ } from './components/FAQ';
import { Reviews } from './components/Reviews';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 selection:bg-orange-500 selection:text-white">
      <Navbar />
      <Hero />
      <Stats />
      {/* Лента логотипов удалена */}
      <Audience />
      <Courses />
      <ConsultationCTA />
      <Benefits />
      <Process />
      <Accreditation />
      <Reviews />
      <FAQ />
      <FinalCTA />
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}