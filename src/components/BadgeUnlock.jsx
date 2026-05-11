import { useState, useEffect } from 'react'
import { BADGES } from '../badges.js'

export default function BadgeUnlock({ newBadgeId, onDone }) {
  const [visible, setVisible] = useState(false)
  const badge = BADGES.find(b => b.id === newBadgeId)

  useEffect(() => {
    if (!newBadgeId) return
    setVisible(true)
    const t = setTimeout(() => { setVisible(false); setTimeout(onDone, 400) }, 4000)
    return () => clearTimeout(t)
  }, [newBadgeId])

  if (!badge) return null

  return (
    <div style={{
      position: 'fixed', bottom: 80, left: '50%',
      transform: `translateX(-50%) translateY(${visible ? 0 : 20}px)`,
      opacity: visible ? 1 : 0,
      transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      zIndex: 998,
      background: 'linear-gradient(135deg, #1a1a1a, #111)',
      border: '1px solid var(--gold)',
      borderRadius: 16, padding: '16px 24px',
      display: 'flex', alignItems: 'center', gap: 16,
      boxShadow: '0 8px 40px rgba(245,200,66,0.25)',
      minWidth: 280,
    }}>
      <div style={{ fontSize: 40 }}>{badge.emoji}</div>
      <div>
        <div style={{ fontSize: 10, color: 'var(--gold)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>
          🏆 Badge Unlocked!
        </div>
        <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
          {badge.name}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
          {badge.desc}
        </div>
      </div>
    </div>
  )
}
