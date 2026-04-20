// src/newsService.js
// Fetches real mention counts from our /api/news proxy
// and converts them into buzz scores (0–100)

// Search terms per celebrity — some need more specific queries
const SEARCH_TERMS = {
  tayswift:      'Taylor Swift',
  beyonce:       'Beyoncé OR Beyonce',
  adele:         'Adele singer',
  edsheeran:     'Ed Sheeran',
  dualipa:       'Dua Lipa',
  samsmith:      'Sam Smith singer',
  tomholland:    'Tom Holland actor',
  emmastone:     'Emma Stone actress',
  oliviacolman:  'Olivia Colman',
  idriselba:     'Idris Elba',
  judidench:     'Judi Dench',
  barrykeoghan:  'Barry Keoghan',
  lewishamilton: 'Lewis Hamilton',
  davebeckham:   'David Beckham',
  bukayosaka:    'Bukayo Saka',
  bellingham:    'Jude Bellingham',
  andymurray:    'Andy Murray tennis',
  benstokes:     'Ben Stokes cricket',
  caitlinclark:  'Caitlin Clark',
  maxverstappen: 'Max Verstappen',
  keirmstarmer:  'Keir Starmer',
  trump:         'Donald Trump',
  albanese:      'Anthony Albanese',
  nigelfar:      'Nigel Farage',
  princewilliam: 'Prince William',
  harryprince:   'Prince Harry',
  elonmusk:      'Elon Musk',
  // Bench
  kyliemin:      'Kylie Minogue',
  zendaya:       'Zendaya',
  rishi:         'Rishi Sunak',
  charleskoen:   'King Charles',
  timcook:       'Tim Cook Apple',
  sabcarp:       'Sabrina Carpenter',
  oscarisaac:    'Oscar Isaac',
  matildaman:    'Matilda Mann',
}

// Fetch mention count for a single celeb
async function fetchMentions(id) {
  const q = SEARCH_TERMS[id]
  if (!q) return null
  try {
    const res = await fetch(`/api/news.cjs?q=${encodeURIComponent(q)}`)
    if (!res.ok) return null
    const data = await res.json()
    return { id, totalMentions: data.totalMentions || 0, articles: data.recentArticles || [] }
  } catch {
    return null
  }
}

// Convert raw mention counts to a 0–100 buzz score
// Uses a log scale so 1000 mentions = ~100, 100 = ~80, 10 = ~55, 1 = ~25, 0 = 5
function mentionsToBuzz(count) {
  if (count <= 0) return 5
  const score = Math.log10(count + 1) / Math.log10(1001) * 100
  return Math.min(100, Math.max(5, score))
}

// Fetch ALL active celebs in batches (respect rate limits)
// NewsAPI free tier: 100 req/day — we fetch all at once on load, then refresh hourly
export async function fetchAllBuzzScores(activeIds) {
  const ids = activeIds.filter(id => SEARCH_TERMS[id])

  // Fetch in small batches to avoid hammering the API
  const BATCH_SIZE = 5
  const results = {}

  for (let i = 0; i < ids.length; i += BATCH_SIZE) {
    const batch = ids.slice(i, i + BATCH_SIZE)
    const fetched = await Promise.all(batch.map(fetchMentions))
    fetched.forEach(r => {
      if (r) results[r.id] = { buzz: mentionsToBuzz(r.totalMentions), mentions: r.totalMentions, articles: r.articles }
    })
    // Small delay between batches
    if (i + BATCH_SIZE < ids.length) {
      await new Promise(resolve => setTimeout(resolve, 300))
    }
  }

  return results
}

// Fetch a single celeb's buzz (used after a news event fires)
export async function fetchSingleBuzz(id) {
  const result = await fetchMentions(id)
  if (!result) return null
  return { buzz: mentionsToBuzz(result.totalMentions), mentions: result.totalMentions, articles: result.articles }
}

export { mentionsToBuzz, SEARCH_TERMS }
