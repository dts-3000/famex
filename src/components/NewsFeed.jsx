export default function NewsFeed({ news }) {
  const realNews = news.filter(n => n.real)

  if (!news.length) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text3)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>📰</div>
        No headlines yet — check back after the next news scrape
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {realNews.length > 0 && (
        <div style={{
          background: 'rgba(74,158,255,0.08)', border: '1px solid rgba(74,158,255,0.2)',
          borderRadius: 8, padding: '8px 14px', fontSize: 12,
          fontFamily: 'var(--font-mono)', color: 'var(--blue)', marginBottom: 4,
        }}>
          📡 {realNews.length} live headlines · buzz scores driven by real mention counts
        </div>
      )}

      {news.map((item, i) => {
        // Buzz direction based on mention count vs base — not random
        // If mentions > 0 for this celeb, it means they're being talked about = buzz up
        // Only show direction if we have meaningful mention data
        const showBuzzUp   = item.real && item.mentions > 0
        const showBuzzDown = item.real && item.mentions === 0

        return (
          <div key={item.id || i} style={{
            background: 'var(--bg2)', border: '1px solid var(--border)',
            borderRadius: 10, padding: '12px 14px',
            borderLeft: `3px solid ${showBuzzUp ? 'var(--green)' : showBuzzDown ? 'var(--red)' : 'var(--border2)'}`,
            animation: i === 0 ? 'fadeIn 0.3s ease' : 'none',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
              {item.real && (
                <span style={{
                  fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--blue)',
                  background: 'rgba(74,158,255,0.1)', border: '1px solid rgba(74,158,255,0.2)',
                  borderRadius: 4, padding: '1px 5px', flexShrink: 0, marginTop: 1,
                }}>LIVE</span>
              )}
              <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.4, flex: 1 }}>
                {item.url ? (
                  <a href={item.url} target="_blank" rel="noopener noreferrer"
                    style={{ color: 'var(--text)', textDecoration: 'none' }}
                    onMouseEnter={e => e.target.style.color = 'var(--blue)'}
                    onMouseLeave={e => e.target.style.color = 'var(--text)'}
                  >{item.headline}</a>
                ) : item.headline}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>{item.pub}</span>
              <span style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>{item.time}</span>
              {item.mentions !== undefined && (
                <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text3)' }}>
                  {item.mentions.toLocaleString()} mentions/7d
                </span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
