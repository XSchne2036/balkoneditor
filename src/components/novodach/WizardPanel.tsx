import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useConfigurator } from '@/store/novodach';
import { STEPS } from '@/lib/novodach-data';
import { StepIndicator } from './StepIndicator';
import {
  StepAufbau,
  StepBelag,
  StepExtras,
  StepFarbe,
  StepGelaender,
  StepKontakt,
  StepWand,
} from './WizardSteps';

const TITLES = [
  'Aufbau',
  'Bodenbelag',
  'Oberfläche / Farbe',
  'Geländer',
  'Wandstruktur',
  'Zusatzoptionen',
  'Kontakt / Anfrage',
];

export const WizardPanel = () => {
  const step = useConfigurator((s) => s.step);
  const next = useConfigurator((s) => s.next);
  const prev = useConfigurator((s) => s.prev);

  const Current = [
    StepAufbau,
    StepBelag,
    StepFarbe,
    StepGelaender,
    StepWand,
    StepExtras,
    StepKontakt,
  ][step - 1];

  return (
    <section className="flex h-full flex-col bg-surface">
      <div className="border-b border-border p-4 lg:p-6">
        <StepIndicator />
        <p className="mt-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Schritt {step} von {STEPS.length}
        </p>
        <h2 className="text-2xl font-bold uppercase tracking-widest text-brand-petrol lg:text-3xl">
          {TITLES[step - 1]}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.22 }}
          >
            <Current />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-border p-4 lg:p-6">
        <Button variant="outline" onClick={prev} disabled={step === 1} aria-label="Zurück">
          <ChevronLeft className="mr-1 h-4 w-4" /> Zurück
        </Button>
        <Button
          onClick={next}
          disabled={step === STEPS.length}
          className="bg-brand-petrol hover:bg-brand-petrol-2"
          aria-label="Weiter"
        >
          Weiter <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </section>
  );
};
