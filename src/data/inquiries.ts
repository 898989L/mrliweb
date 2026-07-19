export interface ContactInquiry {
  id: string
  name: string
  requirement: string
  contact: string
  createdAt: string
}

export const STORAGE_KEY = 'portfolio-inquiries'

export const seedInquiries: ContactInquiry[] = [
  {
    id: 'seed-1',
    name: '陈先生',
    requirement: '需要一个记账类小程序的后端接口开发，预计 2 周交付，技术栈 Spring Boot + Redis。',
    contact: '13812345678',
    createdAt: '2026-06-18T10:30:00.000Z',
  },
  {
    id: 'seed-2',
    name: '林小姐',
    requirement: '智慧社区管理端 UI 优化 + 部分接口联调，希望有低代码平台经验。',
    contact: '15987654321',
    createdAt: '2026-06-15T14:20:00.000Z',
  },
  {
    id: 'seed-3',
    name: '王经理',
    requirement: 'AI 辅助快速搭建企业内部工具原型，Vue3 + Java 均可，长期兼职合作。',
    contact: 'wang.pm@example.com',
    createdAt: '2026-06-10T09:00:00.000Z',
  },
]

export function loadInquiries(): ContactInquiry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const saved: ContactInquiry[] = raw ? JSON.parse(raw) : []
    const savedIds = new Set(saved.map((item) => item.id))
    const merged = [
      ...saved,
      ...seedInquiries.filter((item) => !savedIds.has(item.id)),
    ]
    return merged.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
  } catch {
    return [...seedInquiries]
  }
}

export function saveInquiry(inquiry: ContactInquiry): ContactInquiry[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  const saved: ContactInquiry[] = raw ? JSON.parse(raw) : []
  const next = [inquiry, ...saved]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  return loadInquiries()
}

export function formatInquiryDate(iso: string): string {
  const date = new Date(iso)
  return date.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
