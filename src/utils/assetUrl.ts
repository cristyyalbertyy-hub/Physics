/**
 * Prefix static asset paths with Vite `base` so previews and subpath deploys resolve
 * `/M_K_V.mp4` correctly (e.g. when `base` is `/Physics/`).
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

  const base = import.meta.env.BASE_URL;
  if (!absolutePath.startsWith('/')) return withCacheBust(absolutePath);
  const path = !base || base === '/' ? absolutePath : `${base.replace(/\/$/, '')}${absolutePath}`;
  return withCacheBust(path);
}
