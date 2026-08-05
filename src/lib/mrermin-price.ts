import { EXTRAS, GELAENDER } from '@/lib/mrermin-data';
import type { ConfigData } from '@/store/mrermin';

export interface PriceItem {
  label: string;
  value: number;
}

export interface PriceResult {
  items: PriceItem[];
  netto: number;
  mwst: number;
  brutto: number;
}

export function calcPrice(d: ConfigData): PriceResult {
  const flaeche = d.breite * d.tiefe;
  const items: PriceItem[] = [];

  const basis = flaeche * 720 * (d.etagen === 2 ? 1.12 : 1);
  items.push({
    label: `Basiskonstruktion (${d.breite.toFixed(2)} × ${d.tiefe.toFixed(2)} m${
      d.etagen === 2 ? ', 2 Etagen' : ''
    })`,
    value: basis,
  });

  const art = GELAENDER.find((g) => g.id === d.gelaender)!;
  const gFactor = art.art === 'glas' ? 540 : art.art === 'alublech' ? 460 : 380;
  items.push({ label: art.name, value: d.breite * gFactor });

  if (d.oberflaeche !== 'feuerverzinkt') {
    items.push({ label: `RAL-Beschichtung (RAL ${d.oberflaeche})`, value: flaeche * 95 });
  }

  if (d.belag.typ === 'wpc') {
    const profil = d.belag.wpcProfil === 'voll' ? 40 : 0;
    const ober = d.belag.wpcOberflaeche === 'gebuerstet' ? 40 : d.belag.wpcOberflaeche === 'matt' ? 20 : 0;
    items.push({ label: 'WPC mit Schienensystem', value: flaeche * (280 + profil + ober) });
  } else if (d.belag.typ === 'alu') {
    items.push({ label: 'Alu-Dielen', value: flaeche * 320 });
  } else {
    items.push({ label: 'Feinsteinzeug', value: flaeche * 410 });
  }

  if (d.tragvariante === 'wandseitig') items.push({ label: 'Wandseitige Stützen', value: 600 });
  if (d.treppe === 'erweitert') items.push({ label: 'Treppe mit Anschluss-Podest', value: 1450 });

  EXTRAS.forEach((e) => {
    if (d.extras[e.id]) items.push({ label: e.name, value: e.preis });
  });

  const netto = items.reduce((s, i) => s + i.value, 0);
  const brutto = netto * 1.19;
  return { items, netto, mwst: brutto - netto, brutto };
}
