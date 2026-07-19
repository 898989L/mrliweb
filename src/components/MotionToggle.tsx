import { useEffect, useState } from 'react'
import './MotionToggle.css'

const STORAGE_KEY = 'portfolio-reduce-motion'

export default function MotionToggle() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) === 'true'
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const active = stored || prefersReduced
    setReduced(active)
    document.documentElement.dataset.motion = active ? 'reduced' : 'full'
  }, [])

  const toggle = () => {
    const next = !reduced
    setReduced(next)
    localStorage.setItem(STORAGE_KEY, String(next))
    document.documentElement.dataset.motion = next ? 'reduced' : 'full'
  }

  return (
    <button
      type="button"
      className="motion-toggle"
      onClick={toggle}
      aria-pressed={reduced}
      aria-label={reduced ? '开启页面动效' : '减少页面动效'}
    >
      <span className="motion-toggle__icon" aria-hidden="true">
        {reduced ? '◐' : '◉'}
      </span>
      {reduced ? '动效已减少' : '减少动效'}
    </button>
  )
}
