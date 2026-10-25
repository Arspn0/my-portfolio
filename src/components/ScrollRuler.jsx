import React, { useEffect, useRef, useState } from 'react'

const PAD = 10        // jarak track ke tepi atas dan bawah penggaris (px)
const TARGET_GAP = 13 // jarak ideal antar tick kecil (px)

// jumlah tick selalu kelipatan 10 supaya angka jatuh tepat di 0, 10, 20 ... 100
const tickCount = (h) => Math.min(80, Math.max(20, Math.round(h / (TARGET_GAP * 10)) * 10))

// posisi y bulat (px) untuk progres p (0..1); dipakai tick, titik, dan label agar sejajar
const posY = (p, h) => Math.min(h - 1, Math.round(p * h))

function Ticks({ h, n, active }) {
  const per = n / 10 // jumlah tick per interval angka (10%)
  const items = []
  for (let i = 0; i <= n; i++) {
    const y = posY(i / n, h)
    const major = i % per === 0
    const tone = i <= active ? 'accent' : ''
    items.push(
      <span
        key={`t${i}`}
        className={`absolute right-0 block bg-current ${tone}`}
        style={{ top: y, height: 1, width: major ? 14 : 7 }}
      />
    )
    if (major) {
      items.push(
        <span
          key={`l${i}`}
          className={`absolute font-mono text-[9px] ${tone}`}
          style={{
            top: Math.min(Math.max(y - 5, 0), h - 10), // label tetap di dalam track di ujung
            right: 19,
            height: 10,
            lineHeight: '10px',
          }}
        >
          {(i / per) * 10}
        </span>
      )
    }
  }
  return items
}

function ScrollRuler() {
  const rootRef = useRef(null)
  const trackRef = useRef(null)
  const dotRef = useRef(null)
  const labelRef = useRef(null)
  const hRef = useRef(600)
  const nRef = useRef(50)
  const dragging = useRef(false)
  const [h, setH] = useState(600)
  const [active, setActive] = useState(0)
  const n = tickCount(h)

  useEffect(() => {
    let raf = 0

    const update = () => {
      raf = 0
      const H = hRef.current
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      if (dotRef.current) dotRef.current.style.top = `${posY(p, H)}px`
      if (labelRef.current) labelRef.current.textContent = Math.round(p * 100)
      // tick berubah warna hanya saat titik melewati tick berikutnya
      setActive(Math.min(nRef.current, Math.floor(p * nRef.current + 1e-6)))
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    const measure = () => {
      const H = Math.max(40, Math.floor(rootRef.current.clientHeight - PAD * 2))
      hRef.current = H
      nRef.current = tickCount(H)
      setH(H)
      schedule()
    }

    measure()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', measure)
    // tinggi halaman berubah saat pindah rute atau gambar selesai dimuat
    const ro = new ResizeObserver(schedule)
    ro.observe(document.body)

    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', measure)
      ro.disconnect()
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  const seek = (e) => {
    const r = trackRef.current.getBoundingClientRect()
    const ratio = Math.min(1, Math.max(0, (e.clientY - r.top) / (hRef.current - 1)))
    const max = document.documentElement.scrollHeight - window.innerHeight
    window.scrollTo({ top: ratio * max })
  }

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="muted fixed bottom-0 right-0 top-14 z-40 hidden w-[calc(var(--ruler-w)+1px)] cursor-pointer touch-none select-none hair md:block"
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId)
        dragging.current = true
        seek(e)
      }}
      onPointerMove={(e) => dragging.current && seek(e)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
    >
      <div ref={trackRef} className="absolute inset-x-0" style={{ top: PAD, height: h }}>
        <Ticks h={h} n={n} active={active} />

        {/* titik: wrapper setinggi 1px agar pusatnya tepat di garis tick */}
        <div
          ref={dotRef}
          className="accent pointer-events-none absolute right-0 h-px w-0"
          style={{ top: 0 }}
        >
          <span className="absolute right-0 block h-px w-5 bg-current" />
          <span
            className="absolute block rounded-full bg-current ring-2 ring-neo-light-bg dark:ring-neo-dark-bg"
            style={{ right: 20, top: -5, width: 11, height: 11 }}
          />
          <span
            ref={labelRef}
            className="absolute text-right font-mono text-[10px] font-medium"
            style={{ right: 36, top: -5, height: 11, lineHeight: '11px', width: 22 }}
          >
            0
          </span>
        </div>
      </div>
    </div>
  )
}

export default ScrollRuler