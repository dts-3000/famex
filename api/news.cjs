// api/news.js — Vercel serverless function (CommonJS)
module.exports = async function handler(req, res) {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*')

    const { q } = req.query

    // Check env vars
    const apiKey = process.env.NEWS_API_KEY || process.env.VITE_NEWS_API_KEY
    if (!apiKey) {
      return res.status(200).json({
        status: 'error',
        step: 'env_check',
        message: 'No API key found in environment variables',
      })
    }

    // Check query param
    if (!q) {
      return res.status(200).json({
        status: 'error',
        step: 'query_check',
        message: 'No q param — but API key found OK',
        keyLength: apiKey.length,
      })
    }

    // Fetch from NewsAPI
    const from = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&from=${from}&sortBy=publishedAt&pageSize=100&language=en&apiKey=${apiKey}`

    const response = await fetch(url)
    const data = await response.json()

    if (data.status !== 'ok') {
      return res.status(200).json({
        status: 'error',
        step: 'newsapi_response',
        message: data.message,
        code: data.code,
      })
    }

    return res.status(200).json({
      status: 'ok',
      name: q,
      totalMentions: data.totalResults,
      recentArticles: (data.articles || []).slice(0, 5).map(a => ({
        title: a.title,
        source: a.source && a.source.name,
        publishedAt: a.publishedAt,
        url: a.url,
      }))
    })

  } catch (err) {
    return res.status(200).json({
      status: 'crashed',
      message: err.message,
      stack: err.stack,
    })
  }
}
