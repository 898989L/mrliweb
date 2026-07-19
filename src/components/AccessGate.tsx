import { useEffect, useRef, useState } from 'react'
import { ACCESS_CODE, ACCESS_STORAGE_KEY } from '../data/access'
import './AccessGate.css'

interface AccessGateProps {
  children: React.ReactNode
}

function readUnlocked() {
  try {
    return localStorage.getItem(ACCESS_STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

export default function AccessGate({ children }: AccessGateProps) {
  const [ready, setReady] = useState(false)
  const [unlocked, setUnlocked] = useState(false)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [showCode, setShowCode] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setUnlocked(readUnlocked())
    setReady(true)
  }, [])

  useEffect(() => {
    if (ready && !unlocked) {
      inputRef.current?.focus()
    }
  }, [ready, unlocked])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const value = code.trim()
    if (!value) {
      setError('请输入访问验证码')
      return
    }
    if (value !== ACCESS_CODE) {
      setError('验证码不正确，请重试')
      setCode('')
      inputRef.current?.focus()
      return
    }
    try {
      localStorage.setItem(ACCESS_STORAGE_KEY, '1')
    } catch {
      /* ignore */
    }
    setUnlocked(true)
    setError('')
  }

  if (!ready) {
    return <div className="access-gate access-gate--loading" aria-hidden="true" />
  }

  if (unlocked) {
    return <>{children}</>
  }

  return (
    <div className="access-gate">
      <div className="access-gate__glow" aria-hidden="true" />
      <form className="access-gate__card glass" onSubmit={handleSubmit}>
        <p className="access-gate__eyebrow">Private Portfolio</p>
        <h1 className="access-gate__title">访问验证</h1>
        <p className="access-gate__desc">
          本站含个人联系方式与项目演示，请输入邀请验证码后继续浏览。
        </p>
        <label className="access-gate__field">
          <span>验证码</span>
          <div className="access-gate__input-wrap">
            <input
              ref={inputRef}
              type={showCode ? 'text' : 'password'}
              name="access-code"
              autoComplete="off"
              value={code}
              onChange={(e) => {
                setCode(e.target.value)
                setError('')
              }}
              placeholder="请输入验证码"
              maxLength={32}
            />
            <button
              type="button"
              className="access-gate__eye"
              onClick={() => setShowCode((v) => !v)}
              aria-label={showCode ? '隐藏验证码' : '显示验证码'}
              aria-pressed={showCode}
              title={showCode ? '隐藏' : '显示'}
            >
              {showCode ? (
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78 3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"
                  />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
                  />
                </svg>
              )}
            </button>
          </div>
        </label>
        {error && (
          <p className="access-gate__error" role="alert">
            {error}
          </p>
        )}
        <button type="submit" className="btn-primary access-gate__submit">
          进入作品集
          <span aria-hidden="true">→</span>
        </button>
      </form>
    </div>
  )
}
