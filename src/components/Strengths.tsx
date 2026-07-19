import { motion } from 'framer-motion'
import { strengths } from '../data/strengths'
import './Strengths.css'

export default function Strengths() {
  return (
    <section id="strengths" className="section strengths">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
        >
          <p className="section-label">Strengths</p>
          <h2 className="section-title">个人优势</h2>
          <p className="section-desc">
            设计审美、工程能力与 AI 工具链的三重叠加，让我能更快地把想法变成可交付的产品。
          </p>
        </motion.div>

        <div className="strengths__grid">
          {strengths.map((item, index) => (
            <motion.div
              key={item.id}
              className="strength-card glass"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: index * 0.06 }}
              whileHover={{ y: -4, borderColor: 'rgba(0, 212, 255, 0.3)' }}
            >
              <div className="strength-card__icon">{item.icon}</div>
              <h3 className="strength-card__title">{item.title}</h3>
              <p className="strength-card__desc">{item.description}</p>
              <div className="strength-card__tags">
                {item.tags.map((tag) => (
                  <span key={tag} className="strength-card__tag">{tag}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
