import React, { useState, useEffect } from 'react'
import { Github, Linkedin, Instagram, ArrowRight, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import projectsData from '../data/projectsData.json'
import { socialMediaLinks } from '../data/SocialMediaData'

function Home() {
  const [activeSpeciality, setActiveSpeciality] = useState('mobile')

  const specialities = [
    {
      id: 'mobile',
      title: 'Mobile App',
      description: 'Creating smooth and intuitive mobile experiences with React Native and Flutter',
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80'
    },
    {
      id: 'website',
      title: 'Website',
      description: 'Building modern, responsive websites with cutting-edge technologies',
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80'
    },
    {
      id: '3d',
      title: '3D Design',
      description: 'Crafting stunning 3D visuals and interactive experiences',
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&q=80'
    }
  ]

  const techStack = [
    'React', 'Dart', 'TypeScript', 'Node.js', 'Python', 
    'MongoDB', 'PostgreSQL', 'Tailwind CSS', 'React Native', 
    'Flutter', 'C++', 'Blender', 'Figma', 'Git'
  ]

  // Get 4 most recent featured projects
  const featuredProjects = projectsData.projects
    .filter(p => p.featured)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 4)

  return (
    <div className="bg-neo-light-bg dark:bg-neo-dark-bg transition-colors duration-300 relative w-full flex-col justify-center py-20 px-4">
      
      {/* SECTION 1: HERO */}
      <section className="flex flex-col items-center px-16 pt-20 pb-20">
        <div className="max-w-9xl">

          {/* Greeting */}
          <div className="mb-8">
            <h1 className="text-6xl sm:text-7xl md:text-8xl font-black text-neo-light-text dark:text-neo-dark-text mb-4 font-neo uppercase tracking-tight border-neo-light-border">
              HAI, IT'S ME ARIS
            </h1>
          </div>

          {/* Description */}
          <div className="rounded-3xl mb-8 bg-neo-light-card dark:bg-neo-dark-card border-4 border-neo-light-border dark:border-neo-dark-border p-6">
            <p className="text-3xl sm:text-4xl font-bold text-neo-light-text dark:text-neo-dark-text font-neo">
              Crafting thoughtful digital experiences, one step at a time.
            </p>
            <p className="text-3xl text-neo-light-text dark:text-neo-dark-text opacity-80 mt-2 font-neo">
              I’m exploring the world of design & development — building websites, mobile apps, and 3D concepts while continuing to learn, grow, and find opportunities to contribute.
            </p>
          </div>

          <div className="flex items-center justify-between mb-8">
            {/* Social Links */}
            <div className="flex gap-4">
              {socialMediaLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`rounded-2xl p-4 bg-${social.color} border-4 border-neo-light-border dark:border-neo-dark-border shadow-neo hover:shadow-neo-hover hover:translate-y-1 hover:translate-x-1 transition-all duration-200`}
                  aria-label={social.label}
                >
                  <social.icon size={28} className="text-neo-light-border dark:text-neo-dark-bg" />
                </a>
              ))}
            </div>

            {/* CTA Button */}
            <Link
              to="/about"
              className="rounded-full inline-flex items-center gap-3 px-8 py-4 bg-neo-dark-text text-neo-dark-bg border-4 border-neo-dark-border shadow-neo hover:shadow-neo-hover hover:translate-y-1 hover:translate-x-1 transition-all duration-200 font-black text-xl uppercase"
            >
              About Me
              <ArrowRight size={24} />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 2: MARQUEE + SHORT ABOUT */}
      <section className="py-16 border-t-4 border-b-4 border-neo-light-border dark:border-neo-dark-border">
        {/* Marquee Text */}
        <div className="overflow-hidden bg-neo-yellow dark:bg-neo-green py-6 mb-12">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center">
                <span className="text-4xl sm:text-5xl md:text-6xl font-black text-neo-light-border dark:text-neo-dark-bg mx-8 font-neo uppercase">
                  Mobile
                </span>
                <span className="text-4xl mx-8">★</span>
                <span className="text-4xl sm:text-5xl md:text-6xl font-black text-neo-light-border dark:text-neo-dark-bg mx-8 font-neo uppercase">
                  Website
                </span>
                <span className="text-4xl mx-8">★</span>
                <span className="text-4xl sm:text-5xl md:text-6xl font-black text-neo-light-border dark:text-neo-dark-bg mx-8 font-neo uppercase">
                  3D Design
                </span>
                <span className="text-4xl mx-8">★</span>
              </div>
            ))}
          </div>
        </div>

        {/* Short About */}
        <div className="max-w-5xl mx-auto px-4 sm:px-8">
          <div className="rounded-3xl bg-neo-light-card dark:bg-neo-dark-card border-4 border-neo-light-border dark:border-neo-dark-border p-8 sm:p-12 ">
            <h3 className="text-center text-4xl sm:text-4xl font-black text-neo-light-text dark:text-neo-dark-text mb-6 font-neo uppercase">
              About Me
            </h3>
            <p className="text-center text-3xl text-neo-light-text dark:text-neo-dark-text leading-relaxed font-neo">
              I’m currently growing my skills in web development, mobile apps, and 3D design. Although I don’t have professional experience yet, I’m actively building projects, improving my craft, and looking for opportunities to apply what I’ve learned.
              I’m also open to roles in IT support, administration, customer service, or other fields where I can contribute while continuing my journey in tech.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: MY WORK */}
      <section className="py-20 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Title */}
          <div className="mb-12">
            <div className="rounded-3xl inline-block px-8 py-4 shadow-neo mb-8 bg-neo-cyan dark:bg-neo-pink border-4 border-neo-light-border dark:border-neo-dark-border">
              <h2 className="text-4xl sm:text-5xl font-black text-neo-light-text dark:text-neo-dark-text font-neo uppercase">
                My Work
              </h2>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
            {featuredProjects.map((project) => (
              <div
                key={project.id}
                className="rounded-3xl bg-neo-light-card dark:bg-neo-dark-card border-4 border-neo-light-border dark:border-neo-dark-border shadow-neo hover:shadow-neo-hover hover:translate-x-2 hover:translate-y-2 transition-all duration-200 overflow-hidden group"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden border-b-4 border-neo-light-border dark:border-neo-dark-border">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-black text-neo-light-text dark:text-neo-dark-text mb-3 font-neo uppercase">
                    {project.title}
                  </h3>
                  <p className="text-neo-light-text dark:text-neo-dark-text opacity-80 mb-4 font-neo">
                    {project.shortDescription}
                  </p>
                  
                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2">
                    {project.tech.slice(0, 3).map((tech, index) => (
                      <span
                        key={index}
                        className="rounded-xl px-3 py-1 bg-neo-light-bg dark:bg-neo-dark-bg border-2 border-neo-light-border dark:border-neo-dark-border text-neo-light-text dark:text-neo-dark-text mt-2 font-neo font-bold uppercase"
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
          <div className="text-center">
            <Link
              to="/projects"
              className="rounded-full inline-flex items-center gap-3 px-10 py-5 bg-neo-dark-text text-neo-dark-bg border-4 border-neo-dark-border shadow-neo hover:shadow-neo-hover hover:translate-x-2 hover:translate-y-2 transition-all duration-200 font-black text-xl uppercase"
            >
              View All Projects
              <ArrowRight size={24} />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 4: SPECIALITY */}
      <section className="py-20 px-4 sm:px-8 border-t-4 border-neo-light-border dark:border-neo-dark-border">
        <div className="max-w-7xl mx-auto">
          {/* Section Title */}
          <div className="mb-12">
            <div className="rounded-3xl inline-block px-8 py-4 shadow-neo bg-neo-pink dark:bg-neo-cyan border-4 border-neo-light-border dark:border-neo-dark-border">
              <h2 className="text-4xl sm:text-5xl font-black text-neo-light-bg dark:text-neo-dark-bg font-neo uppercase">
                Speciality
              </h2>
            </div>
          </div>

          {/* Speciality Content */}
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {/* Left: List */}
            <div className="space-y-4">
              {specialities.map((spec) => (
                <button
                  key={spec.id}
                  onClick={() => setActiveSpeciality(spec.id)}
                  className={`rounded-3xl w-full text-left p-6 border-4 border-neo-light-border dark:border-neo-dark-border font-neo shadow-neo hover:shadow-neo-hover hover:translate-x-1 hover:translate-y-1 transition-all duration-200 ${
                    activeSpeciality === spec.id
                      ? 'bg-neo-yellow dark:bg-neo-green shadow-neo-hover translate-x-1 translate-y-1'
                      : 'bg-neo-light-card dark:bg-neo-dark-card shadow-neo hover:shadow-neo-hover hover:translate-x-1 hover:translate-y-1'
                  }`}
                >
                  <h3 className="text-2xl sm:text-3xl font-black text-neo-light-text dark:text-neo-dark-text mb-2 uppercase">
                    {spec.title}
                  </h3>
                  <p className={`text-lg ${
                    activeSpeciality === spec.id
                      ? 'text-neo-light-border dark:text-neo-dark-bg'
                      : 'text-neo-light-text dark:text-neo-dark-text opacity-70'
                  }`}>
                    {spec.description}
                  </p>
                </button>
              ))}
            </div>

            {/* Right: Image */}
            <div className="relative">
              <div className="sticky top-24">
                <div className="rounded-3xl border-4 border-neo-light-border dark:border-neo-dark-border shadow-neo overflow-hidden">
                  <img 
                    src={specialities.find(s => s.id === activeSpeciality)?.image}
                    alt={specialities.find(s => s.id === activeSpeciality)?.title}
                    className="w-full h-[500px] object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tech Stack Marquee */}
          <div className="overflow-hidden bg-neo-light-card dark:bg-neo-dark-card border-4 border-neo-light-border dark:border-neo-dark-border py-8">
            <div className="flex animate-marquee-reverse whitespace-nowrap">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center">
                  {techStack.map((tech, index) => (
                    <React.Fragment key={index}>
                      <span className="text-2xl sm:text-3xl font-black text-neo-light-text dark:text-neo-dark-text mx-6 font-neo uppercase">
                        {tech}
                      </span>
                      <span className="text-2xl mx-6 text-neo-light-text dark:text-neo-dark-text">●</span>
                    </React.Fragment>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

export default Home