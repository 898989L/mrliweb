import { useEffect, useState } from 'react'
import './VideoBackground.css'

const VIDEOS = ['/videos/video1.mp4', '/videos/video2.mp4'] as const

export default function VideoBackground() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((prev) => (prev + 1) % VIDEOS.length)
    }, 18000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <div className="video-bg" aria-hidden="true">
      {VIDEOS.map((src, i) => (
        <video
          key={src}
          className={`video-bg__layer ${active === i ? 'is-active' : ''}`}
          src={src}
          autoPlay
          muted
          loop
          playsInline
        />
      ))}
      <div className="video-bg__overlay" />
      <div className="video-bg__grid" />
      <div className="video-bg__glow" />
    </div>
  )
}
