import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { projects } from '../data/projects'
import type { ProjectItem } from '../data/projects'
import { asset } from '../utils/asset'
import ProjectCard from './ProjectCard'
import './ProjectCarousel.css'

const projectImages: Record<string, string> = {
  renyixuan: 'project-renyixuan.jpg',
}

const CARD_SPREAD = 440
const DRAG_THRESHOLD = 80

function circularOffset(index: number, active: number, count: number, dragOffset = 0) {
  let offset = index - active
  const half = count / 2
  if (offset > half) offset -= count
  if (offset < -half) offset += count
  return offset + dragOffset
}

export default function ProjectCarousel() {
  const [active, setActive] = useState(0)
  const [dragX, setDragX] = useState(0)
  const dragStart = useRef(0)
  const draggingRef = useRef(false)
  const draggedRef = useRef(false)
  const stageRef = useRef<HTMLDivElement>(null)

  const count = projects.length

  const goTo = useCallback(
    (index: number) => {
      setActive(((index % count) + count) % count)
      setDragX(0)
    },
    [count],
  )

  const goPrev = useCallback(() => goTo(active - 1), [active, goTo])
  const goNext = useCallback(() => goTo(active + 1), [active, goTo])

  const onCardClick = useCallback(
    (index: number) => {
      if (draggedRef.current) return
      goTo(index)
    },
    [goTo],
  )

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return

    const onWheel = (e: WheelEvent) => {
      const horizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY)
      if (!horizontal && !e.shiftKey) return
      e.preventDefault()
      const delta = e.deltaX || e.deltaY
      if (delta > 28) goNext()
      else if (delta < -28) goPrev()
    }

    stage.addEventListener('wheel', onWheel, { passive: false })
    return () => stage.removeEventListener('wheel', onWheel)
  }, [goNext, goPrev])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goPrev, goNext])

  const onPointerDown = (e: React.PointerEvent) => {
    draggingRef.current = true
    draggedRef.current = false
    dragStart.current = e.clientX
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return
    const delta = e.clientX - dragStart.current
    if (Math.abs(delta) > 6) draggedRef.current = true
    setDragX(delta)
  }

  const onPointerUp = () => {
    if (!draggingRef.current) return
    draggingRef.current = false
    if (dragX > DRAG_THRESHOLD) goPrev()
    else if (dragX < -DRAG_THRESHOLD) goNext()
    setDragX(0)
    requestAnimationFrame(() => {
      draggedRef.current = false
    })
  }

  return (
    <div className="project-carousel">
      <div
        ref={stageRef}
        className="project-carousel__stage"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div className="project-carousel__track">
          {projects.map((project, index) => (
            <CarouselCard
              key={project.id}
              project={project}
              index={index}
              active={active}
              count={count}
              dragX={dragX}
              imageSrc={projectImages[project.id] ? asset(projectImages[project.id]) : undefined}
              onSelect={() => onCardClick(index)}
            />
          ))}
        </div>
      </div>

      <div className="project-carousel__controls">
        <button
          type="button"
          className="project-carousel__arrow"
          onClick={goPrev}
          aria-label="上一个项目"
        >
          ←
        </button>

        <div className="project-carousel__dots">
          {projects.map((project, i) => (
            <button
              key={project.id}
              type="button"
              className={`project-carousel__dot ${i === active ? 'is-active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={project.title}
            />
          ))}
        </div>

        <button
          type="button"
          className="project-carousel__arrow"
          onClick={goNext}
          aria-label="下一个项目"
        >
          →
        </button>
      </div>

      <p className="project-carousel__hint">循环浏览 · 拖动切换 · 点击卡片居中</p>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          className="project-carousel__counter"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
        >
          {String(active + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

interface CarouselCardProps {
  project: ProjectItem
  index: number
  active: number
  count: number
  dragX: number
  imageSrc?: string
  onSelect: () => void
}

function CarouselCard({
  project,
  index,
  active,
  count,
  dragX,
  imageSrc,
  onSelect,
}: CarouselCardProps) {
  const offset = circularOffset(index, active, count, dragX / CARD_SPREAD)
  const abs = Math.abs(offset)
  const isCenter = abs < 0.55

  const rotateY = offset * -42
  const translateX = offset * CARD_SPREAD
  const translateZ = -abs * 160
  const scale = Math.max(0.72, 1 - abs * 0.13)
  const opacity = Math.max(0.3, 1 - abs * 0.32)

  return (
    <div
      className={`project-carousel__card ${isCenter ? 'is-center' : ''}`}
      style={{
        transform: `translateX(calc(-50% + ${translateX}px)) translateY(-50%) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
        opacity,
        zIndex: Math.round(20 - abs * 10),
        transition: dragX !== 0 ? 'none' : 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.55s ease',
      }}
      onClick={onSelect}
      role="button"
      tabIndex={isCenter ? 0 : -1}
      aria-label={`查看项目 ${project.title}`}
    >
      <ProjectCard
        project={project}
        index={index}
        imageSrc={imageSrc}
        carousel
        isActive={isCenter}
      />
    </div>
  )
}
