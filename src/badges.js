// src/badges.js — Badge definitions and unlock checker

export const BADGES = [
  // Trading
  { id: 'first_trade',      emoji: '🥉', name: 'First Trade',        desc: 'Made your first buy',                          category: 'Trading' },
  { id: 'day_trader',       emoji: '🔄', name: 'Day Trader',         desc: 'Made 10 trades in one session',                category: 'Trading' },
  { id: 'technical_trader', emoji: '📊', name: 'Technical Trader',   desc: 'Made 50 trades',                               category: 'Trading' },
  { id: 'century',          emoji: '💯', name: 'Century',            desc: 'Made 100 trades',                              category: 'Trading' },
  { id: 'all_in',           emoji: '🎰', name: 'All In',             desc: 'Spent 90%+ of cash in one trade',              category: 'Trading' },
  { id: 'sharp_shooter',    emoji: '🎯', name: 'Sharp Shooter',      desc: 'Sold a stock at 25%+ profit',                  category: 'Trading' },
  { id: 'market_oracle',    emoji: '🔮', name: 'Market Oracle',      desc: 'Sold a stock at 50%+ profit',                  category: 'Trading' },
  { id: 'diamond_hands',    emoji: '💎', name: 'Diamond Hands',      desc: 'Held a stock for 10+ market ticks',            category: 'Trading' },
  { id: 'patient_investor', emoji: '🧘', name: 'Patient Investor',   desc: 'Held a stock for 30+ market ticks',            category: 'Trading' },
  { id: 'bull',             emoji: '📈', name: 'Bull',               desc: 'Portfolio up 10%',                             category: 'Trading' },
  { id: 'raging_bull',      emoji: '🐂', name: 'Raging Bull',        desc: 'Portfolio up 50%',                             category: 'Trading' },
  { id: 'paper_hands',      emoji: '💸', name: 'Paper Hands',        desc: 'Sold a stock at a loss 5 times',               category: 'Trading' },

  // Celebrity
  { id: 'royalist',         emoji: '👑', name: 'Royalist',           desc: 'Owns shares in ALL Royals simultaneously',     category: 'Celebrity' },
  { id: 'royal_family',     emoji: '👸', name: 'Royal Family',       desc: 'Owns ALL Royals at once',                      category: 'Celebrity' },
  { id: 'music_mogul',      emoji: '🎵', name: 'Music Mogul',        desc: 'Owns shares in 5+ Music celebs',               category: 'Celebrity' },
  { id: 'festival_season',  emoji: '🎪', name: 'Festival Season',    desc: 'Owns shares in 10+ Music celebs',              category: 'Celebrity' },
  { id: 'sports_fan',       emoji: '⚽', name: 'Sports Fan',         desc: 'Owns shares in 5+ Sport celebs',               category: 'Celebrity' },
  { id: 'super_fan',        emoji: '🏟️', name: 'Super Fan',          desc: 'Owns 100+ shares of one celeb',                category: 'Celebrity' },
  { id: 'hollywood',        emoji: '🎬', name: 'Hollywood',          desc: 'Owns shares in 10+ Film & TV celebs',          category: 'Celebrity' },
  { id: 'political_animal', emoji: '🏛️', name: 'Political Animal',   desc: 'Owns shares in ALL Politics celebs',           category: 'Celebrity' },
  { id: 'world_leader',     emoji: '🌍', name: 'World Leader',       desc: 'Owns ALL Politics celebs at once',             category: 'Celebrity' },
  { id: 'a_lister',         emoji: '🌟', name: 'A-Lister',           desc: 'Owns Taylor Swift, Beyoncé AND Trump',         category: 'Celebrity' },
  { id: 'true_blue',        emoji: '🇦🇺', name: 'True Blue',          desc: 'Owns Albanese AND Kylie Minogue',              category: 'Celebrity' },
  { id: 'diversified',      emoji: '🤝', name: 'Diversified',        desc: 'Owns celebs in every sector simultaneously',   category: 'Celebrity' },

  // Risk
  { id: 'gambler',          emoji: '🎲', name: 'Gambler',            desc: 'Bought a celeb with buzz below 20',            category: 'Risk' },
  { id: 'bottom_fisher',    emoji: '🎣', name: 'Bottom Fisher',      desc: 'Bought a celeb at their lowest ever price',    category: 'Risk' },
  { id: 'playing_with_fire',emoji: '🔥', name: 'Playing with Fire',  desc: 'Owns 3 celebs all in warning territory',       category: 'Risk' },
  { id: 'degen',            emoji: '💥', name: 'Degen',              desc: 'Lost 50% of starting cash',                    category: 'Risk' },
  { id: 'bloodbath',        emoji: '🩸', name: 'Bloodbath',          desc: 'Portfolio down 75%',                           category: 'Risk' },
  { id: 'bag_holder',       emoji: '📉', name: 'Bag Holder',         desc: 'Still holding after a Crash event',            category: 'Risk' },
  { id: 'rekt',             emoji: '☠️', name: 'Rekt',               desc: 'Owned shares in a delisted celeb',             category: 'Risk' },
  { id: 'riding_the_wave',  emoji: '🌊', name: 'Riding the Wave',    desc: 'Bought within 10 ticks of a Boom event',       category: 'Risk' },

  // Wealth ladder
  { id: 'penny_pincher',    emoji: '🪙', name: 'Penny Pincher',      desc: 'Total worth $150,000',                         category: 'Wealth' },
  { id: 'high_roller',      emoji: '💵', name: 'High Roller',        desc: 'Total worth $200,000',                         category: 'Wealth' },
  { id: 'broker',           emoji: '💼', name: 'Broker',             desc: 'Total worth $500,000',                         category: 'Wealth' },
  { id: 'property_dev',     emoji: '🏠', name: 'Property Developer', desc: 'Total worth $1,000,000',                       category: 'Wealth' },
  { id: 'fat_cat',          emoji: '🚗', name: 'Fat Cat',            desc: 'Total worth $2,500,000',                       category: 'Wealth' },
  { id: 'yacht_club',       emoji: '🛥️', name: 'Yacht Club',         desc: 'Total worth $5,000,000',                       category: 'Wealth' },
  { id: 'millionaire',      emoji: '🌟', name: 'Millionaire',        desc: 'Total worth $10,000,000',                      category: 'Wealth' },
  { id: 'jet_setter',       emoji: '✈️', name: 'Jet Setter',         desc: 'Total worth $50,000,000',                      category: 'Wealth' },
  { id: 'island_owner',     emoji: '🏝️', name: 'Island Owner',       desc: 'Total worth $100,000,000',                     category: 'Wealth' },
  { id: 'tycoon',           emoji: '🚀', name: 'Tycoon',             desc: 'Total worth $500,000,000',                     category: 'Wealth' },
  { id: 'billionaire',      emoji: '💎', name: 'Billionaire',        desc: 'Total worth $1,000,000,000',                   category: 'Wealth' },
  { id: 'trillionaire',     emoji: '🌍', name: 'Trillionaire',       desc: 'Total worth $1,000,000,000,000',               category: 'Wealth' },
  { id: 'god_mode',         emoji: '👑', name: 'God Mode',           desc: 'Total worth $1 Quadrillion',                   category: 'Wealth' },
  { id: 'galaxy_brain',     emoji: '🌌', name: 'Galaxy Brain',       desc: 'Total worth $10 Quadrillion',                  category: 'Wealth' },
  { id: 'market_destroyer', emoji: '💀', name: 'Market Destroyer',   desc: 'Total worth $100 Quadrillion — you broke it',  category: 'Wealth' },

  // Loyalty
  { id: 'early_bird',       emoji: '🌅', name: 'Early Bird',         desc: 'Visited 3 days in a row',                      category: 'Loyalty' },
  { id: 'night_owl',        emoji: '🌙', name: 'Night Owl',          desc: 'Made a trade after midnight',                  category: 'Loyalty' },
  { id: 'early_riser',      emoji: '☀️', name: 'Early Riser',        desc: 'Made a trade before 6am',                      category: 'Loyalty' },
  { id: 'famex_og',         emoji: '🏆', name: 'FameX OG',           desc: 'One of the first players',                     category: 'Loyalty' },
]

const WEALTH_THRESHOLDS = [
  ['penny_pincher',    150_000],
  ['high_roller',      200_000],
  ['broker',           500_000],
  ['property_dev',     1_000_000],
  ['fat_cat',          2_500_000],
  ['yacht_club',       5_000_000],
  ['millionaire',      10_000_000],
  ['jet_setter',       50_000_000],
  ['island_owner',     100_000_000],
  ['tycoon',           500_000_000],
  ['billionaire',      1_000_000_000],
  ['trillionaire',     1_000_000_000_000],
  ['god_mode',         1_000_000_000_000_000],
  ['galaxy_brain',     10_000_000_000_000_000],
  ['market_destroyer', Number.MAX_SAFE_INTEGER],
]

export function checkBadges(state, prevBadges = [], meta = {}) {
  const earned = new Set(prevBadges)
  const newlyEarned = []

  const totalWorth = state.cash + Object.entries(state.holdings)
    .reduce((s, [id, h]) => s + (state.prices[id] || 0) * h.qty, 0)

  const portfolioPct = ((totalWorth - 100000) / 100000) * 100

  const holdingCelebs = Object.entries(state.holdings).filter(([, h]) => h.qty > 0)
  const holdingIds    = holdingCelebs.map(([id]) => id)
  const allCelebs     = state.active || []

  // Sector helpers
  const getSectorFor  = id => state.customCelebs?.[id]?.sector || getSector(id)
  const musicIds      = holdingIds.filter(id => getSectorFor(id) === 'Music')
  const sportIds      = holdingIds.filter(id => getSectorFor(id) === 'Sport')
  const filmIds       = holdingIds.filter(id => getSectorFor(id) === 'Film & TV')
  const royalIds      = allCelebs.filter(id => getSectorFor(id) === 'Royals')
  const politicsIds   = allCelebs.filter(id => getSectorFor(id) === 'Politics')
  const allSectors    = [...new Set(allCelebs.map(getSectorFor))]
  const heldSectors   = [...new Set(holdingIds.map(getSectorFor))]

  // Warning territory celebs
  const warningCelebs = holdingIds.filter(id => (state.buzz[id] || 0) < 25)

  // Biggest single holding
  const maxHolding    = Math.max(0, ...holdingCelebs.map(([, h]) => h.qty))

  // Loss count from meta
  const lossCount     = meta.lossCount || 0

  const check = (id, condition) => {
    if (!earned.has(id) && condition) { earned.add(id); newlyEarned.push(id) }
  }

  // Trading
  check('first_trade',      meta.totalTrades >= 1)
  check('day_trader',       meta.totalTrades >= 10)
  check('technical_trader', meta.totalTrades >= 50)
  check('century',          meta.totalTrades >= 100)
  check('all_in',           meta.biggestTradePct >= 90)
  check('sharp_shooter',    meta.bestSellPct >= 25)
  check('market_oracle',    meta.bestSellPct >= 50)
  check('diamond_hands',    meta.longestHold >= 10)
  check('patient_investor', meta.longestHold >= 30)
  check('bull',             portfolioPct >= 10)
  check('raging_bull',      portfolioPct >= 50)
  check('paper_hands',      lossCount >= 5)

  // Celebrity
  check('music_mogul',      musicIds.length >= 5)
  check('festival_season',  musicIds.length >= 10)
  check('sports_fan',       sportIds.length >= 5)
  check('hollywood',        filmIds.length >= 10)
  check('super_fan',        maxHolding >= 100)
  check('royalist',         royalIds.length > 0 && royalIds.every(id => holdingIds.includes(id)))
  check('royal_family',     royalIds.length > 0 && royalIds.every(id => holdingIds.includes(id)))
  check('political_animal', politicsIds.length > 0 && politicsIds.every(id => holdingIds.includes(id)))
  check('world_leader',     politicsIds.length > 0 && politicsIds.every(id => holdingIds.includes(id)))
  check('a_lister',         holdingIds.includes('tayswift') && holdingIds.includes('beyonce') && holdingIds.includes('trump'))
  check('true_blue',        holdingIds.includes('albanese') && holdingIds.includes('kyliemin'))
  check('diversified',      allSectors.every(s => heldSectors.includes(s)))

  // Risk
  check('gambler',          meta.boughtLowBuzz)
  check('bottom_fisher',    meta.boughtAtLow)
  check('playing_with_fire',warningCelebs.length >= 3)
  check('degen',            totalWorth < 50_000)   // lost half starting cash
  check('bloodbath',        totalWorth < 25_000)   // lost 75% of starting cash
  check('bag_holder',       meta.heldThroughCrash)
  check('rekt',             meta.ownedDelisted)
  check('riding_the_wave',  meta.boughtAfterBoom)

  // Wealth
  WEALTH_THRESHOLDS.forEach(([id, threshold]) => check(id, totalWorth >= threshold))

  // Loyalty
  check('famex_og',         true)
  check('early_bird',       meta.consecutiveDays >= 3)
  check('night_owl',        meta.tradedAfterMidnight)
  check('early_riser',      meta.tradedBeforeSix)

  return { earned: [...earned], newlyEarned }
}

// Fallback sector lookup for built-in celebs
function getSector(id) {
  const map = {
    tayswift:'Music', beyonce:'Music', adele:'Music', edsheeran:'Music', dualipa:'Music',
    samsmith:'Music', billieeilish:'Music', arianagrande:'Music', harrystyles:'Music',
    drake:'Music', rihanna:'Music', kanyewest:'Music', ladygaga:'Music', eltonjohn:'Music',
    kyliemin:'Music', sabcarp:'Music', nickiminaj:'Music', badbunny:'Music', charliexcx:'Music',
    kateperry:'Music', yunglean:'Music', justinbieber:'Music', mileycyrus:'Music', selenagomez:'Music',
    tomholland:'Film & TV', emmastone:'Film & TV', oliviacolman:'Film & TV', idriselba:'Film & TV',
    judidench:'Film & TV', barrykeoghan:'Film & TV', zendaya:'Film & TV', margotrobbie:'Film & TV',
    ryanreynolds:'Film & TV', timothee:'Film & TV', scarjo:'Film & TV', bradpitt:'Film & TV',
    angelinajolie:'Film & TV', nicolekidman:'Film & TV', chrishemsworth:'Film & TV',
    robertdowney:'Film & TV', leonardodicap:'Film & TV', keanugreeves:'Film & TV',
    willsmith:'Film & TV', kimkardashian:'Film & TV', kyliejenner:'Film & TV', oprah:'Film & TV',
    dwaynejo:'Film & TV', cateblanchett:'Film & TV', merylstreep:'Film & TV', melgibson:'Film & TV',
    ryanogosling:'Film & TV', jenniferlawrence:'Film & TV', chrisevans:'Film & TV',
    annehathaway:'Film & TV', reesewitherspoon:'Film & TV',
    lewishamilton:'Sport', davebeckham:'Sport', bukayosaka:'Sport', bellingham:'Sport',
    andymurray:'Sport', benstokes:'Sport', caitlinclark:'Sport', maxverstappen:'Sport',
    cristianoron:'Sport', leomessi:'Sport', lebron:'Sport', erling:'Sport', neymarjr:'Sport',
    serenaswilliams:'Sport', rogerfederer:'Sport', tigerwoods:'Sport', tombrady:'Sport',
    stephanicurry:'Sport', patmahomes:'Sport', anthonyjoshua:'Sport', tysonfury:'Sport',
    simonebilessp:'Sport', usainbolt:'Sport', neymar:'Sport', nickdaicos:'Sport', baileysmith:'Sport',
    keirmstarmer:'Politics', trump:'Politics', albanese:'Politics', nigelfar:'Politics',
    joebiden:'Politics', emmanuelmacron:'Politics', justintrudeau:'Politics', jacindaardern:'Politics',
    volodymyrzel:'Politics', vladiputin:'Politics', gretathunberg:'Politics', kamallaharris:'Politics',
    borisjo:'Politics', scottmorrison:'Politics', rishi:'Politics', xi:'Politics',
    princewilliam:'Royals', harryprince:'Royals', charleskoen:'Royals', queencamilla:'Royals',
    princeedward:'Royals', princessanne:'Royals', meghanmarkle:'Royals', princgeorge:'Royals',
    princeandrw:'Royals',
    elonmusk:'Tech', damiansmith:'Tech', jeffbezos:'Tech', markzuckerberg:'Tech', billgates:'Tech',
    samaltman:'Tech', timcook:'Tech', sundar:'Tech', jackdorsey:'Tech', paloalto:'Tech', serjobrin:'Tech',
  }
  return map[id] || 'Other'
}
