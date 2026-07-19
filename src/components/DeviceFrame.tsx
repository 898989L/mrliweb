import type { PreviewBlock } from '../data/projects'
import './DeviceFrame.css'

interface DeviceFrameProps {
  device: 'windows' | 'macos' | 'iphone' | 'android' | 'wechat'
  urlBar: string
  sidebar?: string[]
  content: PreviewBlock[]
  accent: string
  imageSrc?: string
}

function PreviewContent({ blocks, accent }: { blocks: PreviewBlock[]; accent: string }) {
  return (
    <div className="device-preview">
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'header':
            return (
              <div key={i} className="device-preview__header" style={{ borderColor: accent }}>
                {block.label}
              </div>
            )
          case 'stats':
            return (
              <div key={i} className="device-preview__stats">
                {block.items?.map((item) => (
                  <div key={item} className="device-preview__stat" style={{ color: accent }}>
                    {item}
                  </div>
                ))}
              </div>
            )
          case 'chart':
            return (
              <div key={i} className="device-preview__chart">
                <span className="device-preview__chart-label">{block.label}</span>
                <div className="device-preview__chart-bars">
                  {[40, 65, 45, 80, 55, 70].map((h, j) => (
                    <div
                      key={j}
                      className="device-preview__chart-bar"
                      style={{ height: `${h}%`, background: j === 3 ? accent : 'rgba(255,255,255,0.12)' }}
                    />
                  ))}
                </div>
              </div>
            )
          case 'list':
            return (
              <div key={i} className="device-preview__list">
                {block.items?.map((item) => (
                  <div key={item} className="device-preview__list-item">
                    <span className="device-preview__dot" style={{ background: accent }} />
                    {item}
                  </div>
                ))}
              </div>
            )
          case 'grid':
            return (
              <div key={i} className="device-preview__grid">
                {block.items?.map((item) => (
                  <div key={item} className="device-preview__grid-item" style={{ borderColor: `${accent}33` }}>
                    {item}
                  </div>
                ))}
              </div>
            )
          case 'form':
            return (
              <div key={i} className="device-preview__form">
                <span>{block.label}</span>
                <div className="device-preview__form-fields">
                  <div className="device-preview__field" />
                  <div className="device-preview__field device-preview__field--short" />
                </div>
              </div>
            )
          case 'map':
            return <div key={i} className="device-preview__map" style={{ background: `${accent}15` }} />
          default:
            return null
        }
      })}
    </div>
  )
}

function DesktopChrome({
  os,
  urlBar,
  sidebar,
  content,
  accent,
}: {
  os: 'windows' | 'macos'
  urlBar: string
  sidebar?: string[]
  content: PreviewBlock[]
  accent: string
}) {
  return (
    <div className={`device device--desktop device--${os}`}>
      <div className="device__titlebar">
        {os === 'macos' ? (
          <div className="device__traffic">
            <span className="device__traffic-dot device__traffic-dot--red" />
            <span className="device__traffic-dot device__traffic-dot--yellow" />
            <span className="device__traffic-dot device__traffic-dot--green" />
          </div>
        ) : (
          <div className="device__win-controls">
            <span>—</span><span>□</span><span>×</span>
          </div>
        )}
        <div className="device__title">{os === 'macos' ? 'Safari' : 'Microsoft Edge'} — {urlBar.split('/')[0]}</div>
      </div>
      <div className="device__browser-bar">
        {os === 'windows' && (
          <div className="device__nav-btns">
            <span>←</span><span>→</span><span>↻</span>
          </div>
        )}
        <div className="device__url">{urlBar}</div>
      </div>
      <div className="device__body device__body--desktop">
        {sidebar && (
          <div className="device__sidebar">
            {sidebar.map((item, i) => (
              <div key={item} className={`device__sidebar-item ${i === 0 ? 'is-active' : ''}`} style={i === 0 ? { color: accent } : undefined}>
                {item}
              </div>
            ))}
          </div>
        )}
        <div className="device__main">
          <PreviewContent blocks={content} accent={accent} />
        </div>
      </div>
      {os === 'windows' && <div className="device__taskbar"><div className="device__taskbar-start">⊞</div></div>}
    </div>
  )
}

function MobileChrome({
  platform,
  urlBar,
  content,
  accent,
}: {
  platform: 'iphone' | 'android' | 'wechat'
  urlBar: string
  content: PreviewBlock[]
  accent: string
}) {
  const isWechat = platform === 'wechat'
  const isIPhone = platform === 'iphone'

  return (
    <div className={`device device--mobile device--${platform}`}>
      <div className="device__notch-area">
        {isIPhone && <div className="device__dynamic-island" />}
        {!isIPhone && !isWechat && <div className="device__status-bar"><span>9:41</span><span>●●●</span></div>}
      </div>
      {isWechat && (
        <div className="device__wechat-header">
          <span>‹</span>
          <span>{urlBar}</span>
          <span>···</span>
        </div>
      )}
      {!isWechat && (
        <div className="device__mobile-header">
          <span className="device__mobile-title">{urlBar}</span>
        </div>
      )}
      <div className="device__mobile-body">
        <PreviewContent blocks={content} accent={accent} />
      </div>
      {isWechat && <div className="device__wechat-tabbar"><span>首页</span><span>服务</span><span>我的</span></div>}
      {!isWechat && isIPhone && <div className="device__home-indicator" />}
      {!isWechat && !isIPhone && <div className="device__android-nav"><span>◁</span><span>○</span><span>□</span></div>}
    </div>
  )
}

export default function DeviceFrame({ device, urlBar, sidebar, content, accent, imageSrc }: DeviceFrameProps) {
  if (imageSrc) {
    return (
      <div className={`device device--image device--${device}`}>
        <img src={imageSrc} alt="" className="device__screenshot" loading="lazy" decoding="async" />
      </div>
    )
  }

  if (device === 'windows' || device === 'macos') {
    return <DesktopChrome os={device} urlBar={urlBar} sidebar={sidebar} content={content} accent={accent} />
  }

  return <MobileChrome platform={device} urlBar={urlBar} content={content} accent={accent} />
}
