import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { deliveryNotes, services } from '../data/experience'
import './DeliveryNotes.css'

export default function DeliveryNotes() {
  const [active, setActive] = useState(deliveryNotes[0].id)
  const note = deliveryNotes.find((n) => n.id === active) ?? deliveryNotes[0]

  return (
    <section id="notes" className="section delivery-notes">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65 }}
        >
          <p className="section-label">Practice</p>
          <h2 className="section-title">关键实践</h2>
          <p className="section-desc">
            项目中的典型问题、技术方案与落地结果。
          </p>
        </motion.div>

        <div className="notes__grid">
          <div className="notes__list">
            {deliveryNotes.map((item, i) => (
              <motion.button
                key={item.id}
                type="button"
                className={`notes__item glass ${active === item.id ? 'is-active' : ''}`}
                onClick={() => setActive(item.id)}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <span className="notes__index">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <strong>{item.title}</strong>
                  <em>{item.scene}</em>
                </div>
              </motion.button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.article
              key={note.id}
              className="notes__detail glass"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.25 }}
            >
              <p className="notes__scene">{note.scene}</p>
              <h3>{note.title}</h3>
              <div className="notes__block">
                <h4>问题</h4>
                <p>{note.problem}</p>
              </div>
              <div className="notes__block">
                <h4>做法</h4>
                <p>{note.approach}</p>
              </div>
              <div className="notes__block">
                <h4>结果</h4>
                <p>{note.result}</p>
              </div>
              <div className="notes__talk">
                <span>实践要点</span>
                <p>{note.highlight}</p>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>

        <div className="notes__services">
          <h3 className="notes__services-title">擅长方向</h3>
          <div className="notes__services-grid">
            {services.map((s, i) => (
              <motion.article
                key={s.title}
                className="notes__service glass"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 * i }}
              >
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
                <span>{s.fit}</span>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

