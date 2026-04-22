export const CELEBRITIES = [
  { id:'tayswift',      name:'Taylor Swift',     emoji:'🎤', sector:'Music',    basePrice:420, volatility:0.935, buzzBase:88, buzzDecayRate:0.92 },
  { id:'beyonce',       name:'Beyoncé',           emoji:'👑', sector:'Music',    basePrice:380, volatility:0.930, buzzBase:85, buzzDecayRate:0.91 },
  { id:'adele',         name:'Adele',             emoji:'🎵', sector:'Music',    basePrice:290, volatility:0.925, buzzBase:78, buzzDecayRate:0.90 },
  { id:'edsheeran',     name:'Ed Sheeran',        emoji:'🎸', sector:'Music',    basePrice:260, volatility:0.928, buzzBase:75, buzzDecayRate:0.90 },
  { id:'dualipa',       name:'Dua Lipa',          emoji:'💃', sector:'Music',    basePrice:240, volatility:0.932, buzzBase:80, buzzDecayRate:0.91 },
  { id:'samsmith',      name:'Sam Smith',         emoji:'🎼', sector:'Music',    basePrice:190, volatility:0.928, buzzBase:68, buzzDecayRate:0.89 },
  { id:'tomholland',    name:'Tom Holland',       emoji:'🕷️', sector:'Film & TV', basePrice:230, volatility:0.032, buzzBase:76, buzzDecayRate:0.90 },
  { id:'emmastone',     name:'Emma Stone',        emoji:'🎬', sector:'Film & TV', basePrice:200, volatility:0.926, buzzBase:70, buzzDecayRate:0.89 },
  { id:'oliviacolman',  name:'Olivia Colman',     emoji:'🏆', sector:'Film & TV', basePrice:175, volatility:0.020, buzzBase:65, buzzDecayRate:0.88 },
  { id:'idriselba',     name:'Idris Elba',        emoji:'🎭', sector:'Film & TV', basePrice:185, volatility:0.024, buzzBase:67, buzzDecayRate:0.89 },
  { id:'judidench',     name:'Judi Dench',        emoji:'🎩', sector:'Film & TV', basePrice:160, volatility:0.016, buzzBase:62, buzzDecayRate:0.87 },
  { id:'barrykeoghan',  name:'Barry Keoghan',     emoji:'🌟', sector:'Film & TV', basePrice:145, volatility:0.038, buzzBase:64, buzzDecayRate:0.89 },
  { id:'lewishamilton', name:'Lewis Hamilton',    emoji:'🏎️', sector:'Sport',    basePrice:245, volatility:0.036, buzzBase:77, buzzDecayRate:0.90 },
  { id:'davebeckham',   name:'David Beckham',     emoji:'⚽', sector:'Sport',    basePrice:260, volatility:0.028, buzzBase:74, buzzDecayRate:0.89 },
  { id:'bukayosaka',    name:'Bukayo Saka',       emoji:'🦊', sector:'Sport',    basePrice:210, volatility:0.038, buzzBase:78, buzzDecayRate:0.90 },
  { id:'bellingham',    name:'Jude Bellingham',   emoji:'⚽', sector:'Sport',    basePrice:235, volatility:0.042, buzzBase:82, buzzDecayRate:0.91 },
  { id:'andymurray',    name:'Andy Murray',       emoji:'🎾', sector:'Sport',    basePrice:170, volatility:0.028, buzzBase:68, buzzDecayRate:0.88 },
  { id:'benstokes',     name:'Ben Stokes',        emoji:'🏏', sector:'Sport',    basePrice:155, volatility:0.024, buzzBase:65, buzzDecayRate:0.88 },
  { id:'caitlinclark',  name:'Caitlin Clark',     emoji:'🏀', sector:'Sport',    basePrice:195, volatility:0.048, buzzBase:83, buzzDecayRate:0.91 },
  { id:'maxverstappen', name:'Max Verstappen',    emoji:'🏁', sector:'Sport',    basePrice:220, volatility:0.038, buzzBase:76, buzzDecayRate:0.90 },
  { id:'keirmstarmer',  name:'Keir Starmer',      emoji:'🏛️', sector:'Politics', basePrice:140, volatility:0.048, buzzBase:80, buzzDecayRate:0.90 },
  { id:'trump',         name:'Donald Trump',      emoji:'🇺🇸', sector:'Politics', basePrice:350, volatility:0.085, buzzBase:95, buzzDecayRate:0.95 },
  { id:'albanese',      name:'Anthony Albanese',  emoji:'🇦🇺', sector:'Politics', basePrice:130, volatility:0.042, buzzBase:74, buzzDecayRate:0.89 },
  { id:'nigelfar',      name:'Nigel Farage',      emoji:'🍺', sector:'Politics', basePrice:120, volatility:0.065, buzzBase:78, buzzDecayRate:0.90 },
  { id:'princewilliam', name:'Prince William',    emoji:'🎩', sector:'Royals',   basePrice:180, volatility:0.020, buzzBase:72, buzzDecayRate:0.89 },
  { id:'harryprince',   name:'Prince Harry',      emoji:'🤴', sector:'Royals',   basePrice:155, volatility:0.055, buzzBase:82, buzzDecayRate:0.91 },
{ id:'elonmusk', name:'Elon Musk', emoji:'🚀', sector:'Tech', basePrice:310, volatility:0.075, buzzBase:92, buzzDecayRate:0.93 },
{ id:'damiansmith', name:'Damian Smith', emoji:'🎯', sector:'Tech', basePrice:150, volatility:0.03, buzzBase:65, buzzDecayRate:0.90 },
]

// Replacement celebs called up when someone is delisted
export const BENCH = [
  { id:'kyliemin',    name:'Kylie Minogue',     emoji:'💫', sector:'Music',    basePrice:180, volatility:0.028, buzzBase:72, buzzDecayRate:0.89 },
  { id:'zendaya',     name:'Zendaya',           emoji:'🌸', sector:'Film & TV',basePrice:210, volatility:0.038, buzzBase:80, buzzDecayRate:0.91 },
  { id:'rishi',       name:'Rishi Sunak',       emoji:'🇬🇧', sector:'Politics', basePrice:100, volatility:0.055, buzzBase:70, buzzDecayRate:0.89 },
  { id:'charleskoen', name:'King Charles',      emoji:'👑', sector:'Royals',   basePrice:165, volatility:0.022, buzzBase:68, buzzDecayRate:0.88 },
  { id:'timcook',     name:'Tim Cook',          emoji:'🍎', sector:'Tech',     basePrice:160, volatility:0.035, buzzBase:65, buzzDecayRate:0.88 },
  { id:'sabcarp',     name:'Sabrina Carpenter', emoji:'🎀', sector:'Music',    basePrice:195, volatility:0.042, buzzBase:82, buzzDecayRate:0.91 },
  { id:'oscarisaac',  name:'Oscar Isaac',       emoji:'🎬', sector:'Film & TV',basePrice:160, volatility:0.030, buzzBase:65, buzzDecayRate:0.88 },
  { id:'matildaman',  name:'Matilda Mann',      emoji:'🎵', sector:'Music',    basePrice:120, volatility:0.040, buzzBase:60, buzzDecayRate:0.88 },
]

export const NEWS_TEMPLATES = [
  { tmpl:(n)=>`${n} spotted at Glastonbury front row`,           buzzImpact:+18, dir:1,  pub:'The Guardian' },
  { tmpl:(n)=>`${n} breaks internet with surprise announcement`, buzzImpact:+25, dir:1,  pub:'BBC News' },
  { tmpl:(n)=>`${n} trends worldwide on social media`,           buzzImpact:+20, dir:1,  pub:'Daily Mail' },
  { tmpl:(n)=>`${n} wins prestigious award at ceremony`,         buzzImpact:+22, dir:1,  pub:'The Times' },
  { tmpl:(n)=>`${n} new project breaks all records`,             buzzImpact:+18, dir:1,  pub:'Evening Standard' },
  { tmpl:(n)=>`${n} makes surprise comeback — fans ecstatic`,    buzzImpact:+28, dir:1,  pub:'BBC News' },
  { tmpl:(n)=>`${n} rumoured for major new role`,                buzzImpact:+14, dir:1,  pub:'The Guardian' },
  { tmpl:(n)=>`${n} goes viral after candid interview`,          buzzImpact:+20, dir:1,  pub:'Financial Times' },
  { tmpl:(n)=>`${n} announces world tour — tickets sell out`,    buzzImpact:+24, dir:1,  pub:'NME' },
  { tmpl:(n)=>`${n} faces backlash over controversial comments`, buzzImpact:-12, dir:-1, pub:'Daily Mirror' },
  { tmpl:(n)=>`${n} cancels appearance citing personal reasons`, buzzImpact:-8, dir:-1, pub:'BBC News' },
  { tmpl:(n)=>`${n} embroiled in public dispute`,                buzzImpact:-10, dir:-1, pub:'The Sun' },
  { tmpl:(n)=>`Critics pan ${n}'s latest project`,               buzzImpact:-6, dir:-1, pub:'The Telegraph' },
  { tmpl:(n)=>`${n} goes quiet — fans concerned`,                buzzImpact:-4, dir:-1, pub:'Reuters' },
  { tmpl:(n)=>`${n} seen leaving controversial event`,           buzzImpact:-8, dir:-1, pub:'Daily Mail' },
]

export const SECTORS = ['All', ...new Set(CELEBRITIES.map(c => c.sector))]
export const UPDATE_INTERVAL = 60
export const STARTING_CASH = 10000

// How much each share traded moves the price (scales with sqrt of qty)
const TRADE_IMPACT = 0.0015

export function initState() {
  const prices = {}, history = {}, buzz = {}, buzzPrev = {}, holdings = {}, delistWarnings = {}
  CELEBRITIES.forEach(c => {
    prices[c.id] = c.basePrice
    history[c.id] = Array(20).fill(null).map(() => c.basePrice * (1 + (Math.random() - 0.5) * 0.06))
    buzz[c.id] = c.buzzBase + (Math.random() - 0.5) * 6
    buzzPrev[c.id] = buzz[c.id]
    holdings[c.id] = { qty: 0, avgCost: 0 }
    delistWarnings[c.id] = 0
  })
  return {
    cash: STARTING_CASH,
    prices, history, buzz, buzzPrev,
    holdings, delistWarnings,
    active: CELEBRITIES.map(c => c.id),
    benchUsed: [],
    news: [],
  }
}

function getCeleb(id, benchUsed) {
  return CELEBRITIES.find(c => c.id === id) || BENCH.find(c => c.id === id)
}

function calcPriceChange(celeb, buzz, prevBuzz) {
  const buzzRatio    = (buzz - celeb.buzzBase) / 100      // how far from base
  const buzzMomentum = (buzz - prevBuzz) / 100            // rising or falling
  const noise        = (Math.random() - 0.5) * celeb.volatility * 0.3
  return (buzzRatio * 0.50) + (buzzMomentum * 0.35) + noise
}

export function tickMarket(state) {
  const newPrices       = { ...state.prices }
  const newHistory      = { ...state.history }
  const newBuzz         = { ...state.buzz }
  const newBuzzPrev     = { ...state.buzz }   // snapshot current as previous
  const newDelist       = { ...state.delistWarnings }
  const newNews         = [...state.news]
  const newActive       = [...state.active]
  const newBenchUsed    = [...state.benchUsed]
  const newHoldings     = { ...state.holdings }
  const tooDelist       = []

  state.active.forEach(id => {
    const c = getCeleb(id)
    if (!c) return

    // 1. Buzz decays toward base
    const prev = newBuzz[id]
    let next = prev * c.buzzDecayRate + c.buzzBase * (1 - c.buzzDecayRate)
    next += (Math.random() - 0.5) * 4   // small random noise

    // 2. News event
    if (Math.random() < 0.10) {
      const tpl = NEWS_TEMPLATES[Math.floor(Math.random() * NEWS_TEMPLATES.length)]
      const now  = new Date()
      const time = now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0')
      newNews.unshift({ headline: tpl.tmpl(c.name), pub: tpl.pub, time, dir: tpl.dir, id: Date.now() + Math.random() })
      next += tpl.buzzImpact
    }

    next = Math.min(100, Math.max(0, next))
    newBuzz[id] = next

    // 3. Price update driven by buzz
    const change = calcPriceChange(c, next, prev)
    newPrices[id] = Math.max(5, newPrices[id] * (1 + change))
    newHistory[id] = [...(newHistory[id] || []).slice(-39), newPrices[id]]

    // 4. Delist warning — buzz below 15 for 3 consecutive ticks
    if (next < 15) {
      newDelist[id] = (newDelist[id] || 0) + 1
      if (newDelist[id] >= 3) tooDelist.push(id)
    } else {
      newDelist[id] = 0
    }
  })

  // 5. Process delistings + replacements
  tooDelist.forEach(id => {
    const c = getCeleb(id)
    const now  = new Date()
    const time = now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0')
    newNews.unshift({
      headline: `⚠️ ${c?.name || id} DELISTED — buzz hit zero. Shares worthless.`,
      pub: 'Celebrity Exchange', time, dir: -1, id: Date.now() + Math.random()
    })
    // Force price to 0 for delisted
    newPrices[id] = 0

    const idx = newActive.indexOf(id)
    if (idx > -1) newActive.splice(idx, 1)

    // Bring on a replacement
    const available = BENCH.filter(b => !newBenchUsed.includes(b.id))
    if (available.length > 0) {
      const rookie = available[Math.floor(Math.random() * available.length)]
      newBenchUsed.push(rookie.id)
      newActive.push(rookie.id)
      newPrices[rookie.id]  = rookie.basePrice
      newHistory[rookie.id] = Array(20).fill(null).map(() => rookie.basePrice * (1 + (Math.random() - 0.5) * 0.04))
      newBuzz[rookie.id]    = rookie.buzzBase
      newBuzzPrev[rookie.id]= rookie.buzzBase
      newDelist[rookie.id]  = 0
      newHoldings[rookie.id]= newHoldings[rookie.id] || { qty: 0, avgCost: 0 }
      newNews.unshift({
        headline: `🆕 ${rookie.name} joins Celebrity Exchange as a fresh listing!`,
        pub: 'Celebrity Exchange', time, dir: 1, id: Date.now() + Math.random() + 1
      })
    }
  })

  return {
    ...state,
    prices: newPrices, history: newHistory,
    buzz: newBuzz, buzzPrev: newBuzzPrev,
    holdings: newHoldings, delistWarnings: newDelist,
    active: newActive, benchUsed: newBenchUsed,
    news: newNews.slice(0, 60),
  }
}

/**
 * Apply trade price impact — buying nudges price up, selling nudges down.
 * Uses sqrt(qty) so large trades have diminishing impact.
 */
export function applyTradeImpact(state, id, qty, isBuy) {
  const impact   = Math.sqrt(qty) * TRADE_IMPACT * (isBuy ? 1 : -1)
  const newPrice = Math.max(5, state.prices[id] * (1 + impact))
  return {
    ...state,
    prices:  { ...state.prices,  [id]: newPrice },
    history: { ...state.history, [id]: [...(state.history[id] || []).slice(-39), newPrice] },
  }
}

/** Returns celeb objects for all currently active ids */
export function getAllCelebs(state) {
  return state.active.map(id => getCeleb(id)).filter(Boolean)
}

export function fmt(n) {
  return '$' + Math.abs(n).toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

export function fmtChange(n) {
  return (n >= 0 ? '+' : '') + n.toFixed(1) + '%'
}

export function getPriceChange(history, price) {
  if (!history || history.length < 2) return 0
  const prev = history[history.length - 2] || price
  return ((price - prev) / prev) * 100
}
