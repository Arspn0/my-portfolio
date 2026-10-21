import React, { useEffect, useState } from 'react'
import { Eye, Heart } from 'lucide-react'

const ENDPOINT = '/.netlify/functions/stats'

async function call(action) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action }),
  })
  if (!res.ok) throw new Error(`stats ${res.status}`)
  return res.json()
}

let visitPromise = null // satu kunjungan per pemuatan halaman, walau Footer dirender ulang

function FooterStats() {
  const [stats, setStats] = useState(null) // { visitors, likes, liked }
  const [busy, setBusy] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let alive = true
    visitPromise ??= call('visit')
    visitPromise
      .then((data) => alive && setStats(data))
      .catch((err) => {
        visitPromise = null
        console.warn('Statistik tidak dapat dimuat:', err.message)
      })
    return () => {
      alive = false
    }
  }, [])

  const handleLike = async () => {
    if (!stats || stats.liked || busy) return
    setBusy(true)
    setFailed(false)
    try {
      setStats(await call('like'))
    } catch (err) {
      console.warn('Like gagal:', err.message)
      setFailed(true)
      setTimeout(() => setFailed(false), 3000)
    } finally {
      setBusy(false)
    }
  }

  // jika function tidak tersedia, footer tetap tampil normal tanpa bagian ini
  if (!stats) return null

  return (
    <div className="flex items-center gap-4">
      <span className="flex items-center gap-2">
        <Eye size={14} aria-hidden="true" />
        {stats.visitors.toLocaleString()} {stats.visitors === 1 ? 'visitor' : 'visitors'}
      </span>
      <button
        type="button"
        onClick={handleLike}
        aria-pressed={stats.liked}
        aria-label="Like this site"
        className="btn !px-3 !py-2"
      >
        <Heart
          size={14}
          fill={stats.liked ? 'currentColor' : 'none'}
          style={stats.liked ? { color: '#EA4335' } : undefined}
          aria-hidden="true"
        />
        {stats.likes.toLocaleString()}
      </button>
      <span role="status" aria-live="polite" className="accent">
        {failed && 'Try again later'}
      </span>
    </div>
  )
}

export default FooterStats