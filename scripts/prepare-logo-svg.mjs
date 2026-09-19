import fs from 'fs';
import path from 'path';

const inputSvgPath = path.resolve('media/Instagram/logo_1/logo_2.svg');
const outDir = path.resolve('public/assets/logo');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

let svg = fs.readFileSync(inputSvgPath, 'utf8');

// Remove the solid background rect / path (id="path100" with fill:#fefefe)
// Pattern matches <path style="fill:#fefefe" d="M 0,627 V 0 h 627 627 v 627 627 H 627 0 Z" id="path100" />
svg = svg.replace(/<path\s+style="fill:#fefefe"[^>]*id="path100"[^>]*\/>/i, '');

// Also clean inkscape and sodipodi attributes that aren't needed for web rendering
svg = svg.replace(/sodipodi:[a-z0-9-]+="[^"]*"/gi, '')
         .replace(/inkscape:[a-z0-9-]+="[^"]*"/gi, '');

// Ensure viewBox is properly present (0 0 1254 1254)
if (!svg.includes('viewBox="0 0 1254 1254"')) {
  svg = svg.replace('<svg', '<svg viewBox="0 0 1254 1254"');
}

const outSvgPath = path.join(outDir, 'logo-centro-odontomedico.svg');
fs.writeFileSync(outSvgPath, svg.trim(), 'utf8');
console.log('Saved optimized logo SVG to:', outSvgPath);

// Also create a clean favicon.svg
const faviconPath = path.resolve('public/favicon.svg');
fs.writeFileSync(faviconPath, svg.trim(), 'utf8');
console.log('Updated favicon.svg at:', faviconPath);
