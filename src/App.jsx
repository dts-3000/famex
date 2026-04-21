import { useState, useEffect, useCallback, useRef } from 'react'
import { SECTORS, UPDATE_INTERVAL, STARTING_CASH, initState, tickMarket, applyTradeImpact, getAllCelebs, fmt } from './data.js'
import { fetchAllBuzzScores } from './newsService.js'
import Ticker from './components/Ticker.jsx'
import CelebCard from './components/CelebCard.jsx'
import Portfolio from './components/Portfolio.jsx'
import NewsFeed from './components/NewsFeed.jsx'
import Toast from './components/Toast.jsx'
import AdminPanel from './components/AdminPanel.jsx'

const NEWS_REFRESH_INTERVAL = 60 * 60 * 1000

// Market event buzz impacts
const EVENT_IMPACTS = {
  boom:     { buzzDelta: +40, volatilityMult: 1.5,  resetBase: false },
  surge:    { buzzDelta: +20, volatilityMult: 1.0,  resetBase: false },
  drop:     { buzzDelta: -20, volatilityMult: 1.0,  resetBase: false },
  crash:    { buzzDelta: -40, volatilityMult: 1.5,  resetBase: false },
  scandal:  { buzzDelta: -40, volatilityMult: 2.5,  resetBase: false },
  comeback: { buzzDelta: +35, volatilityMult: 1.2,  resetBase: true  },
}

export default function App() {
  const [state, setState] = useState(() => initState())
  const [tab, setTab] = useState('market')
  const [sector, setSector] = useState('All')
  const [countdown, setCountdown] = useState(UPDATE_INTERVAL)
  const [toast, setToast] = useState({ message: '', type: '' })
  const [buzzLoading, setBuzzLoading] = useState(true)
  const [lastBuzzFetch, setLastBuzzFetch] = useState(null)
  const [mentionCounts, setMentionCounts] = useState({})
  const [showAdmin, setShowAdmin] = useState(false)
  // Custom celebs added via admin (stored separately so they survive ticks)
  const [customCelebDefs, setCustomCelebDefs] = useState({})
  const stateRef = useRef(state)
  stateRef.current = state

  const loadRealBuzz = useCallback(async (activeIds) => {
    setBuzzLoading(true)
    try {
      const results = await fetchAllBuzzScores(activeIds)
      setState(prev => {
        const newBuzz = { ...prev.buzz }
        const newNews = [...prev.news]
        const newMentions = {}
        const now = new Date()
        const time = now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0')
        Object.entries(results).forEach(([id, { buzz, mentions, articles }]) => {
          const oldBuzz = prev.buzz[id] || 50
          newBuzz[id] = buzz
          newMentions[id] = mentions
          articles.slice(0, 2).forEach(article => {
            if (article.title && !article.title.includes('[Removed]')) {
              newNews.unshift({
                headline: article.title,
                pub: article.source || 'News',
                time, dir: buzz > oldBuzz ? 1 : buzz < oldBuzz ? -1 : 0,
                id: Date.now() + Math.random(), real: true, url: article.url,
              })
            }
          })
        })
        setMentionCounts(newMentions)
        return { ...prev, buzz: newBuzz, news: newNews.slice(0, 60) }
      })
      setLastBuzzFetch(new Date())
    } catch (err) {
      console.error('Failed to fetch buzz scores:', err)
    } finally {
      setBuzzLoading(false)
    }
  }, [])

  useEffect(() => { loadRealBuzz(stateRef.current.active) }, [loadRealBuzz])
  useEffect(() => {
    const interval = setInterval(() => loadRealBuzz(stateRef.current.active), NEWS_REFRESH_INTERVAL)
    return () => clearInterval(interval)
  }, [loadRealBuzz])

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { setState(s => tickMarket(s)); return UPDATE_INTERVAL }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Check for /admin URL
  useEffect(() => {
    if (window.location.pathname === '/admin') setShowAdmin(true)
  }, [])

  const showToast = useCallback((message, type) => setToast({ message, type }), [])

  const handleBuy = useCallback((id, qty) => {
    setState(prev => {
      const price = prev.prices[id]
      if (!price || price <= 0) { showToast('This celeb is delisted!', 'error'); return prev }
      const total = price * qty
      if (total > prev.cash) { showToast('Not enough cash!', 'error'); return prev }
      const h = prev.holdings[id] || { qty: 0, avgCost: 0 }
      const newAvg = (h.avgCost * h.qty + total) / (h.qty + qty)
      const celeb = getAllCelebs(prev).find(c => c.id === id)
      showToast(`Bought ${qty}x ${celeb?.name} for ${fmt(total)}`, 'buy')
      const impacted = applyTradeImpact(prev, id, qty, true)
      return { ...impacted, cash: impacted.cash - total, holdings: { ...impacted.holdings, [id]: { qty: h.qty + qty, avgCost: newAvg } } }
    })
  }, [showToast])

  const handleSell = useCallback((id, qty) => {
    setState(prev => {
      const h = prev.holdings[id] || { qty: 0, avgCost: 0 }
      if (h.qty < qty) { showToast(`You only own ${h.qty} share${h.qty !== 1 ? 's' : ''}!`, 'error'); return prev }
      const price = prev.prices[id]
      const total = price * qty
      const celeb = getAllCelebs(prev).find(c => c.id === id)
      showToast(`Sold ${qty}x ${celeb?.name} for ${fmt(total)}`, 'sell')
      const impacted = applyTradeImpact(prev, id, qty, false)
      return { ...impacted, cash: impacted.cash + total, holdings: { ...impacted.holdings, [id]: { qty: h.qty - qty, avgCost: h.qty - qty === 0 ? 0 : h.avgCost } } }
    })
  }, [showToast])

  // Admin handlers
  const handleAddCeleb = useCallback((celeb) => {
    setCustomCelebDefs(prev => ({ ...prev, [celeb.id]: celeb }))
    setState(prev => ({
      ...prev,
      active: [...prev.active, celeb.id],
      prices: { ...prev.prices, [celeb.id]: celeb.basePrice },
      history: { ...prev.history, [celeb.id]: Array(20).fill(celeb.basePrice) },
      buzz: { ...prev.buzz, [celeb.id]: celeb.buzzBase },
      buzzPrev: { ...prev.buzzPrev, [celeb.id]: celeb.buzzBase },
      delistWarnings: { ...prev.delistWarnings, [celeb.id]: 0 },
      holdings: { ...prev.holdings, [celeb.id]: { qty: 0, avgCost: 0 } },
      customCelebs: { ...(prev.customCelebs || {}), [celeb.id]: celeb },
      news: [{ headline: `🆕 ${celeb.name} has joined Celebrity Exchange!`, pub: 'Celebrity Exchange', time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }), dir: 1, id: Date.now() }, ...prev.news],
    }))
  }, [])

  const handleRemoveCeleb = useCallback((id) => {
    setState(prev => {
      const celeb = getAllCelebs(prev).find(c => c.id === id)
      return {
        ...prev,
        active: prev.active.filter(a => a !== id),
        prices: { ...prev.prices, [id]: 0 },
        news: [{ headline: `⚠️ ${celeb?.name || id} has been delisted by admin`, pub: 'Celebrity Exchange', time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }), dir: -1, id: Date.now() }, ...prev.news],
      }
    })
  }, [])

  const handleUpdateCeleb = useCallback((id, vals) => {
    setState(prev => ({
      ...prev,
      prices: { ...prev.prices, [id]: vals.price },
      buzz: { ...prev.buzz, [id]: vals.buzz },
      customCelebs: {
        ...(prev.customCelebs || {}),
        [id]: { ...(prev.customCelebs?.[id] || {}), volatility: vals.volatility, buzzBase: vals.buzzBase },
      },
    }))
  }, [])

  const handleMarketEvent = useCallback((id, eventType, headline) => {
    const impact = EVENT_IMPACTS[eventType] || EVENT_IMPACTS.surge
    setState(prev => {
      const currentBuzz = prev.buzz[id] || 50
      const newBuzz = Math.min(100, Math.max(0, currentBuzz + impact.buzzDelta))
      const celeb = getAllCelebs(prev).find(c => c.id === id)

      // For comeback, also reset base buzz upward
      const customUpdate = impact.resetBase ? {
        customCelebs: {
          ...(prev.customCelebs || {}),
          [id]: { ...(prev.customCelebs?.[id] || celeb || {}), buzzBase: Math.min(95, (celeb?.buzzBase || 70) + 10) },
        }
      } : {}

      const now = new Date()
      const time = now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0')
      return {
        ...prev,
        ...customUpdate,
        buzz: { ...prev.buzz, [id]: newBuzz },
        news: [{
          headline, pub: 'Celebrity Exchange Admin',
          time, dir: impact.buzzDelta > 0 ? 1 : -1,
          id: Date.now(), admin: true,
        }, ...prev.news],
      }
    })
  }, [])

  const activeCelebs = getAllCelebs(state)
  const portfolioValue = activeCelebs.reduce((s, c) => s + (state.prices[c.id] || 0) * (state.holdings[c.id]?.qty || 0), 0)
  const pnl = (state.cash + portfolioValue) - STARTING_CASH
  const pnlUp = pnl >= 0
  const visibleCelebs = sector === 'All' ? activeCelebs : activeCelebs.filter(c => c.sector === sector)

  const r = 11
  const circ = 2 * Math.PI * r
  const offset = circ * (countdown / UPDATE_INTERVAL)

  const tabStyle = (t) => ({
    padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600,
    fontFamily: 'var(--font-display)', letterSpacing: '0.02em', border: '1px solid',
    borderColor: tab === t ? 'var(--border2)' : 'var(--border)',
    background: tab === t ? 'var(--bg3)' : 'transparent',
    color: tab === t ? 'var(--text)' : 'var(--text2)',
    cursor: 'pointer', transition: 'all 0.15s',
  })

  const filterStyle = (s) => ({
    padding: '5px 12px', borderRadius: 6, fontSize: 12, fontFamily: 'var(--font-mono)', border: '1px solid',
    borderColor: sector === s ? 'var(--border2)' : 'var(--border)',
    background: sector === s ? 'var(--bg3)' : 'transparent',
    color: sector === s ? 'var(--text)' : 'var(--text3)',
    cursor: 'pointer', transition: 'all 0.15s',
  })

  // Derive all sectors including custom celebs
  const allSectors = ['All', ...new Set([...SECTORS, ...activeCelebs.map(c => c.sector)])]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <header style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', flexWrap: 'wrap', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text)' }}>
                Celebrity<span style={{ color: 'var(--gold)' }}>Exchange</span>
              </span>
              <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text3)' }}>BETA</span>
              {buzzLoading && <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--blue)' }}>⟳ fetching live buzz...</span>}
              {lastBuzzFetch && !buzzLoading && (
                <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text3)' }}>
                  📡 live · {lastBuzzFetch.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              {[
                { label: 'Cash',      value: fmt(state.cash),    color: 'var(--text)' },
                { label: 'Portfolio', value: fmt(portfolioValue), color: 'var(--text)' },
                { label: 'P&L',       value: (pnlUp ? '+' : '') + fmt(pnl), color: pnlUp ? 'var(--green)' : 'var(--red)' },
              ].map(s => (
                <div key={s.label} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 12px', textAlign: 'right' }}>
                  <div style={{ fontSize: 9, color: 'var(--text3)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-mono)', color: s.color }}>{s.value}</div>
                </div>
              ))}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <svg width="28" height="28" viewBox="0 0 28 28">
                  <circle cx="14" cy="14" r={r} fill="none" stroke="var(--border)" strokeWidth="2.5"/>
                  <circle cx="14" cy="14" r={r} fill="none" stroke="var(--blue)" strokeWidth="2.5"
                    strokeDasharray={circ} strokeDashoffset={circ - offset}
                    strokeLinecap="round" transform="rotate(-90 14 14)"
                    style={{ transition: 'stroke-dashoffset 1s linear' }}
                  />
                </svg>
                <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text3)' }}>{countdown}s</span>
              </div>
              {/* Hidden admin button — subtle */}
              <button onClick={() => setShowAdmin(true)} style={{
                width: 28, height: 28, borderRadius: 6, border: '1px solid var(--border)',
                background: 'transparent', color: 'var(--text3)', fontSize: 14, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }} title="Admin">⚙</button>
            </div>
          </div>
        </div>
        <Ticker prices={state.prices} history={state.history} active={state.active} />
      </header>

      <main style={{ flex: 1, maxWidth: 1200, margin: '0 auto', padding: '20px', width: '100%' }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
          {['market', 'portfolio', 'news'].map(t => (
            <button key={t} style={tabStyle(t)} onClick={() => setTab(t)}>
              {t === 'market' ? 'Market' : t === 'portfolio' ? 'My Portfolio' : `Buzz Feed${state.news.filter(n => n.real).length > 0 ? ' 📡' : ''}`}
            </button>
          ))}
        </div>

        {tab === 'market' && (
          <>
            <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
              {allSectors.map(s => (
                <button key={s} style={filterStyle(s)} onClick={() => setSector(s)}>{s}</button>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
              {visibleCelebs.map(c => (
                <CelebCard
                  key={c.id} celeb={c}
                  price={state.prices[c.id]}
                  history={state.history[c.id]}
                  buzz={state.buzz[c.id]}
                  mentions={mentionCounts[c.id]}
                  delistWarning={state.delistWarnings[c.id] || 0}
                  holding={state.holdings[c.id] || { qty: 0, avgCost: 0 }}
                  onBuy={handleBuy} onSell={handleSell}
                />
              ))}
            </div>
          </>
        )}

        {tab === 'portfolio' && <Portfolio holdings={state.holdings} prices={state.prices} activeCelebs={activeCelebs} />}
        {tab === 'news' && <NewsFeed news={state.news} />}
      </main>

      <Toast message={toast.message} type={toast.type} onDone={() => setToast({ message: '', type: '' })} />

      {showAdmin && (
        <AdminPanel
          state={{ ...state, customCelebs: { ...state.customCelebs, ...customCelebDefs } }}
          onAddCeleb={handleAddCeleb}
          onRemoveCeleb={handleRemoveCeleb}
          onUpdateCeleb={handleUpdateCeleb}
          onMarketEvent={handleMarketEvent}
          onClose={() => setShowAdmin(false)}
        />
      )}
    </div>
  )
}
