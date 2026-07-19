import { motion } from 'framer-motion'
import './SplitText.css'

interface SplitTextProps {
  text: string
  className?: string
  delay?: number
  as?: 'h1' | 'h2' | 'p' | 'span'
  animateOnLoad?: boolean
  entryBlur?: number
  entryOffset?: number
  sharp?: boolean
}

export default function SplitText({
  text,
  className = '',
  delay = 0,
  as: Tag = 'span',
  animateOnLoad = false,
  entryBlur = 10,
  entryOffset = 24,
  sharp = false,
}: SplitTextProps) {
  const chars = text.split('')

  const motionFrom = sharp
    ? { opacity: 0, y: entryOffset }
    : { opacity: 0, y: entryOffset, filter: `blur(${entryBlur}px)` }

  const motionTo = sharp
    ? { opacity: 1, y: 0 }
    : { opacity: 1, y: 0, filter: 'blur(0px)' }

  const motionProps = animateOnLoad
    ? {
        initial: motionFrom,
        animate: motionTo,
      }
    : {
        initial: motionFrom,
        whileInView: motionTo,
        viewport: { once: true, margin: '-40px' },
      }

  return (
    <Tag className={`split-text ${sharp ? 'split-text--sharp' : ''} ${className}`} aria-label={text}>
      {chars.map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          className="split-text__char"
          {...motionProps}
          transition={{
            duration: 0.55,
            delay: delay + i * 0.035,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </Tag>
  )
}
