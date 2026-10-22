import React, { useState } from 'react'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import projectsData from '../data/projectsData.json'
import { socialMediaLinks } from '../data/SocialMediaData'
import SectionHead from '../components/SectionHead'
import { brandStyle } from '../data/BrandColors'
import SrcP1 from '../assets/SrcP1.webp'
import SrcP2 from '../assets/SrcP2.webp'
import SrcP3 from '../assets/SrcP3.webp'


const specialities = [
  {
    id: 'mobile',
    title: 'Mobile App',
    description: 'Creating smooth and intuitive mobile experiences with React Native and Flutter',
    image: SrcP1,
  },
  {
    id: 'website',
    title: 'Website',
    description: 'Building modern, responsive websites with cutting-edge technologies',
    image: SrcP2,
  },
  {
    id: 'design',
    title: '3D & Design',
    description: 'Crafting stunning 3D visuals and interactive experiences',
    image: SrcP3,
  },
]

const techStack = [
  'React', 'Dart', 'TypeScript', 'Node.js', 'Python',
  'MongoDB', 'PostgreSQL', 'Tailwind CSS', 'React Native',
  'Flutter', 'C++', 'Blender', 'Figma', 'Git',
]

const pad = (n) => String(n).padStart(2, '0')

// function SectionHead({ n, title, meta }) {
//   return (
//     <div className="label flex items-center justify-between border-t hair px-4 py-3 sm:px-8">
//       <span>{pad(n)} / {title}</span>
//       {meta && <span className="hidden sm:inline">{meta}</span>}
//     </div>
//   )
// }

function Home() {
  const [activeId, setActiveId] = useState('mobile')
  const active = specialities.find((s) => s.id === activeId)

  const featuredProjects = projectsData.projects
    .filter((p) => p.featured)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 4)

  return (
    <div className="page ink min-h-screen pt-12 pb-16 transition-colors duration-300 md:pt-14 md:pb-0">
      <div className="mx-auto max-w-7xl border-x hair">

        {/* 01 HOME */}
        <section>
          <SectionHead n={1} title="Home" meta="Open to work" />
          <div className="grid border-t hair lg:grid-cols-[1.5fr_1fr]">
            <div className="p-6 sm:p-12">
              <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
                Hai, it's me <span className="accent">Aris.</span>
              </h1>
              <p className="mt-6 max-w-xl text-xl font-medium leading-snug sm:text-2xl">
                Crafting thoughtful digital experiences, one step at a time.
              </p>
              <p className="muted mt-4 max-w-xl leading-relaxed sm:text-lg">
                I'm exploring the world of design & development, building websites, mobile apps,
                and 3D concepts while continuing to learn, grow, and find opportunities to contribute.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link to="/about" className="btn-solid">
                  About me <ArrowRight size={14} />
                </Link>
                <Link to="/contact" className="btn">Contact</Link>
                <div className="hidden gap-2 sm:flex sm:ml-3">
                  {socialMediaLinks.map((social, i) => (
                    <a
                      key={i}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      style={brandStyle(social)}
                      className="brand-hover grid h-11 w-11 place-items-center border hair transition-colors"
                    >
                      <social.icon size={18}/>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t hair lg:border-l lg:border-t-0">
              <div className="label border-b hair px-6 py-3 sm:px-8">Focus</div>
              {specialities.map((s, i) => (
                <div key={s.id} className="flex items-baseline gap-4 border-b hair px-6 py-4 sm:px-8">
                  <span className="label">{pad(i + 1)}</span>
                  <span className="font-display text-lg font-semibold">{s.title}</span>
                </div>
              ))}
              <div className="label border-b hair px-6 py-3 sm:px-8">Open to roles</div>
              <p className="muted px-6 py-4 text-sm leading-relaxed sm:px-8">
                IT support, administration, customer service, or other fields where I can
                contribute while continuing my journey in tech.
              </p>
            </div>
          </div>
        </section>

        {/* 02 ABOUT */}
        <section>
          <SectionHead n={2} title="About Me" />
          <div className="grid border-t hair md:grid-cols-[1fr_2fr]">
            <h2 className="p-6 font-display text-3xl font-bold tracking-tight sm:p-12 sm:text-4xl">About me</h2>
            <p className="muted border-t hair p-6 leading-relaxed sm:p-12 sm:text-lg md:border-l md:border-t-0">
              I'm currently growing my skills in web development, mobile apps, and 3D design.
              Although I don't have professional experience yet, I'm actively building projects,
              improving my craft, and looking for opportunities to apply what I've learned. I'm
              also open to roles in IT support, administration, customer service, or other fields
              where I can contribute while continuing my journey in tech.
            </p>
          </div>
        </section>

        {/* 03 WORK */}
        <section>
          <SectionHead n={3} title="Selected work" meta={`${featuredProjects.length} projects`} />
          <div className="grid grid-cols-2 gap-px border-t hair bg-neo-light-border dark:bg-neo-dark-border lg:grid-cols-4">
            {featuredProjects.map((project, i) => (
              <article key={project.id} className="surface group flex flex-col">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-2 p-3 sm:p-5">
                  <span className="label">{pad(i + 1)}</span>
                  <h3 className="line-clamp-2 font-display text-sm font-semibold leading-tight sm:text-xl">
                    {project.title}
                  </h3>
                  <p className="muted line-clamp-2 text-[11px] leading-snug sm:line-clamp-3 sm:text-sm">
                    {project.shortDescription}
                  </p>
                  <div className="mt-auto flex flex-wrap gap-1 pt-2">
                    {project.tech.slice(0, 2).map((tech, k) => (
                      <span key={k} className="label border hair px-2 py-0.5 !text-[9px] sm:!text-[11px]">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="border-t hair p-4 sm:p-6">
            <Link to="/projects" className="btn">
              View all projects <ArrowRight size={14} />
            </Link>
          </div>
        </section>

        {/* 04 SPECIALITY */}
        <section>
          <SectionHead n={4} title="Speciality" />
          <div className="grid grid-cols-2 border-t hair">
            <div>
              {specialities.map((spec, i) => {
                const isOpen = activeId === spec.id
                return (
                  <div key={spec.id} className={`border-b hair ${isOpen ? 'surface' : ''}`}>
                    <button
                      onClick={() => setActiveId(spec.id)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-2 p-3 text-left sm:p-6"
                    >
                      <span className="flex items-baseline gap-3">
                        <span className="label">{pad(i + 1)}</span>
                        <span className={`font-display text-xs font-semibold sm:text-2xl ${isOpen ? 'accent' : ''}`}>
                          {spec.title}
                        </span>
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 transition-transform duration-300 sm:h-6 sm:w-6 ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                      <p className="muted p-3 pt-0 text-[11px] leading-snug sm:p-6 sm:pt-0 sm:text-base">
                        {spec.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="border-l hair">
              <img
                src={active.image}
                alt={active.title}
                className="h-full min-h-[240px] w-full object-cover sm:h-[460px]"
              />
            </div>
          </div>
        </section>

        {/* 05 TOOLKIT */}
        <section>
          <SectionHead n={5} title="Toolkit" />
          <div className="overflow-hidden border-t hair py-5 sm:py-7">
            <div className="flex animate-marquee-reverse whitespace-nowrap">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center">
                  {techStack.map((tech) => (
                    <React.Fragment key={tech}>
                      <span className="mx-4 font-display text-lg font-semibold sm:mx-6 sm:text-3xl">{tech}</span>
                      <span className="accent" aria-hidden="true">/</span>
                    </React.Fragment>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}

export default Home