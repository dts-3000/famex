// api/scrape.js — Vercel serverless function (CommonJS)
// Scrapes Google News via ScrapingBee

const CELEB_NAMES = [
  ['tayswift',      ['Taylor Swift']],
  ['beyonce',       ['Beyonce', 'Beyoncé']],
  ['adele',         ['Adele']],
  ['edsheeran',     ['Ed Sheeran']],
  ['dualipa',       ['Dua Lipa']],
  ['samsmith',      ['Sam Smith']],
  ['tomholland',    ['Tom Holland']],
  ['emmastone',     ['Emma Stone']],
  ['oliviacolman',  ['Olivia Colman']],
  ['idriselba',     ['Idris Elba']],
  ['judidench',     ['Judi Dench']],
  ['barrykeoghan',  ['Barry Keoghan']],
  ['lewishamilton', ['Lewis Hamilton']],
  ['davebeckham',   ['David Beckham', 'Beckham']],
  ['bukayosaka',    ['Bukayo Saka', 'Saka']],
  ['bellingham',    ['Jude Bellingham', 'Bellingham']],
  ['andymurray',    ['Andy Murray']],
  ['benstokes',     ['Ben Stokes']],
  ['caitlinclark',  ['Caitlin Clark']],
  ['maxverstappen', ['Max Verstappen', 'Verstappen']],
  ['keirmstarmer',  ['Keir Starmer', 'Starmer']],
  ['trump',         ['Donald Trump', 'Trump']],
  ['albanese',      ['Anthony Albanese', 'Albanese']],
  ['nigelfar',      ['Nigel Farage', 'Farage']],
  ['princewilliam', ['Prince William']],
  ['harryprince',   ['Prince Harry']],
  ['elonmusk',      ['Elon Musk', 'Musk']],
  ['damiansmith',   ['Damian Smith']],
  ['billieeilish',  ['Billie Eilish']],
  ['arianagrande',  ['Ariana Grande']],
  ['harrystyles',   ['Harry Styles']],
  ['drake',         ['Drake']],
  ['rihanna',       ['Rihanna']],
  ['kanyewest',     ['Kanye West', 'Kanye', 'Ye']],
  ['ladygaga',      ['Lady Gaga']],
  ['cristiano',     ['Cristiano Ronaldo', 'Ronaldo']],
  ['leomessi',      ['Lionel Messi', 'Messi']],
  ['lebron',        ['LeBron James', 'LeBron']],
  ['erling',        ['Erling Haaland', 'Haaland']],
  ['jeffbezos',     ['Jeff Bezos', 'Bezos']],
  ['markzuckerberg',['Mark Zuckerberg', 'Zuckerberg']],
  ['billgates',     ['Bill Gates']],
  ['samaltman',     ['Sam Altman']],
  ['kimkardashian', ['Kim Kardashian', 'Kardashian']],
  ['kyliejenner',   ['Kylie Jenner']],
  ['oprah',         ['Oprah Winfrey', 'Oprah']],
  ['vladiputin',    ['Vladimir Putin', 'Putin']],
  ['volodymyrzel',  ['Volodymyr Zelensky', 'Zelensky']],
  ['meghanmarkle',  ['Meghan Markle', 'Meghan']],
  ['dwaynejo',      ['Dwayne Johnson', 'The Rock']],
  ['ryanreynolds',  ['Ryan Reynolds']],
  ['margotrobbie',  ['Margot Robbie']],
  ['scarjo',        ['Scarlett Johansson']],
  ['bradpitt',      ['Brad Pitt']],
  ['nicolekidman',  ['Nicole Kidman']],
  ['chrishemsworth',['Chris Hemsworth']],
  ['oliviarodrigo', ['Olivia Rodrigo']],
  ['sabcarp',       ['Sabrina Carpenter']],
  ['kendricklamar', ['Kendrick Lamar']],
  ['emmanuelmacron',['Emmanuel Macron', 'Macron']],
  ['justintrudeau', ['Justin Trudeau', 'Trudeau']],
  ['borisjo',       ['Boris Johnson', 'Boris']],
  ['scottmorrison', ['Scott Morrison']],
  ['charleskoen',   ['King Charles']],
  ['queencamilla',  ['Queen Camilla']],
  ['kyliemin',      ['Kylie Minogue']],
  ['zendaya',       ['Zendaya']],
  ['timcook',       ['Tim Cook']],
  ['serenaswilliams',['Serena Williams']],
  ['rogerfederer',  ['Roger Federer', 'Federer']],
  ['tigerwoods',    ['Tiger Woods']],
  ['tombrady',      ['Tom Brady']],
  ['stephanicurry', ['Stephen Curry', 'Steph Curry']],
  ['patmahomes',    ['Patrick Mahomes', 'Mahomes']],
  ['anthonyjoshua', ['Anthony Joshua']],
  ['tysonfury',     ['Tyson Fury']],
  ['mileycyrus',    ['Miley Cyrus']],
  ['selenagomez',   ['Selena Gomez']],
  ['justinbieber',  ['Justin Bieber']],
  ['kamallaharris', ['Kamala Harris']],
  ['joebiden',      ['Joe Biden', 'Biden']],
  ['rishi',         ['Rishi Sunak', 'Sunak']],
  ['jacindaardern', ['Jacinda Ardern']],
  ['gretathunberg', ['Greta Thunberg']],
  ['robertdowney',  ['Robert Downey']],
  ['leonardodicap', ['Leonardo DiCaprio', 'DiCaprio']],
  ['keanugreeves',  ['Keanu Reeves']],
  ['willsmith',     ['Will Smith']],
  ['princeedward',  ['Prince Edward']],
  ['princessanne',  ['Princess Anne']],
  ['jackdorsey',    ['Jack Dorsey']],
  ['sundar',        ['Sundar Pichai']],
  ['neymarjr',      ['Kylian Mbappe', 'Mbappé', 'Mbappe']],
  ['simonebilessp', ['Simone Biles']],
  ['cateblanchett', ['Cate Blanchett']],
  ['merylstreep',   ['Meryl Streep']],
  ['annehathaway',  ['Anne Hathaway']],
]

function scoreCelebs(text) {
  const scores = {}
  CELEB_NAMES.forEach(([id, aliases]) => {
    let count = 0
    aliases.forEach(alias => {
      const regex = new RegExp(alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
      const matches = text.match(regex)
      if (matches) count += matches.length
    })
    scores[id] = count
  })
  return scores
}

function mentionsToBuzz(count) {
  if (count === 0)  return null  // null = don't override, keep existing
  if (count >= 10) return 95
  if (count >= 6)  return 85
  if (count >= 3)  return 75
  if (count >= 1)  return 65
  return null
}

function detectUnknowns(text) {
  const knownNames = CELEB_NAMES.flatMap(([, aliases]) => aliases.map(a => a.toLowerCase()))
  const namePattern = /\b([A-Z][a-z]{2,}(?:\s+[A-Z][a-z]{2,})+)\b/g
  const found = {}
  let match
  while ((match = namePattern.exec(text)) !== null) {
    const name = match[1]
    if (name.split(' ').length >= 2 && !knownNames.some(k => k === name.toLowerCase())) {
      found[name] = (found[name] || 0) + 1
    }
  }
  return Object.entries(found)
    .filter(([, count]) => count >= 3)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([name, count]) => ({
      name, count,
      suggestedBuzzBase:   count >= 8 ? 82 : count >= 5 ? 72 : 62,
      suggestedPrice:      count >= 8 ? 26 : count >= 5 ? 18 : 12,
      suggestedVolatility: 0.035,
      suggestedDecayRate:  0.90,
    }))
}

async function fetchGoogleNews(apiKey, country) {
  const url = `https://news.google.com/rss?hl=en-${country}&gl=${country}&ceid=${country}:en`
  
  const params = new URLSearchParams({
    api_key: apiKey,
    url,
    render_js: 'false',  // RSS doesn't need JS rendering — saves credits!
  })

  const response = await fetch(`https://app.scrapingbee.com/api/v1/?${params}`)
  if (!response.ok) throw new Error(`ScrapingBee ${response.status}: ${await response.text()}`)
  
  const xml = await response.text()
  
  // Parse RSS XML to extract headlines
  const titles = []
  const items = xml.match(/<item>[\s\S]*?<\/item>/g) || []
  
  items.forEach(item => {
    const titleMatch = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || item.match(/<title>(.*?)<\/title>/)
    const linkMatch  = item.match(/<link>(.*?)<\/link>/)
    const sourceMatch = item.match(/<source[^>]*>(.*?)<\/source>/)
    const pubMatch   = item.match(/<pubDate>(.*?)<\/pubDate>/)
    
    if (titleMatch) {
      titles.push({
        title:  titleMatch[1].trim(),
        link:   linkMatch?.[1]?.trim() || '',
        source: sourceMatch?.[1]?.trim() || `Google News ${country}`,
        time:   pubMatch?.[1]?.trim() || '',
      })
    }
  })

  return titles
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Cache-Control', 's-maxage=7200') // Cache for 2 hours at Vercel edge

  const apiKey = process.env.SCRAPING_BEE_KEY
  if (!apiKey) {
    return res.status(200).json({ error: 'SCRAPING_BEE_KEY not set' })
  }

  try {
    // Fetch AU and US RSS feeds in parallel — only 2 credits!
    const [auResult, usResult] = await Promise.allSettled([
      fetchGoogleNews(apiKey, 'AU'),
      fetchGoogleNews(apiKey, 'US'),
    ])

    const au = auResult.status === 'fulfilled' ? auResult.value : []
    const us = usResult.status === 'fulfilled' ? usResult.value : []
    const allHeadlines = [...au, ...us]

    if (!allHeadlines.length) {
      return res.status(200).json({
        error: 'No headlines retrieved',
        au: au.length, us: us.length,
        auError: auResult.reason?.message,
        usError: usResult.reason?.message,
      })
    }

    const allText = allHeadlines.map(h => h.title).join(' ')

    // Score celebs by mention count
    const mentionCounts = scoreCelebs(allText)
    const buzzScores = {}
    CELEB_NAMES.forEach(([id]) => {
      const buzz = mentionsToBuzz(mentionCounts[id] || 0)
      if (buzz !== null) buzzScores[id] = { mentions: mentionCounts[id], buzz }
    })

    // Detect unknown trending names
    const suggestions = detectUnknowns(allText)

    // Deduplicated headlines with celeb tag
    const seen = new Set()
    const topHeadlines = allHeadlines
      .filter(h => { if (seen.has(h.title)) return false; seen.add(h.title); return true })
      .slice(0, 40)
      .map(h => ({
        ...h,
        celebId: CELEB_NAMES.find(([, aliases]) =>
          aliases.some(a => h.title.toLowerCase().includes(a.toLowerCase()))
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
    return res.status(200).json({ error: err.message })
  }
}
