import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { RAL_FARBEN, RAL_HINWEIS, RAL_QUICK } from '@/lib/mrermin-data';
import { Check } from 'lucide-react';

interface Props {
  value: string;
  onChange: (v: string) => void;
  allowFeuerverzinkt?: boolean;
}

export const RalPicker = ({ value, onChange, allowFeuerverzinkt = true }: Props) => {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const list = RAL_FARBEN.filter(
    (r) => `${r.code} ${r.name}`.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {allowFeuerverzinkt && (
          <button
            type="button"
            onClick={() => onChange('feuerverzinkt')}
            className={`rounded-full border px-3 py-1.5 text-sm transition ${
              value === 'feuerverzinkt'
                ? 'border-brand-petrol bg-brand-petrol text-white'
                : 'border-border bg-surface text-foreground hover:border-brand-petrol'
            }`}
          >
            Feuerverzinkt
          </button>
        )}
        {RAL_QUICK.map((code) => {
          const c = RAL_FARBEN.find((r) => r.code === code)!;
          return (
            <button
              key={code}
              type="button"
              onClick={() => onChange(code)}
              className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition ${
                value === code
                  ? 'border-brand-petrol bg-brand-petrol text-white'
                  : 'border-border bg-surface text-foreground hover:border-brand-petrol'
              }`}
            >
              <span
                className="h-3.5 w-3.5 rounded-full border border-border"
                style={{ backgroundColor: c.hex }}
              />
              RAL {c.code} {c.name}
            </button>
          );
        })}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="rounded-full">
              Mehr
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="uppercase tracking-widest">RAL-Sonderfarben</DialogTitle>
            </DialogHeader>
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="RAL-Code oder Name suchen"
              aria-label="RAL-Farbe suchen"
            />
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {list.map((r) => (
                <button
                  key={r.code}
                  type="button"
                  onClick={() => {
                    onChange(r.code);
                    setOpen(false);
                  }}
                  className={`flex items-center gap-3 rounded-md border p-2 text-left text-sm transition hover:border-brand-petrol ${
                    value === r.code ? 'border-brand-petrol' : 'border-border'
                  }`}
                >
                  <span
                    className="h-8 w-8 shrink-0 rounded-md border border-border"
                    style={{ backgroundColor: r.hex }}
                  />
                  <span>
                    <span className="block font-semibold tabular-nums">RAL {r.code}</span>
                    <span className="block text-muted-foreground">{r.name}</span>
                  </span>
                  {value === r.code && <Check className="ml-auto h-4 w-4 text-brand-petrol" />}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">{RAL_HINWEIS}</p>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
