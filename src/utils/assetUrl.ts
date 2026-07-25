/**
 * Prefix static asset paths with Vite `base` so previews and subpath deploys resolve
 * `/M_K_V.mp4` correctly (e.g. when `base` is `/physics/`).
 * Appends a build id query string so replacing a file with the same name still loads
 * after deploy (browser + CDN cache).
 */
export function assetUrl(absolutePath: string): string {
  const v =
    typeof __PUBLIC_ASSET_VERSION__ !== 'undefined' && __PUBLIC_ASSET_VERSION__
      ? __PUBLIC_ASSET_VERSION__
      : '';

  const withCacheBust = (path: string): string => {
    if (!v) return path;
    const sep = path.includes('?') ? '&' : '?';
    return `${path}${sep}v=${encodeURIComponent(v)}`;
  };

  if (!absolutePath.startsWith('/')) return withCacheBust(absolutePath);

  const mediaOrigin = import.meta.env.VITE_MEDIA_ORIGIN;
  if (mediaOrigin) {
    const origin = mediaOrigin.endsWith('/') ? mediaOrigin : `${mediaOrigin}/`;
    return withCacheBust(`${origin}${absolutePath.slice(1)}`);
  }

  const base = import.meta.env.BASE_URL;
  const path = !base || base === '/' ? absolutePath : `${base.replace(/\/$/, '')}${absolutePath}`;
  return withCacheBust(path);
}
