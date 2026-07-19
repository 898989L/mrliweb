import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import type { ProjectItem } from '../data/projects'
import { asset } from '../utils/asset'
import ProjectDemoHost from './ProjectDemoHost'
import './ProjectModal.css'

interface ProjectModalProps {
  project: ProjectItem
  onClose: () => void
  imageSrc?: string
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const scenes = project.demo.scenes
  const [sceneId, setSceneId] = useState(scenes?.[0]?.id ?? 'default')
  const [panel, setPanel] = useState<'arch' | 'cap'>('cap')

  const activeScene = useMemo(
    () => scenes?.find((s) => s.id === sceneId) ?? scenes?.[0],
    [scenes, sceneId],
  )

  const demoSrc = activeScene?.src ?? project.demo.src
  const demoReactId = activeScene?.reactId ?? project.demo.reactId

  useEffect(() => {
    setSceneId(scenes?.[0]?.id ?? 'default')
  }, [project.id, scenes])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
        onClose()
      }
    }
    window.addEventListener('keydown', onKey, true)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey, true)
    }
  }, [onClose])

  const stopDrag = (e: React.SyntheticEvent) => e.stopPropagation()

  return createPortal(
    <motion.div
      className="lab-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      onPointerDown={stopDrag}
    >
      <motion.div
        className="lab glass"
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        onPointerDown={stopDrag}
        style={{ '--lab-accent': project.accent } as React.CSSProperties}
      >
        <header className="lab__top">
          <div className="lab__brand">
            <span className="lab__live">本站演示</span>
            <div>
              <h2 className="lab__title">{project.title}</h2>
              <p className="lab__sub">
                {project.subtitle}
                {(project.access ?? 'intranet') === 'intranet' && (
                  <span className="lab__intranet-tag"> · 客户内网 · 无公网外链</span>
                )}
              </p>
            </div>
          </div>
          <div className="lab__top-actions">
            {demoSrc && (
              <a className="lab__link" href={asset(demoSrc)} target="_blank" rel="noreferrer" onPointerDown={stopDrag}>
                新窗口全屏 ↗
              </a>
            )}
            <button type="button" className="lab__close" onClick={onClose} onPointerDown={stopDrag} aria-label="关闭">
              ×
            </button>
          </div>
        </header>

        {scenes && scenes.length > 0 && (
          <div className="lab__scenes" role="tablist" aria-label="演示场景">
            {scenes.map((s) => (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={sceneId === s.id}
                className={`lab__scene ${sceneId === s.id ? 'is-active' : ''}`}
                onClick={() => setSceneId(s.id)}
                onPointerDown={stopDrag}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}

        <div className="lab__body">
          <aside className="lab__side">
            <div className="lab__side-tabs">
              <button type="button" className={panel === 'cap' ? 'is-active' : ''} onClick={() => setPanel('cap')}>
                交付能力
              </button>
              <button type="button" className={panel === 'arch' ? 'is-active' : ''} onClick={() => setPanel('arch')}>
                架构透视
              </button>
            </div>

            <AnimatePresence mode="wait">
              {panel === 'cap' ? (
                <motion.div
                  key="cap"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  className="lab__side-panel"
                >
                  <p className="lab__hint">{project.demo.hint}</p>
                  <ul className="lab__caps">
                    {(project.demo.capabilities ?? project.highlights).map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                  <div className="lab__tags">
                    {project.tags.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="arch"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  className="lab__side-panel"
                >
                  {project.demo.architecture?.length ? (
                    project.demo.architecture.map((layer) => (
                      <div key={layer.name} className="lab__layer">
                        <div className="lab__layer-name">{layer.name}</div>
                        <div className="lab__nodes">
                          {layer.nodes.map((n) => (
                            <span key={n}>{n}</span>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="lab__hint">{project.description}</p>
                  )}
                  <p className="lab__path">
                    工程模块（内网） · {project.path}
                    <span className="lab__path-note">仓库与线上环境在客户内网，本站仅提供脱敏交互证明交付能力</span>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </aside>

          <div className="lab__stage">
            <div className="lab__stage-frame">
              <ProjectDemoHost
                project={project}
                overrideSrc={demoSrc}
                overrideReactId={demoReactId}
              />
            </div>
            <p className="lab__stage-tip">
              脱敏演示区内可直接点击操作
              {scenes ? ` · 上方 ${scenes.length} 个场景可切换` : ''}
              {' '}· Esc 关闭 · 非客户公网环境
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  )
}

