import React, { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useParams, useLocation, Link } from 'react-router-dom'
import {
  ArrowLeft, ExternalLink, Code, ChevronLeft, ChevronRight, X, Maximize2,
  Play, Pause, Volume2, VolumeX, ZoomIn, ZoomOut,
} from 'lucide-react'
import projectsData from '../data/projectsData.json'
import SectionHead from '../components/Sectionhead'

const pad = (n) => String(n).padStart(2, '0')

function Row({ label, children }) {
  return (
    <div className="grid border-t hair md:grid-cols-[220px_1fr]">
      <div className="label px-6 pt-6 sm:px-12 md:border-r hair md:py-8">{label}</div>
      <div className="p-6 sm:p-8">{children}</div>
    </div>
  )
}

// Gambar dengan penanda jelas jika gagal dimuat (berguna saat menguji tautan gambar)
function SafeImg({ src, alt }) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <div className="label grid aspect-video place-items-center border hair p-4 text-center">
        Image failed to load
      </div>
    )
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className="aspect-video w-full border hair object-cover"
    />
  )
}

function Tags({ items }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, i) => (
        <span key={i} className="label border hair px-3 py-2">{item}</span>
      ))}
    </div>
  )
}

function BulletList({ items }) {
  return (
    <ul className="max-w-3xl">
      {items.map((item, i) => (
        <li key={i} className="flex gap-4 border-b hair py-3 first:pt-0 last:border-b-0 last:pb-0">
          <span className="accent font-mono" aria-hidden="true">+</span>
          <span className="leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  )
}

// Komponen berat (model 3D, panorama, video) baru dipasang saat hampir terlihat di layar,
// supaya file besar tidak diunduh oleh pengunjung yang tidak menggulir sampai ke sana.
function Lazy({ className = '', drag = false, label = 'Load', suspended = false, children }) {
  // berat (WebGL, video, panorama): baru dimuat saat diklik, supaya halaman tidak macet saat dibuka
  const [on, setOn] = useState(false)
  return (
    <div className={`relative border hair ${className}`} data-cursor={on && drag ? 'drag!' : undefined}>
      {on && !suspended ? (
        children
      ) : (
        <button
          type="button"
          onClick={() => setOn(true)}
          disabled={suspended}
          className="label absolute inset-0 grid place-items-center transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
        >
          <span className="border hair px-3 py-1.5">[ {label} ]</span>
        </button>
      )}
    </div>
  )
}

// Bilah kontrol di tepi bawah media interaktif, bergaya sama dengan tombol lightbox
function MediaBar({ children }) {
  return (
    <div className="absolute inset-x-0 bottom-0 z-10 flex items-center gap-2 border-t border-white/20 bg-black/70 p-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-white">
      {children}
    </div>
  )
}

const mmss = (t) => {
  const s = Number.isFinite(t) ? Math.floor(t) : 0
  return `${pad(Math.floor(s / 60))}:${pad(s % 60)}`
}

// layar penuh lewat elemen pembungkus (agar kontrol tetap tampil); iOS hanya mendukung layar penuh milik video
function toggleFullscreen(box, video) {
  if (document.fullscreenElement) {
    document.exitFullscreen?.()
  } else if (box?.requestFullscreen) {
    box.requestFullscreen().catch(() => {})
  } else {
    video?.webkitEnterFullscreen?.()
  }
}

// Pemutar video dengan kontrol sendiri (kontrol bawaan browser tidak bisa diubah gayanya)
function VideoPlayer({ src, label }) {
  const box = useRef(null)
  const vid = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [dur, setDur] = useState(0)
  const [muted, setMuted] = useState(false)
  const [failed, setFailed] = useState(false)

  const toggle = () => {
    const v = vid.current
    if (!v) return
    if (v.paused) v.play().catch(() => {})
    else v.pause()
  }

  return (
    <div ref={box} className="absolute inset-0 bg-black text-white">
      <video
        ref={vid}
        src={src}
        loop
        playsInline
        preload="metadata"
        aria-label={label}
        onClick={toggle}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDur(e.currentTarget.duration)}
        onVolumeChange={(e) => setMuted(e.currentTarget.muted)}
        onError={() => setFailed(true)}
        className="h-full w-full cursor-pointer object-contain"
      />
      {failed && (
        <div className="label pointer-events-none absolute inset-0 grid place-items-center">Video failed to load</div>
      )}
      {!failed && !playing && (
        <button
          type="button"
          onClick={toggle}
          aria-label="Play"
          className="group absolute inset-0 grid place-items-center focus-visible:outline-none"
        >
          <span className="inline-flex items-center gap-2 border border-white/35 bg-black/55 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-white transition-colors group-hover:border-white group-hover:bg-white group-hover:text-black group-focus-visible:ring-1 group-focus-visible:ring-white">
            <Play size={12} /> Play
          </span>
        </button>
      )}
      <MediaBar>
        <LbButton onClick={toggle} label={playing ? 'Pause' : 'Play'} size="sm">
          {playing ? <Pause size={12} /> : <Play size={12} />}
        </LbButton>
        <span className="tabular-nums text-white/80">
          {mmss(time)} / {mmss(dur)}
        </span>
        <input
          type="range"
          aria-label="Seek"
          min={0}
          max={dur || 0}
          step={0.1}
          value={Math.min(time, dur || 0)}
          onChange={(e) => {
            const v = vid.current
            if (v) v.currentTime = Number(e.target.value)
          }}
          className="h-1 min-w-0 flex-1 cursor-pointer accent-white"
        />
        <LbButton
          onClick={() => {
            const v = vid.current
            if (v) v.muted = !v.muted
          }}
          label={muted ? 'Unmute' : 'Mute'}
          size="sm"
        >
          {muted ? <VolumeX size={12} /> : <Volume2 size={12} />}
        </LbButton>
        <LbButton onClick={() => toggleFullscreen(box.current, vid.current)} label="Fullscreen" size="sm">
          <Maximize2 size={12} />
        </LbButton>
      </MediaBar>
    </div>
  )
}

// Tampilan 3D interaktif. Pustaka dimuat hanya saat dibutuhkan (code splitting).
// Perlu: npm i @google/model-viewer
function ModelViewer({ src, title }) {
  const ref = useRef(null)
  const [state, setState] = useState('loading') // loading | ready | failed
  const [rotate, setRotate] = useState(true)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onLoad = () => setState('ready')
    const onError = () => setState('failed')
    el.addEventListener('load', onLoad)
    el.addEventListener('error', onError)
    import('@google/model-viewer').catch(onError)
    return () => {
      el.removeEventListener('load', onLoad)
      el.removeEventListener('error', onError)
    }
  }, [])

  const toggleRotate = () => {
    const el = ref.current
    if (!el) return
    el.autoRotate = !rotate
    setRotate(!rotate)
  }
  const reset = () => {
    const el = ref.current
    if (!el) return
    el.cameraOrbit = '0deg 75deg 105%'
    el.cameraTarget = 'auto auto auto'
    el.fieldOfView = 'auto'
  }

  return (
    <>
      <model-viewer
        ref={ref}
        src={src}
        alt={`${title} 3D model`}
        camera-controls="true"
        auto-rotate="true"
        interaction-prompt="none"
        touch-action="pan-y"
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          '--poster-color': 'transparent',
          '--progress-bar-color': 'currentColor',
          '--progress-bar-height': '2px',
        }}
      />
      {state !== 'ready' && (
        <div className="label pointer-events-none absolute inset-0 grid place-items-center">
          {state === 'failed' ? '3D model failed to load' : 'Loading 3D model…'}
        </div>
      )}
      {state === 'ready' && (
        <MediaBar>
          <LbButton onClick={toggleRotate} label="Toggle auto-rotate" size="sm" className={rotate ? 'border-white' : ''}>
            Auto-rotate {rotate ? 'on' : 'off'}
          </LbButton>
          <LbButton onClick={reset} label="Reset view" size="sm">
            Reset view
          </LbButton>
        </MediaBar>
      )}
    </>
  )
}

// Panorama 360 derajat (gambar equirectangular, rasio 2:1).
// Perlu: npm i @photo-sphere-viewer/core
// Toolbar bawaan dimatikan (gayanya hanya bisa diubah lewat SCSS saat build); diganti kontrol sendiri.
function PanoramaViewer({ src }) {
  const box = useRef(null)
  const ref = useRef(null)
  const viewer = useRef(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    Promise.all([
      import('@photo-sphere-viewer/core'),
      import('@photo-sphere-viewer/core/index.css'),
    ])
      .then(([mod]) => {
        if (cancelled || !ref.current) return
        viewer.current = new mod.Viewer({
          container: ref.current,
          panorama: src,
          navbar: false,
          touchmoveTwoFingers: false,
          mousewheelCtrlKey: false,
        })
        viewer.current.addEventListener('panorama-error', () => setFailed(true))
      })
      .catch(() => setFailed(true))
    return () => {
      cancelled = true
      viewer.current?.destroy()
      viewer.current = null
    }
  }, [src])

  const zoomBy = (d) => {
    const v = viewer.current
    if (v) v.zoom(Math.max(0, Math.min(100, v.getZoomLevel() + d)))
  }

  return (
    <div ref={box} className="absolute inset-0 bg-black">
      <div ref={ref} className="absolute inset-0" />
      {failed && (
        <div className="label pointer-events-none absolute inset-0 grid place-items-center">
          360° view failed to load
        </div>
      )}
      <MediaBar>
        <LbButton onClick={() => zoomBy(-15)} label="Zoom out" size="sm">
          <ZoomOut size={12} />
        </LbButton>
        <LbButton onClick={() => zoomBy(15)} label="Zoom in" size="sm">
          <ZoomIn size={12} />
        </LbButton>
        <span className="flex-1" />
        <LbButton onClick={() => toggleFullscreen(box.current)} label="Fullscreen" size="sm">
          <Maximize2 size={12} />
        </LbButton>
      </MediaBar>
    </div>
  )
}

const WIDE = new Set(['panorama', 'model', 'video'])

// Susunan dua kolom tanpa lubang dan tanpa mengubah urutan: item lebar mengambil satu baris penuh,
// dan item tunggal di baris yang tidak punya pasangan juga dilebarkan.
function fullWidthFlags(items) {
  const flags = items.map(() => false)
  let col = 0
  items.forEach((m, i) => {
    if (WIDE.has(m.kind)) {
      if (col === 1) flags[i - 1] = true
      flags[i] = true
      col = 0
    } else {
      col = (col + 1) % 2
    }
  })
  if (col === 1) flags[items.length - 1] = true
  return flags
}

// Pengganti GIF: video pendek tanpa suara yang berputar terus. Jauh lebih kecil dan ringan didekode daripada GIF,
// dan hanya diputar saat terlihat di layar.
function LoopVideo({ src, label }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) el.play().catch(() => {})
        else el.pause()
      },
      { threshold: 0.25 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <video
      ref={ref}
      src={src}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={label}
      className="aspect-video w-full border hair object-cover"
    />
  )
}

const HINT = { model: 'drag to rotate', panorama: 'drag to look around' }
const INTERACTIVE = new Set(['model', 'panorama', 'video'])
// GIF tidak bisa dijeda dan model/panorama/video terus menggambar, jadi semuanya dilepas dari halaman
// selama lightbox terbuka (hanya satu yang berjalan, yaitu yang ada di lightbox)
const HEAVY = new Set(['model', 'panorama', 'video', 'gif'])

const FOCUSABLE = 'button:not([disabled]), a[href], video[controls], [tabindex]:not([tabindex="-1"])'

// Tombol bergaya blueprint: garis tipis, label mono, dan tanda sudut beraksen yang melebar saat disorot
function LbButton({ onClick, label, className = '', size = 'md', innerRef, children }) {
  const sizes = size === 'sm' ? 'h-7 min-w-7' : 'h-8 min-w-8 sm:h-9 sm:min-w-9'
  const pos = /\babsolute\b/.test(className) ? '' : 'relative' // jangan bentrok dengan absolute dari pemanggil
  return (
    <button
      ref={innerRef}
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`group ${pos} inline-flex items-center justify-center gap-2 border border-white/35 bg-black/55 px-2 font-mono text-[10px] uppercase tracking-[0.1em] text-white backdrop-blur-sm transition-colors duration-150 [transition-timing-function:steps(3,end)] hover:border-white hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white ${sizes} ${className}`}
    >
      <span
        aria-hidden="true"
        className="accent pointer-events-none absolute -left-px -top-px h-1.5 w-1.5 border-l border-t border-current transition-all duration-150 group-hover:h-2.5 group-hover:w-2.5"
      />
      <span
        aria-hidden="true"
        className="accent pointer-events-none absolute -bottom-px -right-px h-1.5 w-1.5 border-b border-r border-current transition-all duration-150 group-hover:h-2.5 group-hover:w-2.5"
      />
      {children}
    </button>
  )
}

function LightboxImage({ src, alt }) {
  const [state, setState] = useState('loading') // loading | ready | failed
  if (state === 'failed') {
    return (
      <div className="grid h-[40vh] w-[min(80vw,600px)] place-items-center border border-white/20 font-mono text-xs uppercase tracking-[0.08em] text-white/70">
        Image failed to load
      </div>
    )
  }
  return (
    <div className="relative min-h-[160px] min-w-[160px]">
      <img
        src={src}
        alt={alt}
        onLoad={() => setState('ready')}
        onError={() => setState('failed')}
        className={`block max-h-[70vh] max-w-[92vw] object-contain transition-opacity duration-200 motion-reduce:transition-none ${
          state === 'ready' ? 'opacity-100' : 'opacity-0'
        }`}
      />
      {state === 'loading' && (
        <div className="absolute inset-0 grid place-items-center font-mono text-xs uppercase tracking-[0.08em] text-white/70">
          Loading…
        </div>
      )}
    </div>
  )
}

// Isi lightbox: hanya foto dan GIF, ukuran asli (tidak dipotong)
function LightboxMedia({ item, title }) {
  return <LightboxImage src={item.url} alt={`${title} - ${item.label || 'media'}`} />
}

// Jendela yang menimpa halaman (lightbox/modal): latar blur, panah sebelumnya/berikutnya, keterangan di tengah.
// Ditutup dengan tombol Close, klik area kosong, atau tombol Esc. Panah kiri/kanan di keyboard juga berfungsi.
function Lightbox({ items, index, title, onIndex, onClose }) {
  const total = items.length
  const item = items[index]
  const dialogRef = useRef(null)
  const closeRef = useRef(null)
  const downOnBackdrop = useRef(false)
  const touchX = useRef(null)
  const [shown, setShown] = useState(false)

  const go = useCallback((d) => onIndex((index + d + total) % total), [index, total, onIndex])

  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(true))
    return () => cancelAnimationFrame(id)
  }, [])

  // kunci gulir halaman di belakang, pindahkan fokus ke tombol tutup, lalu kembalikan saat ditutup
  useEffect(() => {
    const body = document.body
    const prevOverflow = body.style.overflow
    const prevPadding = body.style.paddingRight
    const scrollbar = window.innerWidth - document.documentElement.clientWidth
    body.style.overflow = 'hidden'
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`
    const previouslyFocused = document.activeElement
    closeRef.current?.focus()
    return () => {
      body.style.overflow = prevOverflow
      body.style.paddingRight = prevPadding
      previouslyFocused?.focus?.()
    }
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key === 'Tab') {
        // fokus tetap berputar di dalam lightbox
        const els = [...(dialogRef.current?.querySelectorAll(FOCUSABLE) ?? [])]
        if (!els.length) return
        const first = els[0]
        const last = els[els.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
        return
      }
      if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && total > 1) {
        // panah dibiarkan untuk model 3D, panorama, dan video yang sedang difokuskan
        if (e.target?.closest?.('[data-interactive]')) return
        e.preventDefault()
        go(e.key === 'ArrowLeft' ? -1 : 1)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [go, onClose, total])

  // gambar di sebelahnya dimuat lebih dulu agar perpindahan terasa cepat
  useEffect(() => {
    ;[-1, 1].forEach((d) => {
      const near = items[(index + d + total) % total]
      if (near?.kind === 'image') new Image().src = near.url
    })
  }, [index, items, total])

  const swipeable = true
  const onTouchStart = (e) => {
    touchX.current = e.touches[0].clientX
  }
  const onTouchEnd = (e) => {
    if (touchX.current == null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    touchX.current = null
    if (Math.abs(dx) > 50 && total > 1) go(dx > 0 ? -1 : 1)
  }

  const caption = (
    <p
      aria-live="polite"
      className="pointer-events-none min-w-0 flex-1 text-center font-mono text-[11px] uppercase tracking-[0.08em] text-white/85 sm:flex-none"
    >
      <span className="mr-2 text-white/50">
        {pad(index + 1)} / {pad(total)}
      </span>
      {item.label}
      {HINT[item.kind] ? ` · ${HINT[item.kind]}` : ''}
    </p>
  )

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${title} gallery`}
      // menutup hanya jika tekan dan lepas sama-sama di area kosong (bukan saat menyeret model 3D lalu melepas di luar)
      onPointerDown={(e) => {
        downOnBackdrop.current = e.target === e.currentTarget
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && downOnBackdrop.current) onClose()
      }}
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md transition-opacity duration-200 motion-reduce:transition-none sm:p-8 ${
        shown ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <LbButton
        innerRef={closeRef}
        onClick={onClose}
        label="Close"
        className="absolute right-3 top-3 z-20 sm:right-6 sm:top-6"
      >
        <X size={14} />
        <span className="hidden sm:inline">Close</span>
      </LbButton>

      {/* panah di sisi media (layar lebar) */}
      {total > 1 && (
        <>
          <LbButton
            onClick={() => go(-1)}
            label="Previous"
            className="absolute left-6 top-1/2 z-20 hidden -translate-y-1/2 sm:inline-flex"
          >
            <ChevronLeft size={16} />
          </LbButton>
          <LbButton
            onClick={() => go(1)}
            label="Next"
            className="absolute right-6 top-1/2 z-20 hidden -translate-y-1/2 sm:inline-flex"
          >
            <ChevronRight size={16} />
          </LbButton>
        </>
      )}

      <div className="pointer-events-none flex max-h-full max-w-full flex-col items-center gap-3 sm:gap-4">
        <div
          className="pointer-events-auto"
          onTouchStart={swipeable ? onTouchStart : undefined}
          onTouchEnd={swipeable ? onTouchEnd : undefined}
        >
          <LightboxMedia key={item.url} item={item} title={title} />
        </div>

        {/* di layar kecil panah ada di bawah media, mengapit keterangan, supaya tidak menutupi gambar */}
        <div className="flex w-[92vw] max-w-md items-center justify-between gap-3 sm:w-auto sm:max-w-none">
          {total > 1 && (
            <LbButton onClick={() => go(-1)} label="Previous" className="pointer-events-auto shrink-0 sm:hidden">
              <ChevronLeft size={16} />
            </LbButton>
          )}
          {caption}
          {total > 1 && (
            <LbButton onClick={() => go(1)} label="Next" className="pointer-events-auto shrink-0 sm:hidden">
              <ChevronRight size={16} />
            </LbButton>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}

function MediaItem({ item, index, title, full, suspended, onOpen }) {
  const alt = `${title} - ${item.label || `media ${index + 1}`}`
  // selama lightbox terbuka, yang berat diganti kotak kosong seukuran aslinya (tata letak tidak bergeser)
  const paused = suspended && (item.kind === 'gif' || item.kind === 'loop')
  let body
  if (item.kind === 'model' || item.kind === 'panorama') {
    body = (
      <Lazy drag label={item.kind === 'model' ? 'Click to Load the 3D model' : 'Click to Load the 360° view'} suspended={suspended} className="h-[360px] sm:h-[520px]">
        {item.kind === 'model' ? (
          <ModelViewer key={item.url} src={item.url} title={title} />
        ) : (
          <PanoramaViewer key={item.url} src={item.url} />
        )}
      </Lazy>
    )
  } else if (item.kind === 'video') {
    body = (
      <Lazy label="Click to Load the video" suspended={suspended} className="aspect-video bg-black">
        <VideoPlayer key={item.url} src={item.url} label={alt} />
      </Lazy>
    )
  } else if (item.kind === 'loop') {
    // video loop pengganti GIF: diputar di halaman, tidak masuk lightbox
    body = paused ? (
      <div className="border hair aspect-video w-full" />
    ) : (
      <LoopVideo src={item.url} label={alt} />
    )
  } else {
    // foto dan GIF: seluruh gambar bisa diklik untuk dibuka penuh
    body = (
      <button
        type="button"
        onClick={onOpen}
        aria-label={`View ${item.label || 'image'} full size`}
        className="group relative block w-full text-left"
      >
        {paused ? <div className="border hair aspect-video w-full" /> : <SafeImg src={item.url} alt={alt} />}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-2 top-2 grid h-7 w-7 place-items-center border border-white/35 bg-black/55 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
        >
          <Maximize2 size={13} />
        </span>
      </button>
    )
  }

  return (
    <figure className={full ? 'md:col-span-2' : ''}>
      <div className="relative">
        {body}
      </div>
      <figcaption className="label mt-2 flex gap-3">
        <span>{pad(index + 1)}</span>
        <span>
          {item.label}
          {HINT[item.kind] ? ` · ${HINT[item.kind]}` : ''}
        </span>
      </figcaption>
    </figure>
  )
}

function MediaGallery({ items, title }) {
  const flags = fullWidthFlags(items)
  const [openIndex, setOpenIndex] = useState(null)
  const close = useCallback(() => setOpenIndex(null), [])
  // lightbox hanya untuk foto dan GIF; model, panorama, dan video dipakai langsung di halaman
  const viewable = items.filter((m) => m.kind === 'image' || m.kind === 'gif')
  const open = (item) => setOpenIndex(viewable.indexOf(item))

  return (
    <>
      <div className="grid gap-x-4 gap-y-6 md:grid-cols-2">
        {items.map((item, i) => (
          <MediaItem
            key={`${item.url}-${i}`}
            item={item}
            index={i}
            title={title}
            full={flags[i]}
            suspended={openIndex !== null}
            onOpen={() => open(item)}
          />
        ))}
      </div>
      {openIndex !== null && viewable[openIndex] && (
        <Lightbox items={viewable} index={openIndex} title={title} onIndex={setOpenIndex} onClose={close} />
      )}
    </>
  )
}

function ProjectsDetail() {
  const { slug } = useParams()
  const location = useLocation()
  const currentFilter = location.state?.filter || 'All'

  const all = projectsData.projects
  const project = all.find((p) => p.slug === slug)

  // Daftar mengikuti filter asal; jika proyek tidak ada di daftar itu (akses langsung), pakai semua
  let list = currentFilter === 'All' ? all : all.filter((p) => p.type === currentFilter)
  let index = list.findIndex((p) => p.slug === slug)
  if (index === -1) {
    list = all
    index = all.findIndex((p) => p.slug === slug)
  }
  const prevProject = index > 0 ? list[index - 1] : null
  const nextProject = index >= 0 && index < list.length - 1 ? list[index + 1] : null

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (!project) {
    return (
      <div className="page ink flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <p className="font-display text-2xl font-semibold">Project not found</p>
          <Link to="/projects" className="btn mt-6">
            <ArrowLeft size={14} /> Back to projects
          </Link>
        </div>
      </div>
    )
  }

  // Data lama (tanpa field "family") diperlakukan sebagai project website/mobile
  const isDesign = project.family === 'design'
  const media = project.media ?? []
  const kind = project.type
  const features = project.features ?? []
  const tech = project.tech ?? []

  return (
    <div className="page ink min-h-screen overflow-x-clip pt-12 transition-colors duration-300 md:pt-14">
      <div className="mx-auto max-w-7xl border-x hair">

        <SectionHead n={1} title="Project" meta={`${project.month} ${project.year}`} />

        {/* BACK */}
        <div className="border-t hair p-4 sm:px-8">
          <Link to="/projects" state={{ filter: currentFilter }} className="btn">
            <ArrowLeft size={14} /> Back to projects
          </Link>
        </div>

        {/* TITLE + LINKS */}
        <section className="flex flex-col justify-between gap-8 border-t hair p-6 sm:p-12 lg:flex-row lg:items-end">
          <div className="max-w-4xl">
            <p className="label mb-4">{kind} · {project.month} {project.year}</p>
            <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-7xl">
              {project.title}
            </h1>
          </div>
          {(project.liveLink || project.githubLink) && (
            <div className="flex shrink-0 flex-wrap gap-3 self-start lg:self-auto">
              {project.liveLink && (
                <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="btn-solid">
                  <ExternalLink size={14} /> Check it out
                </a>
              )}
              {project.githubLink && (
                <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="btn">
                  <Code size={14} /> Source code
                </a>
              )}
            </div>
          )}
        </section>

        <Row label="Overview">
          <p className="max-w-3xl leading-relaxed sm:text-lg">{project.fullDescription}</p>
        </Row>

        {project.challenges && (
          <Row label="Challenges">
            <p className="max-w-3xl whitespace-pre-line leading-relaxed sm:text-lg">{project.challenges}</p>
          </Row>
        )}

        {isDesign ? (
          <>
            {project.brief && (
              <Row label="Design brief">
                <p className="max-w-3xl leading-relaxed sm:text-lg">{project.brief}</p>
              </Row>
            )}
            {tech.length > 0 && (
              <Row label="Software">
                <Tags items={tech} />
              </Row>
            )}
            {features.length > 0 && (
              <Row label="Deliverables">
                <BulletList items={features} />
              </Row>
            )}
          </>
        ) : (
          <>
            {features.length > 0 && (
              <Row label="Key features">
                <BulletList items={features} />
              </Row>
            )}
            {tech.length > 0 && (
              <Row label="Tech stack">
                <Tags items={tech} />
              </Row>
            )}
          </>
        )}

        {/* MEDIA: foto, GIF, video, model 3D, dan panorama, sesuai urutan di database */}
        {media.length > 0 && (
          <Row label={isDesign ? 'Gallery' : 'Screenshots'}>
            <MediaGallery key={project.slug} items={media} title={project.title} />
          </Row>
        )}

        {/* PREVIOUS / NEXT */}
        <nav aria-label="Project navigation" className="grid border-t hair sm:grid-cols-2">
          {prevProject ? (
            <Link
              to={`/projects/${prevProject.slug}`}
              state={{ filter: currentFilter }}
              className="group flex items-center gap-4 border-b hair p-6 transition-colors hover:surface sm:border-b-0 sm:border-r sm:p-8"
            >
              <ChevronLeft size={20} className="muted shrink-0 group-hover:accent" />
              <div>
                <p className="label">Previous</p>
                <p className="mt-1 font-display text-lg font-semibold sm:text-xl">{prevProject.title}</p>
              </div>
            </Link>
          ) : (
            <div className="hidden sm:block sm:border-r hair" />
          )}

          {nextProject ? (
            <Link
              to={`/projects/${nextProject.slug}`}
              state={{ filter: currentFilter }}
              className="group flex items-center justify-end gap-4 p-6 text-right transition-colors hover:surface sm:p-8"
            >
              <div>
                <p className="label">Next</p>
                <p className="mt-1 font-display text-lg font-semibold sm:text-xl">{nextProject.title}</p>
              </div>
              <ChevronRight size={20} className="muted shrink-0 group-hover:accent" />
            </Link>
          ) : (
            <div />
          )}
        </nav>

      </div>
    </div>
  )
}

export default ProjectsDetail