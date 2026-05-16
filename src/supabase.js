// src/supabase.js — Supabase client and all database operations

const SUPABASE_URL     = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

// Lightweight fetch-based Supabase client (no SDK needed)
async function supabase(path, options = {}) {
  const url = `${SUPABASE_URL}/rest/v1/${path}`
  const res = await fetch(url, {
    headers: {
      'apikey':        SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type':  'application/json',
      'Prefer':        options.prefer || 'return=representation',
      ...options.headers,
    },
    ...options,
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Supabase error: ${res.status} ${err}`)
  }
  const text = await res.text()
  return text ? JSON.parse(text) : null
}

// ─── PLAYERS ─────────────────────────────────────────────────────────────────

export async function getPlayer(username) {
  const data = await supabase(`players?username=eq.${encodeURIComponent(username)}&select=*`)
  return data?.[0] || null
}

export async function createPlayer(username) {
  const data = await supabase('players', {
    method: 'POST',
    body: JSON.stringify({ username, cash: 100000 }),
  })
  return data?.[0] || null
}

export async function updatePlayerCash(playerId, cash) {
  return supabase(`players?id=eq.${playerId}`, {
    method: 'PATCH',
    body: JSON.stringify({ cash }),
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
  const data = await supabase(`holdings?player_id=eq.${playerId}&select=*`)
  // Convert array to object keyed by celeb_id
  const holdings = {}
  ;(data || []).forEach(h => {
    holdings[h.celeb_id] = { qty: h.qty, avgCost: h.avg_cost }
  })
  return holdings
}

export async function upsertHolding(playerId, celebId, qty, avgCost) {
  return supabase('holdings', {
    method: 'POST',
    prefer: 'resolution=merge-duplicates,return=representation',
    headers: { 'Prefer': 'resolution=merge-duplicates,return=representation' },
    body: JSON.stringify({
      player_id: playerId,
      celeb_id:  celebId,
      qty,
      avg_cost:  avgCost,
    }),
  })
}

export async function deleteHolding(playerId, celebId) {
  return supabase(`holdings?player_id=eq.${playerId}&celeb_id=eq.${celebId}`, {
    method: 'DELETE',
    prefer: 'return=minimal',
  })
}

// ─── MARKET ──────────────────────────────────────────────────────────────────

export async function getMarket() {
  const data = await supabase('market?select=*')
  const market = {}
  ;(data || []).forEach(m => {
    market[m.celeb_id] = { price: m.price, buzz: m.buzz, prevPrice: m.prev_price }
  })
  return market
}

export async function upsertMarketPrice(celebId, price, buzz, prevPrice) {
  return supabase('market', {
    method: 'POST',
    headers: { 'Prefer': 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify({
      celeb_id:   celebId,
      price,
      buzz,
      prev_price: prevPrice,
      updated_at: new Date().toISOString(),
    }),
  })
}

export async function bulkUpsertMarket(entries) {
  // entries = [{ celeb_id, price, buzz, prev_price }]
  return supabase('market', {
    method: 'POST',
    headers: { 'Prefer': 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify(entries.map(e => ({
      ...e,
      updated_at: new Date().toISOString(),
    }))),
  })
}

// ─── BADGES ──────────────────────────────────────────────────────────────────

export async function getBadges(playerId) {
  const data = await supabase(`badges?player_id=eq.${playerId}&select=badge_id`)
  return (data || []).map(b => b.badge_id)
}

export async function awardBadge(playerId, badgeId) {
  try {
    await supabase('badges', {
      method: 'POST',
      headers: { 'Prefer': 'resolution=ignore-duplicates,return=minimal' },
      body: JSON.stringify({ player_id: playerId, badge_id: badgeId }),
    })
  } catch (err) {
    // Ignore duplicate badge errors
    console.warn('Badge already awarded:', badgeId)
  }
}

export async function awardBadges(playerId, badgeIds) {
  if (!badgeIds.length) return
  return supabase('badges', {
    method: 'POST',
    headers: { 'Prefer': 'resolution=ignore-duplicates,return=minimal' },
    body: JSON.stringify(badgeIds.map(badge_id => ({ player_id: playerId, badge_id }))),
  })
}

// ─── LEADERBOARD ─────────────────────────────────────────────────────────────

export async function getLeaderboard() {
  const data = await supabase('leaderboard?select=*&order=total_worth.desc&limit=50')
  return data || []
}

// ─── REALTIME ────────────────────────────────────────────────────────────────

export function subscribeToMarket(onUpdate) {
  const ws = new WebSocket(
    `${SUPABASE_URL.replace('https', 'wss')}/realtime/v1/websocket?apikey=${SUPABASE_ANON_KEY}&vsn=1.0.0`
  )

  ws.onopen = () => {
    ws.send(JSON.stringify({
      topic: 'realtime:public:market',
      event: 'phx_join',
      payload: {},
      ref: '1',
    }))
  }

  ws.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data)
      if (msg.event === 'INSERT' || msg.event === 'UPDATE') {
        onUpdate(msg.payload?.record)
      }
    } catch {}
  }

  ws.onerror = (err) => console.warn('Realtime WS error:', err)

  return () => ws.close()
}
