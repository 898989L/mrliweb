import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { archSystems, skillGroups, techHighlights } from '../data/tech'
import './TechLab.css'

export default function TechLab() {
  const [archId, setArchId] = useState(archSystems[0].id)
  const [skillId, setSkillId] = useState(skillGroups[0].id)
  const [activeSkill, setActiveSkill] = useState(0)

  const arch = archSystems.find((a) => a.id === archId) ?? archSystems[0]
  const group = skillGroups.find((g) => g.id === skillId) ?? skillGroups[0]
  const skill = group.skills[activeSkill] ?? group.skills[0]

  return (
    <section id="tech" className="section tech-lab">
      <div className="tech-lab__glow" aria-hidden="true" />
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65 }}
        >
          <p className="section-label">Tech Lab</p>
          <h2 className="section-title">技术深潜</h2>
          <p className="section-desc">
            Java 后端、多端前端与平台二次开发能力一览，附 JNPF / 智慧园区真实分层架构。
          </p>
        </motion.div>

        <div className="tech-lab__grid">
          <motion.div
            className="tech-lab__panel glass"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.05 }}
          >
            <div className="tech-lab__panel-head">
              <h3>技能矩阵</h3>
              <div className="tech-lab__tabs">
                {skillGroups.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    className={skillId === g.id ? 'is-active' : ''}
                    style={skillId === g.id ? { '--tab-accent': g.accent } as React.CSSProperties : undefined}
                    onClick={() => { setSkillId(g.id); setActiveSkill(0) }}
                  >
                    {g.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="tech-lab__skills">
              {group.skills.map((s, i) => (
                <button
                  key={s.name}
                  type="button"
                  className={`tech-lab__skill ${activeSkill === i ? 'is-active' : ''}`}
                  onClick={() => setActiveSkill(i)}
                >
                  <div className="tech-lab__skill-top">
                    <span>{s.name}</span>
                    <b style={{ color: group.accent }}>{s.level}</b>
                  </div>
                  <div className="tech-lab__bar">
                    <motion.div
                      className="tech-lab__bar-fill"
                      style={{ background: group.accent }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${s.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: i * 0.06 }}
                    />
                  </div>
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${group.id}-${skill.name}`}
                className="tech-lab__skill-note"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
              >
                <span className="tech-lab__note-label">能力说明</span>
                <p>{skill.note}</p>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          <motion.div
            className="tech-lab__panel glass tech-lab__arch"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.12 }}
          >
            <div className="tech-lab__panel-head">
              <h3>系统架构</h3>
              <div className="tech-lab__tabs">
                {archSystems.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    className={archId === a.id ? 'is-active' : ''}
                    onClick={() => setArchId(a.id)}
                  >
                    {a.id === 'jnpf' ? 'JNPF 体系' : '智慧园区'}
                  </button>
                ))}
              </div>
            </div>

            <div className="tech-lab__arch-meta">
              <strong>{arch.title}</strong>
              <span>{arch.subtitle}</span>
            </div>

            <div className="tech-lab__layers">
              {arch.layers.map((layer, i) => (
                <motion.div
                  key={layer.name}
                  className="tech-lab__layer"
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.08 * i }}
                >
                  <div className="tech-lab__layer-name">{layer.name}</div>
                  <div className="tech-lab__nodes">
                    {layer.nodes.map((n) => (
                      <span key={n} className="tech-lab__node">{n}</span>
                    ))}
                  </div>
                  {i < arch.layers.length - 1 && <div className="tech-lab__pipe" />}
                </motion.div>
              ))}
            </div>

            <ul className="tech-lab__flows">
              {arch.flows.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </motion.div>
        </div>

        <div className="tech-lab__highlights">
          {techHighlights.map((h, i) => (
            <motion.article
              key={h.title}
              className="tech-lab__card glass"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.06 * i }}
            >
              <h4>{h.title}</h4>
              <code>{h.code}</code>
              <p>{h.desc}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

