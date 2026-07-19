import { useState } from 'react'
import { motion } from 'framer-motion'
import type { ProjectItem } from '../data/projects'
import DeviceFrame from './DeviceFrame'
import ProjectModal from './ProjectModal'
import './ProjectCard.css'

interface ProjectCardProps {
  project: ProjectItem
  index: number
  imageSrc?: string
  carousel?: boolean
  isActive?: boolean
}

export default function ProjectCard({
  project,
  index,
  imageSrc,
  carousel = false,
  isActive = true,
}: ProjectCardProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (carousel && !isActive) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: y * -6, y: x * 6 })
  }

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 })

  const tiltStyle = carousel && isActive
    ? { transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }
    : !carousel
      ? { transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }
      : undefined

  return (
    <>
      <motion.article
        className={`project-card glass ${carousel ? 'project-card--carousel' : ''} ${isActive ? 'is-active' : ''}`}
        initial={carousel ? false : { opacity: 0, y: 40 }}
        whileInView={carousel ? undefined : { opacity: 1, y: 0 }}
        viewport={carousel ? undefined : { once: true, margin: '-40px' }}
        transition={carousel ? undefined : { duration: 0.6, delay: index * 0.08 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ ...tiltStyle, ['--accent' as string]: project.accent }}
      >
          <div className="project-card__preview" style={{ '--accent': project.accent } as React.CSSProperties}>
          <div className="project-card__glow" />
          <span className="project-card__live">本站演示</span>
          {(project.access ?? 'intranet') === 'intranet' && (
            <span className="project-card__intranet">内网交付</span>
          )}
          <DeviceFrame
            device={project.device}
            urlBar={project.preview.urlBar}
            sidebar={project.preview.sidebar}
            content={project.preview.content}
            accent={project.accent}
            imageSrc={imageSrc}
          />
        </div>

        <div className="project-card__body">
          <div className="project-card__meta">
            <span className="project-card__index">{String(index + 1).padStart(2, '0')}</span>
            <span className="project-card__device">{deviceLabel(project.device)}</span>
          </div>
          <h3 className="project-card__title">{project.title}</h3>
          <p className="project-card__subtitle">{project.subtitle}</p>
          <p className="project-card__desc">{project.description}</p>
          <div className="project-card__tags">
            {project.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="project-card__tag">{tag}</span>
            ))}
          </div>
          {(!carousel || isActive) && (
            <button
              className="project-card__btn"
              onClick={(e) => {
                e.stopPropagation()
                setModalOpen(true)
              }}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <span className="project-card__btn-glow" aria-hidden="true" />
              <span className="project-card__btn-text">
                进入交互实验室
                <small>
                  {project.demo.scenes?.length
                    ? `${project.demo.scenes.length} 个脱敏场景`
                    : '可点击操作 · 交付能力面板'}
                </small>
              </span>
              <span className="project-card__btn-arrow">→</span>
            </button>
          )}
        </div>
      </motion.article>

      {modalOpen && (
        <ProjectModal project={project} onClose={() => setModalOpen(false)} imageSrc={imageSrc} />
      )}
    </>
  )
}

function deviceLabel(device: ProjectItem['device']) {
  const map = {
    windows: 'Windows · Web',
    macos: 'macOS · Web',
    iphone: 'iOS · App',
    android: 'Android · App',
    wechat: 'WeChat · 小程序',
  }
  return map[device]
}
