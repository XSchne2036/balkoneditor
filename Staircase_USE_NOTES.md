# Staircase — Verwendungshinweise

`src/components/three/Staircase.tsx` ersetzt die frühere Mock-Treppe (statisches
4-Stufen-Array direkt in `Stage3D.tsx`).

## Verwendung

```tsx
import { Staircase } from '@/components/three/Staircase';

<Staircase
  platformHeight={d.podesthoehe}
  width={1.1}
  stepColor={floorColor}
  steelColor={steelColor}
  position={[d.breite / 2 + 0.75, 0, d.tiefe / 2 - 0.2]}
  rotation={[0, Math.PI, 0]}
/>
```

## Geometrie-Regeln

- **Stufenanzahl** wird in `useMemo` aus `platformHeight / targetRiser` (Default 18 cm)
  gerundet; die tatsächliche Steigung wird anschließend gleichmäßig verteilt.
- **`TOP_GAP_TO_PLATFORM = 0.005` (5 mm)** wird auf `platformHeight` addiert, damit die
  oberste Stufe das Podest berührt und keine Fuge sichtbar bleibt.
- **Wangen** sind um `tread` länger als die reine Lauflänge und 24 cm hoch — sie
  überlappen die Stufenplatten seitlich, es darf **kein Spalt** entstehen.
- **Handlauf** folgt einer `THREE.CatmullRomCurve3` (Typ `catmullrom`, Tension 0.5) über
  die Stufen-Vorderkanten, extrudiert als `TubeGeometry` (r = 22 mm).

## Screenshot-Kontrolle

Prüfe bei jeder Änderung mindestens diese drei Ansichten:

1. **Seitenansicht (Kamera ~[6, 1.6, 0])** — *Steel-Wangen kritisch kontrollieren*:
   Die Wange muss über die gesamte Lauflänge durchlaufen, oben bündig unter dem Podest
   enden und unten den Boden erreichen. Kein Durchstoßen einzelner Stufen, keine Fuge
   zwischen Wange und Stufenkante.
2. **Nahaufnahme oberste Stufe** — Stufe und Podestkante müssen sich berühren
   (5 mm Overlap), kein Lichtspalt zwischen beiden.
3. **Isometrisch von schräg oben** — Handlauf-Kurve gleichmäßig, keine Knicke an den
   Pfosten, Pfostenabstände regelmäßig.

Screenshots via Playwright, Viewport 1280×1800, Element-Screenshot des Canvas.
