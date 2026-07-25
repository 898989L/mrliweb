import { useEffect, useState, type MouseEvent } from 'react'
import { profile } from '../data/profile'
import { smoothScrollToHash } from '../utils/smoothScroll'
import './Navbar.css'

const navItems = [
  { label: '关于', href: '#about' },
  { label: '履历', href: '#experience' },
  { label: '项目', href: '#projects' },
  { label: '技术', href: '#tech' },
  { label: '实践', href: '#notes' },
  { label: '优势', href: '#strengths' },
  { label: '联系', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    let last = window.scrollY > 40
    setScrolled(last)
    const onScroll = () => {
      const next = window.scrollY > 40
      if (next !== last) {
        last = next
        setScrolled(next)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  const onNavClick = (href: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    smoothScrollToHash(href, e)
    closeMenu()
  }

  return (
    <header className={`navbar ${scrolled ? 'is-scrolled' : ''} ${menuOpen ? 'is-open' : ''}`}>
      <div className="container navbar__inner">
        <a href="#" className="navbar__brand" onClick={onNavClick('#')}>
          <span className="navbar__brand-dot" />
          <span className="font-name navbar__brand-name">{profile.name}</span>
          <span className="navbar__brand-tag">{profile.brandTag}</span>
        </a>

        <nav className="navbar__nav" aria-label="页面导航">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="navbar__link" onClick={onNavClick(item.href)}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="navbar__right">
          <a href="#contact" className="navbar__cta" onClick={onNavClick('#contact')}>
            联系我
          </a>
          <button
            type="button"
            className="navbar__toggle"
            aria-expanded={menuOpen}
            aria-controls="navbar-drawer"
            aria-label={menuOpen ? '关闭菜单' : '打开菜单'}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div
        id="navbar-drawer"
        className={`navbar__drawer ${menuOpen ? 'is-open' : ''}`}
        hidden={!menuOpen}
      >
        <nav className="navbar__drawer-nav" aria-label="移动端导航">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="navbar__drawer-link"
              onClick={onNavClick(item.href)}
            >
              {item.label}
            </a>
          ))}
          <a href="#contact" className="navbar__drawer-cta" onClick={onNavClick('#contact')}>
            联系我
          </a>
        </nav>
      </div>
    </header>
  )
}
