import React, { useState } from 'react'
import { ExternalLink, Github } from 'lucide-react'

function Projects() {
  const [hoveredProject, setHoveredProject] = useState(null)

  const projects = [
    {
      id: 1,
      title: "E-Commerce Platform",
      description: "Full-stack e-commerce platform dengan payment gateway integration, admin dashboard, dan real-time inventory management system.",
      image: "https://images.unsplash.com/photo-1661956602116-aa6865609028?w=800&q=80",
      tech: ["React", "Node.js", "MongoDB", "Stripe"],
      liveLink: "#",
      githubLink: "#",
      color: "primary"
    },
    {
      id: 2,
      title: "AI Task Manager",
      description: "Aplikasi task management dengan AI-powered suggestions untuk prioritas dan scheduling otomatis menggunakan machine learning.",
      image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80",
      tech: ["Next.js", "TypeScript", "OpenAI", "Prisma"],
      liveLink: "#",
      githubLink: "#",
      color: "secondary"
    },
    {
      id: 3,
      title: "Real-time Analytics Dashboard",
      description: "Dashboard analytics real-time dengan data visualization interaktif, customizable widgets, dan export functionality.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
      tech: ["React", "D3.js", "WebSocket", "Redis"],
      liveLink: "#",
      githubLink: "#",
      color: "accent"
    },
    {
      id: 4,
      title: "Social Media App",
      description: "Platform social media dengan real-time messaging, story features, dan recommendation algorithm berbasis user behavior.",
      image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80",
      tech: ["React Native", "Firebase", "Node.js", "Socket.io"],
      liveLink: "#",
      githubLink: "#",
      color: "primary"
    },
    {
      id: 5,
      title: "Learning Management System",
      description: "LMS platform untuk online courses dengan video streaming, quiz system, progress tracking, dan certificate generation.",
      image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&q=80",
      tech: ["Next.js", "PostgreSQL", "AWS S3", "Stripe"],
      liveLink: "#",
      githubLink: "#",
      color: "secondary"
    },
    {
      id: 6,
      title: "Portfolio Generator",
      description: "Tool untuk generate portfolio website dengan drag-and-drop interface, customizable themes, dan one-click deployment.",
      image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80",
      tech: ["React", "TailwindCSS", "Vercel API", "MongoDB"],
      liveLink: "#",
      githubLink: "#",
      color: "accent"
    }
  ]

  const allTechs = [...new Set(projects.flatMap(p => p.tech))]
  const [selectedFilter, setSelectedFilter] = useState('All')

  const filteredProjects = selectedFilter === 'All' 
    ? projects 
    : projects.filter(p => p.tech.includes(selectedFilter))

  return (
    <section className="min-h-screen py-20 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-40 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto relative z-10 pt-16">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Featured Projects
          </h2>
          <p className="text-light-textSecondary dark:text-slate-400 text-lg max-w-2xl mx-auto">
            Beberapa project yang telah saya kerjakan dengan berbagai teknologi modern
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          <button
            onClick={() => setSelectedFilter('All')}
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
              selectedFilter === 'All'
                ? 'bg-primary text-white dark:text-dark-bg shadow-lg shadow-primary/30'
                : 'bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border text-light-textSecondary dark:text-slate-400 hover:border-primary/30 hover:text-primary'
            }`}
          >
            All Projects
          </button>
          {allTechs.slice(0, 5).map((tech) => (
            <button
              key={tech}
              onClick={() => setSelectedFilter(tech)}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                selectedFilter === tech
                  ? 'bg-primary text-white dark:text-dark-bg shadow-lg shadow-primary/30'
                  : 'bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border text-light-textSecondary dark:text-slate-400 hover:border-primary/30 hover:text-primary'
              }`}
            >
              {tech}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onMouseEnter={() => setHoveredProject(project.id)}
              onMouseLeave={() => setHoveredProject(null)}
              className="group bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/10"
            >
              {/* Project Image */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className={`absolute inset-0 bg-gradient-to-t from-light-bg dark:from-dark-bg via-light-bg/50 dark:via-dark-bg/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                
                {/* Hover Links */}
                <div className={`absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-300`}>
                  <a
                    href={project.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-primary text-white dark:text-dark-bg rounded-full hover:bg-accent transition-colors duration-300 hover:scale-110"
                  >
                    <ExternalLink size={20} />
                  </a>
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-light-card dark:bg-dark-card border border-primary text-primary rounded-full hover:bg-primary hover:text-white dark:hover:text-dark-bg transition-all duration-300 hover:scale-110"
                  >
                    <Github size={20} />
                  </a>
                </div>
              </div>

              {/* Project Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-light-text dark:text-slate-200 mb-2 group-hover:text-primary transition-colors duration-300">
                  {project.title}
                </h3>
                <p className="text-light-textSecondary dark:text-slate-400 text-sm mb-4 line-clamp-3">
                  {project.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-full text-xs text-light-textSecondary dark:text-slate-400 hover:border-primary/50 hover:text-primary transition-all duration-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center mt-12">
          <a
            href="https://github.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 bg-light-card dark:bg-dark-card border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white dark:hover:text-dark-bg transition-all duration-300 hover:scale-105"
          >
            <Github size={20} />
            View More on GitHub
          </a>
        </div>
      </div>
    </section>
  )
}

export default Projects