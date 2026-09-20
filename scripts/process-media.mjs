import { existsSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import ffmpegPath from 'ffmpeg-static';

const root = resolve(import.meta.dirname, '..');
const output = resolve(root, 'public/assets');
mkdirSync(resolve(output, 'video'), { recursive: true });
mkdirSync(resolve(output, 'cases'), { recursive: true });

function ffmpeg(args, label) {
  const result = spawnSync(ffmpegPath, ['-hide_banner', '-loglevel', 'error', '-y', ...args], { stdio: 'inherit' });
  if (result.status !== 0) throw new Error(`Falha ao processar ${label}`);
  console.log(`✓ ${label}`);
}

const heroInput = resolve(root, 'media/Instagram/hero_1/hero_1.mp4');
const heroMp4 = resolve(output, 'video/hero_1.mp4');
ffmpeg(['-i', heroInput, '-t', '24', '-vf', 'scale=720:-2:force_original_aspect_ratio=decrease,fps=30', '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '28', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', heroMp4], 'hero híbrida MP4');
ffmpeg(['-ss', '2', '-i', heroMp4, '-frames:v', '1', '-q:v', '3', resolve(output, 'video/hero_1_poster.jpg')], 'poster da hero');

const experienceInput = resolve(root, 'media/hero_animation/smile_animation.mp4');
ffmpeg(['-i', experienceInput, '-vf', 'crop=720:640:0:280,fps=30', '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '22', '-g', '1', '-keyint_min', '1', '-bf', '0', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', resolve(output, 'video/culture_smile_scrub.mp4')], 'vídeo de scrub do sorriso');
ffmpeg(['-ss', '8.5', '-i', resolve(output, 'video/culture_smile_scrub.mp4'), '-frames:v', '1', '-q:v', '2', resolve(output, 'video/culture_smile_poster.jpg')], 'poster do sorriso');

const cases = [
  ['clareamento-01', 'media/Instagram/clareamento_1/start_end_morph_video.mp4'],
  ['clareamento-02', 'media/Instagram/clareamento_2/clareamento_start_end_morph.mp4'],
  ['preenchimento-facial-01', 'media/Instagram/preenchimento_facial_1/start_end_morph_facial_final.mp4'],
  ['preenchimento-labial-01', 'media/Instagram/preenchimento_labial_1/preenchimento_labial_start_end.mp4'],
  ['preenchimento-labial-02', 'media/Instagram/preenchimento_labial_2/preenchimento_labial_start_end_morph.mp4'],
  ['reabilitacao-protese-01', 'media/Instagram/reabilitacao_protese_1/reabilitacao_protese_start_end_morph.mp4'],
  ['rinomodelacao-01', 'media/Instagram/rineomodelacao_1/rineomodelacao_start_end_morph.mp4'],
  ['tratamento-dental-01', 'media/Instagram/tratamento_dental_1/tratamento_dental_hero_download.mp4']
];

for (const [id, relativeInput] of cases) {
  const input = resolve(root, relativeInput);
  if (!existsSync(input)) throw new Error(`Fonte ausente: ${relativeInput}`);
  const base = resolve(output, 'cases', id);
  const filter = 'setpts=1.333333*PTS,scale=1080:1080:force_original_aspect_ratio=decrease:force_divisible_by=2,fps=30';
  ffmpeg(['-i', input, '-vf', filter, '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '29', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', `${base}.mp4`], `${id}.mp4`);
  ffmpeg(['-i', input, '-vf', filter, '-an', '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '35', '-row-mt', '1', `${base}.webm`], `${id}.webm`);
  ffmpeg(['-ss', '0.5', '-i', `${base}.mp4`, '-frames:v', '1', '-q:v', '3', `${base}.jpg`], `${id}.jpg`);
}

console.log('Mídias finalizadas. Casos permanecem desativados no catálogo.');
