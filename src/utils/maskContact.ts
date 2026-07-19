export function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 11) {
    return `${digits.slice(0, 3)}****${digits.slice(7)}`
  }
  if (digits.length >= 7) {
    const head = Math.ceil(digits.length * 0.35)
    const tail = Math.floor(digits.length * 0.25)
    return `${digits.slice(0, head)}****${digits.slice(digits.length - tail)}`
  }
  return '***'
}

export function maskContact(value: string): string {
  const trimmed = value.trim()
  if (/^1\d{10}$/.test(trimmed.replace(/\s/g, ''))) {
    return maskPhone(trimmed)
  }
  if (trimmed.includes('@')) {
    const [local, domain] = trimmed.split('@')
    if (local.length <= 2) return `***@${domain}`
    return `${local.slice(0, 2)}***@${domain}`
  }
  if (/^\d+$/.test(trimmed)) {
    return maskPhone(trimmed)
  }
  if (trimmed.length <= 2) return '***'
  return `${trimmed.slice(0, 1)}**`
}
