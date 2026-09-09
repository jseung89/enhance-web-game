// Preserve the Vite base path when this game is hosted at /enhance/.
export function assetUrl(path) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
}
