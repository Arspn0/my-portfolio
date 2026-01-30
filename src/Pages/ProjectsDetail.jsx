import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom'
import { ArrowLeft, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react'
import projectsData from '../data/projectsData.json'

function ProjectDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [project, setProject] = useState(null)
  const [prevProject, setPrevProject] = useState(null)
  const [nextProject, setNextProject] = useState(null)

  // Get filter from navigation state or default to 'All'
  const currentFilter = location.state?.filter || 'All'

  useEffect(() => {
    // Find current project
    const currentProject = projectsData.projects.find(p => p.slug === slug)
    setProject(currentProject)

    if (currentProject) {
        // Filter projects based on current filter
        const filteredProjects = currentFilter === 'All' 
            ? projectsData.projects 
            : projectsData.projects.filter(p => p.type === currentFilter)

        // Find current index in filtered list
        const currentIndex = filteredProjects.findIndex(p => p.slug === slug)

        // Set previous and next projects
        if (currentIndex > 0) {
        setPrevProject(filteredProjects[currentIndex - 1])
        } else {
        setPrevProject(null)
        }

        if (currentIndex < filteredProjects.length - 1) {
            setNextProject(filteredProjects[currentIndex + 1])
        } else {
            setNextProject(null)
        }
    }

    // Scroll to top
    window.scrollTo(0, 0)
  }, [slug, currentFilter])

  if (!project) {
    return (
      <div className="min-h-screen bg-neo-light-bg dark:bg-neo-dark-bg flex items-center justify-center">
        <div className="bg-neo-light-card dark:bg-neo-dark-card border-4 border-neo-light-border dark:border-neo-dark-border p-12 shadow-neo">
          <p className="text-2xl font-black text-neo-light-text dark:text-neo-dark-text font-neo uppercase">
            Project Not Found
          </p>
        </div>
      </div>
    )
  }

  const handleNavigate = (projectSlug) => {
    navigate(`/projects/${projectSlug}`, { state: { filter: currentFilter } })
  }

  return (
    <div className="bg-neo-light-bg dark:bg-neo-dark-bg min-h-screen transition-colors duration-300">
      
        {/* SECTION 1: BACK BUTTON & DATE */}
        <section className="pt-24 pb-8 px-4 sm:px-8 lg:px-16 border-b-4 border-neo-light-border dark:border-neo-dark-border">
        <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
            {/* Back Button */}
            <Link
                to="/projects"
                state={{ filter: currentFilter }}
                className="inline-flex items-center gap-3 px-6 py-3 bg-neo-light-card dark:bg-neo-dark-card border-4 border-neo-light-border dark:border-neo-dark-border text-neo-light-text dark:text-neo-dark-text shadow-neo hover:shadow-neo-hover hover:translate-x-2 hover:translate-y-2 active:translate-x-3 active:translate-y-3 transition-all duration-200 font-black text-lg uppercase"
            >
                <ArrowLeft size={24} strokeWidth={3} />
                Back to Projects
            </Link>

            {/* Date */}
            <div className="bg-neo-yellow dark:bg-neo-green border-4 border-neo-light-border dark:border-neo-dark-border px-6 py-3 shadow-neo">
                <span className="font-black text-neo-light-border dark:text-neo-dark-bg font-neo uppercase">
                {project.month} {project.year}
                </span>
            </div>
            </div>
        </div>
        </section>

        {/* SECTION 2: TITLE, DESCRIPTION & LINK */}
        <section className="py-16 px-4 sm:px-8 lg:px-16">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-12">
                    {/* Title */}
                    <div className="max-w-4xl">
                        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-neo-light-text dark:text-neo-dark-text font-neo uppercase leading-none mb-6">
                        {project.title}
                        </h1>
                        <div className="w-32 h-2 bg-neo-cyan dark:bg-neo-pink"></div>
                    </div>

                    {/* Check it Out Button */}
                    <a
                        href={project.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 inline-flex items-center gap-3 px-8 py-4 bg-neo-pink dark:bg-neo-cyan border-4 border-neo-light-border dark:border-neo-dark-border text-neo-light-bg dark:text-neo-dark-bg shadow-neo hover:shadow-neo-hover hover:translate-x-2 hover:translate-y-2 active:translate-x-3 active:translate-y-3 transition-all duration-200 font-black text-xl uppercase"
                    >
                        <ExternalLink size={24} strokeWidth={3} />
                        Check it Out
                    </a>
                </div>

                {/* Full Description */}
                <div className="max-w-4xl mb-16">
                    <p className="text-xl text-neo-light-text dark:text-neo-dark-text font-neo leading-relaxed">
                        {project.fullDescription}
                    </p>
                </div>

                {/* Features */}
                <div className="mb-16">
                    <div className="inline-block bg-neo-yellow dark:bg-neo-green border-4 border-neo-light-border dark:border-neo-dark-border px-6 py-2 shadow-neo-sm mb-8">
                        <h2 className="text-2xl font-black text-neo-light-border dark:text-neo-dark-bg font-neo uppercase">
                        Key Features
                        </h2>
                    </div>

                    <div className="bg-neo-light-card dark:bg-neo-dark-card border-4 border-neo-light-border dark:border-neo-dark-border p-8 shadow-neo max-w-4xl">
                        <ul className="space-y-4">
                            {project.features.map((feature, index) => (
                                <li key={index} className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 bg-neo-cyan dark:bg-neo-pink border-2 border-neo-light-border dark:border-neo-dark-border flex items-center justify-center mt-1">
                                        <span className="text-sm font-black text-neo-light-border dark:text-neo-dark-bg font-neo">
                                            {index + 1}
                                        </span>
                                    </div>
                                    <p className="text-lg text-neo-light-text dark:text-neo-dark-text font-neo">
                                        {feature}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Tech Stack */}
                <div className="mb-16">
                    <div className="inline-block bg-neo-cyan dark:bg-neo-pink border-4 border-neo-light-border dark:border-neo-dark-border px-6 py-2 shadow-neo-sm mb-8">
                        <h2 className="text-2xl font-black text-neo-light-border dark:text-neo-dark-bg font-neo uppercase">
                            Tech Stack
                        </h2>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        {project.tech.map((tech, index) => (
                            <div
                                key={index}
                                className="px-6 py-3 bg-neo-light-card dark:bg-neo-dark-card border-4 border-neo-light-border dark:border-neo-dark-border shadow-neo hover:shadow-neo-hover hover:translate-x-1 hover:translate-y-1 transition-all duration-200"
                            >
                                <span className="text-lg font-black text-neo-light-text dark:text-neo-dark-text font-neo uppercase">
                                    {tech}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Screenshots */}
                <div className="mb-16">
                    <div className="inline-block bg-neo-pink dark:bg-neo-cyan border-4 border-neo-light-border dark:border-neo-dark-border px-6 py-2 shadow-neo-sm mb-8">
                        <h2 className="text-2xl font-black text-neo-light-bg dark:text-neo-dark-bg font-neo uppercase">
                            Screenshots
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {project.screenshots.map((screenshot, index) => (
                            <div
                                key={index}
                                className="border-4 border-neo-light-border dark:border-neo-dark-border shadow-neo overflow-hidden group cursor-pointer"
                            >
                                <img 
                                    src={screenshot} 
                                    alt={`Screenshot ${index + 1}`}
                                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>

        {/* NAVIGATION: PREVIOUS & NEXT */}
        <section className="py-16 px-4 sm:px-8 lg:px-16 border-t-4 border-neo-light-border dark:border-neo-dark-border bg-neo-light-card dark:bg-neo-dark-card">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-stretch gap-6">

                    {/* Previous Project */}
                    {prevProject ? (
                        <button
                            onClick={() => handleNavigate(prevProject.slug)}
                            className="flex-1 flex items-center gap-4 p-6 bg-neo-light-bg dark:bg-neo-dark-bg border-4 border-neo-light-border dark:border-neo-dark-border shadow-neo hover:shadow-neo-hover hover:translate-x-2 hover:translate-y-2 active:translate-x-3 active:translate-y-3 transition-all duration-200 text-left group"
                        >
                            <div className="p-3 bg-neo-yellow dark:bg-neo-green border-4 border-neo-light-border dark:border-neo-dark-border group-hover:shadow-neo-sm transition-all duration-200">
                                <ChevronLeft size={32} strokeWidth={3} className="text-neo-light-border dark:text-neo-dark-bg" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-neo-light-text dark:text-neo-dark-text opacity-70 font-neo uppercase mb-1">
                                    Previous Project
                                </p>
                                <h3 className="text-xl font-black text-neo-light-text dark:text-neo-dark-text font-neo uppercase group-hover:text-neo-yellow dark:group-hover:text-neo-green transition-colors duration-200">
                                    {prevProject.title}
                                </h3>
                            </div>
                        </button>
                    ) : (
                        <div className="flex-1"></div>
                    )}

                    {/* Next Project */}
                    {nextProject ? (
                        <button
                            onClick={() => handleNavigate(nextProject.slug)}
                            className="flex-1 flex items-center justify-end gap-4 p-6 bg-neo-light-bg dark:bg-neo-dark-bg border-4 border-neo-light-border dark:border-neo-dark-border shadow-neo hover:shadow-neo-hover hover:translate-x-2 hover:translate-y-2 active:translate-x-3 active:translate-y-3 transition-all duration-200 text-right group"
                        >
                            <div>
                                <p className="text-sm font-bold text-neo-light-text dark:text-neo-dark-text opacity-70 font-neo uppercase mb-1">
                                    Next Project
                                </p>
                                <h3 className="text-xl font-black text-neo-light-text dark:text-neo-dark-text font-neo uppercase group-hover:text-neo-cyan dark:group-hover:text-neo-pink transition-colors duration-200">
                                    {nextProject.title}
                                </h3>
                            </div>
                            <div className="p-3 bg-neo-cyan dark:bg-neo-pink border-4 border-neo-light-border dark:border-neo-dark-border group-hover:shadow-neo-sm transition-all duration-200">
                                <ChevronRight size={32} strokeWidth={3} className="text-neo-light-border dark:text-neo-dark-bg" />
                            </div>
                        </button>
                    ) : (
                        <div className="flex-1"></div>
                    )}
                </div>
            </div>
        </section>
    </div>
  )
}

export default ProjectDetail