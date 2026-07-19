import { motion } from 'framer-motion'
import { profile } from '../data/profile'
import ContactForm from './ContactForm'
import MotionToggle from './MotionToggle'
import './Contact.css'

export default function Contact() {
  return (
    <section id="contact" className="section contact">
      <div className="container contact__inner">
        <motion.div
          className="contact__content"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8 }}
        >
          <p className="section-label">Contact</p>
          <h2 className="contact__title">
            一起做点
            <br />
            <span className="contact__title-accent">有意思的事</span>
          </h2>
          <p className="contact__desc">
            开放兼职、外包合作与创意项目。无论是 UI 设计、后端开发还是 AI Agent 驱动的快速原型，都欢迎聊聊。
          </p>

          <div className="contact__actions">
            <a href={`mailto:${profile.email}`} className="btn-primary">
              发送邮件
              <span aria-hidden="true">→</span>
            </a>
            <a href={`tel:${profile.phone}`} className="btn-ghost">
              {profile.phone}
            </a>
            {profile.links.resumePdf && (
              <a
                href={profile.links.resumePdf}
                className="btn-ghost"
                download={profile.links.resumeFileName}
              >
                下载 PDF 简历
              </a>
            )}
          </div>

          <div className="contact__grid">
            <div className="contact__item glass">
              <span className="contact__item-label">Email</span>
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
            </div>
            <div className="contact__item glass">
              <span className="contact__item-label">Location</span>
              <span>{profile.location}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="contact__wechat glass"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="contact__wechat-profile">
            <img src="/wechat-avatar.jpg" alt={`${profile.name} 微信头像`} className="contact__wechat-avatar" loading="lazy" decoding="async" />
            <div className="contact__wechat-info">
              <strong className="font-name">{profile.name}</strong>
              <span>扫码添加好友</span>
            </div>
          </div>
          <div className="contact__qr-zone">
            <div className="contact__qr-wrap">
              <img src="/wechat-qr.jpg" alt="微信二维码" className="contact__qr-img" loading="lazy" decoding="async" />
            </div>
            <p className="contact__qr-label">悬停放大 · 扫码添加微信</p>
          </div>
        </motion.div>
      </div>

      <div className="container">
        <ContactForm />
      </div>

      <footer className="contact__footer">
        <div className="container contact__footer-inner">
          <span>© {new Date().getFullYear()} <span className="font-name">{profile.name}</span></span>
          <MotionToggle />
          <div className="contact__footer-links">
            {profile.links.github && (
              <a href={profile.links.github} target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            )}
            {profile.links.gitee && (
              <a href={profile.links.gitee} target="_blank" rel="noopener noreferrer">
                Gitee
              </a>
            )}
            <span>{profile.roles.join(' · ')}</span>
          </div>
        </div>
      </footer>
    </section>
  )
}
