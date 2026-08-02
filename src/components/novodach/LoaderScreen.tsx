import { NovodachLogo } from './NovodachLogo';

export const LoaderScreen = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
    <div className="nd-panel w-[min(90vw,420px)] rounded-xl bg-surface p-8 text-center">
      <div className="flex justify-center">
        <NovodachLogo />
      </div>
      <h1 className="mt-6 text-2xl font-bold uppercase tracking-widest text-brand-petrol">
        Konfigurator startet
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">3D-Modell wird geladen</p>
      <div className="nd-progress-bar relative mt-6 h-2 w-full overflow-hidden rounded-full bg-muted" />
    </div>
  </div>
);
