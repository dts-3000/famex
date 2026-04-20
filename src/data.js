export const CELEBRITIES = [
  { id:'tayswift', name:'Taylor Swift', emoji:'🎤', sector:'Music', basePrice:420, volatility:0.04, buzzBase:88 },
  { id:'beyonce', name:'Beyoncé', emoji:'👑', sector:'Music', basePrice:380, volatility:0.03, buzzBase:85 },
  { id:'adele', name:'Adele', emoji:'🎵', sector:'Music', basePrice:290, volatility:0.025, buzzBase:78 },
  { id:'edsheeran', name:'Ed Sheeran', emoji:'🎸', sector:'Music', basePrice:260, volatility:0.03, buzzBase:75 },
  { id:'dualipa', name:'Dua Lipa', emoji:'💃', sector:'Music', basePrice:240, volatility:0.035, buzzBase:80 },
  { id:'samsmith', name:'Sam Smith', emoji:'🎼', sector:'Music', basePrice:190, volatility:0.03, buzzBase:68 },
  { id:'tomholland', name:'Tom Holland', emoji:'🕷️', sector:'Film & TV', basePrice:230, volatility:0.035, buzzBase:76 },
  { id:'emmastone', name:'Emma Stone', emoji:'🎬', sector:'Film & TV', basePrice:200, volatility:0.028, buzzBase:70 },
  { id:'oliviacolman', name:'Olivia Colman', emoji:'🏆', sector:'Film & TV', basePrice:175, volatility:0.02, buzzBase:65 },
  { id:'idriselba', name:'Idris Elba', emoji:'🎭', sector:'Film & TV', basePrice:185, volatility:0.025, buzzBase:67 },
  { id:'judidench', name:'Judi Dench', emoji:'🎩', sector:'Film & TV', basePrice:160, volatility:0.015, buzzBase:62 },
  { id:'barrykeoghan', name:'Barry Keoghan', emoji:'🌟', sector:'Film & TV', basePrice:145, volatility:0.04, buzzBase:64 },
  { id:'lewishamilton', name:'Lewis Hamilton', emoji:'🏎️', sector:'Sport', basePrice:245, volatility:0.04, buzzBase:77 },
  { id:'davebeckham', name:'David Beckham', emoji:'⚽', sector:'Sport', basePrice:260, volatility:0.03, buzzBase:74 },
  { id:'bukayosaka', name:'Bukayo Saka', emoji:'🦊', sector:'Sport', basePrice:210, volatility:0.04, buzzBase:78 },
  { id:'bellingham', name:'Jude Bellingham', emoji:'⚽', sector:'Sport', basePrice:235, volatility:0.045, buzzBase:82 },
  { id:'andymurray', name:'Andy Murray', emoji:'🎾', sector:'Sport', basePrice:170, volatility:0.03, buzzBase:68 },
  { id:'benstokes', name:'Ben Stokes', emoji:'🏏', sector:'Sport', basePrice:155, volatility:0.025, buzzBase:65 },
  { id:'caitlinclark', name:'Caitlin Clark', emoji:'🏀', sector:'Sport', basePrice:195, volatility:0.05, buzzBase:83 },
  { id:'maxverstappen', name:'Max Verstappen', emoji:'🏁', sector:'Sport', basePrice:220, volatility:0.04, buzzBase:76 },
  { id:'keirmstarmer', name:'Keir Starmer', emoji:'🏛️', sector:'Politics', basePrice:140, volatility:0.05, buzzBase:80 },
  { id:'trump', name:'Donald Trump', emoji:'🇺🇸', sector:'Politics', basePrice:350, volatility:0.09, buzzBase:95 },
  { id:'albanese', name:'Anthony Albanese', emoji:'🇦🇺', sector:'Politics', basePrice:130, volatility:0.045, buzzBase:74 },
  { id:'nigelfar', name:'Nigel Farage', emoji:'🍺', sector:'Politics', basePrice:120, volatility:0.07, buzzBase:78 },
  { id:'princewilliam', name:'Prince William', emoji:'🎩', sector:'Royals', basePrice:180, volatility:0.02, buzzBase:72 },
  { id:'harryprince', name:'Prince Harry', emoji:'🤴', sector:'Royals', basePrice:155, volatility:0.06, buzzBase:82 },
  { id:'elonmusk', name:'Elon Musk', emoji:'🚀', sector:'Tech', basePrice:310, volatility:0.07, buzzBase:92 },
]

export const NEWS_TEMPLATES = [
  { tmpl:(n)=>`${n} spotted at Glastonbury front row`, impact:0.03, dir:1, pub:'The Guardian' },
  { tmpl:(n)=>`${n} breaks internet with surprise announcement`, impact:0.06, dir:1, pub:'BBC News' },
  { tmpl:(n)=>`${n} trends worldwide on social media`, impact:0.04, dir:1, pub:'Daily Mail' },
  { tmpl:(n)=>`${n} wins prestigious award at ceremony`, impact:0.05, dir:1, pub:'The Times' },
  { tmpl:(n)=>`${n} new project breaks all records`, impact:0.04, dir:1, pub:'Evening Standard' },
  { tmpl:(n)=>`${n} makes surprise comeback — fans ecstatic`, impact:0.07, dir:1, pub:'BBC News' },
  { tmpl:(n)=>`${n} rumoured for major new role`, impact:0.04, dir:1, pub:'The Guardian' },
  { tmpl:(n)=>`Investors pile into ${n} shares after viral moment`, impact:0.05, dir:1, pub:'Financial Times' },
  { tmpl:(n)=>`${n} faces backlash over controversial comments`, impact:0.05, dir:-1, pub:'Daily Mirror' },
  { tmpl:(n)=>`${n} cancels appearance citing personal reasons`, impact:0.04, dir:-1, pub:'BBC News' },
  { tmpl:(n)=>`${n} embroiled in public dispute`, impact:0.04, dir:-1, pub:'The Sun' },
  { tmpl:(n)=>`Critics question ${n}'s latest move`, impact:0.03, dir:-1, pub:'The Telegraph' },
  { tmpl:(n)=>`${n} shares tumble after quiet news week`, impact:0.03, dir:-1, pub:'Reuters' },
]

export const SECTORS = ['All', ...new Set(CELEBRITIES.map(c => c.sector))]

export const UPDATE_INTERVAL = 60
export const STARTING_CASH = 10000

export function initState() {
  const prices = {}, history = {}, buzz = {}, holdings = {}
  CELEBRITIES.forEach(c => {
    prices[c.id] = c.basePrice
    history[c.id] = Array(20).fill(null).map(() => c.basePrice * (1 + (Math.random() - 0.5) * 0.06))
    buzz[c.id] = c.buzzBase
    holdings[c.id] = { qty: 0, avgCost: 0 }
  })
  return { cash: STARTING_CASH, prices, history, buzz, holdings, news: [] }
}

export function tickMarket(state) {
  const newPrices = { ...state.prices }
  const newHistory = { ...state.history }
  const newBuzz = { ...state.buzz }
  const newNews = [...state.news]

  CELEBRITIES.forEach(c => {
    const drift = (Math.random() - 0.48) * c.volatility
    newPrices[c.id] = Math.max(10, newPrices[c.id] * (1 + drift))
    newHistory[c.id] = [...newHistory[c.id].slice(-39), newPrices[c.id]]
    newBuzz[c.id] = Math.min(100, Math.max(10, newBuzz[c.id] + (Math.random() - 0.5) * 6))

    if (Math.random() < 0.12) {
      const tpl = NEWS_TEMPLATES[Math.floor(Math.random() * NEWS_TEMPLATES.length)]
      const now = new Date()
      const time = now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0')
      newNews.unshift({ headline: tpl.tmpl(c.name), pub: tpl.pub, time, dir: tpl.dir, id: Date.now() + Math.random() })
      newPrices[c.id] = Math.max(10, newPrices[c.id] * (1 + tpl.impact * tpl.dir))
      newBuzz[c.id] = Math.min(100, Math.max(10, newBuzz[c.id] + tpl.dir * tpl.impact * 50))
    }
  })

  return { ...state, prices: newPrices, history: newHistory, buzz: newBuzz, news: newNews.slice(0, 50) }
}

export function fmt(n) {
  return '£' + Math.abs(n).toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

export function fmtChange(n) {
  return (n >= 0 ? '+' : '') + n.toFixed(1) + '%'
}

export function getPriceChange(history, price) {
  const prev = history[history.length - 2] || price
  return ((price - prev) / prev) * 100
}
