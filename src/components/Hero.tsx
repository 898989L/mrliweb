import { motion } from 'framer-motion'
import { profile } from '../data/profile'
import { asset } from '../utils/asset'
import { smoothScrollToHash } from '../utils/smoothScroll'
import SplitText from './SplitText'
import RoleRotator from './RoleRotator'
import './Hero.css'

export default function Hero() {
  return (
    <section className="hero">
      <div className="container hero__inner">
        <motion.div
          className="hero__content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.p
            className="hero__eyebrow"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.5 }}
          >
            <span className="hero__pulse" />
            开放兼职与项目合作
          </motion.p>

          <h1 className="hero__title">
            <SplitText
              text={profile.name}
              className="hero__title-line hero__title-name font-name"
              animateOnLoad
              delay={0.18}
              entryOffset={12}
              sharp
              as="span"
            />
          </h1>

          <motion.p
            className="hero__role"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.55 }}
          >
            <RoleRotator roles={profile.roles} />
            <span className="hero__role-sep">·</span>
            <span>全栈交付</span>
          </motion.p>

          <motion.p
            className="hero__tagline"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.55 }}
          >
            {profile.tagline}
            <span className="hero__tagline-sub"> — {profile.heroHighlight}</span>
          </motion.p>

          <motion.div
            className="hero__actions"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.88, duration: 0.55 }}
          >
            <a
              href="#projects"
              className="btn-primary hero__btn-glow"
              onClick={(e) => smoothScrollToHash('#projects', e)}
            >
              查看项目
              <span aria-hidden="true">→</span>
            </a>
            <a
              href="#contact"
              className="btn-ghost"
              onClick={(e) => smoothScrollToHash('#contact', e)}
            >
              联系我
            </a>
            {profile.links.resumePdf && (
              <a
                href={asset(profile.links.resumePdf)}
                className="btn-ghost"
                download={profile.links.resumeFileName}
              >
                下载简历
              </a>
            )}
          </motion.div>

          <motion.ul
            className="hero__meta"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.05, duration: 0.55 }}
          >
            <li>{profile.location}</li>
            <li>Design · AI · Backend</li>
            <li>Java · React · Agent</li>
          </motion.ul>
        </motion.div>
      </div>

      <motion.div
        className="hero__scroll"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <span>Scroll</span>
        <div className="hero__scroll-line" />
      </motion.div>
    </section>
  )
}

