// api/scrape.js — Vercel serverless function (CommonJS)
// Uses NewsAPI to fetch headlines and score celebs by mention count
// Smart batching: stays within 100 requests/day free tier

const CELEB_QUERIES = [
  ['taylorswift',          'Taylor Swift'],
  ['beyonce',           'Beyonce'],
  ['adele',             'Adele singer'],
  ['edsheeran',         'Ed Sheeran'],
  ['dualipa',           'Dua Lipa'],
  ['samsmith',          'Sam Smith singer'],
  ['tomholland',        'Tom Holland actor'],
  ['emmastone',         'Emma Stone actress'],
  ['oliviacolman',      'Olivia Colman'],
  ['idriselba',         'Idris Elba'],
  ['judidench',         'Judi Dench'],
  ['barrykeoghan',      'Barry Keoghan'],
  ['lewishamilton',     'Lewis Hamilton'],
  ['davebeckham',       'David Beckham'],
  ['bukayosaka',        'Bukayo Saka'],
  ['judebellingham',        'Jude Bellingham'],
  ['andymurray',        'Andy Murray tennis'],
  ['benstokes',         'Ben Stokes cricket'],
  ['caitlinclark',      'Caitlin Clark basketball'],
  ['maxverstappen',     'Max Verstappen'],
  ['keirmstarmer',      'Keir Starmer'],
  ['donaldtrump',             'Donald Trump'],
  ['anthonyalbanese',          'Anthony Albanese'],
  ['nigelfarage',          'Nigel Farage'],
  ['princewilliam',     'Prince William'],
  ['harryprince',       'Prince Harry'],
  ['elonmusk',          'Elon Musk'],
  ['billieeilish',      'Billie Eilish'],
  ['arianagrande',      'Ariana Grande'],
  ['harrystyles',       'Harry Styles'],
  ['tomcruise',         'Tom Cruise'],
  ['rihanna',           'Rihanna'],
  ['kanyewest',         'Kanye West'],
  ['ladygaga',          'Lady Gaga'],
  ['cristiano',      'Cristiano Ronaldo'],
  ['leomessi',          'Lionel Messi'],
  ['lebronjames',            'LeBron James'],
  ['erlinghaaland',            'Erling Haaland'],
  ['mbappe',          'Kylian Mbappe'],
  ['neymar',            'Neymar'],
  ['usainbolt',         'Usain Bolt'],
  ['jeffbezos',         'Jeff Bezos'],
  ['markzuckerberg',    'Mark Zuckerberg'],
  ['billgates',         'Bill Gates'],
  ['samaltman',         'Sam Altman'],
  ['kimkardashian',     'Kim Kardashian'],
  ['kyliejenner',       'Kylie Jenner'],
  ['oprah',             'Oprah Winfrey'],
  ['vladimirputin',        'Vladimir Putin'],
  ['zelensky',      'Zelensky'],
  ['meghanmarkle',      'Meghan Markle'],
  ['dwaynejohnson',          'Dwayne Johnson'],
  ['ryanreynolds',      'Ryan Reynolds'],
  ['margotrobbie',      'Margot Robbie'],
  ['scarjohansson',            'Scarlett Johansson'],
  ['bradpitt',          'Brad Pitt'],
  ['nicolekidman',      'Nicole Kidman'],
  ['chrishemsworth',    'Chris Hemsworth'],
  ['oliviarodrigo',     'Olivia Rodrigo'],
  ['sabrinacarpenter',           'Sabrina Carpenter'],
  ['kendricklamar',     'Kendrick Lamar'],
  ['emmanuelmacron',    'Emmanuel Macron'],
  ['justintrudeau',     'Justin Trudeau'],
  ['borisjohnson',           'Boris Johnson'],
  ['charlesking',       'King Charles'],
  ['kylieminogue',          'Kylie Minogue'],
  ['zendaya',           'Zendaya'],
  ['timcook',           'Tim Cook Apple'],
  ['sydneysweeney',     'Sydney Sweeney'],
  ['tigerwoods',        'Tiger Woods'],
  ['tombrady',          'Tom Brady'],
  ['stephanicurry',     'Stephen Curry'],
  ['patmahomes',        'Patrick Mahomes'],
  ['anthonyjoshua',     'Anthony Joshua'],
  ['tysonfury',         'Tyson Fury'],
  ['mileycyrus',        'Miley Cyrus'],
  ['selenagomez',       'Selena Gomez'],
  ['justinbieber',      'Justin Bieber'],
  ['leonardodicap',     'Leonardo DiCaprio'],
  ['willsmith',         'Will Smith actor'],
  ['nickiminaj',        'Nicki Minaj'],
  ['badbunny',          'Bad Bunny'],
  ['charliexcx',        'Charli XCX'],
  ['cateblanchett',     'Cate Blanchett'],
  ['merylstreep',       'Meryl Streep'],
  ['angelinajolie',     'Angelina Jolie'],
  ['chrisevans',        'Chris Evans actor'],
  ['robertdowney',      'Robert Downey Jr'],
  ['annehathaway',      'Anne Hathaway'],
  ['reesewitherspoon',  'Reese Witherspoon'],
  ['keanugreeves',      'Keanu Reeves'],
  ['timothee',          'Timothee Chalamet'],
  ['ryanogosling',      'Ryan Gosling'],
  ['jenniferlawrence',  'Jennifer Lawrence actress'],
  ['xi',                'Xi Jinping'],
  ['rishi',             'Rishi Sunak'],
  ['princeedward',      'Prince Edward'],
  ['princessanne',      'Princess Anne'],
  ['jensenhuang',          'Jensen Huang Nvidia'],
  ['serjobrin',         'Sergey Brin Google'],
  ['jackdorsey',        'Jack Dorsey'],
  ['yunglean',          'Yung Lean rapper'],
  ['pepguardiola',      'Pep Guardiola manager'],
  ['rogerfederer',      'Roger Federer'],
  ['simonebilessp',     'Simone Biles'],
  ['nickdaicos',        'Nick Daicos AFL'],
  ['baileysmith',       'Bailey Smith AFL'],
  ['kateperry',         'Katy Perry'],
  ['melgibson',         'Mel Gibson'],
  ['queencamilla',      'Queen Camilla'],
  ['princeandrew',       'Prince Andrew'],
  ['princgeorge',       'Princess Catherine'],
  ['vladiputin',        'Vladimir Putin'],
]

// High profile celebs fetched every call
// Others fetched based on day of week to stay within 100/day limit
const HIGH_PROFILE = ['trump', 'elonmusk', 'tayswift', 'beyonce', 'keirmstarmer', 
  'albanese', 'leomessi', 'cristiano', 'lewishamilton', 'markzuckerberg',
  'princewilliam', 'harryprince', 'bellingham', 'erling', 'samaltman']

function mentionsToBuzz(totalResults) {
  if (totalResults >= 500) return 95
  if (totalResults >= 200) return 88
  if (totalResults >= 100) return 80
  if (totalResults >= 50)  return 72
  if (totalResults >= 20)  return 65
  if (totalResults >= 5)   return 58
  if (totalResults >= 1)   return 52
  return null
}

async function fetchCeleb(apiKey, id, query) {
  try {
    const from = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&from=${from}&sortBy=publishedAt&pageSize=5&language=en&apiKey=${apiKey}`
    const res = await fetch(url)
    const data = await res.json()
    if (data.status !== 'ok') return null
    return {
      id,
      totalResults: data.totalResults || 0,
      articles: (data.articles || []).slice(0, 3).map(a => ({
        title:  a.title,
        source: a.source?.name || 'News',
        link:   a.url,
        time:   new Date(a.publishedAt).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' }),
      }))
    }
  } catch { return null }
}

function detectUnknowns(allTitles) {
  const knownQueries = CELEB_QUERIES.map(([, q]) => q.toLowerCase())
  const text = allTitles.join(' ')
  const namePattern = /\b([A-Z][a-z]{2,}(?:\s+[A-Z][a-z]{2,})+)\b/g
  const found = {}
  let match
  while ((match = namePattern.exec(text)) !== null) {
    const name = match[1]
    if (name.length > 6 && !knownQueries.some(q => q.includes(name.toLowerCase()))) {
      found[name] = (found[name] || 0) + 1
    }
  }
  return Object.entries(found)
    .filter(([, count]) => count >= 2)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([name, count]) => ({
      name, count,
      suggestedBuzzBase:   count >= 5 ? 80 : count >= 3 ? 70 : 60,
      suggestedPrice:      count >= 5 ? 24 : count >= 3 ? 16 : 12,
      suggestedVolatility: 0.035,
      suggestedDecayRate:  0.90,
    }))
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Cache-Control', 's-maxage=86400') // Cache 24 hours at Vercel edge

  const apiKey = process.env.NEWS_API_KEY || process.env.VITE_NEWS_API_KEY
  if (!apiKey) {
    return res.status(200).json({ error: 'NEWS_API_KEY not set in environment variables' })
  }

  try {
    // Work out which celebs to fetch today based on day of week
    // High profile always fetched. Others split across days to stay under 100/day.
    const dayOfWeek = new Date().getDay() // 0-6
    const otherCelebs = CELEB_QUERIES.filter(([id]) => !HIGH_PROFILE.includes(id))
    const chunkSize = Math.ceil(otherCelebs.length / 7)
    const todaysOthers = otherCelebs.slice(dayOfWeek * chunkSize, (dayOfWeek + 1) * chunkSize)
    const toFetch = [
      ...CELEB_QUERIES.filter(([id]) => HIGH_PROFILE.includes(id)),
      ...todaysOthers,
    ]

    // Fetch in batches of 5 with small delays
    const results = []
    for (let i = 0; i < toFetch.length; i += 5) {
      const batch = toFetch.slice(i, i + 5)
      const fetched = await Promise.all(batch.map(([id, query]) => fetchCeleb(apiKey, id, query)))
      fetched.forEach(r => { if (r) results.push(r) })
      if (i + 5 < toFetch.length) await new Promise(r => setTimeout(r, 200))
    }

    if (!results.length) {
      return res.status(200).json({ error: 'No results from NewsAPI', hint: 'Check NEWS_API_KEY in Vercel env vars' })
    }

    // Build buzz scores
    const buzzScores = {}
    results.forEach(({ id, totalResults }) => {
      const buzz = mentionsToBuzz(totalResults)
      if (buzz !== null) buzzScores[id] = { mentions: totalResults, buzz }
    })

    // Collect all headlines for buzz feed + unknown detection
    const allTitles = []
    const topHeadlines = []
    const seen = new Set()

    results.forEach(({ id, totalResults, articles }) => {
      articles.forEach(a => {
        if (a.title && !a.title.includes('[Removed]') && !seen.has(a.title)) {
          seen.add(a.title)
          allTitles.push(a.title)
          topHeadlines.push({ ...a, celebId: id, mentions: totalResults })
        }
      })
    })

    // Detect unknown trending names
    const suggestions = detectUnknowns(allTitles)

    return res.status(200).json({
      status:         'ok',
      scrapedAt:      new Date().toISOString(),
      celebsFetched:  results.length,
      headlineCount:  topHeadlines.length,
      buzzScores,
      topHeadlines:   topHeadlines.slice(0, 40),
      suggestions,
      requestsUsed:   toFetch.length,
    })

  } catch (err) {
    return res.status(200).json({ error: err.message })
  }
}
