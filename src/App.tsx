import React, { useState } from 'react';
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
import { AdminLoginModal } from './components/AdminLoginModal';
import { SuperadminUsersPanel } from './components/SuperadminUsersPanel';
import { ContentAdminPanel } from './components/ContentAdminPanel';
import { ContentProvider, useContentReload } from './context/ContentContext';

function SiteContent() {
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<{ email: string; role: 'superadmin' | 'admin' } | null>(null);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const reloadContent = useContentReload();

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-orange-500 selection:text-white">
      <Navbar onOpenAdminPanel={() => setIsAdminModalOpen(true)} />
      <Hero />
      <Stats />
      <Audience />
      <Courses />
      <ConsultationCTA />
      <Benefits />
      <Process />
      <Accreditation />
      <Reviews />
      <FAQ />
      <FinalCTA />
      <Footer onOpenAdminPanel={() => setIsAdminModalOpen(true)} />
      <FloatingWhatsApp />

      <AdminLoginModal
        open={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onLoggedIn={(user) => {
          setAdminUser({ email: user.email, role: user.role });
          setIsAdminPanelOpen(true);
        }}
      />

      {adminUser && (
        <div className="fixed bottom-6 left-6 z-[70] hidden md:block">
          <div className="rounded-2xl bg-slate-950 text-white px-4 py-3 shadow-xl border border-white/10">
            <div className="text-sm opacity-80">Вход выполнен</div>
            <div className="font-semibold">{adminUser.email}</div>
            <div className="text-xs opacity-70">{adminUser.role}</div>
          </div>
        </div>
      )}

      {adminUser && isAdminPanelOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-2 md:p-4">
          <button
            type="button"
            aria-label="Закрыть"
            className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm"
            onClick={() => setIsAdminPanelOpen(false)}
          />
          <div className="relative w-full max-w-6xl max-h-[92vh] overflow-y-auto rounded-3xl bg-slate-100 border border-slate-200 shadow-2xl">
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between gap-4 bg-slate-950 text-white px-6 py-4 rounded-t-3xl">
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center font-black text-lg">A</div>
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-widest">CMS</div>
                  <div className="font-bold leading-tight">{adminUser.email}</div>
                </div>
                <span className="ml-2 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold px-3 py-1">{adminUser.role}</span>
              </div>
              <button
                type="button"
                onClick={() => { setIsAdminPanelOpen(false); void reloadContent(); }}
                className="rounded-xl bg-white/10 hover:bg-white/20 px-4 py-2 text-sm font-semibold transition"
              >
                Закрыть и обновить сайт
              </button>
            </div>

            <div className="p-4 md:p-6">
              {adminUser.role === 'superadmin' ? (
                <SuperadminUsersPanel />
              ) : (
                <ContentAdminPanel />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ContentProvider>
      <SiteContent />
    </ContentProvider>
  );
}
