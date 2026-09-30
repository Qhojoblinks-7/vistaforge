/**
 * Generates responsive image variants used by <OptimizedImage />.
 *
 * <OptimizedImage /> builds `srcset` candidates named `<base>-<w>w.<ext>` and
 * advertises .webp/.avif sources. Those files have to exist on disk, otherwise
 * the browser requests a 404 and the image renders broken or blurry.
 *
 * Variants are only emitted at widths <= the source width, so nothing is ever
 * upscaled. Output goes to src/assets/generated/.
 *
 * Run via: npm run images  (also runs automatically before dev and build)
 */
import { readdir, mkdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC_DIR = path.join(__dirname, '..', 'src', 'assets');
const OUT_DIR = path.join(SRC_DIR, 'generated');

const RASTER = new Set(['.jpg', '.jpeg', '.png']);
const TARGET_WIDTHS = [400, 800, 1200, 1600];
const FORMATS = [
  { ext: 'webp', options: { quality: 80 } },
  { ext: 'avif', options: { quality: 55, effort: 2 } },
];

/** Skip re-encoding when the output is newer than the source. */
const isFresh = async (sourceMs, outPath) => {
  const s = await stat(outPath).catch(() => null);
  return s ? s.mtimeMs >= sourceMs : false;
};

async function processImage(file) {
  const ext = path.extname(file).toLowerCase();
  if (!RASTER.has(ext)) return null;

  const input = path.join(SRC_DIR, file);
  const base = path.basename(file, ext);
  const srcStat = await stat(input);
  const image = sharp(input);
  const meta = await image.metadata();
  const sourceWidth = meta.width;
  if (!sourceWidth) return null;

  const widths = TARGET_WIDTHS.filter((w) => w < sourceWidth);
  // Always include the source width so a large original is still served well.
  if (widths[widths.length - 1] !== sourceWidth) widths.push(sourceWidth);

  await mkdir(OUT_DIR, { recursive: true });
  let written = 0;
  let reused = 0;

  for (const width of widths) {
    const targets = [
      { path: path.join(OUT_DIR, `${base}-${width}w${ext}`) },
      ...FORMATS.map(({ ext: fExt, options }) => ({
        path: path.join(OUT_DIR, `${base}-${width}w.${fExt}`),
        options,
      })),
    ];

    for (const target of targets) {
      if (await isFresh(srcStat.mtimeMs, target.path)) {
        reused++;
        continue;
      }
      // sharp infers the output format from the file extension; options are
      // per-format (quality, effort).
      const pipeline = sharp(input).resize({ width, withoutEnlargement: true });
      await pipeline.toFile(target.path, target.options);
      written++;
    }
  }

  return { file, sourceWidth, widths, written, reused };
}

async function main() {
  if (!existsSync(SRC_DIR)) {
    console.error(`No asset directory at ${SRC_DIR}`);
    process.exit(1);
  }

  const entries = await readdir(SRC_DIR);
  const images = entries
    .filter((f) => RASTER.has(path.extname(f).toLowerCase()))
    .filter((f) => !f.startsWith('generated-'))
    // Spaces become %20 in built asset URLs; skip rather than emit confusing
    // names. Rename the source file if the image is actually needed.
    .filter((f) => !/\s/.test(f));

  if (images.length === 0) {
    console.log('No raster images to process.');
    return;
  }

  console.log(`Checking ${images.length} image(s)...`);

  let totalWritten = 0;
  for (const file of images) {
    try {
      const r = await processImage(file);
      if (r) {
        totalWritten += r.written;
        const note = r.written === 0 ? ' (up to date)' : '';
        console.log(`  ${r.file}: ${r.sourceWidth}px -> [${r.widths.join(', ')}]${note}`);
      }
    } catch (err) {
      console.error(`  FAILED ${file}: ${err.message}`);
      process.exitCode = 1;
    }
  }

  console.log(
    totalWritten === 0
      ? `All variants up to date (${path.relative(process.cwd(), OUT_DIR)}/)`
      : `Generated ${totalWritten} file(s) in ${path.relative(process.cwd(), OUT_DIR)}/`
  );
}

main();
