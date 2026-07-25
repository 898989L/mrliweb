import { useEffect, useRef } from 'react'
import './SmoothScrollbar.css'

/**
 * 自定义滚动条：拖动时滑块立刻跟鼠标（transform），
 * 页面滚动用与滚轮相同的即时 scrollTop，避免原生滑块被主线程拖住。
 */
export default function SmoothScrollbar() {
  const trackRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)
  const draggingRef = useRef(false)
  const dragOffsetRef = useRef(0)
  const rafRef = useRef(0)
  const pendingTopRef = useRef<number | null>(null)
  const syncRafRef = useRef(0)

  useEffect(() => {
    const track = trackRef.current
    const thumb = thumbRef.current
    if (!track || !thumb) return

    const getMetrics = () => {
      const docH = document.documentElement.scrollHeight
      const viewH = window.innerHeight
      const scrollable = Math.max(0, docH - viewH)
      const trackH = track.clientHeight
      const thumbH = Math.max(40, Math.min(trackH, (viewH / Math.max(docH, 1)) * trackH))
      const maxThumbTop = Math.max(0, trackH - thumbH)
      return { scrollable, trackH, thumbH, maxThumbTop }
    }

    const paintThumb = (scrollY: number, thumbH?: number) => {
      const m = getMetrics()
      const h = thumbH ?? m.thumbH
      const y = m.maxThumbTop > 0 && m.scrollable > 0 ? (scrollY / m.scrollable) * m.maxThumbTop : 0
      thumb.style.height = `${h}px`
      thumb.style.transform = `translate3d(0, ${y}px, 0)`
    }

    const flushScroll = () => {
      rafRef.current = 0
      if (pendingTopRef.current == null) return
      const y = pendingTopRef.current
      pendingTopRef.current = null
      document.documentElement.scrollTop = y
      document.body.scrollTop = y
    }

    const queueScroll = (y: number) => {
      pendingTopRef.current = y
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(flushScroll)
      }
    }

    const syncFromScroll = () => {
      syncRafRef.current = 0
      if (draggingRef.current) return
      paintThumb(window.scrollY || document.documentElement.scrollTop)
    }

    const scheduleSync = () => {
      if (draggingRef.current) return
      if (!syncRafRef.current) {
        syncRafRef.current = requestAnimationFrame(syncFromScroll)
      }
    }

    const scrollFromClientY = (clientY: number) => {
      const m = getMetrics()
      const rect = track.getBoundingClientRect()
      let thumbTop = clientY - rect.top - dragOffsetRef.current
      thumbTop = Math.max(0, Math.min(m.maxThumbTop, thumbTop))
      // 滑块立刻跟手
      thumb.style.height = `${m.thumbH}px`
      thumb.style.transform = `translate3d(0, ${thumbTop}px, 0)`
      const y = m.maxThumbTop > 0 ? (thumbTop / m.maxThumbTop) * m.scrollable : 0
      queueScroll(y)
    }

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return
      e.preventDefault()
      const m = getMetrics()
      const thumbRect = thumb.getBoundingClientRect()
      const onThumb = e.target === thumb || thumb.contains(e.target as Node)

      draggingRef.current = true
      track.classList.add('is-dragging')
      thumb.setPointerCapture(e.pointerId)

      if (onThumb) {
        dragOffsetRef.current = e.clientY - thumbRect.top
      } else {
        // 点击轨道：滑块中心跳到点击处
        dragOffsetRef.current = m.thumbH / 2
        scrollFromClientY(e.clientY)
      }
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!draggingRef.current) return
      scrollFromClientY(e.clientY)
    }

    const onPointerUp = (e: PointerEvent) => {
      if (!draggingRef.current) return
      draggingRef.current = false
      track.classList.remove('is-dragging')
      try {
        thumb.releasePointerCapture(e.pointerId)
      } catch {
        /* ignore */
      }
      scheduleSync()
    }

    const onKeyScroll = () => scheduleSync()

    paintThumb(window.scrollY || document.documentElement.scrollTop)
    window.addEventListener('scroll', scheduleSync, { passive: true })
    window.addEventListener('resize', scheduleSync)
    track.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)
    window.addEventListener('keydown', onKeyScroll, { passive: true })

    const ro = new ResizeObserver(scheduleSync)
    ro.observe(document.documentElement)

    return () => {
      cancelAnimationFrame(rafRef.current)
      cancelAnimationFrame(syncRafRef.current)
      window.removeEventListener('scroll', scheduleSync)
      window.removeEventListener('resize', scheduleSync)
      track.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
      window.removeEventListener('keydown', onKeyScroll)
      ro.disconnect()
    }
  }, [])

  return (
    <div
      ref={trackRef}
      className="smooth-scrollbar"
      aria-hidden="true"
    >
      <div ref={thumbRef} className="smooth-scrollbar__thumb" />
    </div>
  )
}
