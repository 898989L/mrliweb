import SplitText from './SplitText'
import './SectionHeader.css'

interface SectionHeaderProps {
  label: string
  title: string
  description?: string
}

export default function SectionHeader({ label, title, description }: SectionHeaderProps) {
  return (
    <div className="section-header">
      <p className="section-label">{label}</p>
      <SplitText text={title} className="section-title" as="h2" />
      {description && <p className="section-desc">{description}</p>}
    </div>
  )
}
