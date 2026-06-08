import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import projectsData from '../data/projectsData.json'

function Projects() {
  const [selectedFilter, setSelectedFilter] = useState('All')
  const navigate = useNavigate()

  const filters = ['All', 'Website', 'Mobile', 'Design']

  // Filter projects based on selected filter
  const filteredProjects = selectedFilter === 'All' 
    ? projectsData.projects 
    : projectsData.projects.filter(p => p.type === selectedFilter)

  // Staggered animation delay
  const getAnimationDelay = (index) => {
    return `${index * 0.1}s`
  }

  const handleProjectClick = (slug) => {
    navigate(`/projects/${slug}`, { state: { filter: selectedFilter } })
  }

  return (
    <div className="bg-neo-light-bg dark:bg-neo-dark-bg min-h-screen transition-colors duration-300 py-4 overflow-x-hidden">
      
      {/* SECTION 1: TITLE & DESCRIPTION */}
      <section className="pt-20 sm:pt-32 pb-8 sm:pb-16 px-4 sm:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            {/* Title */}
            <div className="mb-6 sm:mb-8">
              <h1 className="text-4xl sm:text-7xl md:text-8xl font-black text-neo-light-text dark:text-neo-dark-text font-neo uppercase mb-4 sm:mb-6 leading-tight">
                MY WORK
              </h1>
              <div className="w-20 sm:w-32 h-2 bg-neo-yellow dark:bg-neo-green mb-6 sm:mb-8"></div>
            </div>

            {/* Description */}
            <p className="text-base sm:text-xl text-neo-light-text dark:text-neo-dark-text font-neo leading-relaxed opacity-90">
              A collection of projects showcasing my expertise in web development, mobile applications, 
              and creative design. Each project represents a unique challenge solved with innovative 
              solutions and cutting-edge technologies.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: FILTER & PROJECTS GRID */}
      <section className="pb-20 px-4 sm:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          
          {/* Filter Buttons - Scrollable on Mobile */}
          <div className="flex justify-start sm:justify-end mb-8 sm:mb-12 overflow-x-auto pb-4 sm:pb-0 scrollbar-hide">
            <div className="inline-flex gap-2 sm:gap-3 p-1">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`whitespace-nowrap px-4 py-2 sm:px-6 sm:py-3 font-black text-xs sm:text-sm font-neo uppercase transition-all duration-200 border-2 sm:border-2 ${
                    selectedFilter === filter
                      ? 'rounded-xl sm:rounded-2xl bg-neo-yellow dark:bg-neo-green text-neo-light-border dark:text-neo-dark-bg border-neo-light-border dark:border-neo-dark-border shadow-neo-sm'
                      : 'rounded-xl sm:rounded-2xl bg-transparent text-neo-light-text dark:text-neo-dark-text border-transparent hover:border-neo-light-border dark:hover:border-neo-dark-border'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-8 relative">
            {filteredProjects.map((project, index) => (
              <div
                key={project.id}
                onClick={() => handleProjectClick(project.slug)}
                className={`rounded-2xl sm:rounded-3xl group cursor-pointer bg-neo-light-card dark:bg-neo-dark-card border-2 sm:border-4 border-neo-light-border dark:border-neo-dark-border shadow-neo hover:shadow-neo-hover hover:translate-x-1 hover:translate-y-1 sm:hover:translate-x-2 sm:hover:translate-y-2 transition-all duration-300 overflow-hidden animate-fade-in
                  ${index % 2 === 1 ? 'mt-8 sm:mt-16' : ''}
                  hover:z-10 relative flex flex-col h-full
                `}
                style={{ 
                  animationDelay: getAnimationDelay(index),
                  animationFillMode: 'both'
                }}
              >

                {/* Project Image */}
                <div className="relative h-32 sm:h-64 overflow-hidden border-b-2 sm:border-b-4 border-neo-light-border dark:border-neo-dark-border flex-shrink-0">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Type Badge */}
                  <div className="absolute top-2 right-2 sm:top-4 sm:right-4">
                    <div className={`rounded-lg sm:rounded-xl px-2 py-1 sm:px-4 sm:py-2 border-2 sm:border-4 border-neo-light-border dark:border-neo-dark-border shadow-neo-sm font-black text-[8px] sm:text-sm uppercase font-neo
                      ${project.type === 'Website' ? 'bg-neo-cyan text-neo-light-border dark:text-neo-dark-bg' : ''}
                      ${project.type === 'Mobile' ? 'bg-neo-pink text-neo-light-border dark:text-neo-dark-bg' : ''}
                      ${project.type === 'Design' ? 'bg-neo-yellow text-neo-light-border dark:text-neo-dark-bg' : ''}
                    `}>
                      {project.type}
                    </div>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-neo-light-bg/0 dark:bg-neo-dark-bg/0 group-hover:bg-neo-light-bg/30 dark:group-hover:bg-neo-dark-bg/30 transition-all duration-300"></div>
                </div>

                {/* Project Info */}
                <div className="p-3 sm:p-6 flex flex-col flex-grow">
                  {/* Title */}
                  <h3 className="text-sm sm:text-2xl font-black text-neo-light-text dark:text-neo-dark-text font-neo uppercase mb-1 sm:mb-3 group-hover:text-neo-cyan dark:group-hover:text-neo-pink transition-colors duration-300 leading-tight">
                    {project.title}
                  </h3>

                  {/* Date */}
                  <p className="text-[10px] sm:text-base text-neo-light-text dark:text-neo-dark-text opacity-70 font-neo font-bold mb-2 sm:mb-4">
                    {project.month} {project.year}
                  </p>

                  {/* Short Description */}
                  <p className="text-[10px] sm:text-base text-neo-light-text dark:text-neo-dark-text font-neo leading-snug sm:leading-relaxed line-clamp-3 sm:line-clamp-none opacity-90">
                    {project.shortDescription}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <div className="text-center py-20">
              <div className="inline-block bg-neo-light-card dark:bg-neo-dark-card border-4 border-neo-light-border dark:border-neo-dark-border p-8 sm:p-12 shadow-neo mx-4">
                <p className="text-lg sm:text-2xl font-black text-neo-light-text dark:text-neo-dark-text font-neo uppercase">
                  No Projects Found
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Dimming Overlay CSS */}
      <style jsx>{`
        /* Efek opacity hanya aktif di layar besar (hover support) agar tidak aneh di touchscreen */
        @media (hover: hover) {
          .group:hover ~ .group {
            opacity: 0.5;
          }
          .group:hover {
            opacity: 1 !important;
          }
        }
      `}</style>
    </div>
  )
}

export default Projects