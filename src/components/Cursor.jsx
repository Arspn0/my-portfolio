import React, { useEffect, useRef } from 'react'

const INTERACTIVE = 'a[href], button:not([disabled]), summary, [role="button"], [data-cursor]'
const NATIVE = 'input, textarea, select, [contenteditable="true"]'
const PAD = 6   // jarak bracket ke elemen yang dikunci
const BASE = 28 // ukuran bracket saat tidak mengunci

function Cursor() {
  const boxRef = useRef(null)
  const innerRef = useRef(null)
  const crossRef = useRef(null)
  const labelRef = useRef(null)

  useEffect(() => {
    // hanya untuk perangkat dengan mouse
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ease = reduce ? 1 : 0.25
    const root = document.documentElement
    const box = boxRef.current
    const inner = innerRef.current
    const cross = crossRef.current
    const label = labelRef.current
    root.classList.add('custom-cursor')

    const s = { mx: 0, my: 0, x: 0, y: 0, w: BASE, h: BASE, el: null, box: null, seen: false, raf: 0, text: '' }

    const setLabel = (t) => {
      if (t !== s.text) {
        s.text = t
        label.textContent = t
      }
    }

    const frame = () => {
      s.raf = 0
      if (s.el && !s.el.isConnected) apply(document.elementFromPoint(s.mx, s.my))
      let tx, ty, tw, th
      if (s.box) {
        const r = s.box.getBoundingClientRect()
        tx = r.left - PAD; ty = r.top - PAD; tw = r.width + PAD * 2; th = r.height + PAD * 2
      } else {
        tx = s.mx - BASE / 2; ty = s.my - BASE / 2; tw = BASE; th = BASE
      }
      s.x += (tx - s.x) * ease
      s.y += (ty - s.y) * ease
      s.w += (tw - s.w) * ease
      s.h += (th - s.h) * ease
      box.style.width = `${s.w}px`
      box.style.height = `${s.h}px`
      box.style.transform = `translate3d(${s.x}px, ${s.y}px, 0)`

      const moving =
        Math.abs(tx - s.x) > 0.2 || Math.abs(ty - s.y) > 0.2 ||
        Math.abs(tw - s.w) > 0.2 || Math.abs(th - s.h) > 0.2
      // terus berjalan saat bergerak, atau saat mengunci elemen (mengikuti scroll)
      if (moving || s.el) s.raf = requestAnimationFrame(frame)
    }
    const schedule = () => {
      if (!s.raf) s.raf = requestAnimationFrame(frame)
    }

    const apply = (target) => {
      const native = target && target.closest(NATIVE)
      const el = !native && target ? target.closest(INTERACTIVE) : null
      const show = s.seen && !native

      box.style.opacity = show ? 1 : 0
      cross.style.opacity = show && !el ? 1 : 0

      if (el !== s.el) {
        s.el = el
        s.box = el ? el.querySelector('[data-cursor-box]') || el : null
        box.classList.toggle('accent', !!el)
        box.classList.toggle('ink', !el)
      }
      if (el) {
        setLabel(el.dataset.cursor || (el.tagName === 'A' ? 'click!' : 'press!'))
      } else {
        // koordinat halaman, ikut berubah saat scroll
        setLabel(`x:${Math.round(s.mx + window.scrollX)} y:${Math.round(s.my + window.scrollY)}`)
      }
    }

    const onMove = (e) => {
      s.mx = e.clientX
      s.my = e.clientY
      if (!s.seen) {
        s.seen = true
        s.x = s.mx - BASE / 2
        s.y = s.my - BASE / 2
      }
      cross.style.transform = `translate3d(${s.mx}px, ${s.my}px, 0)`
      apply(e.target)
      schedule()
    }
    const onScroll = () => {
      if (!s.seen) return
      apply(document.elementFromPoint(s.mx, s.my))
      schedule()
    }
    const onDown = () => inner.classList.add('scale-90')
    const onUp = () => inner.classList.remove('scale-90')
    const onLeave = () => {
      s.seen = false
      box.style.opacity = 0
      cross.style.opacity = 0
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    document.addEventListener('mouseleave', onLeave)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      document.removeEventListener('mouseleave', onLeave)
      if (s.raf) cancelAnimationFrame(s.raf)
      root.classList.remove('custom-cursor')
    }
  }, [])

  const corner = 'absolute h-2 w-2 border-current'

  return (
    <>
      {/* Bracket: mengunci elemen interaktif, kalau tidak, melingkupi crosshair */}
      <div
        ref={boxRef}
        aria-hidden="true"
        className="ink pointer-events-none fixed left-0 top-0 z-[9999] opacity-0 transition-opacity duration-150"
        style={{ width: BASE, height: BASE }}
      >
        <div ref={innerRef} className="absolute inset-0 transition-transform duration-150">
          <i className={`${corner} left-0 top-0 border-l-[1.5px] border-t-[1.5px]`} />
          <i className={`${corner} right-0 top-0 border-r-[1.5px] border-t-[1.5px]`} />
          <i className={`${corner} bottom-0 left-0 border-b-[1.5px] border-l-[1.5px]`} />
          <i className={`${corner} bottom-0 right-0 border-b-[1.5px] border-r-[1.5px]`} />
        </div>
        <span
          ref={labelRef}
          className="muted absolute left-full top-full ml-1.5 mt-1 whitespace-nowrap bg-neo-light-bg/80 px-1 font-mono text-[10px] dark:bg-neo-dark-bg/80"
        />
      </div>

      {/* Crosshair: tepat di posisi kursor, hilang saat mengunci */}
      <div
        ref={crossRef}
        aria-hidden="true"
        className="ink pointer-events-none fixed left-0 top-0 z-[9999] opacity-0 transition-opacity duration-150"
      >
        <i className="absolute -left-1.5 top-0 h-px w-3 bg-current" />
        <i className="absolute -top-1.5 left-0 h-3 w-px bg-current" />
      </div>
    </>
  )
}

export default Cursor