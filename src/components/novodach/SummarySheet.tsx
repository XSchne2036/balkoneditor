import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useConfigurator } from '@/store/novodach';
import { calcPrice } from '@/lib/novodach-price';
import { eur } from '@/lib/novodach-data';
import { Receipt } from 'lucide-react';

export const SummarySheet = () => {
  const data = useConfigurator((s) => s.data);
  const setStep = useConfigurator((s) => s.setStep);
  const price = calcPrice(data);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label="Preisdetails anzeigen"
          className="nd-panel flex items-center gap-2 rounded-full bg-brand-petrol px-4 py-2 text-xs font-semibold text-white sm:text-sm"
        >
          <Receipt className="h-4 w-4" aria-hidden="true" />
          <span aria-live="polite" className="tabular-nums">
            Gesamtpreis inkl. MwSt. · {eur(price.brutto)}
          </span>
        </button>
      </SheetTrigger>
      <SheetContent className="w-full overflow-y-auto bg-surface sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="uppercase tracking-widest text-brand-petrol">
            Bestellübersicht
          </SheetTitle>
        </SheetHeader>
        <ul className="mt-6 space-y-2 text-sm">
          {price.items.map((i, idx) => (
            <li key={idx} className="flex justify-between gap-4 border-b border-border pb-2">
              <span className="text-muted-foreground">{i.label}</span>
              <span className="shrink-0 font-semibold tabular-nums">{eur(i.value)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Summe netto</span>
            <span className="font-semibold tabular-nums">{eur(price.netto)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">MwSt. 19 %</span>
            <span className="font-semibold tabular-nums">{eur(price.mwst)}</span>
          </div>
          <div className="flex justify-between border-t border-border pt-2 text-base">
            <span className="font-semibold">Gesamtpreis inkl. MwSt.</span>
            <span className="font-bold tabular-nums text-brand-petrol">{eur(price.brutto)}</span>
          </div>
        </div>
        <Button className="mt-6 w-full bg-brand-petrol hover:bg-brand-petrol-2" onClick={() => setStep(7)}>
          Anfrage absenden
        </Button>
      </SheetContent>
    </Sheet>
  );
};
