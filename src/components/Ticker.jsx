import { CELEBRITIES, fmt, getPriceChange } from '../data.js'

export default function Ticker({ prices, history }) {
  const items = CELEBRITIES.map(c => {
    const chg = getPriceChange(history[c.id], prices[c.id])
    return `${c.emoji} ${c.name}  ${fmt(prices[c.id])}  ${chg >= 0 ? '▲' : '▼'} ${Math.abs(chg).toFixed(1)}%`
  })

  const content = [...items, ...items].join('   ·   ')

  return (
    <div style={{
      borderBottom: '1px solid var(--border)',
      borderTop: '1px solid var(--border)',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      padding: '10px 0',
      background: 'var(--bg2)',
      marginBottom: 0,
    }}>
      <span style={{
        display: 'inline-block',
        animation: 'ticker 60s linear infinite',
        fontFamily: 'var(--font-mono)',
        fontSize: '12px',
        color: 'var(--text2)',
        letterSpacing: '0.03em',
      }}>
        {CELEBRITIES.map((c, i) => {
          const chg = getPriceChange(history[c.id], prices[c.id])
          const color = chg >= 0 ? 'var(--green)' : 'var(--red)'
          return (
            <span key={c.id}>
              <span style={{ color: 'var(--text2)' }}>{c.emoji} {c.name} </span>
              <span style={{ color }}>{fmt(prices[c.id])} {chg >= 0 ? '▲' : '▼'}{Math.abs(chg).toFixed(1)}%</span>
              <span style={{ color: 'var(--border2)', margin: '0 20px' }}>·</span>
            </span>
          )
        })}
        {CELEBRITIES.map((c, i) => {
          const chg = getPriceChange(history[c.id], prices[c.id])
          const color = chg >= 0 ? 'var(--green)' : 'var(--red)'
          return (
            <span key={c.id + '-2'}>
              <span style={{ color: 'var(--text2)' }}>{c.emoji} {c.name} </span>
              <span style={{ color }}>{fmt(prices[c.id])} {chg >= 0 ? '▲' : '▼'}{Math.abs(chg).toFixed(1)}%</span>
              <span style={{ color: 'var(--border2)', margin: '0 20px' }}>·</span>
            </span>
          )
        })}
      </span>
    </div>
  )
}
