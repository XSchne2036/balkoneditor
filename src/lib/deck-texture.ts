import * as THREE from 'three';

/** Erzeugt eine nahtlos kachelbare Dielen-/Belag-Textur (RepeatWrapping). */
export const makeDeckTexture = (color: string, repeatX = 4, repeatY = 4) => {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const base = new THREE.Color(color);

  ctx.fillStyle = `#${base.getHexString()}`;
  ctx.fillRect(0, 0, size, size);

  // Maserung — horizontal, wiederholt sich nahtlos an den Rändern
  for (let i = 0; i < 900; i++) {
    const y = Math.random() * size;
    const w = 8 + Math.random() * 90;
    const x = Math.random() * size;
    const shade = (Math.random() - 0.5) * 0.16;
    const c = base.clone().offsetHSL(0, 0, shade);
    ctx.strokeStyle = `#${c.getHexString()}`;
    ctx.globalAlpha = 0.35;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + w, y);
    ctx.stroke();
    if (x + w > size) {
      ctx.beginPath();
      ctx.moveTo(x - size, y);
      ctx.lineTo(x + w - size, y);
      ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;

  // Dielenfugen (4 Dielen pro Kachel)
  const gap = base.clone().offsetHSL(0, 0, -0.18);
  ctx.strokeStyle = `#${gap.getHexString()}`;
  ctx.lineWidth = 2;
  for (let i = 0; i <= 4; i++) {
    const y = (i * size) / 4;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(size, y);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeatX, repeatY);
  tex.anisotropy = 8;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
};
