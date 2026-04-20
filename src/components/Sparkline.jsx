export default function Sparkline({ data, isUp, width = 120, height = 36 }) {
  if (!data || data.length < 2) return null

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - ((v - min) / range) * height
    return `${x},${y}`
  }).join(' ')

  const fillPoints = `0,${height} ${points} ${width},${height}`
  const color = isUp ? '#00d084' : '#ff4455'
  const fillColor = isUp ? 'rgba(0,208,132,0.08)' : 'rgba(255,68,85,0.08)'

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block' }}>
      <polygon points={fillPoints} fill={fillColor} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}
