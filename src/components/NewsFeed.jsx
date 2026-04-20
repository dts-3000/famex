export default function NewsFeed({ news }) {
  if (!news.length) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text3)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>📰</div>
        No buzz yet — the market will generate headlines as it ticks
      </div>
    )
  }

  const realCount = news.filter(n => n.real).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {realCount > 0 && (
        <div style={{
          background: 'rgba(74,158,255,0.08)', border: '1px solid rgba(74,158,255,0.2)',
          borderRadius: 8, padding: '8px 14px', fontSize: 12,
          fontFamily: 'var(--font-mono)', color: 'var(--blue)',
        }}>
          📡 {realCount} real headlines from NewsAPI · prices driven by actual media mentions
        </div>
      )}

      {news.map((item, i) => (
        <div key={item.id || i} style={{
          background: 'var(--bg2)', border: '1px solid var(--border)',
          borderRadius: 10, padding: '12px 14px',
          borderLeft: `3px solid ${item.dir > 0 ? 'var(--green)' : item.dir < 0 ? 'var(--red)' : 'var(--text3)'}`,
          animation: i === 0 ? 'fadeIn 0.3s ease' : 'none',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
            {item.real && (
              <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--blue)', background: 'rgba(74,158,255,0.1)', border: '1px solid rgba(74,158,255,0.2)', borderRadius: 4, padding: '1px 5px', flexShrink: 0, marginTop: 1 }}>
                LIVE
              </span>
            )}
            <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.4 }}>
              {item.url ? (
                <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text)', textDecoration: 'none' }}
                  onMouseEnter={e => e.target.style.color = 'var(--blue)'}
                  onMouseLeave={e => e.target.style.color = 'var(--text)'}
                >
                  {item.headline}
                </a>
              ) : item.headline}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>{item.pub}</span>
            <span style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>{item.time}</span>
            {item.dir !== 0 && (
              <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 500, color: item.dir > 0 ? 'var(--green)' : 'var(--red)' }}>
                {item.dir > 0 ? '▲ Buzz up' : '▼ Buzz down'}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
