import React, { useEffect, useState } from 'react'
import { Eye, Heart } from 'lucide-react'

const ENDPOINT = '/.netlify/functions/stats'

// Angka baru tampil setelah mencapai batas ini. Saat testing isi VITE_STATS_MIN=0 di .env
const parsed = Number(import.meta.env.VITE_STATS_MIN ?? 100)
const MIN = Number.isFinite(parsed) ? parsed : 100

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
    try {
      setStats(await call('like'))
    } catch (err) {
      console.warn('Like gagal:', err.message)
    } finally {
      setBusy(false)
    }
  }

  // jika function tidak tersedia, footer tetap tampil normal tanpa bagian ini
  if (!stats) return null

  const showVisitors = stats.visitors >= MIN
  const showLikes = stats.likes >= MIN

  return (
    <div className="flex items-center gap-4">
      {showVisitors && (
        <span className="flex items-center gap-2">
          <Eye size={14} aria-hidden="true" />
          {stats.visitors.toLocaleString()} {stats.visitors === 1 ? 'visitor' : 'visitors'}
        </span>
      )}
      <button
        type="button"
        onClick={handleLike}
        aria-pressed={stats.liked}
        aria-label={stats.liked ? 'You liked this site' : 'Like this site'}
        className="btn !px-3 !py-2"
      >
        <Heart size={14} fill={stats.liked ? 'currentColor' : 'none'} aria-hidden="true" />
        {showLikes ? stats.likes.toLocaleString() : stats.liked ? 'Liked' : 'Like'}
      </button>
    </div>
  )
}

export default FooterStats