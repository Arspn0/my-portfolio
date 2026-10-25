import React, { useState, useRef, useLayoutEffect } from 'react'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import projectsData from '../data/projectsData.json'
import { socialMediaLinks } from '../data/SocialMediaData'
import SectionHead from '../components/SectionHead'
import { brandStyle } from '../data/BrandColors'
import siteData from '../data/siteData.json'

const { specialities } = siteData
const techStack = siteData.techStack.home
const pad = (n) => String(n).padStart(2, '0')

function Home() {
  const [activeId, setActiveId] = useState(specialities[0]?.id)
  const active = specialities.find((s) => s.id === activeId) ?? specialities[0]

  const activeIndex = Math.max(0, specialities.findIndex((s) => s.id === active.id))
  const imgRefs = useRef([])
  const scanRef = useRef(null)
  const shownRef = useRef(0)
  const zRef = useRef(1)

  useLayoutEffect(() => {
    if (activeIndex === shownRef.current) return
    const prev = imgRefs.current[shownRef.current]
    const next = imgRefs.current[activeIndex]
    const scan = scanRef.current
    if (!prev || !next) return
    shownRef.current = activeIndex

    // hentikan animasi yang sedang berjalan lalu sembunyikan semua kecuali gambar sebelumnya
    imgRefs.current.forEach((el) => {
      if (!el) return
      el.getAnimations().forEach((a) => a.cancel())
      el.style.opacity = el === prev ? '1' : '0'
      el.style.zIndex = el === prev ? '1' : '0'
    })
    scan?.getAnimations().forEach((a) => a.cancel())

    next.style.opacity = '1'
    next.style.zIndex = String(++zRef.current)

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const duration = 800
    const easing = 'steps(16, end)'
    next.animate(
      [{ clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)' }],
      { duration, easing }
    )
    scan?.animate(
      [
        { transform: 'translateY(0)', opacity: 1 },
        { transform: `translateY(${next.parentElement.clientHeight}px)`, opacity: 1 },
      ],
      { duration, easing }
    )
  }, [activeIndex])

  const featuredProjects = projectsData.projects
    .filter((p) => p.featured)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 4)

  return (
    // Jangan beri overflow-x-clip/hidden di akar halaman: garis atas section (bleed-left) harus bisa menembus ke kiri.
    // pb dihapus: jarak untuk navigasi bawah di HP sudah disediakan oleh Footer (pb-14 md:pb-0)
    <div className="page ink min-h-screen pt-12 transition-colors duration-300 md:pt-14">
      <div className="mx-auto max-w-7xl border-x hair">

        {/* 01 HOME */}
        <section>
          <SectionHead n={1} title="Home" meta="Open to work" />
          <div className="grid border-t hair lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
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
          <div className="grid border-t hair md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
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
          {/* 1 kolom di layar sangat sempit, 2 kolom mulai 420px (butuh Tailwind 3.2 ke atas) */}
          <div className="grid grid-cols-1 gap-px border-t hair bg-neo-light-border dark:bg-neo-dark-border min-[420px]:grid-cols-2 lg:grid-cols-4">
            {featuredProjects.map((project, i) => (
              <article key={project.id} className="surface group flex flex-col">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
                  <span className="label">{pad(i + 1)}</span>
                  <h3 className="line-clamp-2 font-display text-base font-semibold leading-tight sm:text-xl">
                    {project.title}
                  </h3>
                  <p className="muted line-clamp-3 text-xs leading-snug sm:text-sm">
                    {project.shortDescription}
                  </p>
                  <div className="mt-auto flex flex-wrap gap-1 pt-2">
                    {project.tech.slice(0, 2).map((tech, k) => (
                      <span key={k} className="label border hair px-2 py-0.5 !text-[10px] sm:!text-[11px]">
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

        {/* 04 SPECIALITY: di HP daftar di atas dan gambar di bawah, mulai sm berdampingan */}
        <section>
          <SectionHead n={4} title="Speciality" />
          <div className="grid grid-cols-1 border-t hair sm:grid-cols-2">
            <div className="min-w-0">
              {specialities.map((spec, i) => {
                const isOpen = activeId === spec.id
                return (
                  <div key={spec.id} className={`border-b hair ${isOpen ? 'surface' : ''}`}>
                    <button
                      onClick={() => setActiveId(spec.id)}
                      aria-expanded={isOpen}
                      className="flex min-h-[44px] w-full items-center justify-between gap-2 p-4 text-left sm:p-6"
                    >
                      <span className="flex min-w-0 items-baseline gap-3">
                        <span className="label">{pad(i + 1)}</span>
                        <span className={`break-words font-display text-lg font-semibold sm:text-xl md:text-2xl ${isOpen ? 'accent' : ''}`}>
                          {spec.title}
                        </span>
                      </span>
                      <ChevronDown
                        className={`h-5 w-5 shrink-0 transition-transform duration-300 sm:h-6 sm:w-6 ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                    <div
                      aria-hidden={!isOpen}
                      className={`grid transition-[grid-template-rows,opacity] duration-300 ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                    >
                      <div className="overflow-hidden">
                        <p className="muted p-4 pt-0 text-sm leading-snug sm:p-6 sm:pt-0 sm:text-base">
                          {spec.description}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* isolate: z-index gambar dan garis pemindai terkurung di sini, tidak bisa menimpa navbar */}
            <div className="relative isolate aspect-[4/3] min-w-0 overflow-hidden border-t hair sm:aspect-auto sm:min-h-[460px] sm:border-l sm:border-t-0">
              {specialities.map((s, i) => (
                <img
                  key={s.id}
                  ref={(el) => {
                    imgRefs.current[i] = el
                  }}
                  src={s.image}
                  alt={s.title}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  aria-hidden={i !== activeIndex}
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ opacity: i === 0 ? 1 : 0, zIndex: i === 0 ? 1 : 0 }}
                />
              ))}
              <div
                ref={scanRef}
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 z-[99999] border-t border-white mix-blend-difference"
                style={{ opacity: 0 }}
              />
            </div>
          </div>
        </section>

        {/* 05 TOOLKIT */}
        <section>
          <SectionHead n={5} title="Toolkit" />
          <div className="overflow-hidden border-t hair py-5 sm:py-7">
            <div className="flex animate-marquee-reverse whitespace-nowrap motion-reduce:animate-none">
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