import React, { useEffect, useRef } from 'react'

// 0..100 dengan tick tiap 2%, label tiap 10
const STEPS = 50

function Ticks() {
  return Array.from({ length: STEPS + 1 }, (_, i) => {
    const major = i % 5 === 0
    return (
      <div
        key={i}
        className="absolute right-0 flex -translate-y-1/2 items-center"
        style={{ top: `${(i / STEPS) * 100}%` }}
      >
        {major && <span className="mr-1.5 font-mono text-[9px] leading-none">{i * 2}</span>}
        <span className={`block h-px bg-current ${major ? 'w-4' : 'w-2'}`} />
      </div>
    )
  })
}

function ScrollRuler() {
  const rootRef = useRef(null)
  const trackRef = useRef(null)
  const fillRef = useRef(null)
  const dotRef = useRef(null)
  const labelRef = useRef(null)
  const dragging = useRef(false)

  useEffect(() => {
    let raf = 0

    const update = () => {
      raf = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      const pct = p * 100
      if (dotRef.current) dotRef.current.style.top = `${pct}%`
      if (fillRef.current) fillRef.current.style.clipPath = `inset(0 0 ${100 - pct}% 0)`
      if (labelRef.current) labelRef.current.textContent = Math.round(pct)
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    // tinggi halaman berubah saat pindah rute atau konten dimuat
    const ro = new ResizeObserver(schedule)
    ro.observe(document.body)

    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      ro.disconnect()
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  const seek = (e) => {
    const r = trackRef.current.getBoundingClientRect()
    const ratio = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height))
    const max = document.documentElement.scrollHeight - window.innerHeight
    window.scrollTo({ top: ratio * max })
  }

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="page muted fixed bottom-0 right-0 top-14 z-40 hidden w-12 cursor-pointer touch-none select-none border-l hair md:block"
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId)
        dragging.current = true
        seek(e)
      }}
      onPointerMove={(e) => dragging.current && seek(e)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
    >
      <div ref={trackRef} className="absolute inset-x-0 inset-y-4">
        {/* lapisan dasar: tick abu-abu */}
        <Ticks />

        {/* lapisan terisi: tick yang sudah dilewati berwarna aksen */}
        <div ref={fillRef} className="accent pointer-events-none absolute inset-0">
          <Ticks />
        </div>

        {/* penanda posisi berbentuk titik */}
        <div
          ref={dotRef}
          className="accent pointer-events-none absolute right-0 flex -translate-y-1/2 items-center"
        >
          <span ref={labelRef} className="mr-1.5 font-mono text-[10px] font-medium leading-none">0</span>
          <span className="h-2.5 w-2.5 rounded-full bg-current ring-2 ring-neo-light-bg dark:ring-neo-dark-bg" />
          <span className="h-px w-5 bg-current" />
        </div>
      </div>
    </div>
  )
}

export default ScrollRuler