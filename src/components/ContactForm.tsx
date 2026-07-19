import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  formatInquiryDate,
  loadInquiries,
  saveInquiry,
  type ContactInquiry,
} from '../data/inquiries'
import { maskContact } from '../utils/maskContact'
import './ContactForm.css'

interface FormState {
  name: string
  requirement: string
  contact: string
}

const emptyForm: FormState = { name: '', requirement: '', contact: '' }
const apiUrl = (import.meta.env.VITE_CONTACT_API_URL as string | undefined)?.trim() || ''

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(emptyForm)
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setInquiries(loadInquiries())
  }, [])

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setError('')
    setSubmitted(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const name = form.name.trim()
    const requirement = form.requirement.trim()
    const contact = form.contact.trim()

    if (!name || !requirement || !contact) {
      setError('请填写姓名、需求描述和联系方式')
      return
    }
    if (name.length < 2) {
      setError('姓名至少 2 个字符')
      return
    }
    if (requirement.length < 10) {
      setError('需求描述请至少 10 个字，方便我了解你的项目')
      return
    }

    const inquiry: ContactInquiry = {
      id: `local-${Date.now()}`,
      name,
      requirement,
      contact,
      createdAt: new Date().toISOString(),
    }

    setSubmitting(true)
    setError('')

    try {
      if (apiUrl) {
        const res = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, requirement, contact }),
        })
        if (!res.ok) {
          throw new Error(`提交失败（${res.status}）`)
        }
      }

      setInquiries(saveInquiry(inquiry))
      setForm(emptyForm)
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : '提交失败，请稍后重试或直接发邮件')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="contact-form-block">
      <motion.div
        className="contact-form glass"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.6 }}
      >
        <h3 className="contact-form__title">合作咨询</h3>
        <p className="contact-form__desc">
          {apiUrl
            ? '填写简要需求，提交后会同步到收单接口，方便我尽快回复。'
            : '填写简要需求，我会尽快回复。未配置收单接口时，信息仅保存在本机浏览器用于演示（见 .env.example）。'}
        </p>

        <form className="contact-form__fields" onSubmit={handleSubmit} noValidate>
          <label className="contact-form__field">
            <span>姓名</span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="怎么称呼您"
              autoComplete="name"
              maxLength={20}
            />
          </label>

          <label className="contact-form__field">
            <span>需求描述</span>
            <textarea
              name="requirement"
              value={form.requirement}
              onChange={(e) => handleChange('requirement', e.target.value)}
              placeholder="项目类型、技术栈、周期、预算范围等"
              rows={4}
              maxLength={500}
            />
          </label>

          <label className="contact-form__field">
            <span>联系方式</span>
            <input
              type="text"
              name="contact"
              value={form.contact}
              onChange={(e) => handleChange('contact', e.target.value)}
              placeholder="手机号 / 微信 / 邮箱"
              autoComplete="tel"
              maxLength={60}
            />
          </label>

          {error && (
            <p className="contact-form__error" role="alert">
              {error}
            </p>
          )}

          {submitted && (
            <p className="contact-form__success" role="status">
              已收到您的咨询，感谢信任！我会通过您留下的方式联系。
            </p>
          )}

          <button type="submit" className="btn-primary contact-form__submit" disabled={submitting}>
            {submitting ? '提交中…' : '提交咨询'}
            <span aria-hidden="true">→</span>
          </button>
        </form>
      </motion.div>

      <motion.aside
        className="contact-inquiries glass"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.6, delay: 0.08 }}
        aria-label="近期咨询展示"
      >
        <div className="contact-inquiries__head">
          <h3 className="contact-inquiries__title">近期咨询</h3>
        </div>
        <ul className="contact-inquiries__list">
          {inquiries.map((item) => (
            <li key={item.id} className="contact-inquiries__item">
              <div className="contact-inquiries__meta">
                <strong>{item.name}</strong>
                <time dateTime={item.createdAt}>{formatInquiryDate(item.createdAt)}</time>
              </div>
              <p className="contact-inquiries__text">{item.requirement}</p>
              <span className="contact-inquiries__contact">
                {maskContact(item.contact)}
              </span>
            </li>
          ))}
        </ul>
      </motion.aside>
    </div>
  )
}
