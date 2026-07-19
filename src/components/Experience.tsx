import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { experiences } from '../data/experience'
import './Experience.css'

export default function Experience() {
  const [active, setActive] = useState(experiences[0].id)
  const current = experiences.find((e) => e.id === active) ?? experiences[0]

  return (
    <section id="experience" className="section experience">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65 }}
        >
          <p className="section-label">Experience</p>
          <h2 className="section-title">工作履历</h2>
          <p className="section-desc">
            三段任职经历与主要职责，可与下方项目对照查看。
          </p>
        </motion.div>

        <div className="experience__layout">
          <div className="experience__rail" role="tablist" aria-label="任职经历">
            {experiences.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active === item.id}
                className={`experience__tab ${active === item.id ? 'is-active' : ''}`}
                onClick={() => setActive(item.id)}
              >
                <span className="experience__tab-period">{item.period}</span>
                <strong>{item.company}</strong>
                <em>{item.role}</em>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.article
              key={current.id}
              className="experience__panel glass"
              role="tabpanel"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28 }}
            >
              <header className="experience__head">
                <div>
                  <h3>{current.role}</h3>
                  <p>{current.company}</p>
                </div>
                <span className="experience__period">{current.period}</span>
              </header>
              <p className="experience__summary">{current.summary}</p>
              <ul className="experience__bullets">
                {current.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              <div className="experience__stack">
                {current.stack.map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </div>
            </motion.article>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

