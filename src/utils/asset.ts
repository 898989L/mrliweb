/** 拼接 Vite base，兼容 GitHub Pages 子路径部署 */
export function asset(path: string): string {
  const base = import.meta.env.BASE_URL || '/'
  const clean = path.replace(/^\//, '')
  return `${base}${clean}`
}
