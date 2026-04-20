import { useEffect, useState } from 'react'

export default function Toast({ message, type, onDone }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!message) return
    setVisible(true)
    const t = setTimeout(() => { setVisible(false); setTimeout(onDone, 300) }, 2500)
    return () => clearTimeout(t)
  }, [message])

  if (!message) return null

  const color = type === 'buy' ? 'var(--green)' : type === 'sell' ? 'var(--blue)' : 'var(--red)'

  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24,
      background: 'var(--bg2)', border: `1px solid ${color}`,
      borderRadius: 10, padding: '12px 18px',
      fontSize: 13, fontFamily: 'var(--font-mono)',
      color: 'var(--text)', zIndex: 1000,
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(8px)',
      transition: 'all 0.3s ease',
      maxWidth: 300,
      boxShadow: `0 0 20px rgba(0,0,0,0.4)`,
    }}>
      <span style={{ color, marginRight: 8 }}>
        {type === 'buy' ? '▲' : type === 'sell' ? '▼' : '✕'}
      </span>
      {message}
    </div>
  )
}
