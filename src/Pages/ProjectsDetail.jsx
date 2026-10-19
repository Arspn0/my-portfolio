import React, { useEffect } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import { ArrowLeft, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react'
import projectsData from '../data/projectsData.json'
import SectionHead from '../components/Sectionhead'

function Row({ label, children }) {
  return (
    <div className="grid border-t hair md:grid-cols-[220px_1fr]">
      <div className="label px-6 pt-6 sm:px-12 md:border-r hair md:py-8">{label}</div>
      <div className="p-6 sm:p-8">{children}</div>
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

  return (
    <div className="page ink min-h-screen overflow-x-hidden pt-12 transition-colors duration-300 md:pt-14">
      <div className="mx-auto max-w-7xl border-x hair">

        <SectionHead n={1} title="Project" meta={`${project.month} ${project.year}`} />

        {/* BACK */}
        <div className="border-t hair p-4 sm:px-8">
          <Link to="/projects" state={{ filter: currentFilter }} className="btn">
            <ArrowLeft size={14} /> Back to projects
          </Link>
        </div>

        {/* TITLE + LIVE LINK */}
        <section className="flex flex-col justify-between gap-8 border-t hair p-6 sm:p-12 lg:flex-row lg:items-end">
          <div className="max-w-4xl">
            <p className="label mb-4">{project.type} · {project.month} {project.year}</p>
            <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-7xl">
              {project.title}
            </h1>
          </div>
          {project.liveLink && (
            <a
              href={project.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-solid shrink-0 self-start lg:self-auto"
            >
              <ExternalLink size={14} /> Check it out
            </a>
          )}
        </section>

        <Row label="Overview">
          <p className="max-w-3xl leading-relaxed sm:text-lg">{project.fullDescription}</p>
        </Row>

        <Row label="Key features">
          <ul className="max-w-3xl">
            {project.features.map((feature, i) => (
              <li key={i} className="flex gap-4 border-b hair py-3 first:pt-0 last:border-b-0 last:pb-0">
                <span className="accent font-mono" aria-hidden="true">+</span>
                <span className="leading-relaxed">{feature}</span>
              </li>
            ))}
          </ul>
        </Row>

        <Row label="Tech stack">
          <div className="flex flex-wrap gap-2">
            {project.tech.map((tech, i) => (
              <span key={i} className="label border hair px-3 py-2">{tech}</span>
            ))}
          </div>
        </Row>

        <Row label="Screenshots">
          <div className="grid gap-4 md:grid-cols-2">
            {project.screenshots.map((screenshot, i) => (
              <img
                key={i}
                src={screenshot}
                alt={`${project.title} screenshot ${i + 1}`}
                className="h-auto w-full border hair object-cover"
              />
            ))}
          </div>
        </Row>

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