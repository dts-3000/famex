import { useState, useEffect } from 'react'
import { getLeaderboard } from '../supabase.js'
import { fmt } from '../data.js'

export default function Leaderboard({ currentPlayerId }) {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)

  const load = async () => {
    try {
      const data = await getLeaderboard()
      setEntries(data)
      setLastUpdated(new Date())
    } catch (err) {
      console.error('Leaderboard error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    const interval = setInterval(load, 30000) // refresh every 30s
    return () => clearInterval(interval)
  }, [])

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>
      Loading leaderboard...
    </div>
  )

  if (!entries.length) return (
    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>🏆</div>
      No players yet — be the first!
    </div>
  )

  const medals = ['🥇', '🥈', '🥉']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Header */}
      <div style={{
        background: 'var(--bg2)', border: '1px solid var(--border)',
        borderRadius: 12, padding: '16px 20px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 8,
      }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
            🏆 Global Leaderboard
          </div>
          <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
            {entries.length} traders · updates every 30s
          </div>
        </div>
        <button onClick={load} style={{
          padding: '6px 12px', borderRadius: 8, fontSize: 11,
          border: '1px solid var(--border)', background: 'transparent',
          color: 'var(--text3)', fontFamily: 'var(--font-mono)', cursor: 'pointer',
        }}>↺ Refresh</button>
      </div>

      {/* Entries */}
      {entries.map((entry, i) => {
        const isMe = entry.id === currentPlayerId
        const pnl  = entry.total_worth - 100000
        const pnlUp = pnl >= 0

        return (
          <div key={entry.id} style={{
            background: isMe ? 'rgba(245,200,66,0.06)' : 'var(--bg2)',
            border: `1px solid ${isMe ? 'var(--gold)' : 'var(--border)'}`,
            borderRadius: 10, padding: '14px 16px',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            {/* Rank */}
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: i < 3 ? 'var(--bg3)' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: i < 3 ? 20 : 13,
              fontFamily: 'var(--font-mono)', color: 'var(--text3)',
              flexShrink: 0,
            }}>
              {i < 3 ? medals[i] : `#${i + 1}`}
            </div>

            {/* Name */}
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: isMe ? 'var(--gold)' : 'var(--text)', fontFamily: 'var(--font-display)' }}>
                {entry.username} {isMe && '(you)'}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
                {entry.badge_count} badges · joined {new Date(entry.created_at).toLocaleDateString('en-AU')}
              </div>
            </div>

            {/* Worth */}
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 700, fontSize: 16, fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>
                {fmt(entry.total_worth)}
              </div>
              <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: pnlUp ? 'var(--green)' : 'var(--red)', marginTop: 2 }}>
                {pnlUp ? '+' : ''}{fmt(pnl)} P&L
              </div>
            </div>
          </div>
        )
      })}

      {lastUpdated && (
        <div style={{ textAlign: 'center', fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--font-mono)', marginTop: 8 }}>
          Last updated {lastUpdated.toLocaleTimeString('en-AU')}
        </div>
      )}
    </div>
  )
}
