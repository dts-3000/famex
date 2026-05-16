// src/supabase.js — Supabase client using official REST API

const RAW_URL          = (import.meta.env.VITE_SUPABASE_URL || '')
const SUPABASE_URL      = RAW_URL.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '')
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

async function db(table, options = {}) {
  const { filter = '', method = 'GET', body, prefer } = options
  const url = `${SUPABASE_URL}/rest/v1/${table}${filter ? '?' + filter : ''}`
  
  const headers = {
    'apikey':        SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type':  'application/json',
  }
  if (prefer) headers['Prefer'] = prefer

  console.log(`[Supabase] ${method} ${url}`)

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const text = await res.text()
  if (!res.ok) throw new Error(`Supabase error: ${res.status} ${text}`)
  return text ? JSON.parse(text) : null
}

// ─── PLAYERS ─────────────────────────────────────────────────────────────────

export async function getPlayer(username) {
  const data = await db('players', { filter: `username=eq.${encodeURIComponent(username)}&select=*` })
  return data?.[0] || null
}

export async function createPlayer(username) {
  const data = await db('players', {
    method: 'POST',
    body: { username, cash: 100000 },
    prefer: 'return=representation',
  })
  return Array.isArray(data) ? data[0] : data
}

export async function updatePlayerCash(playerId, cash) {
  return db('players', {
    method:  'PATCH',
    filter:  `id=eq.${playerId}`,
    body:    { cash },
    prefer:  'return=minimal',
  })
}

export async function getOrCreatePlayer(username) {
  try {
    let player = await getPlayer(username)
    if (!player) player = await createPlayer(username)
    return player
  } catch (err) {
    console.error('getOrCreatePlayer error:', err)
    return null
  }
}

// ─── HOLDINGS ────────────────────────────────────────────────────────────────

export async function getHoldings(playerId) {
  const data = await db('holdings', { filter: `player_id=eq.${playerId}&select=*` })
  const holdings = {}
  ;(data || []).forEach(h => { holdings[h.celeb_id] = { qty: h.qty, avgCost: h.avg_cost } })
  return holdings
}

export async function upsertHolding(playerId, celebId, qty, avgCost) {
  return db('holdings', {
    method: 'POST',
    body:   { player_id: playerId, celeb_id: celebId, qty, avg_cost: avgCost },
    prefer: 'resolution=merge-duplicates,return=minimal',
  })
}

export async function deleteHolding(playerId, celebId) {
  return db('holdings', {
    method: 'DELETE',
    filter: `player_id=eq.${playerId}&celeb_id=eq.${celebId}`,
    prefer: 'return=minimal',
  })
}

// ─── MARKET ──────────────────────────────────────────────────────────────────

export async function getMarket() {
  const data = await db('market', { filter: 'select=*' })
  const market = {}
  ;(data || []).forEach(m => { market[m.celeb_id] = { price: m.price, buzz: m.buzz } })
  return market
}

export async function bulkUpsertMarket(entries) {
  if (!entries.length) return
  return db('market', {
    method: 'POST',
    body:   entries.map(e => ({ ...e, updated_at: new Date().toISOString() })),
    prefer: 'resolution=merge-duplicates,return=minimal',
  })
}

// ─── BADGES ──────────────────────────────────────────────────────────────────

export async function getBadges(playerId) {
  const data = await db('badges', { filter: `player_id=eq.${playerId}&select=badge_id` })
  return (data || []).map(b => b.badge_id)
}

export async function awardBadges(playerId, badgeIds) {
  if (!badgeIds.length) return
  return db('badges', {
    method: 'POST',
    body:   badgeIds.map(badge_id => ({ player_id: playerId, badge_id })),
    prefer: 'resolution=ignore-duplicates,return=minimal',
  })
}

// ─── LEADERBOARD ─────────────────────────────────────────────────────────────

export async function getLeaderboard() {
  const data = await db('leaderboard', { filter: 'select=*&order=total_worth.desc&limit=50' })
  return data || []
}

// ─── REALTIME ────────────────────────────────────────────────────────────────

export function subscribeToMarket(onUpdate) {
  try {
    const wsUrl = `${SUPABASE_URL.replace('https', 'wss')}/realtime/v1/websocket?apikey=${SUPABASE_ANON_KEY}&vsn=1.0.0`
    const ws = new WebSocket(wsUrl)

    ws.onopen = () => {
      ws.send(JSON.stringify({ topic: 'realtime:public:market', event: 'phx_join', payload: {}, ref: '1' }))
    }
    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data)
        if ((msg.event === 'INSERT' || msg.event === 'UPDATE') && msg.payload?.record) {
          onUpdate(msg.payload.record)
        }
      } catch {}
    }
    ws.onerror = (err) => console.warn('Realtime WS error:', err)
    return () => ws.close()
  } catch (err) {
    console.warn('Realtime setup failed:', err)
    return () => {}
  }
}
