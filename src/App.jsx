import { useState, useEffect, useCallback, useRef } from 'react'
import { SECTORS, UPDATE_INTERVAL, STARTING_CASH, initState, tickMarket, applyTradeImpact, getAllCelebs, getVolume, manualDelist, fmt } from './data.js'
import { checkBadges } from './badges.js'
import { getOrCreatePlayer, getHoldings, updatePlayerCash, upsertHolding, deleteHolding, getBadges, awardBadges, bulkUpsertMarket, subscribeToMarket } from './supabase.js'
import Ticker from './components/Ticker.jsx'
import CelebCard from './components/CelebCard.jsx'
import Portfolio from './components/Portfolio.jsx'
import NewsFeed from './components/NewsFeed.jsx'
import Toast from './components/Toast.jsx'
import AdminPanel from './components/AdminPanel.jsx'
import TrophyCabinet from './components/TrophyCabinet.jsx'
import BadgeUnlock from './components/BadgeUnlock.jsx'
import UsernamePrompt from './components/UsernamePrompt.jsx'
import Leaderboard from './components/Leaderboard.jsx'

const SAVE_KEY = 'famex_save'
const SCRAPE_INTERVAL = 24 * 60 * 60 * 1000 // 24 hours
const SCRAPE_INTERVAL_SECS = 24 * 60 * 60    // 24 hours in seconds

const EVENT_IMPACTS = {
  boom:     { buzzDelta: +40, resetBase: false },
  surge:    { buzzDelta: +20, resetBase: false },
  drop:     { buzzDelta: -20, resetBase: false },
  crash:    { buzzDelta: -40, resetBase: false },
  scandal:  { buzzDelta: -40, resetBase: false },
  comeback: { buzzDelta: +35, resetBase: true  },
}

function loadSave() {
  try {
    const saved = localStorage.getItem(SAVE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      const fresh = initState()
      return {
        ...fresh, ...parsed,
        prices:         { ...fresh.prices,         ...parsed.prices },
        history:        { ...fresh.history,        ...parsed.history },
        buzz:           { ...fresh.buzz,           ...parsed.buzz },
        buzzPrev:       { ...fresh.buzzPrev,       ...parsed.buzzPrev },
        holdings:       { ...fresh.holdings,       ...parsed.holdings },
        delistWarnings: { ...fresh.delistWarnings, ...parsed.delistWarnings },
        volume:         { ...fresh.volume,         ...(parsed.volume || {}) },
        customCelebs:   { ...(parsed.customCelebs || {}) },
        // Restore active list — includes any admin-added celebs
        active:         parsed.active || fresh.active,
      }
    }
  } catch (e) { console.warn('Could not load save:', e) }
  return initState()
}

export default function App() {
  const [state, setState] = useState(() => loadSave())
  const [tab, setTab] = useState('market')
  const [sector, setSector] = useState('All')
  const [countdown, setCountdown] = useState(UPDATE_INTERVAL)
  const [toast, setToast] = useState({ message: '', type: '' })
  const [showAdmin, setShowAdmin] = useState(false)
  const [lastSaved, setLastSaved] = useState(null)
  const [lastScraped, setLastScraped] = useState(null)
  const [scraping, setScraping] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [newsCountdown, setNewsCountdown] = useState(SCRAPE_INTERVAL_SECS)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('name')

  // Player / multiplayer state
  const [player, setPlayer] = useState(null)
  const [playerLoading, setPlayerLoading] = useState(false)
  const [dbReady, setDbReady] = useState(false)

  // Badge state
  const [earnedBadges, setEarnedBadges] = useState(() => {
    try { return JSON.parse(localStorage.getItem('famex_badges') || '[]') } catch { return [] }
  })
  const [pendingBadge, setPendingBadge] = useState(null)
  const badgeQueue = useRef([])

  // Trade meta for badge tracking
  const tradeMeta = useRef({
    totalTrades:         0,
    bestSellPct:         0,
    longestHold:         0,
    biggestTradePct:     0,
    lossCount:           0,
    boughtLowBuzz:       false,
    boughtAtLow:         false,
    heldThroughCrash:    false,
    ownedDelisted:       false,
    boughtAfterBoom:     false,
    tradedAfterMidnight: false,
    tradedBeforeSix:     false,
    consecutiveDays:     1,
  })

  const stateRef = useRef(state)
  stateRef.current = state

  // ── Player join ──────────────────────────────────────────────────────────
  const handleJoin = useCallback(async (username) => {
    setPlayerLoading(true)
    try {
      const p = await getOrCreatePlayer(username)
      if (!p) { showToast('Could not connect — playing offline', 'error'); setDbReady(false); return }

      // Load holdings from DB
      const dbHoldings = await getHoldings(p.id)
      const dbBadges   = await getBadges(p.id)

      setState(prev => ({
        ...prev,
        cash:     p.cash,
        holdings: { ...prev.holdings, ...dbHoldings },
      }))
      setEarnedBadges(dbBadges)
      setPlayer(p)
      setDbReady(true)
      localStorage.setItem('famex_username', username)
      showToast(`Welcome back ${username}! 🎉`, 'buy')
    } catch (err) {
      console.error('Join error:', err)
      showToast('Playing offline — DB unavailable', 'error')
      setDbReady(false)
    } finally {
      setPlayerLoading(false)
    }
  }, [])

  // Auto-login if username saved
  useEffect(() => {
    const saved = localStorage.getItem('famex_username')
    if (saved) handleJoin(saved)
  }, [])

  // ── Real-time market sync ────────────────────────────────────────────────
  useEffect(() => {
    if (!dbReady) return
    const unsub = subscribeToMarket((record) => {
      if (!record) return
      setState(prev => ({
        ...prev,
        prices: { ...prev.prices, [record.celeb_id]: record.price },
        buzz:   { ...prev.buzz,   [record.celeb_id]: record.buzz  },
      }))
    })
    return unsub
  }, [dbReady])

  // ── Save holdings to DB on change ───────────────────────────────────────
  const saveToDB = useCallback(async (newState) => {
    if (!player || !dbReady) return
    try {
      await updatePlayerCash(player.id, newState.cash)
      // Upsert changed holdings
      const promises = Object.entries(newState.holdings)
        .filter(([, h]) => h.qty >= 0)
        .map(([id, h]) =>
          h.qty === 0
            ? deleteHolding(player.id, id)
            : upsertHolding(player.id, id, h.qty, h.avgCost)
        )
      await Promise.allSettled(promises)
    } catch (err) {
      console.warn('DB save error:', err)
    }
  }, [player, dbReady])

  // ── Push market prices to DB every tick (so all players share prices) ───
  const pushMarketToDB = useCallback(async (newState) => {
    if (!dbReady) return
    try {
      const entries = newState.active.map(id => ({
        celeb_id:   id,
        price:      newState.prices[id] || 0,
        buzz:       newState.buzz[id] || 0,
        prev_price: newState.history[id]?.[newState.history[id].length - 2] || newState.prices[id] || 0,
      }))
      await bulkUpsertMarket(entries)
    } catch (err) {
      console.warn('Market push error:', err)
    }
  }, [dbReady])

  // Auto-save
  useEffect(() => {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(state))
      setLastSaved(new Date())
    } catch (e) { console.warn('Could not save:', e) }
  }, [state])

  // Save badges
  useEffect(() => {
    try { localStorage.setItem('famex_badges', JSON.stringify(earnedBadges)) } catch {}
  }, [earnedBadges])

  // Check badges after state changes
  const checkAndAwardBadges = useCallback((newState) => {
    const { earned, newlyEarned } = checkBadges(newState, earnedBadges, tradeMeta.current)
    if (newlyEarned.length > 0) {
      setEarnedBadges(earned)
      if (player) awardBadges(player.id, newlyEarned)
      badgeQueue.current = [...badgeQueue.current, ...newlyEarned]
      if (!pendingBadge) setPendingBadge(badgeQueue.current.shift())
    }
  }, [earnedBadges, pendingBadge, player])

  // Badge queue processor
  const handleBadgeDone = useCallback(() => {
    setPendingBadge(null)
    if (badgeQueue.current.length > 0) {
      setTimeout(() => setPendingBadge(badgeQueue.current.shift()), 500)
    }
  }, [])

  // Scrape real news
  const scrapeNews = useCallback(async () => {
    setScraping(true)
    try {
      const res = await fetch('/api/scrape')
      if (!res.ok) throw new Error('Scrape failed')
      const data = await res.json()
      if (data.error) { console.warn('Scrape error:', data.error); return }

      setState(prev => {
        const newBuzz = { ...prev.buzz }
        const newNews = [...prev.news]
        const now = new Date()
        const time = now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0')

        // Apply real buzz scores
        Object.entries(data.buzzScores || {}).forEach(([id, { buzz }]) => {
          if (prev.active.includes(id)) newBuzz[id] = buzz
        })

        // Add real headlines to news feed
        ;(data.topHeadlines || []).forEach(h => {
          if (h.title) {
            newNews.unshift({
              headline: h.title, pub: h.source || 'Google News',
              time, dir: 1,  // always positive — being mentioned = buzz
              id: Date.now() + Math.random(), real: true,
              url: h.link, mentions: h.mentions || 0,
            })
          }
        })

        return { ...prev, buzz: newBuzz, news: newNews.slice(0, 60) }
      })

      // Store suggestions for admin panel
      if (data.suggestions?.length) setSuggestions(data.suggestions)
      setLastScraped(new Date())
    } catch (err) {
      console.warn('Scrape failed:', err)
    } finally {
      setScraping(false)
    }
  }, [])

  // Initial scrape + interval
  useEffect(() => { scrapeNews() }, [])
  useEffect(() => {
    const interval = setInterval(scrapeNews, SCRAPE_INTERVAL)
    return () => clearInterval(interval)
  }, [scrapeNews])

  // Market tick + news countdown every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setState(s => {
            const next = tickMarket(s)
            checkAndAwardBadges(next)
            pushMarketToDB(next)
            return next
          })
          return UPDATE_INTERVAL
        }
        return prev - 1
      })
      setNewsCountdown(prev => prev <= 1 ? SCRAPE_INTERVAL_SECS : prev - 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [checkAndAwardBadges, pushMarketToDB])

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

      // Badge meta
      tradeMeta.current.totalTrades++
      if ((prev.buzz[id] || 50) < 20) tradeMeta.current.boughtLowBuzz = true

      // All in — check if this trade is 90%+ of cash
      const tradePct = (total / prev.cash) * 100
      if (tradePct > tradeMeta.current.biggestTradePct) tradeMeta.current.biggestTradePct = tradePct

      // Time-based badges
      const hour = new Date().getHours()
      if (hour >= 0 && hour < 6) tradeMeta.current.tradedBeforeSix = true
      if (hour === 0 || hour === 23) tradeMeta.current.tradedAfterMidnight = true

      // Riding the wave — bought within 10 ticks (100s) of a Boom on same celeb
      if (tradeMeta.current.lastBoomId === id &&
          Date.now() - (tradeMeta.current.lastBoomTick || 0) < 100000) {
        tradeMeta.current.boughtAfterBoom = true
      }

      const impacted = applyTradeImpact(prev, id, qty, true)
      const next = { ...impacted, cash: impacted.cash - total, holdings: { ...impacted.holdings, [id]: { qty: h.qty + qty, avgCost: newAvg } } }
      checkAndAwardBadges(next)
      saveToDB(next)
      return next
    })
  }, [showToast, checkAndAwardBadges, saveToDB])

  const handleSell = useCallback((id, qty) => {
    setState(prev => {
      const h = prev.holdings[id] || { qty: 0, avgCost: 0 }
      if (h.qty < qty) { showToast(`You only own ${h.qty} share${h.qty !== 1 ? 's' : ''}!`, 'error'); return prev }
      const price = prev.prices[id]
      const total = price * qty
      const celeb = getAllCelebs(prev).find(c => c.id === id)
      showToast(`Sold ${qty}x ${celeb?.name} for ${fmt(total)}`, 'sell')

      // Badge meta
      tradeMeta.current.totalTrades++
      const pct = h.avgCost > 0 ? ((price - h.avgCost) / h.avgCost) * 100 : 0
      if (pct > tradeMeta.current.bestSellPct) tradeMeta.current.bestSellPct = pct
      if (pct < 0) tradeMeta.current.lossCount = (tradeMeta.current.lossCount || 0) + 1

      // Time-based badges
      const hour = new Date().getHours()
      if (hour >= 0 && hour < 6) tradeMeta.current.tradedBeforeSix = true
      if (hour === 0 || hour === 23) tradeMeta.current.tradedAfterMidnight = true

      const impacted = applyTradeImpact(prev, id, qty, false)
      const next = { ...impacted, cash: impacted.cash + total, holdings: { ...impacted.holdings, [id]: { qty: h.qty - qty, avgCost: h.qty - qty === 0 ? 0 : h.avgCost } } }
      checkAndAwardBadges(next)
      saveToDB(next)
      return next
    })
  }, [showToast, checkAndAwardBadges, saveToDB])

  const handleDelist = useCallback((id, addReplacement) => {
    setState(prev => manualDelist(prev, id, addReplacement))
    if (state.holdings[id]?.qty > 0) tradeMeta.current.ownedDelisted = true
  }, [state.holdings])

  const handleAddCeleb = useCallback((celeb) => {
    setState(prev => ({
      ...prev,
      active: [...prev.active, celeb.id],
      prices: { ...prev.prices, [celeb.id]: celeb.basePrice },
      history: { ...prev.history, [celeb.id]: Array(20).fill(celeb.basePrice) },
      buzz: { ...prev.buzz, [celeb.id]: celeb.buzzBase },
      buzzPrev: { ...prev.buzzPrev, [celeb.id]: celeb.buzzBase },
      delistWarnings: { ...prev.delistWarnings, [celeb.id]: 0 },
      holdings: { ...prev.holdings, [celeb.id]: { qty: 0, avgCost: 0 } },
      volume: { ...prev.volume, [celeb.id]: [] },
      customCelebs: { ...(prev.customCelebs || {}), [celeb.id]: celeb },
      news: [{ headline: `🆕 ${celeb.name} has joined FameX!`, pub: 'FameX', time: new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' }), dir: 1, id: Date.now() }, ...prev.news],
    }))
  }, [])

  const handleRemoveCeleb = useCallback((id) => {
    setState(prev => {
      const celeb = getAllCelebs(prev).find(c => c.id === id)
      if (prev.holdings[id]?.qty > 0) tradeMeta.current.ownedDelisted = true
      return {
        ...prev,
        active: prev.active.filter(a => a !== id),
        prices: { ...prev.prices, [id]: 0 },
        news: [{ headline: `⚠️ ${celeb?.name || id} delisted by admin`, pub: 'FameX', time: new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' }), dir: -1, id: Date.now() }, ...prev.news],
      }
    })
  }, [])

  const handleUpdateCeleb = useCallback((id, vals) => {
    setState(prev => ({
      ...prev,
      prices: { ...prev.prices, [id]: vals.price },
      buzz: { ...prev.buzz, [id]: vals.buzz },
      customCelebs: { ...(prev.customCelebs || {}), [id]: { ...(prev.customCelebs?.[id] || {}), volatility: vals.volatility, buzzBase: vals.buzzBase } },
    }))
  }, [])

  const handleMarketEvent = useCallback((id, eventType, headline) => {
    const impact = EVENT_IMPACTS[eventType] || EVENT_IMPACTS.surge
    if (eventType === 'crash' || eventType === 'scandal') {
      const holdings = stateRef.current.holdings
      if (holdings[id]?.qty > 0) tradeMeta.current.heldThroughCrash = true
    }
    if (eventType === 'boom' || eventType === 'surge') {
      // Mark that a boom just fired — next buy on this celeb triggers riding_the_wave
      tradeMeta.current.lastBoomId = id
      tradeMeta.current.lastBoomTick = Date.now()
    }
    setState(prev => {
      const currentBuzz = prev.buzz[id] || 50
      const newBuzz = Math.min(100, Math.max(0, currentBuzz + impact.buzzDelta))
      const celeb = getAllCelebs(prev).find(c => c.id === id)
      const customUpdate = impact.resetBase ? {
        customCelebs: { ...(prev.customCelebs || {}), [id]: { ...(prev.customCelebs?.[id] || celeb || {}), buzzBase: Math.min(95, (celeb?.buzzBase || 70) + 10) } }
      } : {}
      const time = new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })
      return {
        ...prev, ...customUpdate,
        buzz: { ...prev.buzz, [id]: newBuzz },
        news: [{ headline, pub: 'FameX Admin', time, dir: impact.buzzDelta > 0 ? 1 : -1, id: Date.now() }, ...prev.news],
      }
    })
  }, [])

  const activeCelebs = getAllCelebs(state)
  const portfolioValue = activeCelebs.reduce((s, c) => s + (state.prices[c.id] || 0) * (state.holdings[c.id]?.qty || 0), 0)
  const pnl = (state.cash + portfolioValue) - STARTING_CASH
  const pnlUp = pnl >= 0
  const allSectors = ['All', ...new Set([...SECTORS, ...activeCelebs.map(c => c.sector)])]

  // Filter by sector + search
  const filteredCelebs = activeCelebs
    .filter(c => sector === 'All' || c.sector === sector)
    .filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()))

  // Sort
  const visibleCelebs = [...filteredCelebs].sort((a, b) => {
    switch (sortBy) {
      case 'price':  return (state.prices[b.id] || 0) - (state.prices[a.id] || 0)
      case 'buzz':   return (state.buzz[b.id] || 0) - (state.buzz[a.id] || 0)
      case 'change': {
        const chgA = state.history[a.id]?.length > 1 ? (state.prices[a.id] - state.history[a.id][state.history[a.id].length - 2]) / state.history[a.id][state.history[a.id].length - 2] : 0
        const chgB = state.history[b.id]?.length > 1 ? (state.prices[b.id] - state.history[b.id][state.history[b.id].length - 2]) / state.history[b.id][state.history[b.id].length - 2] : 0
        return chgB - chgA
      }
      case 'volume': return (getVolume(state, b.id).total) - (getVolume(state, a.id).total)
      case 'owned':  return (state.holdings[b.id]?.qty || 0) - (state.holdings[a.id]?.qty || 0)
      default:       return a.name.localeCompare(b.name)
    }
  })

  const r = 11, circ = 2 * Math.PI * r, offset = circ * (countdown / UPDATE_INTERVAL)

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

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <header style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', flexWrap: 'wrap', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text)' }}>
                Fame<span style={{ color: 'var(--gold)' }}>X</span>
              </span>
              <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text3)' }}>BETA</span>
              {player && (
                <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--gold)' }}>
                  👤 {player.username}
                </span>
              )}
              {dbReady && (
                <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--green)' }}>● live</span>
              )}
              {scraping && <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--blue)' }}>📡 scraping news...</span>}
              {lastScraped && !scraping && (
                <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text3)' }}>
                  📡 live · {lastScraped.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })}
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
              {/* Price update countdown */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <svg width="24" height="24" viewBox="0 0 28 28">
                  <circle cx="14" cy="14" r={r} fill="none" stroke="var(--border)" strokeWidth="2.5"/>
                  <circle cx="14" cy="14" r={r} fill="none" stroke="var(--green)" strokeWidth="2.5"
                    strokeDasharray={circ} strokeDashoffset={circ - (circ * (countdown / UPDATE_INTERVAL))}
                    strokeLinecap="round" transform="rotate(-90 14 14)"
                    style={{ transition: 'stroke-dashoffset 1s linear' }}
                  />
                </svg>
                <div>
                  <div style={{ fontSize: 9, color: 'var(--text3)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Price</div>
                  <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--green)' }}>{countdown}s</div>
                </div>
              </div>
              {/* News scrape countdown */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <svg width="24" height="24" viewBox="0 0 28 28">
                  <circle cx="14" cy="14" r={r} fill="none" stroke="var(--border)" strokeWidth="2.5"/>
                  <circle cx="14" cy="14" r={r} fill="none" stroke="var(--blue)" strokeWidth="2.5"
                    strokeDasharray={circ} strokeDashoffset={circ - (circ * (newsCountdown / SCRAPE_INTERVAL_SECS))}
                    strokeLinecap="round" transform="rotate(-90 14 14)"
                    style={{ transition: 'stroke-dashoffset 1s linear' }}
                  />
                </svg>
                <div>
                  <div style={{ fontSize: 9, color: 'var(--text3)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>News</div>
                  <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--blue)' }}>
                    {newsCountdown >= 3600
                      ? `${Math.floor(newsCountdown / 3600)}h ${Math.floor((newsCountdown % 3600) / 60)}m`
                      : newsCountdown >= 60
                      ? `${Math.floor(newsCountdown / 60)}m ${newsCountdown % 60}s`
                      : `${newsCountdown}s`}
                  </div>
                </div>
              </div>
              {lastSaved && (
                <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text3)' }}>
                  💾 {lastSaved.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
              <button onClick={() => {
                if (confirm('Reset game? This will clear all your holdings and trophies and start fresh.')) {
                  localStorage.removeItem(SAVE_KEY)
                  localStorage.removeItem('famex_badges')
                  setState(initState())
                  setEarnedBadges([])
                  setPendingBadge(null)
                  badgeQueue.current = []
                  showToast('Game reset — good luck!', 'buy')
                }
              }} style={{ padding: '5px 10px', borderRadius: 6, fontSize: 11, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text3)', fontFamily: 'var(--font-mono)', cursor: 'pointer' }}>↺ Reset</button>
            </div>
          </div>
        </div>
        <Ticker prices={state.prices} history={state.history} active={state.active} />
      </header>

      <main style={{ flex: 1, maxWidth: 1200, margin: '0 auto', padding: '20px', width: '100%' }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
          {['market', 'portfolio', 'news', 'trophies', 'leaderboard'].map(t => (
            <button key={t} style={tabStyle(t)} onClick={() => setTab(t)}>
              {t === 'market'      ? 'Market' :
               t === 'portfolio'   ? 'My Portfolio' :
               t === 'news'        ? `Buzz Feed${state.news.filter(n=>n.real).length > 0 ? ' 📡' : ''}` :
               t === 'trophies'    ? `🏆 Trophies${earnedBadges.length > 0 ? ` (${earnedBadges.length})` : ''}` :
               `🏅 Leaderboard`}
            </button>
          ))}
        </div>

        {tab === 'market' && (
          <>
            {/* Sector filters */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
              {allSectors.map(s => <button key={s} style={filterStyle(s)} onClick={() => setSector(s)}>{s}</button>)}
            </div>

            {/* Search + Sort bar */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
              {/* Search */}
              <div style={{ position: 'relative', flex: 1, minWidth: 160 }}>
                <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: 'var(--text3)' }}>🔍</span>
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search celebrities..."
                  style={{
                    width: '100%', paddingLeft: 32, paddingRight: 10, paddingTop: 7, paddingBottom: 7,
                    background: 'var(--bg2)', border: '1px solid var(--border)',
                    borderRadius: 8, color: 'var(--text)', fontFamily: 'var(--font-mono)',
                    fontSize: 12, outline: 'none',
                  }}
                />
                {search && (
                  <button onClick={() => setSearch('')} style={{
                    position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: 14,
                  }}>✕</button>
                )}
              </div>

              {/* Sort buttons */}
              <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                <span style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--font-mono)', marginRight: 2 }}>SORT:</span>
                {[
                  { key: 'name',   label: 'A–Z' },
                  { key: 'price',  label: 'Price' },
                  { key: 'buzz',   label: 'Buzz' },
                  { key: 'change', label: '% Change' },
                  { key: 'volume', label: 'Volume' },
                  { key: 'owned',  label: 'Owned' },
                ].map(s => (
                  <button key={s.key} onClick={() => setSortBy(s.key)} style={{
                    padding: '4px 10px', borderRadius: 6, fontSize: 11,
                    fontFamily: 'var(--font-mono)', border: '1px solid',
                    borderColor: sortBy === s.key ? 'var(--gold)' : 'var(--border)',
                    background: sortBy === s.key ? 'var(--gold-bg)' : 'transparent',
                    color: sortBy === s.key ? 'var(--gold)' : 'var(--text3)',
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}>{s.label}</button>
                ))}
              </div>

              {/* Results count */}
              <span style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>
                {visibleCelebs.length} of {activeCelebs.length}
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
              {visibleCelebs.map(c => (
                <CelebCard key={c.id} celeb={c}
                  price={state.prices[c.id]} history={state.history[c.id]}
                  buzz={state.buzz[c.id]} delistWarning={state.delistWarnings[c.id] || 0}
                  holding={state.holdings[c.id] || { qty: 0, avgCost: 0 }}
                  volume={getVolume(state, c.id)}
                  onBuy={handleBuy} onSell={handleSell}
                />
              ))}
            </div>
          </>
        )}

        {tab === 'portfolio'   && <Portfolio holdings={state.holdings} prices={state.prices} activeCelebs={activeCelebs} />}
        {tab === 'news'        && <NewsFeed news={state.news} />}
        {tab === 'trophies'   && <TrophyCabinet earnedBadges={earnedBadges} />}
        {tab === 'leaderboard' && <Leaderboard currentPlayerId={player?.id} />}
      </main>

      <Toast message={toast.message} type={toast.type} onDone={() => setToast({ message: '', type: '' })} />

      {/* Badge unlock popup */}
      <BadgeUnlock newBadgeId={pendingBadge} onDone={handleBadgeDone} />

      {/* Username prompt — show if no player yet */}
      {!player && !playerLoading && (
        <UsernamePrompt onJoin={handleJoin} loading={playerLoading} />
      )}
      {playerLoading && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, color: 'var(--text)', fontFamily: 'var(--font-mono)', fontSize: 14 }}>
          ⟳ Connecting to FameX...
        </div>
      )}

      {/* Fixed admin button with warning badge */}
      <div style={{ position: 'fixed', bottom: 32, right: 32, zIndex: 999 }}>
        {activeCelebs.filter(c => (state.buzz[c.id] || 0) < 25).length > 0 && (
          <div style={{
            position: 'absolute', top: -8, right: -8,
            background: '#ff4455', color: '#fff', borderRadius: '50%',
            width: 20, height: 20, fontSize: 11, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-mono)', zIndex: 1000,
          }}>
            {activeCelebs.filter(c => (state.buzz[c.id] || 0) < 25).length}
          </div>
        )}
        <button onClick={() => setShowAdmin(true)} style={{
          padding: '12px 20px', borderRadius: 12,
          border: '2px solid #f5c842', background: '#f5c842',
          color: '#000', fontSize: 14, fontWeight: 800,
          fontFamily: 'var(--font-display)', cursor: 'pointer',
          boxShadow: '0 4px 24px rgba(245,200,66,0.4)',
          letterSpacing: '0.02em',
        }}>⚙ ADMIN</button>
      </div>

      {showAdmin && (
        <AdminPanel
          state={state}
          activeCelebs={activeCelebs}
          suggestions={suggestions}
          onAddCeleb={handleAddCeleb}
          onRemoveCeleb={handleRemoveCeleb}
          onUpdateCeleb={handleUpdateCeleb}
          onMarketEvent={handleMarketEvent}
          onDelist={handleDelist}
          onClose={() => setShowAdmin(false)}
        />
      )}
    </div>
  )
}
