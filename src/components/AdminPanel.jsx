import { useState, useRef } from 'react'

const ADMIN_PASSWORD = 'famex2024'
const SECTORS = ['Music', 'Film & TV', 'Sport', 'Politics', 'Royals', 'Tech']

const inputStyle = {
  background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8, padding: '8px 12px', color: '#f0ede8',
  fontFamily: "'DM Mono', monospace", fontSize: 13, width: '100%', outline: 'none',
}
const btnStyle = (color = '#378ADD') => ({
  padding: '8px 16px', borderRadius: 8, border: `1px solid ${color}`,
  background: `${color}18`, color, fontFamily: "'Syne', sans-serif",
  fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
})
const cardStyle = {
  background: '#111111', border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: 12, padding: '20px', marginBottom: 16,
}
const labelStyle = {
  fontSize: 10, color: '#555550', fontFamily: "'DM Mono', monospace",
  textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6, display: 'block',
}

// Parse a CSV string into celeb objects
function parseCSV(text) {
  const lines = text.trim().split('\n').filter(l => l.trim())
  if (lines.length < 2) throw new Error('CSV must have a header row and at least one data row')

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
  const required = ['id', 'name', 'emoji', 'sector', 'baseprice', 'volatility', 'buzzbase', 'buzzDecayRate'.toLowerCase()]
  const missing = required.filter(r => !headers.includes(r))
  if (missing.length) throw new Error(`Missing columns: ${missing.join(', ')}`)

  const celebs = []
  const errors = []

  lines.slice(1).forEach((line, i) => {
    if (!line.trim()) return
    // Handle commas inside quoted fields
    const cols = line.match(/(".*?"|[^,]+)(?=,|$)/g) || line.split(',')
    const row = {}
    headers.forEach((h, j) => { row[h] = (cols[j] || '').replace(/^"|"$/g, '').trim() })

    // Validate
    const rowNum = i + 2
    if (!row.id || !/^[a-z0-9]+$/.test(row.id)) { errors.push(`Row ${rowNum}: id must be lowercase letters/numbers only`); return }
    if (!row.name) { errors.push(`Row ${rowNum}: name is required`); return }
    if (!SECTORS.includes(row.sector)) { errors.push(`Row ${rowNum}: sector must be one of ${SECTORS.join(', ')}`); return }
    const price = parseFloat(row.baseprice)
    const vol = parseFloat(row.volatility)
    const buzz = parseInt(row.buzzbase)
    const decay = parseFloat(row.buzzDecayRate || row.buzzdecayrate || '0.90')
    if (isNaN(price) || price <= 0) { errors.push(`Row ${rowNum}: basePrice must be a positive number`); return }
    if (isNaN(vol) || vol < 0.01 || vol > 0.15) { errors.push(`Row ${rowNum}: volatility must be between 0.01 and 0.15`); return }
    if (isNaN(buzz) || buzz < 0 || buzz > 100) { errors.push(`Row ${rowNum}: buzzBase must be 0–100`); return }

    celebs.push({
      id: row.id, name: row.name, emoji: row.emoji || '⭐',
      sector: row.sector, basePrice: price, volatility: vol,
      buzzBase: buzz, buzzDecayRate: isNaN(decay) ? 0.90 : decay,
    })
  })

  return { celebs, errors }
}

function getAllCelebsFromState(state) {
  const allKnown = [
    { id:'tayswift', name:'Taylor Swift', emoji:'🎤', sector:'Music', basePrice:42, volatility:0.035, buzzBase:88 },
    { id:'beyonce', name:'Beyoncé', emoji:'👑', sector:'Music', basePrice:38, volatility:0.030, buzzBase:85 },
    { id:'adele', name:'Adele', emoji:'🎵', sector:'Music', basePrice:29, volatility:0.025, buzzBase:78 },
    { id:'edsheeran', name:'Ed Sheeran', emoji:'🎸', sector:'Music', basePrice:26, volatility:0.028, buzzBase:75 },
    { id:'dualipa', name:'Dua Lipa', emoji:'💃', sector:'Music', basePrice:24, volatility:0.032, buzzBase:80 },
    { id:'samsmith', name:'Sam Smith', emoji:'🎼', sector:'Music', basePrice:19, volatility:0.028, buzzBase:68 },
    { id:'tomholland', name:'Tom Holland', emoji:'🕷️', sector:'Film & TV', basePrice:23, volatility:0.032, buzzBase:76 },
    { id:'emmastone', name:'Emma Stone', emoji:'🎬', sector:'Film & TV', basePrice:20, volatility:0.026, buzzBase:70 },
    { id:'oliviacolman', name:'Olivia Colman', emoji:'🏆', sector:'Film & TV', basePrice:17.5, volatility:0.020, buzzBase:65 },
    { id:'idriselba', name:'Idris Elba', emoji:'🎭', sector:'Film & TV', basePrice:18.5, volatility:0.024, buzzBase:67 },
    { id:'judidench', name:'Judi Dench', emoji:'🎩', sector:'Film & TV', basePrice:16, volatility:0.016, buzzBase:62 },
    { id:'barrykeoghan', name:'Barry Keoghan', emoji:'🌟', sector:'Film & TV', basePrice:14.5, volatility:0.038, buzzBase:64 },
    { id:'lewishamilton', name:'Lewis Hamilton', emoji:'🏎️', sector:'Sport', basePrice:24.5, volatility:0.036, buzzBase:77 },
    { id:'davebeckham', name:'David Beckham', emoji:'⚽', sector:'Sport', basePrice:26, volatility:0.028, buzzBase:74 },
    { id:'bukayosaka', name:'Bukayo Saka', emoji:'🦊', sector:'Sport', basePrice:21, volatility:0.038, buzzBase:78 },
    { id:'bellingham', name:'Jude Bellingham', emoji:'⚽', sector:'Sport', basePrice:23.5, volatility:0.042, buzzBase:82 },
    { id:'andymurray', name:'Andy Murray', emoji:'🎾', sector:'Sport', basePrice:17, volatility:0.028, buzzBase:68 },
    { id:'benstokes', name:'Ben Stokes', emoji:'🏏', sector:'Sport', basePrice:15.5, volatility:0.024, buzzBase:65 },
    { id:'caitlinclark', name:'Caitlin Clark', emoji:'🏀', sector:'Sport', basePrice:19.5, volatility:0.048, buzzBase:83 },
    { id:'maxverstappen', name:'Max Verstappen', emoji:'🏁', sector:'Sport', basePrice:22, volatility:0.038, buzzBase:76 },
    { id:'keirmstarmer', name:'Keir Starmer', emoji:'🏛️', sector:'Politics', basePrice:14, volatility:0.048, buzzBase:80 },
    { id:'trump', name:'Donald Trump', emoji:'🇺🇸', sector:'Politics', basePrice:35, volatility:0.085, buzzBase:95 },
    { id:'albanese', name:'Anthony Albanese', emoji:'🇦🇺', sector:'Politics', basePrice:13, volatility:0.042, buzzBase:74 },
    { id:'nigelfar', name:'Nigel Farage', emoji:'🍺', sector:'Politics', basePrice:12, volatility:0.065, buzzBase:78 },
    { id:'princewilliam', name:'Prince William', emoji:'🎩', sector:'Royals', basePrice:18, volatility:0.020, buzzBase:72 },
    { id:'harryprince', name:'Prince Harry', emoji:'🤴', sector:'Royals', basePrice:15.5, volatility:0.055, buzzBase:82 },
    { id:'elonmusk', name:'Elon Musk', emoji:'🚀', sector:'Tech', basePrice:31, volatility:0.075, buzzBase:92 },
    { id:'damiansmith', name:'Damian Smith', emoji:'🎯', sector:'Tech', basePrice:15, volatility:0.030, buzzBase:65 },
  ]
  return state.active
    .map(id => state.customCelebs?.[id] || allKnown.find(c => c.id === id))
    .filter(Boolean)
}

export default function AdminPanel({ state, onAddCeleb, onRemoveCeleb, onUpdateCeleb, onMarketEvent, onClose }) {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [pwError, setPwError] = useState('')
  const [activeSection, setActiveSection] = useState('celebs')
  const [toast, setToast] = useState('')
  const [newCeleb, setNewCeleb] = useState({ name: '', emoji: '⭐', sector: 'Music', basePrice: 20, volatility: 0.03, buzzBase: 70 })
  const [editingId, setEditingId] = useState(null)
  const [editVals, setEditVals] = useState({})
  const [eventTarget, setEventTarget] = useState('')
  const [eventType, setEventType] = useState('boom')
  const [eventHeadline, setEventHeadline] = useState('')

  // CSV state
  const [csvDragOver, setCsvDragOver] = useState(false)
  const [csvPreview, setCsvPreview] = useState([])
  const [csvErrors, setCsvErrors] = useState([])
  const [csvFileName, setCsvFileName] = useState('')
  const fileInputRef = useRef()

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3500) }

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) { setAuthed(true); setPwError('') }
    else { setPwError('Incorrect password'); setPassword('') }
  }

  const handleAddCeleb = () => {
    if (!newCeleb.name.trim()) { showToast('Name is required'); return }
    const id = newCeleb.name.toLowerCase().replace(/[^a-z0-9]/g, '')
    onAddCeleb({ ...newCeleb, id, basePrice: Number(newCeleb.basePrice), volatility: Number(newCeleb.volatility), buzzBase: Number(newCeleb.buzzBase), buzzDecayRate: 0.90 })
    setNewCeleb({ name: '', emoji: '⭐', sector: 'Music', basePrice: 20, volatility: 0.03, buzzBase: 70 })
    showToast(`✅ ${newCeleb.name} added!`)
  }

  const startEdit = (id) => {
    const allCelebs = getAllCelebsFromState(state)
    const c = allCelebs.find(x => x.id === id)
    if (!c) return
    setEditingId(id)
    setEditVals({ basePrice: state.prices[id] || c.basePrice, buzz: Math.round(state.buzz[id] || c.buzzBase), volatility: c.volatility, buzzBase: c.buzzBase })
  }

  const saveEdit = (id) => {
    onUpdateCeleb(id, { price: Number(editVals.basePrice), buzz: Number(editVals.buzz), volatility: Number(editVals.volatility), buzzBase: Number(editVals.buzzBase) })
    setEditingId(null)
    showToast('✅ Celebrity updated')
  }

  const fireEvent = () => {
    if (!eventTarget) { showToast('Select a celebrity'); return }
    const headline = eventHeadline.trim() ||
      (eventType === 'boom' ? `🚀 ${getAllCelebsFromState(state).find(c=>c.id===eventTarget)?.name} goes viral — shares surge!` :
       eventType === 'crash' ? `💥 ${getAllCelebsFromState(state).find(c=>c.id===eventTarget)?.name} in crisis — shares plummet!` :
       `📰 Breaking: ${getAllCelebsFromState(state).find(c=>c.id===eventTarget)?.name} in the news`)
    onMarketEvent(eventTarget, eventType, headline)
    setEventHeadline('')
    showToast(`🎯 Event fired!`)
  }

  // CSV handling
  const handleCSVFile = (file) => {
    if (!file || !file.name.endsWith('.csv')) { showToast('Please upload a .csv file'); return }
    setCsvFileName(file.name)
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const { celebs, errors } = parseCSV(e.target.result)
        setCsvPreview(celebs)
        setCsvErrors(errors)
      } catch (err) {
        setCsvErrors([err.message])
        setCsvPreview([])
      }
    }
    reader.readAsText(file)
  }

  const handleCSVImport = () => {
    if (!csvPreview.length) return
    csvPreview.forEach(c => onAddCeleb(c))
    showToast(`✅ ${csvPreview.length} celebrities imported!`)
    setCsvPreview([])
    setCsvErrors([])
    setCsvFileName('')
  }

  const downloadTemplate = () => {
    const csv = `id,name,emoji,sector,basePrice,volatility,buzzBase,buzzDecayRate\nbillieeilish,Billie Eilish,🖤,Music,28.00,0.038,84,0.91\ncristiano,Cristiano Ronaldo,⚽,Sport,38.00,0.045,90,0.92`
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'famex-celebs-template.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  if (!authed) {
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
        <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 40, width: 340, textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🔐</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#f0ede8', marginBottom: 4, fontFamily: "'Syne', sans-serif" }}>Admin Access</div>
          <div style={{ fontSize: 12, color: '#555550', fontFamily: "'DM Mono', monospace", marginBottom: 24 }}>FameX control panel</div>
          <input type="password" placeholder="Enter password" value={password}
            onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()}
            style={{ ...inputStyle, textAlign: 'center', marginBottom: 12, fontSize: 15 }} />
          {pwError && <div style={{ color: '#ff4455', fontSize: 12, fontFamily: "'DM Mono', monospace", marginBottom: 12 }}>{pwError}</div>}
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={onClose} style={{ ...btnStyle('#888'), flex: 1 }}>Cancel</button>
            <button onClick={handleLogin} style={{ ...btnStyle('#f5c842'), flex: 1 }}>Enter</button>
          </div>
        </div>
      </div>
    )
  }

  const allCelebs = getAllCelebsFromState(state)

  const sectionBtn = (id, label) => (
    <button key={id} onClick={() => setActiveSection(id)} style={{
      ...btnStyle(activeSection === id ? '#f5c842' : '#555'),
      background: activeSection === id ? 'rgba(245,200,66,0.12)' : 'transparent',
    }}>{label}</button>
  )

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 1000, overflowY: 'auto', padding: '20px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#f0ede8', fontFamily: "'Syne', sans-serif" }}>
              Fame<span style={{ color: '#f5c842' }}>X</span> Admin
            </div>
            <div style={{ fontSize: 11, color: '#555550', fontFamily: "'DM Mono', monospace" }}>
              {allCelebs.length} active celebs · ${Math.round(state.cash).toLocaleString()} player cash
            </div>
          </div>
          <button onClick={onClose} style={{ ...btnStyle('#ff4455') }}>✕ Close</button>
        </div>

        {/* Nav */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {sectionBtn('celebs', '👥 Manage Celebs')}
          {sectionBtn('add', '➕ Add Celeb')}
          {sectionBtn('csv', '📂 CSV Upload')}
          {sectionBtn('events', '💥 Market Events')}
        </div>

        {/* MANAGE CELEBS */}
        {activeSection === 'celebs' && (
          <div>
            <div style={{ fontSize: 13, color: '#888', fontFamily: "'DM Mono', monospace", marginBottom: 16 }}>
              Click Edit to adjust price, buzz & volatility. Delist removes them immediately.
            </div>
            {allCelebs.map(c => {
              const isEditing = editingId === c.id
              const price = state.prices[c.id] || 0
              const buzz = Math.round(state.buzz[c.id] || 0)
              const holding = state.holdings[c.id]?.qty || 0
              return (
                <div key={c.id} style={{ ...cardStyle, borderColor: isEditing ? 'rgba(245,200,66,0.3)' : 'rgba(255,255,255,0.07)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 22 }}>{c.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: '#f0ede8', fontFamily: "'Syne', sans-serif" }}>{c.name}</div>
                      <div style={{ fontSize: 11, color: '#555550', fontFamily: "'DM Mono', monospace" }}>
                        {c.sector} · ${price.toFixed(2)} · buzz {buzz}/100 · {holding} shares held
                      </div>
                    </div>
                    {!isEditing && (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => startEdit(c.id)} style={btnStyle('#378ADD')}>Edit</button>
                        <button onClick={() => { onRemoveCeleb(c.id); showToast(`${c.name} delisted`) }} style={btnStyle('#ff4455')}>Delist</button>
                      </div>
                    )}
                  </div>
                  {isEditing && (
                    <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                      <div><label style={labelStyle}>Price ($)</label><input style={inputStyle} type="number" value={editVals.basePrice} onChange={e => setEditVals(v => ({ ...v, basePrice: e.target.value }))} /></div>
                      <div><label style={labelStyle}>Buzz (0–100)</label><input style={inputStyle} type="number" min="0" max="100" value={editVals.buzz} onChange={e => setEditVals(v => ({ ...v, buzz: e.target.value }))} /></div>
                      <div><label style={labelStyle}>Base Buzz</label><input style={inputStyle} type="number" min="0" max="100" value={editVals.buzzBase} onChange={e => setEditVals(v => ({ ...v, buzzBase: e.target.value }))} /></div>
                      <div><label style={labelStyle}>Volatility</label><input style={inputStyle} type="number" step="0.005" min="0.01" max="0.15" value={editVals.volatility} onChange={e => setEditVals(v => ({ ...v, volatility: e.target.value }))} /></div>
                      <div style={{ gridColumn: 'span 4', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                        <button onClick={() => setEditingId(null)} style={btnStyle('#555')}>Cancel</button>
                        <button onClick={() => saveEdit(c.id)} style={btnStyle('#00d084')}>Save</button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* ADD SINGLE CELEB */}
        {activeSection === 'add' && (
          <div style={cardStyle}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#f0ede8', fontFamily: "'Syne', sans-serif", marginBottom: 20 }}>Add New Celebrity</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px', gap: 12, marginBottom: 12 }}>
              <div><label style={labelStyle}>Name</label><input style={inputStyle} placeholder="e.g. Billie Eilish" value={newCeleb.name} onChange={e => setNewCeleb(v => ({ ...v, name: e.target.value }))} /></div>
              <div><label style={labelStyle}>Emoji</label><input style={inputStyle} placeholder="⭐" value={newCeleb.emoji} onChange={e => setNewCeleb(v => ({ ...v, emoji: e.target.value }))} /></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
              <div>
                <label style={labelStyle}>Sector</label>
                <select style={inputStyle} value={newCeleb.sector} onChange={e => setNewCeleb(v => ({ ...v, sector: e.target.value }))}>
                  {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div><label style={labelStyle}>Price ($)</label><input style={inputStyle} type="number" value={newCeleb.basePrice} onChange={e => setNewCeleb(v => ({ ...v, basePrice: e.target.value }))} /></div>
              <div><label style={labelStyle}>Base Buzz (0–100)</label><input style={inputStyle} type="number" min="0" max="100" value={newCeleb.buzzBase} onChange={e => setNewCeleb(v => ({ ...v, buzzBase: e.target.value }))} /></div>
              <div><label style={labelStyle}>Volatility</label><input style={inputStyle} type="number" step="0.005" min="0.01" max="0.15" value={newCeleb.volatility} onChange={e => setNewCeleb(v => ({ ...v, volatility: e.target.value }))} /></div>
            </div>
            {newCeleb.name && (
              <div style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: 16, marginBottom: 20 }}>
                <div style={{ fontSize: 11, color: '#555550', fontFamily: "'DM Mono', monospace", marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Preview</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 28 }}>{newCeleb.emoji}</span>
                  <div>
                    <div style={{ fontWeight: 700, color: '#f0ede8', fontFamily: "'Syne', sans-serif" }}>{newCeleb.name}</div>
                    <div style={{ fontSize: 11, color: '#555550', fontFamily: "'DM Mono', monospace" }}>{newCeleb.sector} · ${newCeleb.basePrice} · buzz {newCeleb.buzzBase}/100</div>
                  </div>
                  <div style={{ marginLeft: 'auto', fontFamily: "'DM Mono', monospace", fontSize: 18, fontWeight: 500, color: '#f0ede8' }}>${newCeleb.basePrice}</div>
                </div>
              </div>
            )}
            <button onClick={handleAddCeleb} style={{ ...btnStyle('#00d084'), width: '100%', padding: '12px', fontSize: 14 }}>➕ Add to Exchange</button>
          </div>
        )}

        {/* CSV UPLOAD */}
        {activeSection === 'csv' && (
          <div>
            {/* Template download */}
            <div style={cardStyle}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#f0ede8', fontFamily: "'Syne', sans-serif", marginBottom: 8 }}>📂 Bulk CSV Upload</div>
              <div style={{ fontSize: 12, color: '#888', fontFamily: "'DM Mono', monospace", marginBottom: 16, lineHeight: 1.6 }}>
                Upload a CSV file to add multiple celebrities at once. Download the template to get started.
              </div>
              <div style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: 12, marginBottom: 16, fontFamily: "'DM Mono', monospace", fontSize: 11, color: '#555550' }}>
                <div style={{ color: '#f5c842', marginBottom: 4 }}>Required columns:</div>
                id · name · emoji · sector · basePrice · volatility · buzzBase · buzzDecayRate
                <div style={{ color: '#555550', marginTop: 8 }}>Sectors: Music · Film & TV · Sport · Politics · Royals · Tech</div>
              </div>
              <button onClick={downloadTemplate} style={{ ...btnStyle('#378ADD') }}>⬇ Download Template CSV</button>
            </div>

            {/* Drop zone */}
            <div style={cardStyle}>
              <div
                onDragOver={e => { e.preventDefault(); setCsvDragOver(true) }}
                onDragLeave={() => setCsvDragOver(false)}
                onDrop={e => { e.preventDefault(); setCsvDragOver(false); handleCSVFile(e.dataTransfer.files[0]) }}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: `2px dashed ${csvDragOver ? '#f5c842' : 'rgba(255,255,255,0.15)'}`,
                  borderRadius: 10, padding: '40px 20px', textAlign: 'center',
                  cursor: 'pointer', transition: 'all 0.2s',
                  background: csvDragOver ? 'rgba(245,200,66,0.05)' : 'transparent',
                  marginBottom: 16,
                }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>📄</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, color: '#f0ede8', marginBottom: 4 }}>
                  {csvFileName || 'Drop CSV here or click to browse'}
                </div>
                <div style={{ fontSize: 11, color: '#555550', fontFamily: "'DM Mono', monospace" }}>
                  .csv files only
                </div>
                <input ref={fileInputRef} type="file" accept=".csv" style={{ display: 'none' }}
                  onChange={e => handleCSVFile(e.target.files[0])} />
              </div>

              {/* Errors */}
              {csvErrors.length > 0 && (
                <div style={{ background: 'rgba(255,68,85,0.08)', border: '1px solid rgba(255,68,85,0.2)', borderRadius: 8, padding: 12, marginBottom: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#ff4455', fontFamily: "'Syne', sans-serif", marginBottom: 8 }}>⚠️ Errors found:</div>
                  {csvErrors.map((e, i) => (
                    <div key={i} style={{ fontSize: 11, color: '#ff4455', fontFamily: "'DM Mono', monospace", marginBottom: 4 }}>• {e}</div>
                  ))}
                </div>
              )}

              {/* Preview table */}
              {csvPreview.length > 0 && (
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#00d084', fontFamily: "'Syne', sans-serif", marginBottom: 12 }}>
                    ✅ {csvPreview.length} celebrities ready to import:
                  </div>
                  <div style={{ maxHeight: 300, overflowY: 'auto', marginBottom: 16 }}>
                    {csvPreview.map((c, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ fontSize: 18 }}>{c.emoji}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#f0ede8', fontFamily: "'Syne', sans-serif" }}>{c.name}</div>
                          <div style={{ fontSize: 10, color: '#555550', fontFamily: "'DM Mono', monospace" }}>
                            {c.sector} · ${c.basePrice} · buzz {c.buzzBase}/100 · vol {c.volatility}
                          </div>
                        </div>
                        <div style={{ fontSize: 11, color: '#00d084', fontFamily: "'DM Mono', monospace" }}>Ready</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => { setCsvPreview([]); setCsvErrors([]); setCsvFileName('') }} style={{ ...btnStyle('#555'), flex: 1 }}>Cancel</button>
                    <button onClick={handleCSVImport} style={{ ...btnStyle('#00d084'), flex: 2, padding: '12px' }}>
                      ➕ Import {csvPreview.length} Celebrities
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MARKET EVENTS */}
        {activeSection === 'events' && (
          <div>
            <div style={cardStyle}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#f0ede8', fontFamily: "'Syne', sans-serif", marginBottom: 20 }}>Fire a Market Event</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={labelStyle}>Celebrity</label>
                  <select style={inputStyle} value={eventTarget} onChange={e => setEventTarget(e.target.value)}>
                    <option value="">Select a celebrity...</option>
                    {allCelebs.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Event Type</label>
                  <select style={inputStyle} value={eventType} onChange={e => setEventType(e.target.value)}>
                    <option value="boom">🚀 Boom — massive buzz spike (+40)</option>
                    <option value="surge">📈 Surge — buzz spike (+20)</option>
                    <option value="drop">📉 Drop — buzz drop (-20)</option>
                    <option value="crash">💥 Crash — massive buzz crash (-40)</option>
                    <option value="scandal">🔥 Scandal — crash + high volatility</option>
                    <option value="comeback">⭐ Comeback — spike + reset base buzz</option>
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Custom Headline (optional)</label>
                <input style={inputStyle} placeholder="Leave blank for auto-generated headline..." value={eventHeadline} onChange={e => setEventHeadline(e.target.value)} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 20 }}>
                {[
                  { type: 'boom',     label: '🚀 Boom',     desc: 'Buzz +40, price surge', color: '#00d084' },
                  { type: 'surge',    label: '📈 Surge',    desc: 'Buzz +20, price up',    color: '#00d084' },
                  { type: 'drop',     label: '📉 Drop',     desc: 'Buzz -20, price down',  color: '#ff8c00' },
                  { type: 'crash',    label: '💥 Crash',    desc: 'Buzz -40, price fall',  color: '#ff4455' },
                  { type: 'scandal',  label: '🔥 Scandal',  desc: 'Crash + chaos',         color: '#ff4455' },
                  { type: 'comeback', label: '⭐ Comeback', desc: 'Spike + base reset',    color: '#f5c842' },
                ].map(e => (
                  <div key={e.type} onClick={() => setEventType(e.type)} style={{
                    background: eventType === e.type ? `${e.color}12` : '#0a0a0a',
                    border: `1px solid ${eventType === e.type ? e.color : 'rgba(255,255,255,0.07)'}`,
                    borderRadius: 8, padding: '10px 12px', cursor: 'pointer',
                  }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: e.color, fontFamily: "'Syne', sans-serif" }}>{e.label}</div>
                    <div style={{ fontSize: 10, color: '#555550', fontFamily: "'DM Mono', monospace", marginTop: 2 }}>{e.desc}</div>
                  </div>
                ))}
              </div>
              <button onClick={fireEvent} style={{ ...btnStyle('#f5c842'), width: '100%', padding: '12px', fontSize: 14 }}>🎯 Fire Event</button>
            </div>

            {state.news.length > 0 && (
              <div style={cardStyle}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#f0ede8', fontFamily: "'Syne', sans-serif", marginBottom: 12 }}>Recent Headlines</div>
                {state.news.slice(0, 8).map((n, i) => (
                  <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: 12, color: '#888', fontFamily: "'DM Mono', monospace" }}>
                    <span style={{ color: n.dir > 0 ? '#00d084' : n.dir < 0 ? '#ff4455' : '#555' }}>{n.dir > 0 ? '▲' : n.dir < 0 ? '▼' : '·'} </span>
                    {n.headline}
                    <span style={{ color: '#333', marginLeft: 8 }}>{n.pub} {n.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          background: '#1a1a1a', border: '1px solid rgba(245,200,66,0.3)',
          borderRadius: 10, padding: '10px 20px', fontSize: 13,
          fontFamily: "'DM Mono', monospace", color: '#f5c842', zIndex: 2000,
        }}>{toast}</div>
      )}
    </div>
  )
}
