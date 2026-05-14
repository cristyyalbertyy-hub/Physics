/**
 * Prefix static asset paths with Vite `base` so previews and subpath deploys resolve
 * `/M_K_V.mp4` correctly (e.g. when `base` is `/Physics/`).
 */
export function assetUrl(absolutePath: string): string {
  const base = import.meta.env.BASE_URL;
  if (!absolutePath.startsWith('/')) return absolutePath;
  if (!base || base === '/') return absolutePath;
  const trimmed = base.endsWith('/') ? base.slice(0, -1) : base;
  return `${trimmed}${absolutePath}`;
}
