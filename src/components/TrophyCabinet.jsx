import { BADGES } from '../badges.js'

const CATEGORIES = ['Wealth', 'Trading', 'Celebrity', 'Risk', 'Loyalty']

export default function TrophyCabinet({ earnedBadges = [] }) {
  const earnedSet = new Set(earnedBadges)
  const totalEarned = earnedBadges.length
  const totalBadges = BADGES.length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{
        background: 'var(--bg2)', border: '1px solid var(--border)',
        borderRadius: 12, padding: '16px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
            🏆 Trophy Cabinet
          </div>
          <div style={{ fontSize: 12, color: 'var(--text3)', fontFamily: 'var(--font-mono)', marginTop: 4 }}>
            {totalEarned} of {totalBadges} badges unlocked
          </div>
        </div>
        {/* Progress bar */}
        <div style={{ width: 160 }}>
          <div style={{ height: 6, background: 'var(--bg3)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 3,
              width: `${(totalEarned / totalBadges) * 100}%`,
              background: 'linear-gradient(90deg, var(--blue), var(--gold))',
              transition: 'width 0.5s ease',
            }} />
          </div>
          <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--font-mono)', marginTop: 4, textAlign: 'right' }}>
            {Math.round((totalEarned / totalBadges) * 100)}% complete
          </div>
        </div>
      </div>

      {/* Badge categories */}
      {CATEGORIES.map(category => {
        const categoryBadges = BADGES.filter(b => b.category === category)
        const categoryEarned = categoryBadges.filter(b => earnedSet.has(b.id)).length

        return (
          <div key={category}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text2)', fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {category}
              </div>
              <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>
                {categoryEarned}/{categoryBadges.length}
              </div>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8 }}>
              {categoryBadges.map(badge => {
                const isEarned = earnedSet.has(badge.id)
                return (
                  <div key={badge.id} style={{
                    background: isEarned ? 'var(--bg2)' : 'var(--bg)',
                    border: `1px solid ${isEarned ? 'var(--gold)' : 'var(--border)'}`,
                    borderRadius: 10, padding: '14px 12px',
                    opacity: isEarned ? 1 : 0.4,
                    transition: 'all 0.2s',
                    position: 'relative',
                    overflow: 'hidden',
                  }}>
                    {isEarned && (
                      <div style={{
                        position: 'absolute', top: 0, right: 0,
                        width: 0, height: 0,
                        borderLeft: '20px solid transparent',
                        borderTop: '20px solid var(--gold)',
                      }} />
                    )}
                    <div style={{ fontSize: 28, marginBottom: 8 }}>{isEarned ? badge.emoji : '🔒'}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: isEarned ? 'var(--gold)' : 'var(--text3)', fontFamily: 'var(--font-display)', marginBottom: 4 }}>
                      {badge.name}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--font-mono)', lineHeight: 1.4 }}>
                      {badge.desc}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
