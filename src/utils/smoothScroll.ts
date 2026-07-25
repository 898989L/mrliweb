/** 锚点平滑滚动（不用 html scroll-behavior，避免拖动滚动条发粘） */
export function smoothScrollToHash(hash: string, e?: { preventDefault(): void }) {
  if (!hash.startsWith('#')) return false
  e?.preventDefault()

  if (hash === '#' || hash === '#top') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return true
  }

  const el = document.querySelector(hash)
  if (!(el instanceof HTMLElement)) return false
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  return true
}
