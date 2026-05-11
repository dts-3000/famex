// src/badges.js — Badge definitions and unlock checker

export const BADGES = [
  // First steps
  { id: 'first_trade',    emoji: '🥉', name: 'First Trade',      desc: 'Made your first buy',                     category: 'Trading' },
  { id: 'day_trader',     emoji: '🔄', name: 'Day Trader',       desc: 'Made 10 trades in one session',           category: 'Trading' },
  { id: 'sharp_shooter',  emoji: '🎯', name: 'Sharp Shooter',    desc: 'Sold a stock at 25%+ profit',             category: 'Trading' },
  { id: 'diamond_hands',  emoji: '💎', name: 'Diamond Hands',    desc: 'Held a stock for 10+ market ticks',       category: 'Trading' },
  { id: 'bull',           emoji: '📈', name: 'Bull',             desc: 'Portfolio up 10%',                        category: 'Trading' },
  { id: 'raging_bull',    emoji: '🐂', name: 'Raging Bull',      desc: 'Portfolio up 50%',                        category: 'Trading' },

  // Celebrity
  { id: 'royalist',       emoji: '👑', name: 'Royalist',         desc: 'Owns shares in all Royals',               category: 'Celebrity' },
  { id: 'music_mogul',    emoji: '🎵', name: 'Music Mogul',      desc: 'Owns shares in 5+ Music celebs',          category: 'Celebrity' },
  { id: 'sports_fan',     emoji: '⚽', name: 'Sports Fan',       desc: 'Owns shares in 5+ Sport celebs',          category: 'Celebrity' },
  { id: 'political_animal',emoji: '🏛️',name: 'Political Animal', desc: 'Owns shares in all Politics celebs',      category: 'Celebrity' },
  { id: 'a_lister',       emoji: '🌟', name: 'A-Lister',         desc: 'Owns Taylor Swift, Beyoncé AND Trump',    category: 'Celebrity' },

  // Risk
  { id: 'gambler',        emoji: '🎲', name: 'Gambler',          desc: 'Bought a celeb with buzz below 20',       category: 'Risk' },
  { id: 'degen',          emoji: '💥', name: 'Degen',            desc: 'Lost 50% of starting cash',               category: 'Risk' },
  { id: 'bag_holder',     emoji: '📉', name: 'Bag Holder',       desc: 'Still holding after a Crash event',       category: 'Risk' },
  { id: 'rekt',           emoji: '☠️', name: 'Rekt',             desc: 'Owned shares in a delisted celeb',        category: 'Risk' },

  // Wealth ladder
  { id: 'penny_pincher',  emoji: '🪙', name: 'Penny Pincher',    desc: 'Total worth $5,000',                      category: 'Wealth' },
  { id: 'high_roller',    emoji: '💵', name: 'High Roller',      desc: 'Total worth $10,000',                     category: 'Wealth' },
  { id: 'broker',         emoji: '💼', name: 'Broker',           desc: 'Total worth $50,000',                     category: 'Wealth' },
  { id: 'property_dev',   emoji: '🏠', name: 'Property Developer',desc: 'Total worth $100,000',                   category: 'Wealth' },
  { id: 'fat_cat',        emoji: '🚗', name: 'Fat Cat',          desc: 'Total worth $250,000',                    category: 'Wealth' },
  { id: 'yacht_club',     emoji: '🛥️', name: 'Yacht Club',       desc: 'Total worth $500,000',                    category: 'Wealth' },
  { id: 'millionaire',    emoji: '🌟', name: 'Millionaire',      desc: 'Total worth $1,000,000',                  category: 'Wealth' },
  { id: 'jet_setter',     emoji: '✈️', name: 'Jet Setter',       desc: 'Total worth $5,000,000',                  category: 'Wealth' },
  { id: 'island_owner',   emoji: '🏝️', name: 'Island Owner',     desc: 'Total worth $10,000,000',                 category: 'Wealth' },
  { id: 'tycoon',         emoji: '🚀', name: 'Tycoon',           desc: 'Total worth $50,000,000',                 category: 'Wealth' },
  { id: 'billionaire',    emoji: '💎', name: 'Billionaire',      desc: 'Total worth $1,000,000,000',              category: 'Wealth' },
  { id: 'trillionaire',   emoji: '🌍', name: 'Trillionaire',     desc: 'Total worth $1,000,000,000,000',          category: 'Wealth' },
  { id: 'god_mode',       emoji: '👑', name: 'God Mode',         desc: 'Total worth $1,000,000,000,000,000',      category: 'Wealth' },
  { id: 'galaxy_brain',   emoji: '🌌', name: 'Galaxy Brain',     desc: 'Total worth $1 Quadrillion',              category: 'Wealth' },
  { id: 'market_destroyer',emoji:'💀', name: 'Market Destroyer', desc: 'You broke the game',                      category: 'Wealth' },

  // Loyalty
  { id: 'early_bird',     emoji: '🌅', name: 'Early Bird',       desc: 'Visited 3 days in a row',                 category: 'Loyalty' },
  { id: 'famex_og',       emoji: '🏆', name: 'FameX OG',         desc: 'One of the first players',                category: 'Loyalty' },
]

const WEALTH_THRESHOLDS = [
  ['penny_pincher',   5_000],
  ['high_roller',     10_000],
  ['broker',          50_000],
  ['property_dev',    100_000],
  ['fat_cat',         250_000],
  ['yacht_club',      500_000],
  ['millionaire',     1_000_000],
  ['jet_setter',      5_000_000],
  ['island_owner',    10_000_000],
  ['tycoon',          50_000_000],
  ['billionaire',     1_000_000_000],
  ['trillionaire',    1_000_000_000_000],
  ['god_mode',        1_000_000_000_000_000],
  ['galaxy_brain',    1_000_000_000_000_000_000],
  ['market_destroyer',Infinity],
]

export function checkBadges(state, prevBadges = [], meta = {}) {
  const earned = new Set(prevBadges)
  const newlyEarned = []

  const totalWorth = state.cash + Object.entries(state.holdings)
    .reduce((s, [id, h]) => s + (state.prices[id] || 0) * h.qty, 0)

  const portfolioPct = ((totalWorth - 1000) / 1000) * 100

  const holdingCelebs = Object.entries(state.holdings).filter(([, h]) => h.qty > 0)
  const holdingIds = holdingCelebs.map(([id]) => id)

  const allCelebs = state.active || []

  const royalIds = allCelebs.filter(id => {
    const c = state.customCelebs?.[id]
    return c?.sector === 'Royals'
  })

  const musicIds  = holdingIds.filter(id => (state.customCelebs?.[id]?.sector || getSector(id)) === 'Music')
  const sportIds  = holdingIds.filter(id => (state.customCelebs?.[id]?.sector || getSector(id)) === 'Sport')
  const politicsIds = allCelebs.filter(id => (state.customCelebs?.[id]?.sector || getSector(id)) === 'Politics')

  const check = (id, condition) => {
    if (!earned.has(id) && condition) {
      earned.add(id)
      newlyEarned.push(id)
    }
  }

  // Trading
  check('first_trade',    meta.totalTrades >= 1)
  check('day_trader',     meta.totalTrades >= 10)
  check('sharp_shooter',  meta.bestSellPct >= 25)
  check('diamond_hands',  meta.longestHold >= 10)
  check('bull',           portfolioPct >= 10)
  check('raging_bull',    portfolioPct >= 50)

  // Celebrity
  check('music_mogul',    musicIds.length >= 5)
  check('sports_fan',     sportIds.length >= 5)
  check('royalist',       royalIds.length > 0 && royalIds.every(id => holdingIds.includes(id)))
  check('political_animal', politicsIds.length > 0 && politicsIds.every(id => holdingIds.includes(id)))
  check('a_lister',       holdingIds.includes('tayswift') && holdingIds.includes('beyonce') && holdingIds.includes('trump'))

  // Risk
  check('gambler',        meta.boughtLowBuzz)
  check('degen',          state.cash < 500)
  check('bag_holder',     meta.heldThroughCrash)
  check('rekt',           meta.ownedDelisted)

  // Wealth
  WEALTH_THRESHOLDS.forEach(([id, threshold]) => {
    check(id, totalWorth >= threshold)
  })

  // Loyalty
  check('famex_og',       true) // Everyone who plays early gets this
  check('early_bird',     meta.consecutiveDays >= 3)

  return { earned: [...earned], newlyEarned }
}

// Fallback sector lookup for built-in celebs
function getSector(id) {
  const map = {
    tayswift:'Music', beyonce:'Music', adele:'Music', edsheeran:'Music', dualipa:'Music', samsmith:'Music',
    billieeilish:'Music', arianagrande:'Music', harrystyles:'Music', drake:'Music', rihanna:'Music',
    kanyewest:'Music', ladygaga:'Music', eltonjohn:'Music', kyliemin:'Music', sabcarp:'Music',
    tomholland:'Film & TV', emmastone:'Film & TV', oliviacolman:'Film & TV', idriselba:'Film & TV',
    judidench:'Film & TV', barrykeoghan:'Film & TV', zendaya:'Film & TV', margotrobbie:'Film & TV',
    ryanreynolds:'Film & TV', timothee:'Film & TV', scarjo:'Film & TV', bradpitt:'Film & TV',
    angelinajolie:'Film & TV', nicolekidman:'Film & TV', chrishemsworth:'Film & TV', robertdowney:'Film & TV',
    leonardodicap:'Film & TV', keanugreeves:'Film & TV', willsmith:'Film & TV', kimkardashian:'Film & TV',
    kyliejenner:'Film & TV', oprah:'Film & TV', dwaynejo:'Film & TV',
    lewishamilton:'Sport', davebeckham:'Sport', bukayosaka:'Sport', bellingham:'Sport', andymurray:'Sport',
    benstokes:'Sport', caitlinclark:'Sport', maxverstappen:'Sport', cristiano:'Sport', leomessi:'Sport',
    lebron:'Sport', erling:'Sport', serenaswilliams:'Sport', rogerfederer:'Sport', tigerwoods:'Sport',
    tombrady:'Sport', stephanicurry:'Sport', patmahomes:'Sport', anthonyjoshua:'Sport', tysonfury:'Sport',
    simonebilessp:'Sport', neymarjr:'Sport', philfoden:'Sport',
    keirmstarmer:'Politics', trump:'Politics', albanese:'Politics', nigelfar:'Politics',
    joebiden:'Politics', emmanuelmacron:'Politics', justintrudeau:'Politics', jacindaardern:'Politics',
    volodymyrzel:'Politics', vladiputin:'Politics', gretathunberg:'Politics', kamallaharris:'Politics',
    borisjo:'Politics', scottmorrison:'Politics', rishi:'Politics',
    princewilliam:'Royals', harryprince:'Royals', charleskoen:'Royals', queencamilla:'Royals',
    princeedward:'Royals', princessanne:'Royals', meghanmarkle:'Royals',
    elonmusk:'Tech', damiansmith:'Tech', jeffbezos:'Tech', markzuckerberg:'Tech', billgates:'Tech',
    samaltman:'Tech', timcook:'Tech', sundar:'Tech', jackdorsey:'Tech', paloalto:'Tech',
  }
  return map[id] || 'Other'
}
