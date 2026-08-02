export type BelagTyp = 'wpc' | 'alu' | 'feinstein';
export type WpcProfil = 'hohl' | 'voll';
export type WpcOberflaeche = 'matt' | 'unbehandelt' | 'gebuerstet';
export type WpcFarbe = 'anthrazit' | 'grau' | 'braun' | 'schoko';
export type GelaenderId = '001' | '002' | '003' | '004' | '005' | '006' | '008';
export type WandId = 'ziegel' | 'braun' | 'hell' | 'grunge';
export type MontageAnimation = 'aus' | 'langsam' | 'normal' | 'schnell';
export type ExtraKey = 'statik' | 'bauantrag' | 'montage' | 'montageassistent' | 'aufmass' | 'geraest';

export const STEPS = [
  { key: 'aufbau', label: 'Aufbau' },
  { key: 'belag', label: 'Belag' },
  { key: 'farbe', label: 'Oberfläche' },
  { key: 'gelaender', label: 'Geländer' },
  { key: 'wand', label: 'Wandstruktur' },
  { key: 'extras', label: 'Optionen' },
  { key: 'kontakt', label: 'Kontakt' },
] as const;

export const BELAG_TYPEN: {
  id: BelagTyp;
  name: string;
  sub: string;
  beschreibung: string;
  color: string;
}[] = [
  {
    id: 'wpc',
    name: 'WPC mit Schienensystem',
    sub: 'Kovalex Standard · Art.-Nr. K02005',
    beschreibung:
      'Verbunddielen-System für eine warme Holzoptik mit wetterbeständiger Oberfläche.',
    color: '#6b5947',
  },
  {
    id: 'alu',
    name: 'Alu-Dielen',
    sub: 'Novodach AluTec TerraLine',
    beschreibung: 'Pulverbeschichtete Aluminium-Dielen, extrem langlebig und wartungsarm.',
    color: '#9aa3a8',
  },
  {
    id: 'feinstein',
    name: 'Feinsteinzeug',
    sub: 'Keramikplatten 20 mm',
    beschreibung: 'Frostsichere Keramikplatten auf Stelzlagern für eine steinerne Optik.',
    color: '#b9b2a8',
  },
];

export const WPC_PROFILE: { id: WpcProfil; label: string }[] = [
  { id: 'hohl', label: 'Hohlkammerprofil' },
  { id: 'voll', label: 'Vollprofil' },
];

export const WPC_OBERFLAECHEN: { id: WpcOberflaeche; label: string }[] = [
  { id: 'matt', label: 'Matt' },
  { id: 'unbehandelt', label: 'Unbehandelt' },
  { id: 'gebuerstet', label: 'Gebürstet' },
];

export const WPC_FARBEN: { id: WpcFarbe; label: string; color: string }[] = [
  { id: 'anthrazit', label: 'Anthrazit (Graubraun)', color: '#5c554e' },
  { id: 'grau', label: 'Grau', color: '#8a8b86' },
  { id: 'braun', label: 'Braun', color: '#7a5a3c' },
  { id: 'schoko', label: 'Schokoladenbraun', color: '#4b3428' },
];

export const WPC_HINWEIS =
  'Hohlkammer- oder Vollprofil · Matt, unbehandelt oder gebürstet · Vier Standardfarben · Profile und Oberflächen sind artikelnummernbasiert.';

export const RAL_QUICK = ['7011', '7016', '9016'];

export const RAL_FARBEN: { code: string; name: string; hex: string }[] = [
  { code: '1001', name: 'Beige', hex: '#C2B078' },
  { code: '1013', name: 'Austernweiß', hex: '#E3D9C6' },
  { code: '1019', name: 'Graubeige', hex: '#9E8F7B' },
  { code: '7011', name: 'Eisengrau', hex: '#52595D' },
  { code: '7016', name: 'Anthrazitgrau', hex: '#383E42' },
  { code: '7035', name: 'Lichtgrau', hex: '#CBD0CC' },
  { code: '8017', name: 'Schokoladenbraun', hex: '#442F29' },
  { code: '9001', name: 'Creme', hex: '#EFEBDC' },
  { code: '9005', name: 'Tiefschwarz', hex: '#0A0A0A' },
  { code: '9010', name: 'Reinweiß', hex: '#F1EDE1' },
  { code: '9016', name: 'Verkehrsweiß', hex: '#F1F1F1' },
];

export const RAL_HINWEIS =
  'Die Schnellauswahl zeigt gängige RAL-Farben. RAL-, NCS- und MCS-Sonderfarben können mit der Anfrage angegeben werden.';

export const FEUERVERZINKT_HINWEIS =
  'Modell wird mit einer helleren Werksoptik dargestellt. Wähle eine RAL-Farbe, um die Oberfläche anzupassen.';

export type GelaenderArt = 'stahl' | 'glas' | 'alublech';

export const GELAENDER: {
  id: GelaenderId;
  name: string;
  art: GelaenderArt;
  img: string;
}[] = [
  { id: '001', name: 'Stahlgeländer feuerverzinkt', art: 'stahl', img: '/ballkoni-001.png' },
  { id: '002', name: 'Flachstahlgeländer feuerverzinkt', art: 'stahl', img: '/ballkoni-002.png' },
  { id: '003', name: 'Edelstahlgeländer', art: 'stahl', img: '/ballkoni-003.png' },
  { id: '004', name: 'VSG Glas klar', art: 'glas', img: '/ballkoni-004.png' },
  { id: '005', name: 'VSG Glas matt', art: 'glas', img: '/ballkoni-005.png' },
  { id: '006', name: 'VSG-TVG Sicherheitsglas', art: 'glas', img: '/ballkoni-006.png' },
  { id: '008', name: 'Alublech Muster', art: 'alublech', img: '/ballkoni-008.png' },
];

export const WANDSTRUKTUREN: { id: WandId; label: string; color: string; accent: string }[] = [
  { id: 'ziegel', label: 'Klassischer Ziegel', color: '#9c5a45', accent: '#d9cfc6' },
  { id: 'braun', label: 'Brauner Anstrich', color: '#6d4f3c', accent: '#8a6a52' },
  { id: 'hell', label: 'Heller Ziegel', color: '#d8c6ae', accent: '#efe6d8' },
  { id: 'grunge', label: 'Weissgraue Grunge', color: '#c9cdc9', accent: '#e8eae7' },
];

export const MONTAGE_ANIMATIONEN: { id: MontageAnimation; label: string }[] = [
  { id: 'aus', label: 'Aus' },
  { id: 'langsam', label: 'Langsam' },
  { id: 'normal', label: 'Normal' },
  { id: 'schnell', label: 'Schnell' },
];

export const EXTRAS: { id: ExtraKey; name: string; preis: number; beschreibung: string }[] = [
  {
    id: 'statik',
    name: 'Statik',
    preis: 714.0,
    beschreibung:
      'Erstellung der statischen Berechnungen für die Stahlkonstruktion des Balkons. Nachweis der Tragfähigkeit von Konstruktion, Befestigungen und Fundamenten. Bezieht sich ausschließlich auf die Stahlkonstruktion. Nachweise für Geländer, Glasfüllungen oder Anbauteile sind nicht enthalten.',
  },
  {
    id: 'bauantrag',
    name: 'Bauantrag',
    preis: 2380.0,
    beschreibung:
      'Erstellung der erforderlichen Unterlagen für den Bauantrag. Anfertigung der notwendigen Zeichnungen und Pläne. Zusammenstellung und Einreichung beim zuständigen Bauamt.',
  },
  {
    id: 'montage',
    name: 'Montage',
    preis: 2100.08,
    beschreibung:
      'Fachgerechte Montage des Balkons vor Ort. Ausrichten und Befestigen der Konstruktion. Montage von Bodenbelag, Geländer und Zubehör.',
  },
  {
    id: 'montageassistent',
    name: 'Montageassistent',
    preis: 595.0,
    beschreibung:
      'Unterstützung durch einen erfahrenen Monteur während der Selbstmontage. Einweisung und Hilfestellung bei den wichtigsten Montageschritten.',
  },
  {
    id: 'aufmass',
    name: 'Aufmaß',
    preis: 416.5,
    beschreibung:
      'Vermessung der Einbausituation vor Ort. Kontrolle der relevanten Maße für Fertigung und Montage.',
  },
  {
    id: 'geraest',
    name: 'Gerüst / Hebetechnik',
    preis: 1190.0,
    beschreibung:
      'Erforderlich ab dem 2. Obergeschoss bzw. ab einer Arbeitshöhe von 5 Metern. Bereitstellung von Gerüst oder geeigneter Hebetechnik für eine sichere Montage.',
  },
];

export const eur = (v: number) =>
  new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(v);

export const meter = (v: number) => `${v.toFixed(2).replace('.', ',')} m`;
