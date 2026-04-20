import { fmt, fmtChange } from '../data.js'

export default function Portfolio({ holdings, prices, activeCelebs }) {
  const held = activeCelebs.filter(c => (holdings[c.id]?.qty || 0) > 0)

  // Also show delisted holdings (price = 0)
  const delistedHeld = Object.entries(holdings)
    .filter(([id, h]) => h.qty > 0 && (prices[id] === 0 || prices[id] === undefined))
    .filter(([id]) => !activeCelebs.find(c => c.id === id))

  if (!held.length && !delistedHeld.length) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text3)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>📊</div>
        No holdings yet — head to the Market to start trading
      </div>
    )
  }

  const totalValue = held.reduce((s, c) => s + (prices[c.id] || 0) * (holdings[c.id]?.qty || 0), 0)
  const totalCost  = held.reduce((s, c) => s + (holdings[c.id]?.avgCost || 0) * (holdings[c.id]?.qty || 0), 0)
  const totalPnl   = totalValue - totalCost

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 8 }}>
        {[
          { label: 'Holdings value', value: fmt(totalValue),   color: 'var(--text)' },
          { label: 'Total invested', value: fmt(totalCost),    color: 'var(--text)' },
          { label: 'Total P&L',      value: (totalPnl >= 0 ? '+' : '') + fmt(totalPnl), color: totalPnl >= 0 ? 'var(--green)' : 'var(--red)' },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px' }}>
            <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: s.color, fontFamily: 'var(--font-mono)' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Active holdings */}
      {held.map(c => {
        const h = holdings[c.id]
        const price = prices[c.id] || 0
        const value = price * h.qty
        const cost  = h.avgCost * h.qty
        const pnl   = value - cost
        const pnlPct = cost > 0 ? (pnl / cost) * 100 : 0
        const isUp  = pnl >= 0

        return (
          <div key={c.id} style={{
            background: 'var(--bg2)', border: '1px solid var(--border)',
            borderRadius: 10, padding: '14px 16px',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <span style={{ fontSize: 22 }}>{c.emoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>{c.name}</div>
              <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text3)', marginTop: 2 }}>
                {h.qty} share{h.qty !== 1 ? 's' : ''} · avg {fmt(h.avgCost)} · now {fmt(price)}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 700, fontSize: 15, fontFamily: 'var(--font-mono)', color: isUp ? 'var(--green)' : 'var(--red)' }}>
                {isUp ? '+' : ''}{fmt(pnl)}
              </div>
              <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: isUp ? 'var(--green)' : 'var(--red)', marginTop: 2 }}>
                {fmtChange(pnlPct)}
              </div>
            </div>
          </div>
        )
      })}

      {/* Delisted holdings */}
      {delistedHeld.map(([id, h]) => (
        <div key={id} style={{
          background: 'var(--bg2)', border: '1px solid var(--red-border)',
          borderRadius: 10, padding: '14px 16px',
          display: 'flex', alignItems: 'center', gap: 12, opacity: 0.6,
        }}>
          <span style={{ fontSize: 22 }}>💀</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--red)' }}>DELISTED</div>
            <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text3)', marginTop: 2 }}>
              {h.qty} share{h.qty !== 1 ? 's' : ''} · paid {fmt(h.avgCost)} · now worthless
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 700, fontSize: 15, fontFamily: 'var(--font-mono)', color: 'var(--red)' }}>
              -{fmt(h.avgCost * h.qty)}
            </div>
            <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--red)', marginTop: 2 }}>-100%</div>
          </div>
        </div>
      ))}
    </div>
  )
}
