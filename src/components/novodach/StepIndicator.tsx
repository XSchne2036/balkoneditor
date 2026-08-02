import { STEPS } from '@/lib/novodach-data';
import { useConfigurator } from '@/store/novodach';

export const StepIndicator = () => {
  const step = useConfigurator((s) => s.step);
  const setStep = useConfigurator((s) => s.setStep);

  return (
    <>
      <nav aria-label="Konfigurationsschritte" className="hidden flex-wrap gap-1.5 md:flex">
        {STEPS.map((s, i) => (
          <button
            key={s.key}
            type="button"
            onClick={() => setStep(i + 1)}
            aria-current={step === i + 1 ? 'step' : undefined}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              step === i + 1
                ? 'bg-brand-petrol text-white'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            <span className="tabular-nums">{i + 1}</span> {s.label}
          </button>
        ))}
      </nav>
      <div className="flex gap-1.5 md:hidden" aria-hidden="true">
        {STEPS.map((s, i) => (
          <span
            key={s.key}
            className={`h-2 w-2 rounded-full ${step === i + 1 ? 'bg-brand-petrol' : 'bg-muted'}`}
          />
        ))}
      </div>
    </>
  );
};
