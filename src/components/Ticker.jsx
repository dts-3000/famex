import { CELEBRITIES, BENCH, fmt, getPriceChange } from '../data.js'

function getCeleb(id) {
  return CELEBRITIES.find(c => c.id === id) || BENCH.find(c => c.id === id)
}

export default function Ticker({ prices, history, active }) {
  const celebs = (active || []).map(id => getCeleb(id)).filter(Boolean)

  return (
    <div style={{
      borderBottom: '1px solid var(--border)', overflow: 'hidden',
      whiteSpace: 'nowrap', padding: '8px 0', background: 'var(--bg2)',
    }}>
      <span style={{
        display: 'inline-block',
        animation: 'ticker 250s linear infinite',
        fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.02em',
      }}>
        {[...celebs, ...celebs].map((c, i) => {
          const chg = getPriceChange(history[c.id], prices[c.id])
          const color = chg >= 0 ? 'var(--green)' : 'var(--red)'
          return (
            <span key={`${c.id}-${i}`}>
              <span style={{ color: 'var(--text2)' }}>{c.emoji} {c.name} </span>
              <span style={{ color }}>
                {fmt(prices[c.id])} {chg >= 0 ? '▲' : '▼'}{Math.abs(chg).toFixed(1)}%
              </span>
              <span style={{ color: 'var(--border2)', margin: '0 20px' }}>·</span>
            </span>
          )
        })}
      </span>
    </div>
  )
}
