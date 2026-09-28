import React, { useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

/**
 * Responsive <img> with AVIF/WebP support.
 *
 * Variant files are generated into src/assets/generated/ by
 * `npm run images` (see scripts/generate-image-variants.mjs). They are
 * resolved through Vite's glob import so they get hashed and copied into the
 * build, rather than being reconstructed by string surgery on a hashed URL.
 *
 * Variants are only emitted at widths <= the source width, so nothing is ever
 * upscaled.
 */

// name -> { width -> { png, webp, avif } }
const modules = import.meta.glob('../assets/generated/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const EXT_RE = /\.(jpe?g|png|webp|avif)$/i;
const VARIANT_RE = /^(.*)-(\d+)w\.(jpe?g|png|webp|avif)$/i;

const variantsByBase = (() => {
  const map = new Map();

  for (const [path, url] of Object.entries(modules)) {
    const file = path.split('/').pop();
    const match = file.match(VARIANT_RE);
    if (!match) continue;

    const [, base, widthStr, ext] = match;
    const width = parseInt(widthStr, 10);

    if (!map.has(base)) {
      map.set(base, { base, widths: [], files: new Map() });
    }
    const entry = map.get(base);
    entry.widths.push(width);
    entry.files.set(`${width}.${ext.toLowerCase()}`, url);
  }

  for (const entry of map.values()) {
    entry.widths.sort((a, b) => a - b);
  }

  return map;
})();

const buildSrcSet = (entry, ext) =>
  entry.widths
    .map((w) => {
      const url = entry.files.get(`${w}.${ext}`);
      return url ? `${url} ${w}w` : null;
    })
    .filter(Boolean)
    .join(', ');

const OptimizedImage = ({
  src,
  alt = '',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  className = '',
  wrapperClassName = '',
  effect = 'blur',
  placeholderSrc,
  eager = false,
  onLoad,
  onError,
  // Accepted for backward compatibility. Variant widths are now derived from
  // the source image at build time instead of being requested per call site.
  widths: _legacyWidths,
  ...props
}) => {
  const [failed, setFailed] = useState(false);

  // Derive the variant group from the original file name, e.g. "hero2".
  const srcFile = (src || '').split('/').pop() || '';
  const base = srcFile.replace(EXT_RE, '');
  const entry = variantsByBase.get(base);

  const avifSrcSet = entry ? buildSrcSet(entry, 'avif') : '';
  const webpSrcSet = entry ? buildSrcSet(entry, 'webp') : '';
  const fallbackSrcSet = entry ? buildSrcSet(entry, srcFile.includes('png') ? 'png' : 'jpeg') : '';

  const hasVariants = Boolean(avifSrcSet || webpSrcSet || fallbackSrcSet);
  const finalSrc = failed || !hasVariants ? src : (placeholderSrc || src);

  const handleError = (e) => {
    if (!failed) setFailed(true);
    if (onError) onError(e);
  };

  const img = (
    <LazyLoadImage
      src={finalSrc}
      alt={alt}
      effect={hasVariants ? effect : 'none'}
      placeholderSrc={hasVariants ? placeholderSrc || src : undefined}
      loading={eager ? 'eager' : 'lazy'}
      className={className}
      onLoad={onLoad}
      onError={handleError}
      {...props}
    />
  );

  if (!hasVariants) {
    // No generated variants: skip <picture> entirely rather than advertising
    // sources that do not exist.
    return img;
  }

  return (
    <picture className={wrapperClassName || undefined}>
      {avifSrcSet && <source type="image/avif" srcSet={avifSrcSet} sizes={sizes} />}
      {webpSrcSet && <source type="image/webp" srcSet={webpSrcSet} sizes={sizes} />}
      {fallbackSrcSet && (
        <source
          type={srcFile.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg'}
          srcSet={fallbackSrcSet}
          sizes={sizes}
        />
      )}
      {img}
    </picture>
  );
};

export default OptimizedImage;
