import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import './RoleRotator.css'

interface RoleRotatorProps {
  roles: string[]
  interval?: number
}

export default function RoleRotator({ roles, interval = 2800 }: RoleRotatorProps) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (roles.length <= 1) return
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % roles.length)
    }, interval)
    return () => window.clearInterval(timer)
  }, [roles.length, interval])

  return (
    <span className="role-rotator">
      <AnimatePresence mode="wait">
        <motion.span
          key={roles[index]}
          className="role-rotator__text"
          initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -18, filter: 'blur(6px)' }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {roles[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
