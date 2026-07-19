import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { profile } from '../data/profile'
import './About.css'

function StatCounter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = Math.ceil(value / 30)
    const timer = window.setInterval(() => {
      start += step
      if (start >= value) {
        setCount(value)
        window.clearInterval(timer)
      } else {
        setCount(start)
      }
    }, 40)
    return () => window.clearInterval(timer)
  }, [inView, value])

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  )
}

export default function About() {
  return (
    <section id="about" className="section about">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
        >
          <p className="section-label">About</p>
          <h2 className="section-title">个人经历</h2>
          <p className="section-desc">设计、开发与 AI 的交叉点，是我持续探索的方向。</p>
        </motion.div>

        <div className="about__grid">
          <motion.div
            className="about__profile glass"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="about__avatar-wrap">
              <img src="/avatar.jpg" alt={profile.name} className="about__avatar" loading="lazy" decoding="async" />
              <div className="about__avatar-ring" />
            </div>
            <h3 className="about__name font-name">{profile.name}</h3>
            <p className="about__roles">{profile.roles.join(' · ')}</p>
            <div className="about__contact">
              <a href={`mailto:${profile.email}`} className="about__contact-item">
                <span className="about__contact-icon">✉</span>
                {profile.email}
              </a>
              <a href={`tel:${profile.phone}`} className="about__contact-item">
                <span className="about__contact-icon">☎</span>
                {profile.phone}
              </a>
              <div className="about__contact-item">
                <span className="about__contact-icon">⌖</span>
                {profile.location}
              </div>
            </div>
          </motion.div>

          <motion.div
            className="about__content"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <p className="about__intro">{profile.intro}</p>
            <p className="about__bio">{profile.bio}</p>

            <div className="about__stats">
              {profile.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="about__stat glass"
                  tabIndex={0}
                  aria-label={`${stat.value}${stat.suffix} ${stat.label}：${stat.detail}`}
                >
                  <div className="about__stat-value">
                    <StatCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="about__stat-label">{stat.label}</div>
                  <p className="about__stat-detail">{stat.detail}</p>
                  <span className="about__stat-hint">悬停查看说明</span>
                </div>
              ))}
            </div>

            <div className="about__timeline">
              {profile.timeline.map((item) => (
                <div key={item.period} className="about__timeline-item">
                  <div className="about__timeline-period">{item.period}</div>
                  <div className="about__timeline-body">
                    <strong>{item.company}</strong>
                    <span>{item.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
