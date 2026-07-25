import { useEffect, useRef, useState } from 'react'
import { asset } from '../utils/asset'
import './VideoBackground.css'

const VIDEOS = [asset('videos/video1.mp4'), asset('videos/video2.mp4')] as const

export default function VideoBackground() {
  const [active, setActive] = useState(0)
  const videosRef = useRef<(HTMLVideoElement | null)[]>([])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((prev) => (prev + 1) % VIDEOS.length)
    }, 18000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    videosRef.current.forEach((video, i) => {
      if (!video) return
      if (i === active) {
        void video.play().catch(() => {})
      } else {
        video.pause()
      }
    })
  }, [active])

  return (
    <div className="video-bg" aria-hidden="true">
      {VIDEOS.map((src, i) => (
        <video
          key={src}
          ref={(el) => {
            videosRef.current[i] = el
          }}
          className={`video-bg__layer ${active === i ? 'is-active' : ''}`}
          src={src}
          muted
          loop
          playsInline
          preload={i === 0 ? 'auto' : 'metadata'}
        />
      ))}
      <div className="video-bg__overlay" />
      <div className="video-bg__grid" />
      <div className="video-bg__glow" />
    </div>
  )
}
