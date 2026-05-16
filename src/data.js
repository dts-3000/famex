export const CELEBRITIES = [
  // MUSIC — typical weekly mentions in brackets
  { id:'tayswift',      name:'Taylor Swift',     emoji:'🎤', sector:'Music',    basePrice:22.00, volatility:0.035, buzzBase:48, buzzDecayRate:0.92 }, // ~200-300/wk
  { id:'beyonce',       name:'Beyoncé',           emoji:'👑', sector:'Music',    basePrice:28.00, volatility:0.030, buzzBase:42, buzzDecayRate:0.91 }, // ~100-200/wk
  { id:'adele',         name:'Adele',             emoji:'🎵', sector:'Music',    basePrice:19.00, volatility:0.025, buzzBase:32, buzzDecayRate:0.90 }, // ~20-50/wk
  { id:'edsheeran',     name:'Ed Sheeran',        emoji:'🎸', sector:'Music',    basePrice:16.00, volatility:0.028, buzzBase:30, buzzDecayRate:0.90 }, // ~20-50/wk
  { id:'dualipa',       name:'Dua Lipa',          emoji:'💃', sector:'Music',    basePrice:14.00, volatility:0.032, buzzBase:35, buzzDecayRate:0.91 }, // ~30-80/wk
  { id:'samsmith',      name:'Sam Smith',         emoji:'🎼', sector:'Music',    basePrice:13.00, volatility:0.028, buzzBase:28, buzzDecayRate:0.89 }, // ~10-30/wk
  { id:'sabcarp',       name:'Sabrina Carpenter', emoji:'🎤', sector:'Music',    basePrice:19.50, volatility:0.042, buzzBase:45, buzzDecayRate:0.91 }, // ~100-200/wk
  { id:'kyliemin',      name:'Kylie Minogue',     emoji:'💫', sector:'Music',    basePrice:18.00, volatility:0.028, buzzBase:30, buzzDecayRate:0.89 }, // ~20-50/wk
  { id:'billieeilish',  name:'Billie Eilish',     emoji:'🖤', sector:'Music',    basePrice:18.00, volatility:0.038, buzzBase:40, buzzDecayRate:0.91 }, // ~80-150/wk
  { id:'arianagrande',  name:'Ariana Grande',     emoji:'🌙', sector:'Music',    basePrice:12.00, volatility:0.035, buzzBase:38, buzzDecayRate:0.91 }, // ~40-100/wk
  { id:'justinbieber',  name:'Justin Bieber',     emoji:'🎤', sector:'Music',    basePrice:13.00, volatility:0.038, buzzBase:32, buzzDecayRate:0.90 }, // ~20-60/wk
  { id:'kanyewest',     name:'Kanye West',        emoji:'🎭', sector:'Music',    basePrice:18.00, volatility:0.095, buzzBase:38, buzzDecayRate:0.91 }, // ~50-200/wk wildly variable
  { id:'ladygaga',      name:'Lady Gaga',         emoji:'🎨', sector:'Music',    basePrice:18.00, volatility:0.035, buzzBase:36, buzzDecayRate:0.91 }, // ~30-80/wk
  { id:'nickiminaj',    name:'Nicki Minaj',       emoji:'👸', sector:'Music',    basePrice:14.00, volatility:0.055, buzzBase:34, buzzDecayRate:0.91 }, // ~30-80/wk
  { id:'badbunny',      name:'Bad Bunny',         emoji:'🐰', sector:'Music',    basePrice:17.00, volatility:0.040, buzzBase:36, buzzDecayRate:0.91 }, // ~30-80/wk
  { id:'charliexcx',    name:'Charli XCX',        emoji:'⚡', sector:'Music',    basePrice:11.00, volatility:0.045, buzzBase:32, buzzDecayRate:0.91 }, // ~20-60/wk
  { id:'kateperry',     name:'Katy Perry',        emoji:'🐰', sector:'Music',    basePrice:17.00, volatility:0.040, buzzBase:30, buzzDecayRate:0.90 }, // ~20-50/wk
  { id:'yunglean',      name:'Yung Lean',         emoji:'⚡', sector:'Music',    basePrice:11.00, volatility:0.045, buzzBase:22, buzzDecayRate:0.89 }, // ~5-15/wk

  // FILM & TV
  { id:'tomholland',    name:'Tom Holland',       emoji:'🕷️', sector:'Film & TV', basePrice:13.00, volatility:0.032, buzzBase:32, buzzDecayRate:0.90 }, // ~20-60/wk
  { id:'emmastone',     name:'Emma Stone',        emoji:'🎬', sector:'Film & TV', basePrice:20.00, volatility:0.026, buzzBase:30, buzzDecayRate:0.89 }, // ~20-50/wk
  { id:'oliviacolman',  name:'Olivia Colman',     emoji:'🏆', sector:'Film & TV', basePrice:17.50, volatility:0.020, buzzBase:28, buzzDecayRate:0.88 }, // ~10-30/wk
  { id:'idriselba',     name:'Idris Elba',        emoji:'🎭', sector:'Film & TV', basePrice:12.50, volatility:0.024, buzzBase:28, buzzDecayRate:0.89 }, // ~10-30/wk
  { id:'judidench',     name:'Judi Dench',        emoji:'🎩', sector:'Film & TV', basePrice:12.00, volatility:0.022, buzzBase:24, buzzDecayRate:0.88 }, // ~5-20/wk
  { id:'barrykeoghan',  name:'Barry Keoghan',     emoji:'🌟', sector:'Film & TV', basePrice:11.50, volatility:0.038, buzzBase:26, buzzDecayRate:0.89 }, // ~10-30/wk
  { id:'melgibson',     name:'Mel Gibson',        emoji:'🎭', sector:'Film & TV', basePrice:11.00, volatility:0.038, buzzBase:24, buzzDecayRate:0.88 }, // ~5-20/wk
  { id:'ryanreynolds',  name:'Ryan Reynolds',     emoji:'😏', sector:'Film & TV', basePrice:16.00, volatility:0.032, buzzBase:34, buzzDecayRate:0.90 }, // ~30-80/wk
  { id:'margotrobbie',  name:'Margot Robbie',     emoji:'🎬', sector:'Film & TV', basePrice:18.00, volatility:0.030, buzzBase:36, buzzDecayRate:0.91 }, // ~30-80/wk
  { id:'timothee',      name:'Timothée Chalamet', emoji:'🎭', sector:'Film & TV', basePrice:15.00, volatility:0.038, buzzBase:38, buzzDecayRate:0.91 }, // ~40-100/wk
  { id:'ryanogosling',  name:'Ryan Gosling',      emoji:'🦢', sector:'Film & TV', basePrice:17.00, volatility:0.028, buzzBase:32, buzzDecayRate:0.90 }, // ~20-60/wk
  { id:'jenniferlawrence',name:'Jennifer Lawrence',emoji:'🏹',sector:'Film & TV', basePrice:14.00, volatility:0.028, buzzBase:28, buzzDecayRate:0.90 }, // ~10-30/wk
  { id:'leonardodicap', name:'Leonardo DiCaprio', emoji:'🎥', sector:'Film & TV', basePrice:20.00, volatility:0.025, buzzBase:32, buzzDecayRate:0.90 }, // ~20-60/wk
  { id:'dwaynejo',      name:'Dwayne Johnson',    emoji:'💪', sector:'Film & TV', basePrice:12.00, volatility:0.035, buzzBase:36, buzzDecayRate:0.91 }, // ~30-80/wk
  { id:'willsmith',     name:'Will Smith',        emoji:'👋', sector:'Film & TV', basePrice:12.00, volatility:0.065, buzzBase:30, buzzDecayRate:0.90 }, // ~20-60/wk
  { id:'nicolekidman',  name:'Nicole Kidman',     emoji:'🌺', sector:'Film & TV', basePrice:12.00, volatility:0.022, buzzBase:28, buzzDecayRate:0.89 }, // ~10-30/wk
  { id:'chrishemsworth',name:'Chris Hemsworth',   emoji:'⚡', sector:'Film & TV', basePrice:21.00, volatility:0.030, buzzBase:32, buzzDecayRate:0.90 }, // ~20-50/wk
  { id:'cateblanchett', name:'Cate Blanchett',    emoji:'🏆', sector:'Film & TV', basePrice:14.00, volatility:0.022, buzzBase:28, buzzDecayRate:0.89 }, // ~10-30/wk
  { id:'merylstreep',   name:'Meryl Streep',      emoji:'🎭', sector:'Film & TV', basePrice:12.00, volatility:0.018, buzzBase:24, buzzDecayRate:0.88 }, // ~5-20/wk
  { id:'bradpitt',      name:'Brad Pitt',         emoji:'😎', sector:'Film & TV', basePrice:26.00, volatility:0.035, buzzBase:36, buzzDecayRate:0.90 }, // ~30-80/wk
  { id:'angelinajolie', name:'Angelina Jolie',    emoji:'🌺', sector:'Film & TV', basePrice:25.00, volatility:0.032, buzzBase:34, buzzDecayRate:0.90 }, // ~20-60/wk
  { id:'scarjo',        name:'Scarlett Johansson',emoji:'⚡', sector:'Film & TV', basePrice:27.00, volatility:0.030, buzzBase:34, buzzDecayRate:0.90 }, // ~20-60/wk
  { id:'chrisevans',    name:'Chris Evans',       emoji:'🛡️', sector:'Film & TV', basePrice:15.00, volatility:0.030, buzzBase:28, buzzDecayRate:0.90 }, // ~10-30/wk
  { id:'robertdowney',  name:'Robert Downey Jr',  emoji:'🦾', sector:'Film & TV', basePrice:18.00, volatility:0.035, buzzBase:30, buzzDecayRate:0.89 }, // ~20-50/wk
  { id:'annehathaway',  name:'Anne Hathaway',     emoji:'👒', sector:'Film & TV', basePrice:12.00, volatility:0.026, buzzBase:26, buzzDecayRate:0.89 }, // ~10-20/wk
  { id:'reesewitherspoon',name:'Reese Witherspoon',emoji:'🌸',sector:'Film & TV', basePrice:11.00, volatility:0.025, buzzBase:24, buzzDecayRate:0.89 }, // ~5-20/wk
  { id:'keanugreeves',  name:'Keanu Reeves',      emoji:'🕶️', sector:'Film & TV', basePrice:14.00, volatility:0.025, buzzBase:26, buzzDecayRate:0.90 }, // ~10-30/wk

  // SPORT
  { id:'lewishamilton', name:'Lewis Hamilton',    emoji:'🏎️', sector:'Sport',    basePrice:21.50, volatility:0.036, buzzBase:40, buzzDecayRate:0.90 }, // ~80-150/wk during season
  { id:'davebeckham',   name:'David Beckham',     emoji:'⚽', sector:'Sport',    basePrice:21.00, volatility:0.028, buzzBase:36, buzzDecayRate:0.89 }, // ~50-100/wk
  { id:'bukayosaka',    name:'Bukayo Saka',       emoji:'🦊', sector:'Sport',    basePrice:21.00, volatility:0.038, buzzBase:38, buzzDecayRate:0.90 }, // ~50-150/wk
  { id:'bellingham',    name:'Jude Bellingham',   emoji:'⚽', sector:'Sport',    basePrice:23.50, volatility:0.042, buzzBase:40, buzzDecayRate:0.91 }, // ~50-150/wk
  { id:'andymurray',    name:'Andy Murray',       emoji:'🎾', sector:'Sport',    basePrice:17.00, volatility:0.028, buzzBase:22, buzzDecayRate:0.88 }, // ~3-20/wk retired
  { id:'benstokes',     name:'Ben Stokes',        emoji:'🏏', sector:'Sport',    basePrice:12.50, volatility:0.024, buzzBase:28, buzzDecayRate:0.88 }, // ~10-40/wk
  { id:'caitlinclark',  name:'Caitlin Clark',     emoji:'🏀', sector:'Sport',    basePrice:19.50, volatility:0.048, buzzBase:42, buzzDecayRate:0.91 }, // ~80-150/wk in season
  { id:'maxverstappen', name:'Max Verstappen',    emoji:'🏁', sector:'Sport',    basePrice:22.00, volatility:0.038, buzzBase:38, buzzDecayRate:0.90 }, // ~50-120/wk
  { id:'cristianoron',  name:'Cristiano Ronaldo', emoji:'⚽', sector:'Sport',    basePrice:18.00, volatility:0.045, buzzBase:44, buzzDecayRate:0.92 }, // ~100-200/wk
  { id:'leomessi',      name:'Lionel Messi',      emoji:'🐐', sector:'Sport',    basePrice:16.00, volatility:0.040, buzzBase:44, buzzDecayRate:0.92 }, // ~100-200/wk
  { id:'lebron',        name:'LeBron James',      emoji:'👑', sector:'Sport',    basePrice:15.00, volatility:0.042, buzzBase:42, buzzDecayRate:0.92 }, // ~80-200/wk in season
  { id:'usainbolt',     name:'Usain Bolt',        emoji:'⚡', sector:'Sport',    basePrice:12.00, volatility:0.022, buzzBase:20, buzzDecayRate:0.89 }, // ~5-15/wk retired
  { id:'tigerwoods',    name:'Tiger Woods',       emoji:'⛳', sector:'Sport',    basePrice:14.00, volatility:0.038, buzzBase:28, buzzDecayRate:0.89 }, // ~20-60/wk
  { id:'neymar',        name:'Neymar',            emoji:'🇧🇷', sector:'Sport',    basePrice:16.00, volatility:0.048, buzzBase:34, buzzDecayRate:0.90 }, // ~30-80/wk
  { id:'rogerfederer',  name:'Roger Federer',     emoji:'🎾', sector:'Sport',    basePrice:15.00, volatility:0.022, buzzBase:24, buzzDecayRate:0.89 }, // ~10-30/wk retired
  { id:'neymarjr',      name:'Kylian Mbappé',     emoji:'⚡', sector:'Sport',    basePrice:24.00, volatility:0.045, buzzBase:44, buzzDecayRate:0.92 }, // ~100-200/wk
  { id:'erling',        name:'Erling Haaland',    emoji:'🎯', sector:'Sport',    basePrice:22.00, volatility:0.042, buzzBase:40, buzzDecayRate:0.91 }, // ~80-150/wk
  { id:'anthonyjoshua', name:'Anthony Joshua',    emoji:'🥊', sector:'Sport',    basePrice:22.00, volatility:0.048, buzzBase:30, buzzDecayRate:0.90 }, // ~20-60/wk
  { id:'tysonfury',     name:'Tyson Fury',        emoji:'👊', sector:'Sport',    basePrice:24.00, volatility:0.055, buzzBase:32, buzzDecayRate:0.90 }, // ~20-80/wk
  { id:'stephanicurry', name:'Stephen Curry',     emoji:'🏀', sector:'Sport',    basePrice:26.00, volatility:0.038, buzzBase:38, buzzDecayRate:0.90 }, // ~50-120/wk in season
  { id:'nickdaicos',    name:'Nick Daicos',       emoji:'🎯', sector:'Sport',    basePrice:15.00, volatility:0.035, buzzBase:26, buzzDecayRate:0.89 }, // ~10-30/wk AFL season
  { id:'baileysmith',   name:'Bailey Smith',      emoji:'🏈', sector:'Sport',    basePrice:15.00, volatility:0.035, buzzBase:22, buzzDecayRate:0.88 }, // ~5-20/wk AFL season

  // POLITICS
  { id:'trump',         name:'Donald Trump',      emoji:'🇺🇸', sector:'Politics', basePrice:35.00, volatility:0.085, buzzBase:60, buzzDecayRate:0.95 }, // ~3000-6000/wk always
  { id:'keirmstarmer',  name:'Keir Starmer',      emoji:'🏛️', sector:'Politics', basePrice:14.00, volatility:0.048, buzzBase:48, buzzDecayRate:0.90 }, // ~300-600/wk
  { id:'albanese',      name:'Anthony Albanese',  emoji:'🇦🇺', sector:'Politics', basePrice:13.00, volatility:0.042, buzzBase:38, buzzDecayRate:0.89 }, // ~50-150/wk
  { id:'nigelfar',      name:'Nigel Farage',      emoji:'🍺', sector:'Politics', basePrice:12.00, volatility:0.065, buzzBase:42, buzzDecayRate:0.90 }, // ~100-300/wk
  { id:'volodymyrzel',  name:'Volodymyr Zelensky',emoji:'🇺🇦', sector:'Politics', basePrice:18.00, volatility:0.070, buzzBase:44, buzzDecayRate:0.91 }, // ~100-300/wk
  { id:'vladiputin',    name:'Vladimir Putin',    emoji:'🐻', sector:'Politics', basePrice:16.00, volatility:0.060, buzzBase:44, buzzDecayRate:0.91 }, // ~100-300/wk
  { id:'xi',            name:'Xi Jinping',        emoji:'🇨🇳', sector:'Politics', basePrice:15.00, volatility:0.055, buzzBase:38, buzzDecayRate:0.90 }, // ~50-150/wk

  // ROYALS
  { id:'princewilliam', name:'Prince William',    emoji:'🎩', sector:'Royals',   basePrice:18.00, volatility:0.020, buzzBase:38, buzzDecayRate:0.89 }, // ~100-200/wk
  { id:'harryprince',   name:'Prince Harry',      emoji:'🤴', sector:'Royals',   basePrice:15.50, volatility:0.055, buzzBase:42, buzzDecayRate:0.91 }, // ~80-200/wk always drama
  { id:'charleskoen',   name:'King Charles',      emoji:'👑', sector:'Royals',   basePrice:16.50, volatility:0.022, buzzBase:36, buzzDecayRate:0.88 }, // ~50-150/wk
  { id:'meghanmarkle',  name:'Meghan Markle',     emoji:'🌻', sector:'Royals',   basePrice:18.00, volatility:0.058, buzzBase:40, buzzDecayRate:0.91 }, // ~80-200/wk
  { id:'princgeorge',   name:'Princess Catherine',emoji:'👸', sector:'Royals',   basePrice:20.00, volatility:0.022, buzzBase:36, buzzDecayRate:0.89 }, // ~50-150/wk
  { id:'queencamilla',  name:'Queen Camilla',     emoji:'👑', sector:'Royals',   basePrice:14.00, volatility:0.018, buzzBase:26, buzzDecayRate:0.88 }, // ~10-40/wk
  { id:'princeandrw',   name:'Prince Andrew',     emoji:'🎖️', sector:'Royals',   basePrice:10.00, volatility:0.060, buzzBase:24, buzzDecayRate:0.88 }, // ~10-40/wk
  { id:'princeedward',  name:'Prince Edward',     emoji:'🎩', sector:'Royals',   basePrice:12.00, volatility:0.015, buzzBase:20, buzzDecayRate:0.87 }, // ~5-15/wk
  { id:'princessanne',  name:'Princess Anne',     emoji:'🐴', sector:'Royals',   basePrice:13.00, volatility:0.015, buzzBase:22, buzzDecayRate:0.88 }, // ~5-20/wk

  // TECH
  { id:'elonmusk',      name:'Elon Musk',         emoji:'🚀', sector:'Tech',     basePrice:31.00, volatility:0.075, buzzBase:55, buzzDecayRate:0.93 }, // ~400-700/wk
  { id:'samaltman',     name:'Sam Altman',        emoji:'🤯', sector:'Tech',     basePrice:22.00, volatility:0.070, buzzBase:46, buzzDecayRate:0.91 }, // ~150-300/wk
  { id:'markzuckerberg',name:'Mark Zuckerberg',   emoji:'🤖', sector:'Tech',     basePrice:26.00, volatility:0.065, buzzBase:44, buzzDecayRate:0.91 }, // ~100-200/wk
  { id:'jeffbezos',     name:'Jeff Bezos',        emoji:'📦', sector:'Tech',     basePrice:28.00, volatility:0.060, buzzBase:40, buzzDecayRate:0.91 }, // ~80-150/wk
  { id:'billgates',     name:'Bill Gates',        emoji:'💻', sector:'Tech',     basePrice:24.00, volatility:0.040, buzzBase:36, buzzDecayRate:0.90 }, // ~50-100/wk
  { id:'timcook',       name:'Tim Cook',          emoji:'🍎', sector:'Tech',     basePrice:16.00, volatility:0.035, buzzBase:30, buzzDecayRate:0.88 }, // ~20-60/wk
  { id:'paloalto',      name:'Jensen Huang',      emoji:'💻', sector:'Tech',     basePrice:20.00, volatility:0.065, buzzBase:36, buzzDecayRate:0.89 }, // ~50-150/wk AI boom
  { id:'jackdorsey',    name:'Jack Dorsey',       emoji:'🐦', sector:'Tech',     basePrice:16.00, volatility:0.045, buzzBase:26, buzzDecayRate:0.89 }, // ~10-40/wk
  { id:'serjobrin',     name:'Sergey Brin',       emoji:'🔍', sector:'Tech',     basePrice:18.00, volatility:0.040, buzzBase:22, buzzDecayRate:0.88 }, // ~5-20/wk
]

// Replacement celebs called up when someone is delisted
export const BENCH = [
  { id:'zendaya',    name:'Zendaya',      emoji:'🌸', sector:'Film & TV', basePrice:21.00, volatility:0.038, buzzBase:80, buzzDecayRate:0.91 },
  { id:'oscarisaac', name:'Oscar Isaac',  emoji:'🎬', sector:'Film & TV', basePrice:16.00, volatility:0.030, buzzBase:65, buzzDecayRate:0.88 },
  { id:'matildaman', name:'Matilda Mann', emoji:'🎵', sector:'Music',     basePrice:12.00, volatility:0.040, buzzBase:60, buzzDecayRate:0.88 },
]

export const SECTORS = ['All', ...new Set(CELEBRITIES.map(c => c.sector))]
export const UPDATE_INTERVAL = 10       // 10 second ticks — faster, smaller moves
export const STARTING_CASH = 100000

// Price impact constants
const TRADE_IMPACT    = 0.0008         // Smaller per-trade impact (was 0.0015)
const VOLUME_WINDOW   = 60             // Look back 60 seconds for volume
const VOLUME_IMPACT   = 0.12          // How much volume affects price (15% of total move)
const BUZZ_WEIGHT     = 0.50          // Buzz level vs base
const MOMENTUM_WEIGHT = 0.25          // Buzz rising/falling
const VOLUME_WEIGHT   = 0.15          // Trade volume pressure
const NOISE_WEIGHT    = 0.10          // Random noise

export function initState() {
  const prices = {}, history = {}, buzz = {}, buzzPrev = {}, holdings = {}, delistWarnings = {}, volume = {}
  CELEBRITIES.forEach(c => {
    prices[c.id]         = c.basePrice
    history[c.id]        = Array(20).fill(null).map(() => c.basePrice * (1 + (Math.random() - 0.5) * 0.06))
    buzz[c.id]           = c.buzzBase + (Math.random() - 0.5) * 6
    buzzPrev[c.id]       = buzz[c.id]
    holdings[c.id]       = { qty: 0, avgCost: 0 }
    delistWarnings[c.id] = 0
    volume[c.id]         = []   // Array of { qty, isBuy, time }
  })
  return {
    cash: STARTING_CASH,
    prices, history, buzz, buzzPrev,
    holdings, delistWarnings, volume,
    active: CELEBRITIES.map(c => c.id),
    benchUsed: [],
    news: [],
  }
}

function getCeleb(id) {
  return CELEBRITIES.find(c => c.id === id) || BENCH.find(c => c.id === id)
}

/**
 * Calculate net volume pressure from recent trades
 * Returns value between -1 (all selling) and +1 (all buying)
 */
function calcVolumePressure(trades, now) {
  const recent = trades.filter(t => now - t.time < VOLUME_WINDOW * 1000)
  if (!recent.length) return 0
  const netQty = recent.reduce((s, t) => s + (t.isBuy ? t.qty : -t.qty), 0)
  const totalQty = recent.reduce((s, t) => s + t.qty, 0)
  return totalQty > 0 ? (netQty / totalQty) : 0  // -1 to +1
}

/**
 * Combined price change formula:
 * buzz(50%) + momentum(25%) + volume(15%) + noise(10%)
 * Smaller moves per tick since ticks are faster (10s vs 30s)
 */
function calcPriceChange(celeb, buzz, prevBuzz, volumePressure) {
  const buzzRatio    = (buzz - celeb.buzzBase) / 100
  const buzzMomentum = (buzz - prevBuzz) / 100
  const noise        = (Math.random() - 0.5) * celeb.volatility * 0.15  // smaller noise
  return (
    buzzRatio       * BUZZ_WEIGHT     +
    buzzMomentum    * MOMENTUM_WEIGHT +
    volumePressure  * VOLUME_IMPACT * VOLUME_WEIGHT +
    noise           * NOISE_WEIGHT
  ) * 0.4  // scale down — faster ticks = smaller moves per tick
}

export function tickMarket(state) {
  const newPrices    = { ...state.prices }
  const newHistory   = { ...state.history }
  const newBuzz      = { ...state.buzz }
  const newBuzzPrev  = { ...state.buzz }
  const newNews      = [...state.news]
  const newHoldings  = { ...state.holdings }
  const newVolume    = { ...state.volume }
  const now          = Date.now()

  state.active.forEach(id => {
    const c = getCeleb(id)
    if (!c) return

    // Buzz stays fixed between news scrapes — only changes when scraper runs
    const prev = newBuzz[id]
    const next = prev  // no decay!

    // 2. Calculate volume pressure from recent trades
    const trades = newVolume[id] || []
    const volumePressure = calcVolumePressure(trades, now)

    // 3. Prune old trades outside window
    newVolume[id] = trades.filter(t => now - t.time < VOLUME_WINDOW * 1000)

    // 4. Price change — buzz + momentum + volume + noise
    const change = calcPriceChange(c, next, prev, volumePressure)
    newPrices[id] = Math.max(0.10, newPrices[id] * (1 + change))
    newHistory[id] = [...(newHistory[id] || []).slice(-79), newPrices[id]]
  })

  return {
    ...state,
    prices: newPrices, history: newHistory,
    buzz: newBuzz, buzzPrev: newBuzzPrev,
    holdings: newHoldings,
    volume: newVolume,
    active: state.active, benchUsed: state.benchUsed,
    news: newNews.slice(0, 60),
  }
}

/**
 * Apply trade price impact + record volume
 * Smaller immediate impact since volume builds pressure over time
 */
export function applyTradeImpact(state, id, qty, isBuy) {
  const impact   = Math.sqrt(qty) * TRADE_IMPACT * (isBuy ? 1 : -1)
  const newPrice = Math.max(0.10, state.prices[id] * (1 + impact))
  const newVolume = {
    ...state.volume,
    [id]: [...(state.volume[id] || []), { qty, isBuy, time: Date.now() }]
  }
  return {
    ...state,
    prices:  { ...state.prices,  [id]: newPrice },
    history: { ...state.history, [id]: [...(state.history[id] || []).slice(-79), newPrice] },
    volume:  newVolume,
  }
}

/** Returns total buy/sell volume for a celeb in last 60s */
export function getVolume(state, id) {
  const now    = Date.now()
  const trades = (state.volume?.[id] || []).filter(t => now - t.time < 60000)
  const buys   = trades.filter(t => t.isBuy).reduce((s, t) => s + t.qty, 0)
  const sells  = trades.filter(t => !t.isBuy).reduce((s, t) => s + t.qty, 0)
  return { buys, sells, total: buys + sells }
}

/** Manually delist a celeb and optionally bring on a replacement */
export function manualDelist(state, id, addReplacement = true) {
  const c = getCeleb(id)
  const time = new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })
  const newPrices    = { ...state.prices,    [id]: 0 }
  const newActive    = state.active.filter(a => a !== id)
  const newBenchUsed = [...state.benchUsed]
  const newHistory   = { ...state.history }
  const newBuzz      = { ...state.buzz }
  const newBuzzPrev  = { ...state.buzzPrev }
  const newDelist    = { ...state.delistWarnings, [id]: 0 }
  const newVolume    = { ...state.volume }
  const newHoldings  = { ...state.holdings }
  const newNews      = [
    { headline: `⚠️ ${c?.name || id} has been DELISTED from FameX`, pub: 'FameX Admin', time, dir: -1, id: Date.now() },
    ...state.news
  ]

  let rookie = null
  if (addReplacement) {
    const available = BENCH.filter(b => !newBenchUsed.includes(b.id))
    if (available.length > 0) {
      rookie = available[Math.floor(Math.random() * available.length)]
      newBenchUsed.push(rookie.id)
      newActive.push(rookie.id)
      newPrices[rookie.id]   = rookie.basePrice
      newHistory[rookie.id]  = Array(20).fill(null).map(() => rookie.basePrice * (1 + (Math.random() - 0.5) * 0.04))
      newBuzz[rookie.id]     = rookie.buzzBase
      newBuzzPrev[rookie.id] = rookie.buzzBase
      newDelist[rookie.id]   = 0
      newVolume[rookie.id]   = []
      newHoldings[rookie.id] = newHoldings[rookie.id] || { qty: 0, avgCost: 0 }
      newNews.unshift({ headline: `🆕 ${rookie.name} joins FameX!`, pub: 'FameX', time, dir: 1, id: Date.now() + 1 })
    }
  }

  return {
    ...state,
    prices: newPrices, active: newActive, benchUsed: newBenchUsed,
    history: newHistory, buzz: newBuzz, buzzPrev: newBuzzPrev,
    delistWarnings: newDelist, volume: newVolume, holdings: newHoldings,
    news: newNews.slice(0, 60),
  }
}

export function getAllCelebs(state) {
  return state.active.map(id => getCeleb(id)).filter(Boolean)
}

export function fmt(n) {
  return '$' + Math.abs(n).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function fmtChange(n) {
  return (n >= 0 ? '+' : '') + n.toFixed(1) + '%'
}

export function getPriceChange(history, price) {
  if (!history || history.length < 2) return 0
  const prev = history[history.length - 2] || price
  return ((price - prev) / prev) * 100
}
