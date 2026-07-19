import { motion } from 'framer-motion'
import { projectsAccessNote } from '../data/projects'
import ProjectCarousel from './ProjectCarousel'
import './Projects.css'

export default function Projects() {
  return (
    <section id="projects" className="section projects">
      <div className="container projects__container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
        >
          <p className="section-label">Projects</p>
          <h2 className="section-title">精选项目</h2>
          <p className="section-desc">
            内网交付 · 本站脱敏演示可交互操作，并对照查看业务能力与架构分层。
          </p>
          <p className="projects__access-note">{projectsAccessNote}</p>
        </motion.div>

        <ProjectCarousel />
      </div>
    </section>
  )
}
