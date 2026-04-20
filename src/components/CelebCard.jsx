import { useState } from 'react'
import Sparkline from './Sparkline.jsx'
import { fmt, fmtChange, getPriceChange } from '../data.js'

export default function CelebCard({ celeb, price, history, buzz, mentions, delistWarning, holding, onBuy, onSell }) {
  const [qty, setQty] = useState(1)
  const chg = getPriceChange(history, price)
  const isUp = chg >= 0
  const isDelisted = price <= 0
  const delistRisk = delistWarning >= 2 ? 'high' : delistWarning >= 1 ? 'medium' : null
  const hasRealBuzz = mentions !== undefined

  return (
    <div style={{
      background: 'var(--bg2)',
      border: `1px solid ${delistRisk === 'high' ? 'var(--red)' : delistRisk === 'medium' ? '#ff8c00' : 'var(--border)'}`,
      borderRadius: '12px', padding: '16px',
      display: 'flex', flexDirection: 'column', gap: '12px',
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
          borderRadius: 6, padding: '4px 8px', fontSize: 11,
          fontFamily: 'var(--font-mono)', color: delistRisk === 'high' ? 'var(--red)' : '#ff8c00',
          textAlign: 'center',
        }}>
          {delistRisk === 'high' ? '🚨 DELIST IMMINENT — buzz critical!' : '⚠️ Low buzz — delist risk rising'}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
        <div style={{
          width: 42, height: 42, borderRadius: '50%',
          background: 'var(--bg3)', border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20, flexShrink: 0,
        }}>{celeb.emoji}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', letterSpacing: '-0.01em', lineHeight: 1.2 }}>{celeb.name}</div>
          <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>{celeb.sector}</div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 16, color: isDelisted ? 'var(--red)' : 'var(--text)' }}>
            {isDelisted ? 'DELISTED' : fmt(price)}
          </div>
          {!isDelisted && (
            <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: isUp ? 'var(--green)' : 'var(--red)', marginTop: 2 }}>
              {fmtChange(chg)}
            </div>
          )}
        </div>
      </div>

      {/* Sparkline */}
      <div style={{ borderRadius: 6, overflow: 'hidden' }}>
        <Sparkline data={history || []} isUp={isUp} width={260} height={40} />
      </div>

      {/* Buzz bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
          <span style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {hasRealBuzz ? '📡 Live buzz' : 'Media buzz'} {buzz < 20 ? '⚠️' : ''}
          </span>
          <span style={{ fontSize: 10, color: buzz < 20 ? 'var(--red)' : 'var(--text2)', fontFamily: 'var(--font-mono)' }}>
            {Math.round(buzz)}/100
          </span>
        </div>
        <div style={{ height: 3, background: 'var(--bg3)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${buzz}%`,
            background: buzz < 20 ? 'var(--red)' : buzz < 40 ? '#ff8c00' : 'linear-gradient(90deg, var(--blue), var(--gold))',
            borderRadius: 2, transition: 'width 1s ease',
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
          <span style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>
            Base: {celeb.buzzBase} ·{' '}
            <span style={{ color: buzz > celeb.buzzBase ? 'var(--green)' : buzz < celeb.buzzBase ? 'var(--red)' : 'var(--text3)' }}>
              {buzz > celeb.buzzBase ? `+${(buzz - celeb.buzzBase).toFixed(0)} above` : buzz < celeb.buzzBase ? `${(buzz - celeb.buzzBase).toFixed(0)} below` : 'at base'}
            </span>
          </span>
          {hasRealBuzz && (
            <span style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>
              {mentions.toLocaleString()} articles/7d
            </span>
          )}
        </div>
      </div>

      {/* Trade row */}
      {!isDelisted && (
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <input
            type="number" min="1" max="999" value={qty}
            onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))}
            style={{
              width: 56, textAlign: 'center', fontSize: 13,
              background: 'var(--bg3)', border: '1px solid var(--border)',
              borderRadius: 8, padding: '7px 4px', color: 'var(--text)', outline: 'none',
            }}
          />
          <button onClick={() => onBuy(celeb.id, qty)} style={{
            flex: 1, padding: '7px 0', borderRadius: 8, fontSize: 12, fontWeight: 600,
            fontFamily: 'var(--font-display)', letterSpacing: '0.03em',
            border: '1px solid var(--green-border)', background: 'var(--green-bg)',
            color: 'var(--green)', cursor: 'pointer', transition: 'all 0.15s',
          }}
          onMouseEnter={e => e.target.style.background = 'rgba(0,208,132,0.15)'}
          onMouseLeave={e => e.target.style.background = 'var(--green-bg)'}
          >Buy ↑</button>
          <button onClick={() => onSell(celeb.id, qty)} style={{
            flex: 1, padding: '7px 0', borderRadius: 8, fontSize: 12, fontWeight: 600,
            fontFamily: 'var(--font-display)', letterSpacing: '0.03em',
            border: '1px solid var(--red-border)', background: 'var(--red-bg)',
            color: 'var(--red)', cursor: 'pointer', transition: 'all 0.15s',
          }}
          onMouseEnter={e => e.target.style.background = 'rgba(255,68,85,0.15)'}
          onMouseLeave={e => e.target.style.background = 'var(--red-bg)'}
          >Sell ↓</button>
        </div>
      )}

      {/* Trade impact hint */}
      {!isDelisted && (
        <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--font-mono)', textAlign: 'center' }}>
          {qty > 1 ? `Trading ${qty} shares moves price ~${(Math.sqrt(qty) * 0.15).toFixed(2)}%` : 'Trades nudge the market price'}
        </div>
      )}

      {/* Owned badge */}
      {holding.qty > 0 && (
        <div style={{
          textAlign: 'center', fontSize: 11, fontFamily: 'var(--font-mono)',
          color: 'var(--gold)', background: 'var(--gold-bg)',
          border: '1px solid rgba(245,200,66,0.15)', borderRadius: 6, padding: '4px 8px',
        }}>
          You own {holding.qty} share{holding.qty !== 1 ? 's' : ''} · avg {fmt(holding.avgCost)}
          {isDelisted && <span style={{ color: 'var(--red)' }}> · WORTHLESS</span>}
        </div>
      )}
    </div>
  )
}
