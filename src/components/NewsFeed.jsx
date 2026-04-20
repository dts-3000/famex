export default function NewsFeed({ news }) {
  if (!news.length) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text3)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>📰</div>
        No buzz yet — the market will generate headlines as it ticks
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {news.map((item, i) => (
        <div key={item.id || i} style={{
          background: 'var(--bg2)', border: '1px solid var(--border)',
          borderRadius: 10, padding: '12px 14px',
          borderLeft: `3px solid ${item.dir > 0 ? 'var(--green)' : 'var(--red)'}`,
          animation: i === 0 ? 'fadeIn 0.3s ease' : 'none',
        }}>
          <div style={{ fontSize: 13, color: 'var(--text)', marginBottom: 6, lineHeight: 1.4 }}>{item.headline}</div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>{item.pub}</span>
            <span style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>{item.time}</span>
            <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 500, color: item.dir > 0 ? 'var(--green)' : 'var(--red)' }}>
              {item.dir > 0 ? '▲ Buzz up' : '▼ Buzz down'}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
