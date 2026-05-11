import { useState } from 'react'
import { fmt, fmtChange, getPriceChange } from '../data.js'

export default function CelebCard({ celeb, price, history, buzz, delistWarning, holding, volume, onBuy, onSell }) {
  const [qty, setQty] = useState(1)
  const chg = getPriceChange(history, price)
  const isUp = chg >= 0
  const isDelisted = price <= 0
  const delistRisk = delistWarning >= 6 ? 'high' : delistWarning >= 3 ? 'medium' : null

  const vol = volume || { buys: 0, sells: 0, total: 0 }
  const hasVolume = vol.total > 0
  const buyPct = hasVolume ? (vol.buys / vol.total) * 100 : 50

  return (
    <div style={{
      background: 'var(--bg2)',
      border: `1px solid ${delistRisk === 'high' ? 'var(--red)' : delistRisk === 'medium' ? '#ff8c00' : 'var(--border)'}`,
      borderRadius: '12px', padding: '14px',
      display: 'flex', flexDirection: 'column', gap: '10px',
      transition: 'border-color 0.2s', animation: 'fadeIn 0.3s ease',
      opacity: isDelisted ? 0.5 : 1,
    }}
    onMouseEnter={e => { if (!delistRisk && !isDelisted) e.currentTarget.style.borderColor = 'var(--border2)' }}
    onMouseLeave={e => { if (!delistRisk && !isDelisted) e.currentTarget.style.borderColor = 'var(--border)' }}
    >
      {/* Delist warning */}
      {delistRisk && (
        <div style={{
          background: delistRisk === 'high' ? 'var(--red-bg)' : 'rgba(255,140,0,0.1)',
          border: `1px solid ${delistRisk === 'high' ? 'var(--red-border)' : 'rgba(255,140,0,0.3)'}`,
          borderRadius: 6, padding: '3px 8px', fontSize: 10,
          fontFamily: 'var(--font-mono)', color: delistRisk === 'high' ? 'var(--red)' : '#ff8c00',
          textAlign: 'center',
        }}>
          {delistRisk === 'high' ? '🚨 DELIST IMMINENT' : '⚠️ Low buzz — delist risk'}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
        <div style={{
          width: 38, height: 38, borderRadius: '50%',
          background: 'var(--bg3)', border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, flexShrink: 0,
        }}>{celeb.emoji}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text)', letterSpacing: '-0.01em', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{celeb.name}</div>
          <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--font-mono)', marginTop: 1 }}>{celeb.sector}</div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 15, color: isDelisted ? 'var(--red)' : 'var(--text)' }}>
            {isDelisted ? 'DELISTED' : fmt(price)}
          </div>
          {!isDelisted && (
            <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: isUp ? 'var(--green)' : 'var(--red)', marginTop: 1 }}>
              {fmtChange(chg)}
            </div>
          )}
        </div>
      </div>

      {/* Sparkline */}
      <Sparkline data={history || []} isUp={isUp} />

      {/* Buzz bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 9, color: 'var(--text3)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Buzz {buzz < 20 ? '⚠️' : ''}
          </span>
          <span style={{ fontSize: 9, color: buzz < 20 ? 'var(--red)' : 'var(--text3)', fontFamily: 'var(--font-mono)' }}>
            {Math.round(buzz)}/100 · base {celeb.buzzBase}
          </span>
        </div>
        <div style={{ height: 3, background: 'var(--bg3)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${buzz}%`,
            background: buzz < 20 ? 'var(--red)' : buzz < 40 ? '#ff8c00' : 'linear-gradient(90deg, var(--blue), var(--gold))',
            borderRadius: 2, transition: 'width 2s ease',
          }} />
        </div>
      </div>

      {/* Volume bar — only show if recent activity */}
      {hasVolume && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 9, color: 'var(--green)', fontFamily: 'var(--font-mono)' }}>▲ {vol.buys} bought</span>
            <span style={{ fontSize: 9, color: 'var(--text3)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>60s volume</span>
            <span style={{ fontSize: 9, color: 'var(--red)', fontFamily: 'var(--font-mono)' }}>{vol.sells} sold ▼</span>
          </div>
          <div style={{ height: 3, background: 'var(--bg3)', borderRadius: 2, overflow: 'hidden', display: 'flex' }}>
            <div style={{ height: '100%', width: `${buyPct}%`, background: 'var(--green)', borderRadius: '2px 0 0 2px', transition: 'width 0.5s ease' }} />
            <div style={{ height: '100%', width: `${100 - buyPct}%`, background: 'var(--red)', borderRadius: '0 2px 2px 0' }} />
          </div>
        </div>
      )}

      {/* Trade row */}
      {!isDelisted && (
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <input
            type="number" min="1" max="999" value={qty}
            onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))}
            style={{
              width: 52, textAlign: 'center', fontSize: 12,
              background: 'var(--bg3)', border: '1px solid var(--border)',
              borderRadius: 8, padding: '6px 4px', color: 'var(--text)', outline: 'none',
            }}
          />
          <button onClick={() => onBuy(celeb.id, qty)} style={{
            flex: 1, padding: '6px 0', borderRadius: 8, fontSize: 12, fontWeight: 600,
            fontFamily: 'var(--font-display)', letterSpacing: '0.02em',
            border: '1px solid var(--green-border)', background: 'var(--green-bg)',
            color: 'var(--green)', cursor: 'pointer', transition: 'all 0.15s',
          }}
          onMouseEnter={e => e.target.style.background = 'rgba(0,208,132,0.15)'}
          onMouseLeave={e => e.target.style.background = 'var(--green-bg)'}
          >Buy ↑</button>
          <button onClick={() => onSell(celeb.id, qty)} style={{
            flex: 1, padding: '6px 0', borderRadius: 8, fontSize: 12, fontWeight: 600,
            fontFamily: 'var(--font-display)', letterSpacing: '0.02em',
            border: '1px solid var(--red-border)', background: 'var(--red-bg)',
            color: 'var(--red)', cursor: 'pointer', transition: 'all 0.15s',
          }}
          onMouseEnter={e => e.target.style.background = 'rgba(255,68,85,0.15)'}
          onMouseLeave={e => e.target.style.background = 'var(--red-bg)'}
          >Sell ↓</button>
        </div>
      )}

      {/* Owned badge */}
      {holding.qty > 0 && (
        <div style={{
          textAlign: 'center', fontSize: 10, fontFamily: 'var(--font-mono)',
          color: 'var(--gold)', background: 'var(--gold-bg)',
          border: '1px solid rgba(245,200,66,0.15)', borderRadius: 6, padding: '3px 8px',
        }}>
          {holding.qty} share{holding.qty !== 1 ? 's' : ''} · avg {fmt(holding.avgCost)}
          {isDelisted && <span style={{ color: 'var(--red)' }}> · WORTHLESS</span>}
        </div>
      )}
    </div>
  )
}

// Inline sparkline — no external dependency
function Sparkline({ data, isUp }) {
  if (!data || data.length < 2) return <div style={{ height: 36 }} />
  const w = 260, h = 36
  const min = Math.min(...data), max = Math.max(...data)
  const range = max - min || 1
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / range) * h
    return `${x},${y}`
  }).join(' ')
  const fill = `0,${h} ${pts} ${w},${h}`
  const color = isUp ? '#00d084' : '#ff4455'
  const fillColor = isUp ? 'rgba(0,208,132,0.07)' : 'rgba(255,68,85,0.07)'
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
      <polygon points={fill} fill={fillColor} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}
