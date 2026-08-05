import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { MrErminLogo } from '@/components/mrermin/MrErminLogo';
import { LoaderScreen } from '@/components/mrermin/LoaderScreen';
import { Stage3D } from '@/components/mrermin/Stage3D';
import { WizardPanel } from '@/components/mrermin/WizardPanel';
import { SummarySheet } from '@/components/mrermin/SummarySheet';
import { useConfigurator } from '@/store/mrermin';

const MrErmin = () => {
  const [ready, setReady] = useState(false);
  const next = useConfigurator((s) => s.next);
  const prev = useConfigurator((s) => s.prev);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 1400);
    return () => clearTimeout(t);
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
    <div className="mrermin min-h-screen">
      <Helmet>
        <html lang="de" />
        <title>MR. ERMIN Balkon-Konfigurator — 3D Balkon planen</title>
        <meta
          name="description"
          content="Planen Sie Ihren Balkon in 3D: Maße, Bodenbelag, Geländer, RAL-Farbe und Zusatzleistungen mit Live-Preis inkl. MwSt."
        />
      </Helmet>

      {!ready && <LoaderScreen />}

      <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border bg-surface px-4 py-3 lg:px-6">
        <MrErminLogo />
        <SummarySheet />
      </header>

      <main className="flex flex-col lg:h-[calc(100vh-65px)] lg:flex-row">
        <div className="sticky top-[65px] z-10 h-[40vh] w-full bg-background lg:static lg:h-full lg:w-[60%]">
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
