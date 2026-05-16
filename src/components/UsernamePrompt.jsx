import { useState } from 'react'

export default function UsernamePrompt({ onJoin, loading }) {
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')

  const handleJoin = () => {
    const clean = username.trim().replace(/[^a-zA-Z0-9_-]/g, '')
    if (clean.length < 3) { setError('Username must be at least 3 characters'); return }
    if (clean.length > 20) { setError('Username must be 20 characters or less'); return }
    setError('')
    onJoin(clean)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 2000, flexDirection: 'column', gap: 0,
    }}>
      <div style={{ textAlign: 'center', maxWidth: 400, padding: '0 20px', width: '100%' }}>
        {/* Logo */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 48, fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
            Fame<span style={{ color: 'var(--gold)' }}>X</span>
          </div>
          <div style={{ fontSize: 13, color: 'var(--text3)', fontFamily: 'var(--font-mono)', marginTop: 4 }}>
            Celebrity Stock Exchange
          </div>
        </div>

        {/* Card */}
        <div style={{
          background: 'var(--bg2)', border: '1px solid var(--border)',
          borderRadius: 16, padding: 32,
        }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', fontFamily: 'var(--font-display)', marginBottom: 8 }}>
            Choose your trader name
          </div>
          <div style={{ fontSize: 12, color: 'var(--text3)', fontFamily: 'var(--font-mono)', marginBottom: 24, lineHeight: 1.5 }}>
            You'll start with $100,000 to invest.<br/>Your portfolio saves automatically.
          </div>

          <input
            autoFocus
            type="text"
            placeholder="e.g. TrumpTrader88"
            value={username}
            onChange={e => setUsername(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleJoin()}
            maxLength={20}
            style={{
              width: '100%', padding: '12px 16px',
              background: 'var(--bg3)', border: '1px solid var(--border)',
              borderRadius: 10, color: 'var(--text)',
              fontFamily: 'var(--font-mono)', fontSize: 15,
              outline: 'none', marginBottom: 8,
              boxSizing: 'border-box',
            }}
          />

          {error && (
            <div style={{ fontSize: 12, color: 'var(--red)', fontFamily: 'var(--font-mono)', marginBottom: 12, textAlign: 'left' }}>
              {error}
            </div>
          )}

          <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--font-mono)', marginBottom: 20, textAlign: 'left' }}>
            Letters, numbers, _ and - only · 3-20 characters
          </div>

          <button
            onClick={handleJoin}
            disabled={loading || !username.trim()}
            style={{
              width: '100%', padding: '14px',
              background: loading ? 'var(--bg3)' : 'var(--gold)',
              border: 'none', borderRadius: 10,
              color: loading ? 'var(--text3)' : '#000',
              fontSize: 15, fontWeight: 800,
              fontFamily: 'var(--font-display)',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s',
              letterSpacing: '0.02em',
            }}
          >
            {loading ? '⟳ Joining...' : '🚀 Start Trading'}
          </button>
        </div>

        <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--font-mono)', marginTop: 16 }}>
          Already have an account? Just enter your username to continue.
        </div>
      </div>
    </div>
  )
}
