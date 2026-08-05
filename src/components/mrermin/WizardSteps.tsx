import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useConfigurator } from '@/store/mrermin';
import {
  BELAG_TYPEN,
  EXTRAS,
  FEUERVERZINKT_HINWEIS,
  GELAENDER,
  MONTAGE_ANIMATIONEN,
  WANDSTRUKTUREN,
  WPC_FARBEN,
  WPC_HINWEIS,
  WPC_OBERFLAECHEN,
  WPC_PROFILE,
  eur,
  meter,
} from '@/lib/mrermin-data';
import { calcPrice } from '@/lib/mrermin-price';
import { RalPicker } from './RalPicker';
import { Check, Info, Plus } from 'lucide-react';
import { toast } from 'sonner';

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-2">
    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
    {children}
  </div>
);

const Pill = ({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-full border px-3 py-1.5 text-sm transition ${
      active
        ? 'border-brand-petrol bg-brand-petrol text-white'
        : 'border-border bg-surface text-foreground hover:border-brand-petrol'
    }`}
  >
    {children}
  </button>
);

const Dimension = ({
  label,
  value,
  min,
  max,
  quick,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  quick?: number[];
  onChange: (v: number) => void;
}) => (
  <Field label={label}>
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">individuell</span>
      <span className="font-semibold tabular-nums text-brand-petrol">{meter(value)}</span>
    </div>
    <Slider
      value={[value]}
      min={min}
      max={max}
      step={0.01}
      onValueChange={([v]) => onChange(v)}
      aria-label={label}
    />
    {quick && (
      <div className="flex flex-wrap gap-2 pt-1">
        {quick.map((q) => (
          <Pill key={q} active={Math.abs(value - q) < 0.005} onClick={() => onChange(q)}>
            {meter(q)}
          </Pill>
        ))}
      </div>
    )}
  </Field>
);

export const StepAufbau = () => {
  const d = useConfigurator((s) => s.data);
  const update = useConfigurator((s) => s.update);
  return (
    <div className="space-y-6">
      <Dimension
        label="Breite"
        value={d.breite}
        min={1.5}
        max={6}
        quick={[2.5, 3.5, 4.5]}
        onChange={(v) => update({ breite: v })}
      />
      <Dimension
        label="Tiefe"
        value={d.tiefe}
        min={1}
        max={4}
        quick={[1.5]}
        onChange={(v) => update({ tiefe: v })}
      />
      <Dimension
        label="Podesthöhe"
        value={d.podesthoehe}
        min={0.5}
        max={9}
        onChange={(v) => update({ podesthoehe: v })}
      />
      <Field label="Etagenanzahl">
        <div className="inline-flex rounded-full bg-muted p-1">
          {([1, 2] as const).map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => update({ etagen: e })}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                d.etagen === e ? 'bg-brand-petrol text-white' : 'text-muted-foreground'
              }`}
            >
              {e} {e === 1 ? 'Etage' : 'Etagen'}
            </button>
          ))}
        </div>
      </Field>
      <Field label="Tragvariante">
        <div className="grid grid-cols-2 gap-3">
          {(
            [
              { id: 'selbst', label: 'Selbsttragend', icon: '◫' },
              { id: 'wandseitig', label: 'Wandseitige Stützen', icon: '⊔' },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => update({ tragvariante: t.id })}
              className={`rounded-xl border p-3 text-left text-sm transition ${
                d.tragvariante === t.id ? 'border-brand-petrol bg-brand-petrol/5' : 'border-border bg-surface'
              }`}
            >
              <span className="block text-2xl text-brand-petrol" aria-hidden="true">
                {t.icon}
              </span>
              <span className="mt-1 block font-medium">{t.label}</span>
            </button>
          ))}
        </div>
      </Field>
      <Field label="Treppe">
        <div className="grid grid-cols-2 gap-3">
          {(
            [
              { id: 'keine', label: 'Keine' },
              { id: 'erweitert', label: 'Erweitert' },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => update({ treppe: t.id })}
              className={`rounded-xl border p-3 text-left text-sm transition ${
                d.treppe === t.id ? 'border-brand-petrol bg-brand-petrol/5' : 'border-border bg-surface'
              }`}
            >
              <span className="block text-2xl text-brand-petrol" aria-hidden="true">
                {t.id === 'keine' ? '—' : '▧'}
              </span>
              <span className="mt-1 block font-medium">{t.label}</span>
            </button>
          ))}
        </div>
      </Field>
    </div>
  );
};

export const StepBelag = () => {
  const d = useConfigurator((s) => s.data);
  const updateBelag = useConfigurator((s) => s.updateBelag);
  return (
    <div className="space-y-6">
      <Field label="Bodenbelag-Typ">
        <div className="space-y-3">
          {BELAG_TYPEN.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => updateBelag({ typ: b.id })}
              className={`flex w-full gap-3 rounded-xl border p-3 text-left transition ${
                d.belag.typ === b.id ? 'border-brand-petrol bg-brand-petrol/5' : 'border-border bg-surface'
              }`}
            >
              <span
                className="h-14 w-14 shrink-0 rounded-md border border-border"
                style={{ backgroundColor: b.color }}
                aria-hidden="true"
              />
              <span className="min-w-0">
                <span className="block text-sm font-semibold">{b.name}</span>
                <span className="block text-xs text-muted-foreground">{b.sub}</span>
                <span className="mt-1 block text-xs text-muted-foreground">{b.beschreibung}</span>
              </span>
              {d.belag.typ === b.id && <Check className="ml-auto h-4 w-4 shrink-0 text-brand-petrol" />}
            </button>
          ))}
        </div>
      </Field>

      {d.belag.typ === 'wpc' && (
        <>
          <Field label="WPC-Profil">
            <div className="flex flex-wrap gap-2">
              {WPC_PROFILE.map((p) => (
                <Pill
                  key={p.id}
                  active={d.belag.wpcProfil === p.id}
                  onClick={() => updateBelag({ wpcProfil: p.id })}
                >
                  {p.label}
                </Pill>
              ))}
            </div>
          </Field>
          <Field label="WPC-Oberfläche">
            <div className="flex flex-wrap gap-2">
              {WPC_OBERFLAECHEN.map((o) => (
                <Pill
                  key={o.id}
                  active={d.belag.wpcOberflaeche === o.id}
                  onClick={() => updateBelag({ wpcOberflaeche: o.id })}
                >
                  {o.label}
                </Pill>
              ))}
            </div>
          </Field>
          <Field label="WPC-Farbe">
            <div className="grid grid-cols-2 gap-2">
              {WPC_FARBEN.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => updateBelag({ wpcFarbe: f.id })}
                  className={`flex items-center gap-2 rounded-md border p-2 text-left text-xs transition ${
                    d.belag.wpcFarbe === f.id ? 'border-brand-petrol' : 'border-border'
                  }`}
                >
                  <span
                    className="h-7 w-7 rounded-md border border-border"
                    style={{ backgroundColor: f.color }}
                  />
                  {f.label}
                </button>
              ))}
            </div>
          </Field>
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="flex cursor-help items-start gap-2 text-xs text-muted-foreground">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {WPC_HINWEIS}
              </p>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">{WPC_HINWEIS}</TooltipContent>
          </Tooltip>
        </>
      )}
    </div>
  );
};

export const StepFarbe = () => {
  const d = useConfigurator((s) => s.data);
  const update = useConfigurator((s) => s.update);
  return (
    <div className="space-y-4">
      {d.oberflaeche === 'feuerverzinkt' && (
        <p className="rounded-md bg-muted p-3 text-xs text-muted-foreground">
          {FEUERVERZINKT_HINWEIS}
        </p>
      )}
      <Field label="Oberfläche / Farbe">
        <RalPicker value={d.oberflaeche} onChange={(v) => update({ oberflaeche: v })} />
      </Field>
    </div>
  );
};

export const StepGelaender = () => {
  const d = useConfigurator((s) => s.data);
  const update = useConfigurator((s) => s.update);
  const art = GELAENDER.find((g) => g.id === d.gelaender)!.art;
  return (
    <div className="space-y-6">
      <Field label="Geländer">
        <div className="grid grid-cols-2 gap-3">
          {GELAENDER.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => update({ gelaender: g.id })}
              className={`relative overflow-hidden rounded-xl border p-2 text-left transition ${
                d.gelaender === g.id ? 'border-brand-petrol bg-brand-petrol/5' : 'border-border bg-surface'
              }`}
            >
              <img
                src={g.img}
                alt={g.name}
                loading="lazy"
                className="h-20 w-full rounded-md bg-muted object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.visibility = 'hidden';
                }}
              />
              <span className="mt-2 block text-xs font-medium">{g.name}</span>
              {d.gelaender === g.id && (
                <Check className="absolute right-2 top-2 h-4 w-4 text-brand-petrol" />
              )}
            </button>
          ))}
        </div>
      </Field>
      {(art === 'glas' || art === 'alublech') && (
        <Field label="RAL-Farbe Rahmen">
          <RalPicker
            value={d.gelaenderFarbe ?? 'feuerverzinkt'}
            onChange={(v) => update({ gelaenderFarbe: v })}
          />
        </Field>
      )}
    </div>
  );
};

export const StepWand = () => {
  const d = useConfigurator((s) => s.data);
  const update = useConfigurator((s) => s.update);
  return (
    <Field label="Wandstruktur">
      <div className="grid grid-cols-2 gap-3">
        {WANDSTRUKTUREN.map((w) => (
          <button
            key={w.id}
            type="button"
            onClick={() => update({ wand: w.id })}
            className={`rounded-xl border p-2 text-left transition ${
              d.wand === w.id ? 'border-brand-petrol bg-brand-petrol/5' : 'border-border bg-surface'
            }`}
          >
            <span
              className="block h-16 w-full rounded-md border border-border"
              style={{ background: `linear-gradient(135deg, ${w.color}, ${w.accent})` }}
              aria-hidden="true"
            />
            <span className="mt-2 block text-xs font-medium">{w.label}</span>
          </button>
        ))}
      </div>
    </Field>
  );
};

export const StepExtras = () => {
  const d = useConfigurator((s) => s.data);
  const update = useConfigurator((s) => s.update);
  const toggleExtra = useConfigurator((s) => s.toggleExtra);
  return (
    <div className="space-y-6">
      <Field label="Montageanimation">
        <div className="inline-flex flex-wrap rounded-full bg-muted p-1">
          {MONTAGE_ANIMATIONEN.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => update({ montageAnimation: m.id })}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                d.montageAnimation === m.id ? 'bg-brand-petrol text-white' : 'text-muted-foreground'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </Field>
      <div className="space-y-3">
        {EXTRAS.map((e) => {
          const active = d.extras[e.id];
          return (
            <div key={e.id} className="rounded-xl border border-border bg-surface p-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-semibold">{e.name}</h3>
                <span className="shrink-0 text-lg font-bold tabular-nums text-brand-petrol">
                  {eur(e.preis)}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{e.beschreibung}</p>
              <Button
                variant={active ? 'ghost' : 'default'}
                size="sm"
                onClick={() => toggleExtra(e.id)}
                className={`mt-3 ${active ? 'text-brand-petrol' : 'bg-brand-petrol hover:bg-brand-petrol-2'}`}
              >
                {active ? (
                  <>
                    <Check className="mr-1 h-4 w-4" /> Hinzugefügt
                  </>
                ) : (
                  <>
                    <Plus className="mr-1 h-4 w-4" /> Hinzufügen
                  </>
                )}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const StepKontakt = () => {
  const k = useConfigurator((s) => s.kontakt);
  const data = useConfigurator((s) => s.data);
  const setKontakt = useConfigurator((s) => s.setKontakt);
  const reset = useConfigurator((s) => s.reset);

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const price = calcPrice(data);
    const lines = [
      `Anrede: ${k.anrede}`,
      `Name: ${k.vorname} ${k.nachname}`,
      k.firma ? `Firma: ${k.firma}` : '',
      `E-Mail: ${k.email}`,
      `Telefon: ${k.telefon}`,
      `Adresse: ${k.strasse}, ${k.plz} ${k.ort}, ${k.land}`,
      '',
      'Konfiguration:',
      `- Breite: ${meter(data.breite)}`,
      `- Tiefe: ${meter(data.tiefe)}`,
      `- Podesthöhe: ${meter(data.podesthoehe)}`,
      `- Etagen: ${data.etagen}`,
      `- Tragvariante: ${data.tragvariante}`,
      `- Treppe: ${data.treppe}`,
      `- Belag: ${data.belag.typ} (${data.belag.wpcProfil}, ${data.belag.wpcOberflaeche}, ${data.belag.wpcFarbe})`,
      `- Oberfläche: ${data.oberflaeche}`,
      `- Geländer: ${data.gelaender}`,
      `- Wandstruktur: ${data.wand}`,
      '',
      'Positionen:',
      ...price.items.map((i) => `- ${i.label}: ${eur(i.value)}`),
      `Gesamt inkl. MwSt.: ${eur(price.brutto)}`,
      '',
      'Nachricht:',
      k.nachricht,
    ].filter(Boolean);

    const href = `mailto:info@mrermin.de?subject=${encodeURIComponent(
      `Balkon-Anfrage ${k.vorname} ${k.nachname}`
    )}&body=${encodeURIComponent(lines.join('\n'))}`;
    window.location.href = href;
    toast.success('Ihre Anfrage wird an info@mrermin.de gesendet.');
  };

  return (
    <form className="space-y-4" onSubmit={submit}>
      <div className="space-y-2">
        <Label htmlFor="anrede">Anrede</Label>
        <Select value={k.anrede} onValueChange={(v) => setKontakt({ anrede: v as typeof k.anrede })}>
          <SelectTrigger id="anrede">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Herr">Herr</SelectItem>
            <SelectItem value="Frau">Frau</SelectItem>
            <SelectItem value="Divers">Divers</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="vorname">Vorname*</Label>
          <Input id="vorname" required value={k.vorname} onChange={(e) => setKontakt({ vorname: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nachname">Nachname*</Label>
          <Input id="nachname" required value={k.nachname} onChange={(e) => setKontakt({ nachname: e.target.value })} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="firma">Firma (optional)</Label>
        <Input id="firma" value={k.firma} onChange={(e) => setKontakt({ firma: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="email">E-Mail*</Label>
          <Input id="email" type="email" required value={k.email} onChange={(e) => setKontakt({ email: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="telefon">Telefon*</Label>
          <Input id="telefon" required value={k.telefon} onChange={(e) => setKontakt({ telefon: e.target.value })} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="strasse">Straße*</Label>
        <Input id="strasse" required value={k.strasse} onChange={(e) => setKontakt({ strasse: e.target.value })} />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-2">
          <Label htmlFor="plz">PLZ*</Label>
          <Input id="plz" required value={k.plz} onChange={(e) => setKontakt({ plz: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ort">Ort*</Label>
          <Input id="ort" required value={k.ort} onChange={(e) => setKontakt({ ort: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="land">Land</Label>
          <Select value={k.land} onValueChange={(v) => setKontakt({ land: v })}>
            <SelectTrigger id="land">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DE">DE</SelectItem>
              <SelectItem value="AT">AT</SelectItem>
              <SelectItem value="CH">CH</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="nachricht">Nachricht</Label>
        <Textarea id="nachricht" rows={4} value={k.nachricht} onChange={(e) => setKontakt({ nachricht: e.target.value })} />
      </div>
      <div className="flex items-start gap-2">
        <Checkbox
          id="dsgvo"
          checked={k.dsgvo}
          onCheckedChange={(v) => setKontakt({ dsgvo: Boolean(v) })}
          required
        />
        <Label htmlFor="dsgvo" className="text-xs font-normal leading-snug text-muted-foreground">
          Ich stimme der Verarbeitung meiner Daten gemäß DSGVO zu.*
        </Label>
      </div>
      <Button type="submit" disabled={!k.dsgvo} className="w-full bg-brand-petrol hover:bg-brand-petrol-2">
        Anfrage absenden
      </Button>
      <Button type="button" variant="outline" className="w-full" onClick={reset}>
        Neue Konfiguration starten
      </Button>
    </form>
  );
};
