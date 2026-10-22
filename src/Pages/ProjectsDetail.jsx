import React, { useEffect, useRef, useState } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import { ArrowLeft, ExternalLink, Code, ChevronLeft, ChevronRight } from 'lucide-react'
import projectsData from '../data/projectsData.json'
import SectionHead from '../components/SectionHead'

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

function Gallery({ images, title }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {images.map((src, i) => (
        <SafeImg key={`${src}-${i}`} src={src} alt={`${title} ${i + 1}`} />
      ))}
    </div>
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

// Tampilan 3D 360 derajat. Pustaka dimuat hanya di halaman yang memakainya (code splitting).
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
    <div className="relative h-[360px] border hair sm:h-[520px]" data-cursor="drag!">
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
  const is3D = isDesign && !!project.modelUrl
  const kind = is3D ? `${project.type} · 3D` : project.type
  const features = project.features ?? []
  const screenshots = project.screenshots ?? []
  const processImages = project.processImages ?? []
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
            {is3D && (
              <Row label="3D viewer">
                <ModelViewer key={project.modelUrl} src={project.modelUrl} title={project.title} />
                <p className="label mt-3">Drag to rotate · scroll or pinch to zoom</p>
              </Row>
            )}
            {screenshots.length > 0 && (
              <Row label="Final results">
                <Gallery images={screenshots} title={`${project.title} result`} />
              </Row>
            )}
            {processImages.length > 0 && (
              <Row label="Process">
                <Gallery images={processImages} title={`${project.title} process`} />
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
            {screenshots.length > 0 && (
              <Row label="Screenshots">
                <Gallery images={screenshots} title={`${project.title} screenshot`} />
              </Row>
            )}
          </>
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