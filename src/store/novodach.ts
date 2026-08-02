import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  BelagTyp,
  ExtraKey,
  GelaenderId,
  MontageAnimation,
  WandId,
  WpcFarbe,
  WpcOberflaeche,
  WpcProfil,
} from '@/lib/novodach-data';

export interface ContactForm {
  anrede: 'Herr' | 'Frau' | 'Divers';
  vorname: string;
  nachname: string;
  firma: string;
  email: string;
  telefon: string;
  strasse: string;
  plz: string;
  ort: string;
  land: string;
  nachricht: string;
  dsgvo: boolean;
}

export interface ConfigData {
  breite: number;
  tiefe: number;
  podesthoehe: number;
  etagen: 1 | 2;
  tragvariante: 'selbst' | 'wandseitig';
  treppe: 'keine' | 'erweitert';
  belag: {
    typ: BelagTyp;
    wpcProfil: WpcProfil;
    wpcOberflaeche: WpcOberflaeche;
    wpcFarbe: WpcFarbe;
  };
  oberflaeche: string; // 'feuerverzinkt' | RAL-Code
  gelaender: GelaenderId;
  gelaenderFarbe?: string;
  wand: WandId;
  montageAnimation: MontageAnimation;
  extras: Record<ExtraKey, boolean>;
}

export const defaultContact: ContactForm = {
  anrede: 'Herr',
  vorname: '',
  nachname: '',
  firma: '',
  email: '',
  telefon: '',
  strasse: '',
  plz: '',
  ort: '',
  land: 'DE',
  nachricht: '',
  dsgvo: false,
};

export const defaultData: ConfigData = {
  breite: 3.84,
  tiefe: 2.03,
  podesthoehe: 2.5,
  etagen: 1,
  tragvariante: 'selbst',
  treppe: 'erweitert',
  belag: { typ: 'wpc', wpcProfil: 'hohl', wpcOberflaeche: 'matt', wpcFarbe: 'anthrazit' },
  oberflaeche: 'feuerverzinkt',
  gelaender: '001',
  wand: 'ziegel',
  montageAnimation: 'aus',
  extras: {
    statik: false,
    bauantrag: false,
    montage: false,
    montageassistent: false,
    aufmass: false,
    geraest: false,
  },
};

interface State {
  step: number;
  data: ConfigData;
  kontakt: ContactForm;
  setStep: (s: number) => void;
  next: () => void;
  prev: () => void;
  update: (patch: Partial<ConfigData>) => void;
  updateBelag: (patch: Partial<ConfigData['belag']>) => void;
  toggleExtra: (key: ExtraKey) => void;
  setKontakt: (patch: Partial<ContactForm>) => void;
  reset: () => void;
}

export const useConfigurator = create<State>()(
  persist(
    (set) => ({
      step: 1,
      data: defaultData,
      kontakt: defaultContact,
      setStep: (s) => set({ step: Math.min(7, Math.max(1, s)) }),
      next: () => set((st) => ({ step: Math.min(7, st.step + 1) })),
      prev: () => set((st) => ({ step: Math.max(1, st.step - 1) })),
      update: (patch) => set((st) => ({ data: { ...st.data, ...patch } })),
      updateBelag: (patch) =>
        set((st) => ({ data: { ...st.data, belag: { ...st.data.belag, ...patch } } })),
      toggleExtra: (key) =>
        set((st) => ({
          data: { ...st.data, extras: { ...st.data.extras, [key]: !st.data.extras[key] } },
        })),
      setKontakt: (patch) => set((st) => ({ kontakt: { ...st.kontakt, ...patch } })),
      reset: () => set({ step: 1, data: defaultData, kontakt: defaultContact }),
    }),
    { name: 'novodach-config-v1' }
  )
);
