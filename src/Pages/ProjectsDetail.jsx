import React, { useEffect, useRef, useState } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import { ArrowLeft, ExternalLink, Code, ChevronLeft, ChevronRight } from 'lucide-react'
import projectsData from '../data/projectsData.json'
import SectionHead from '../components/SectionHead'

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
function Lazy({ className = '', drag = false, children }) {
  const ref = useRef(null)
  const [near, setNear] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || near) return
    if (!('IntersectionObserver' in window)) {
      setNear(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true)
          io.disconnect()
        }
      },
      { rootMargin: '300px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [near])

  return (
    <div ref={ref} className={`relative border hair ${className}`} data-cursor={drag ? 'drag!' : undefined}>
      {near ? (
        children
      ) : (
        <div className="label absolute inset-0 grid place-items-center">Loading…</div>
      )}
    </div>
  )
}

// Tampilan 3D interaktif. Pustaka dimuat hanya saat dibutuhkan (code splitting).
// Perlu: npm i @google/model-viewer
function ModelViewer({ src, title }) {
  const ref = useRef(null)
  const [state, setState] = useState('loading') // loading | ready | failed

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

  return (
    <>
      <model-viewer
        ref={ref}
        src={src}
        alt={`${title} 3D model`}
        camera-controls="true"
        auto-rotate="true"
        shadow-intensity="1"
        touch-action="pan-y"
        style={{ width: '100%', height: '100%', display: 'block', '--poster-color': 'transparent' }}
      />
      {state !== 'ready' && (
        <div className="label pointer-events-none absolute inset-0 grid place-items-center">
          {state === 'failed' ? '3D model failed to load' : 'Loading 3D model…'}
        </div>
      )}
    </>
  )
}

// Panorama 360 derajat (gambar equirectangular, rasio 2:1).
// Perlu: npm i @photo-sphere-viewer/core
function PanoramaViewer({ src }) {
  const ref = useRef(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let viewer
    let cancelled = false
    Promise.all([
      import('@photo-sphere-viewer/core'),
      import('@photo-sphere-viewer/core/index.css'),
    ])
      .then(([mod]) => {
        if (cancelled || !ref.current) return
        viewer = new mod.Viewer({
          container: ref.current,
          panorama: src,
          navbar: ['zoom', 'fullscreen'],
          touchmoveTwoFingers: false,
          mousewheelCtrlKey: false,
        })
        viewer.addEventListener('panorama-error', () => setFailed(true))
      })
      .catch(() => setFailed(true))
    return () => {
      cancelled = true
      viewer?.destroy()
    }
  }, [src])

  return (
    <>
      <div ref={ref} className="absolute inset-0" />
      {failed && (
        <div className="label pointer-events-none absolute inset-0 grid place-items-center">
          360° view failed to load
        </div>
      )}
    </>
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

const HINT = { model: 'drag to rotate', panorama: 'drag to look around' }

function MediaItem({ item, index, title, full }) {
  const alt = `${title} - ${item.label || `media ${index + 1}`}`
  let body
  if (item.kind === 'model') {
    body = (
      <Lazy drag className="h-[360px] sm:h-[520px]">
        <ModelViewer key={item.url} src={item.url} title={title} />
      </Lazy>
    )
  } else if (item.kind === 'panorama') {
    body = (
      <Lazy drag className="h-[360px] sm:h-[520px]">
        <PanoramaViewer key={item.url} src={item.url} />
      </Lazy>
    )
  } else if (item.kind === 'video') {
    body = (
      <Lazy className="aspect-video bg-black">
        <video
          src={item.url}
          controls
          loop
          playsInline
          preload="metadata"
          aria-label={alt}
          className="h-full w-full object-contain"
        />
      </Lazy>
    )
  } else {
    body = <SafeImg src={item.url} alt={alt} />
  }

  return (
    <figure className={full ? 'md:col-span-2' : ''}>
      {body}
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
  return (
    <div className="grid gap-x-4 gap-y-6 md:grid-cols-2">
      {items.map((item, i) => (
        <MediaItem key={`${item.url}-${i}`} item={item} index={i} title={title} full={flags[i]} />
      ))}
    </div>
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
            <MediaGallery items={media} title={project.title} />
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