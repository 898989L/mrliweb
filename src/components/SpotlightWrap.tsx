import { useRef, useState } from 'react'
import type { ReactNode } from 'react'
import './SpotlightWrap.css'

interface SpotlightWrapProps {
  active: boolean
  children: ReactNode
  className?: string
}

export default function SpotlightWrap({ active, children, className = '' }: SpotlightWrapProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: 50, y: 40 })

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!active || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    setPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })
  }

  const handleLeave = () => setPos({ x: 50, y: 40 })

  return (
    <div
      ref={ref}
      className={`spotlight-wrap ${active ? 'is-active' : ''} ${className}`}
      style={
        {
          '--spot-x': `${pos.x}%`,
          '--spot-y': `${pos.y}%`,
        } as React.CSSProperties
      }
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {active && (
        <>
          <div className="spotlight-wrap__beam" aria-hidden="true" />
          <div className="spotlight-wrap__border-beam" aria-hidden="true" />
        </>
      )}
      {children}
    </div>
  )
}
