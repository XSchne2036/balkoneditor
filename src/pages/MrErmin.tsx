import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { MrErminLogo } from '@/components/mrermin/MrErminLogo';
import { LoaderScreen } from '@/components/mrermin/LoaderScreen';
import { Stage3D } from '@/components/mrermin/Stage3D';
import { WizardPanel } from '@/components/mrermin/WizardPanel';
import { SummarySheet } from '@/components/mrermin/SummarySheet';
import { ThemeToggle } from '@/components/mrermin/ThemeToggle';
import { useConfigurator } from '@/store/mrermin';

const MrErmin = () => {
  const [ready, setReady] = useState(false);
  const next = useConfigurator((s) => s.next);
  const prev = useConfigurator((s) => s.prev);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 1400);
    return () => clearTimeout(t);
  }, []);

  // Theme-Tokens global setzen, damit auch Dialoge/Sheets (Portals) die Markenfarben nutzen
  useEffect(() => {
    document.documentElement.classList.add('mrermin');
    return () => document.documentElement.classList.remove('mrermin');
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName)) return;
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <html lang="de" />
        <title>Mr. Ermin Balkon-Konfigurator — 3D Balkon planen</title>
        <meta
          name="description"
          content="Planen Sie Ihren Balkon in 3D bei Mr. Ermin: Maße, Bodenbelag, Geländer, RAL-Farbe und Zusatzleistungen mit Live-Preis inkl. MwSt."
        />
      </Helmet>

      {!ready && <LoaderScreen />}

      <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border bg-surface px-4 py-3 lg:px-6">
        <MrErminLogo />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <SummarySheet />
        </div>
      </header>

      <main className="flex flex-col lg:h-[calc(100vh-73px)] lg:flex-row">
        <div className="sticky top-[73px] z-10 h-[40vh] w-full bg-background lg:static lg:h-full lg:w-[60%]">
          <Stage3D />
        </div>
        <div className="nd-panel w-full lg:h-full lg:w-[40%]">
          <WizardPanel />
        </div>
      </main>
    </div>
  );
};

export default MrErmin;
