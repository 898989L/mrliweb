import type { DemoFrame } from '../data/projects'
import './DemoShell.css'

interface DemoShellProps {
  frame: DemoFrame
  title: string
  children: React.ReactNode
  className?: string
}

export default function DemoShell({ frame, title, children, className = '' }: DemoShellProps) {
  if (frame === 'bare') {
    return (
      <div className={`demo-shell demo-shell--bare ${className}`}>
        <div className="demo-shell__bare-label">{title} · 可点击交互</div>
        <div className="demo-shell__body">{children}</div>
      </div>
    )
  }

  if (frame === 'desktop') {
    return (
      <div className={`demo-shell demo-shell--desktop ${className}`}>
        <div className="demo-shell__bar">
          <div className="demo-shell__dots">
            <span /><span /><span />
          </div>
          <div className="demo-shell__url">{title}</div>
        </div>
        <div className="demo-shell__body">{children}</div>
      </div>
    )
  }

  const isWechat = frame === 'wechat'

  return (
    <div className={`demo-shell demo-shell--phone demo-shell--${frame} ${className}`}>
      <div className="demo-shell__notch" />
      {isWechat && (
        <div className="demo-shell__wx-head">
          <span>‹</span>
          <span>{title}</span>
          <span>···</span>
        </div>
      )}
      {!isWechat && (
        <div className="demo-shell__app-head">
          <span>{title}</span>
        </div>
      )}
      <div className="demo-shell__phone-body">{children}</div>
      {isWechat ? null : <div className="demo-shell__home-bar" />}
    </div>
  )
}

