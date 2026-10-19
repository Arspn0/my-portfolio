import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import projectsData from '../data/projectsData.json'
import SectionHead from '../components/Sectionhead'

const pad = (n) => String(n).padStart(2, '0')
const filters = ['All', 'Website', 'Mobile', 'Design']

function Projects() {
  const [selectedFilter, setSelectedFilter] = useState('All')

  const all = projectsData.projects
  const countOf = (f) => (f === 'All' ? all.length : all.filter((p) => p.type === f).length)
  const filteredProjects = selectedFilter === 'All' ? all : all.filter((p) => p.type === selectedFilter)

  return (
    <div className="page ink min-h-screen overflow-x-hidden pt-12 transition-colors duration-300 md:pt-14">
      <div className="mx-auto max-w-7xl border-x hair">

        {/* 01 INTRO */}
        <section>
          <SectionHead n={1} title="Projects" meta={`${all.length} total`} />
          <div className="grid border-t hair md:grid-cols-[1fr_1fr]">
            <h1 className="p-6 font-display text-5xl font-bold leading-[1.05] tracking-tight sm:p-12 sm:text-7xl">
              My work
            </h1>
            <p className="muted border-t hair p-6 leading-relaxed sm:p-12 sm:text-lg md:border-l md:border-t-0">
              A collection of projects showcasing my expertise in web development, mobile
              applications, and creative design. Each project represents a unique challenge solved
              with innovative solutions and cutting-edge technologies.
            </p>
          </div>
        </section>

        {/* 02 GRID */}
        <section>
          <SectionHead n={2} title="Index" meta={`Showing ${filteredProjects.length}`} />

          {/* Filter tabs */}
          <div role="group" aria-label="Filter projects" className="flex overflow-x-auto border-t hair">
            {filters.map((filter) => {
              const on = selectedFilter === filter
              return (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  aria-pressed={on}
                  className={`flex items-center gap-2 whitespace-nowrap border-r hair px-5 py-3 font-mono text-[11px] uppercase tracking-[0.08em] transition-colors ${
                    on ? 'tab-on' : 'muted hover:surface hover:ink'
                  }`}
                >
                  {filter}
                  <span className="opacity-60">{pad(countOf(filter))}</span>
                </button>
              )
            })}
          </div>

          {filteredProjects.length > 0 ? (
            <div
              key={selectedFilter}
              className="animate-fade-in -ml-px grid grid-cols-2 overflow-hidden border-t hair lg:grid-cols-3"
            >
              {filteredProjects.map((project, i) => (
                <Link
                  key={project.id}
                  to={`/projects/${project.slug}`}
                  state={{ filter: selectedFilter }}
                  className="group flex flex-col border-b border-l hair transition-colors hover:surface"
                >
                  <div className="relative aspect-video overflow-hidden border-b hair">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="label surface absolute left-0 top-0 border-b border-r hair px-2 py-1 sm:px-3">
                      {project.type}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-3 sm:p-6">
                    <div className="label flex justify-between">
                      <span>{pad(i + 1)}</span>
                      <span>{project.month} {project.year}</span>
                    </div>
                    <h3 className="font-display text-sm font-semibold leading-tight transition-colors group-hover:accent sm:text-2xl">
                      {project.title}
                    </h3>
                    <p className="muted line-clamp-3 text-[11px] leading-snug sm:text-base sm:leading-relaxed">
                      {project.shortDescription}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="border-t hair p-10 text-center sm:p-20">
              <p className="font-display text-xl font-semibold">No projects in this category yet.</p>
              <button onClick={() => setSelectedFilter('All')} className="btn mt-6">Show all projects</button>
            </div>
          )}
        </section>

      </div>
    </div>
  )
}

export default Projects