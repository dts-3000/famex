// api/scrape.js — Vercel serverless function (CommonJS)
// Scrapes Google News AU + US via ScrapingBee and scores celebs by mention count

const CELEB_NAMES = [
  // Each entry: [id, searchName, aliases]
  ['tayswift',      'Taylor Swift',       ['Taylor Swift']],
  ['beyonce',       'Beyoncé',            ['Beyonce', 'Beyoncé']],
  ['adele',         'Adele',              ['Adele']],
  ['edsheeran',     'Ed Sheeran',         ['Ed Sheeran']],
  ['dualipa',       'Dua Lipa',           ['Dua Lipa']],
  ['samsmith',      'Sam Smith',          ['Sam Smith']],
  ['tomholland',    'Tom Holland',        ['Tom Holland']],
  ['emmastone',     'Emma Stone',         ['Emma Stone']],
  ['oliviacolman',  'Olivia Colman',      ['Olivia Colman']],
  ['idriselba',     'Idris Elba',         ['Idris Elba']],
  ['judidench',     'Judi Dench',         ['Judi Dench']],
  ['barrykeoghan',  'Barry Keoghan',      ['Barry Keoghan']],
  ['lewishamilton', 'Lewis Hamilton',     ['Lewis Hamilton']],
  ['davebeckham',   'David Beckham',      ['Beckham']],
  ['bukayosaka',    'Bukayo Saka',        ['Bukayo Saka', 'Saka']],
  ['bellingham',    'Jude Bellingham',    ['Bellingham']],
  ['andymurray',    'Andy Murray',        ['Andy Murray']],
  ['benstokes',     'Ben Stokes',         ['Ben Stokes']],
  ['caitlinclark',  'Caitlin Clark',      ['Caitlin Clark']],
  ['maxverstappen', 'Max Verstappen',     ['Verstappen']],
  ['keirmstarmer',  'Keir Starmer',       ['Starmer', 'Keir Starmer']],
  ['trump',         'Donald Trump',       ['Trump', 'Donald Trump']],
  ['albanese',      'Anthony Albanese',   ['Albanese', 'Anthony Albanese']],
  ['nigelfar',      'Nigel Farage',       ['Farage', 'Nigel Farage']],
  ['princewilliam', 'Prince William',     ['Prince William', 'William']],
  ['harryprince',   'Prince Harry',       ['Prince Harry', 'Harry']],
  ['elonmusk',      'Elon Musk',          ['Elon Musk', 'Musk']],
  ['damiansmith',   'Damian Smith',       ['Damian Smith']],
  ['billieeilish',  'Billie Eilish',      ['Billie Eilish']],
  ['arianagrande',  'Ariana Grande',      ['Ariana Grande']],
  ['harrystyles',   'Harry Styles',       ['Harry Styles']],
  ['drake',         'Drake',              ['Drake']],
  ['rihanna',       'Rihanna',            ['Rihanna']],
  ['kanyewest',     'Kanye West',         ['Kanye', 'Ye']],
  ['ladygaga',      'Lady Gaga',          ['Lady Gaga']],
  ['cristiano',     'Cristiano Ronaldo',  ['Ronaldo', 'Cristiano']],
  ['leomessi',      'Lionel Messi',       ['Messi']],
  ['lebron',        'LeBron James',       ['LeBron']],
  ['erling',        'Erling Haaland',     ['Haaland']],
  ['kylmbapp',      'Kylian Mbappé',      ['Mbappé', 'Mbappe']],
  ['jeffbezos',     'Jeff Bezos',         ['Bezos']],
  ['markzuckerberg','Mark Zuckerberg',    ['Zuckerberg']],
  ['billgates',     'Bill Gates',         ['Bill Gates']],
  ['samaltman',     'Sam Altman',         ['Sam Altman']],
  ['kimkardashian', 'Kim Kardashian',     ['Kardashian']],
  ['kyliejenner',   'Kylie Jenner',       ['Kylie Jenner']],
  ['oprah',         'Oprah Winfrey',      ['Oprah']],
  ['vladiputin',    'Vladimir Putin',     ['Putin']],
  ['volodymyrzel',  'Volodymyr Zelensky', ['Zelensky']],
  ['gretathunberg', 'Greta Thunberg',     ['Greta Thunberg']],
  ['meghanmarkle',  'Meghan Markle',      ['Meghan', 'Markle']],
  ['dwaynejo',      'Dwayne Johnson',     ['The Rock', 'Dwayne Johnson']],
  ['ryanreynolds',  'Ryan Reynolds',      ['Ryan Reynolds']],
  ['margotrobbie',  'Margot Robbie',      ['Margot Robbie']],
  ['timothee',      'Timothée Chalamet',  ['Chalamet', 'Timothee']],
  ['scarjo',        'Scarlett Johansson', ['Scarlett Johansson']],
  ['bradpitt',      'Brad Pitt',          ['Brad Pitt']],
  ['angelinajolie', 'Angelina Jolie',     ['Angelina Jolie']],
  ['nicolekidman',  'Nicole Kidman',      ['Nicole Kidman']],
  ['chrishemsworth','Chris Hemsworth',    ['Chris Hemsworth']],
  ['oliviarodrigo', 'Olivia Rodrigo',     ['Olivia Rodrigo']],
  ['sabcarp',       'Sabrina Carpenter',  ['Sabrina Carpenter']],
  ['kendricklamar', 'Kendrick Lamar',     ['Kendrick Lamar']],
  ['emmanuelmacron','Emmanuel Macron',    ['Macron']],
  ['justintrudeau', 'Justin Trudeau',     ['Trudeau']],
  ['borisjo',       'Boris Johnson',      ['Boris Johnson', 'Boris']],
  ['scottmorrison', 'Scott Morrison',     ['Scott Morrison']],
  ['charleskoen',   'King Charles',       ['King Charles']],
  ['queencamilla',  'Queen Camilla',      ['Queen Camilla']],
  ['princeedward',  'Prince Edward',      ['Prince Edward']],
  ['princessanne',  'Princess Anne',      ['Princess Anne']],
  ['kyliemin',      'Kylie Minogue',      ['Kylie Minogue']],
  ['zendaya',       'Zendaya',            ['Zendaya']],
  ['timcook',       'Tim Cook',           ['Tim Cook']],
  ['sundar',        'Sundar Pichai',      ['Sundar Pichai']],
  ['jackdorsey',    'Jack Dorsey',        ['Jack Dorsey']],
  ['serenaswilliams','Serena Williams',   ['Serena Williams']],
  ['rogerfederer',  'Roger Federer',      ['Federer']],
  ['tigerwoods',    'Tiger Woods',        ['Tiger Woods']],
  ['tombrady',      'Tom Brady',          ['Tom Brady']],
  ['stephanicurry', 'Stephen Curry',      ['Steph Curry']],
  ['patmahomes',    'Patrick Mahomes',    ['Mahomes']],
  ['anthonyjoshua', 'Anthony Joshua',     ['Anthony Joshua']],
  ['tysonfury',     'Tyson Fury',         ['Tyson Fury']],
  ['simonebilessp', 'Simone Biles',       ['Simone Biles']],
  ['mileycyrus',    'Miley Cyrus',        ['Miley Cyrus']],
  ['selenagomez',   'Selena Gomez',       ['Selena Gomez']],
  ['justinbieber',  'Justin Bieber',      ['Justin Bieber']],
  ['nickiminaj',    'Nicki Minaj',        ['Nicki Minaj']],
  ['cateblanchett', 'Cate Blanchett',     ['Cate Blanchett']],
  ['merylstreep',   'Meryl Streep',       ['Meryl Streep']],
  ['robertdowney',  'Robert Downey Jr',   ['Robert Downey']],
  ['leonardodicap', 'Leonardo DiCaprio',  ['DiCaprio', 'Leonardo DiCaprio']],
  ['keanugreeves',  'Keanu Reeves',       ['Keanu Reeves']],
  ['willsmith',     'Will Smith',         ['Will Smith']],
  ['kamallaharris', 'Kamala Harris',      ['Kamala Harris']],
  ['joebiden',      'Joe Biden',          ['Biden']],
  ['jacindaardern', 'Jacinda Ardern',     ['Jacinda Ardern']],
  ['rishi',         'Rishi Sunak',        ['Rishi Sunak', 'Sunak']],
]

// Convert mention count to buzz score (log scale)
function mentionsToBuzz(count, baseScore) {
  if (count === 0) return Math.max(10, baseScore - 10)
  if (count >= 10) return Math.min(100, baseScore + 35)
  if (count >= 6)  return Math.min(100, baseScore + 20)
  if (count >= 3)  return Math.min(100, baseScore + 10)
  if (count >= 1)  return baseScore
  return Math.max(10, baseScore - 5)
}

// Score all celebs from headline text
function scoreCelebs(headlines) {
  const allText = headlines.map(h => (h.title || '') + ' ' + (h.source || '')).join(' ')
  const scores = {}

  CELEB_NAMES.forEach(([id, , aliases]) => {
    let count = 0
    aliases.forEach(alias => {
      const regex = new RegExp(alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
      const matches = allText.match(regex)
      if (matches) count += matches.length
    })
    scores[id] = count
  })

  return scores
}

// Detect trending names NOT in our celeb list
function detectUnknowns(headlines) {
  const allText = headlines.map(h => h.title || '').join(' ')
  const knownNames = CELEB_NAMES.flatMap(([,, aliases]) => aliases.map(a => a.toLowerCase()))

  // Simple name detection — capitalised word pairs
  const namePattern = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\b/g
  const found = {}
  let match
  while ((match = namePattern.exec(allText)) !== null) {
    const name = match[1]
    if (!knownNames.some(k => k === name.toLowerCase())) {
      found[name] = (found[name] || 0) + 1
    }
  }

  // Return names mentioned 3+ times
  return Object.entries(found)
    .filter(([, count]) => count >= 3)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([name, count]) => ({
      name,
      count,
      suggestedBuzzBase: count >= 10 ? 85 : count >= 6 ? 75 : 65,
      suggestedPrice: count >= 10 ? 28 : count >= 6 ? 20 : 14,
      suggestedVolatility: 0.035,
      suggestedDecayRate: 0.90,
    }))
}

async function scrapeGoogleNews(apiKey, country) {
  const extractRules = {
    news: {
      selector: 'article',
      type: 'list',
      output: {
        title: '.gPFEn,.JtKRv',
        source: '.vr1PYe',
        time: 'time@datetime',
        link: '.WwrzSb@href',
      }
    }
  }

  const params = new URLSearchParams({
    api_key: apiKey,
    url: `https://news.google.com/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRFZxYUdjU0FtVnVHZ0pWVXlnQVAB?gl=${country}&hl=en`,
    extract_rules: JSON.stringify(extractRules),
    wait_for: '.gPFEn',
    render_js: 'true',
  })

  const response = await fetch(`https://app.scrapingbee.com/api/v1/?${params}`)
  if (!response.ok) throw new Error(`ScrapingBee error: ${response.status}`)
  const data = await response.json()
  return data.news || []
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')

  const apiKey = process.env.SCRAPING_BEE_KEY
  if (!apiKey) {
    return res.status(200).json({ error: 'SCRAPING_BEE_KEY not set in environment variables' })
  }

  try {
    // Scrape AU and US in parallel
    const [auHeadlines, usHeadlines] = await Promise.allSettled([
      scrapeGoogleNews(apiKey, 'AU'),
      scrapeGoogleNews(apiKey, 'US'),
    ])

    const au = auHeadlines.status === 'fulfilled' ? auHeadlines.value : []
    const us = usHeadlines.status === 'fulfilled' ? usHeadlines.value : []
    const allHeadlines = [...au, ...us]

    if (!allHeadlines.length) {
      return res.status(200).json({ error: 'No headlines retrieved', au: au.length, us: us.length })
    }

    // Score celebs
    const mentionCounts = scoreCelebs(allHeadlines)

    // Detect unknown trending names
    const suggestions = detectUnknowns(allHeadlines)

    // Build buzz scores
    const buzzScores = {}
    CELEB_NAMES.forEach(([id]) => {
      buzzScores[id] = {
        mentions: mentionCounts[id] || 0,
        buzz: mentionsToBuzz(mentionCounts[id] || 0, 70),
      }
    })

    // Get top headlines for buzz feed (deduplicated)
    const seen = new Set()
    const topHeadlines = allHeadlines
      .filter(h => {
        if (!h.title || seen.has(h.title)) return false
        seen.add(h.title)
        return true
      })
      .slice(0, 30)
      .map(h => ({
        title: h.title,
        source: h.source,
        time: h.time,
        link: h.link,
        // Which celeb does this headline mention?
        celebId: CELEB_NAMES.find(([, , aliases]) =>
          aliases.some(a => h.title?.toLowerCase().includes(a.toLowerCase()))
        )?.[0] || null,
      }))

    return res.status(200).json({
      status: 'ok',
      scrapedAt: new Date().toISOString(),
      headlineCount: allHeadlines.length,
      auCount: au.length,
      usCount: us.length,
      buzzScores,
      topHeadlines,
      suggestions,
    })

  } catch (err) {
    return res.status(200).json({ error: err.message, stack: err.stack })
  }
}
