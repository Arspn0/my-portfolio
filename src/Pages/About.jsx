import React from 'react'
import { Download, Lightbulb, Code, Rocket, CheckCircle, PenBox } from 'lucide-react'
import experienceData from '../data/experienceData.json'
import ProfilePicture from '../assets/profile/profile-picture.png'
import SectionHead from '../components/Sectionhead'

const pad = (n) => String(n).padStart(2, '0')

const techStack = [
  'React', 'Next.js', 'TypeScript', 'Node.js', 'Python', 'MongoDB', 'PostgreSQL', 'Tailwind CSS',
  'React Native', 'Flutter', 'Three.js', 'Blender', 'Figma', 'Git', 'Docker', 'AWS',
]

const workProcess = [
  { id: 1, title: 'Discovery', icon: Lightbulb, description: 'Understanding your needs, goals, and target audience to create the perfect strategy' },
  { id: 2, title: 'Design', icon: Code, description: 'Crafting beautiful and functional designs that align with your brand identity' },
  { id: 3, title: 'Development', icon: Rocket, description: 'Building robust and scalable solutions using modern technologies and best practices' },
  { id: 4, title: 'Delivery', icon: CheckCircle, description: 'Launching your product with ongoing support and maintenance for success' },
  { id: 5, title: 'Revision', icon: PenBox, description: 'Revision the work for the best experience' },
]

function MarqueeRow({ items, className }) {
  return (
    <div className="overflow-hidden py-2">
      <div className={`flex whitespace-nowrap ${className}`}>
        {[...Array(2)].map((_, copy) => (
          <div key={copy} className="flex items-center">
            {items.map((tech) => (
              <React.Fragment key={tech}>
                <span className="mx-4 font-display text-lg font-semibold sm:mx-6 sm:text-3xl">{tech}</span>
                <span className="accent" aria-hidden="true">/</span>
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function About() {
  return (
    <div className="page ink min-h-screen overflow-x-hidden pt-12 transition-colors duration-300 md:pt-14">
      <div className="mx-auto max-w-7xl border-x hair">

        {/* 01 PROFILE */}
        <section>
          <SectionHead n={1} title="About" />
          <div className="grid border-t hair lg:grid-cols-[1fr_1.4fr]">
            <div className="border-b hair lg:border-b-0 lg:border-r">
              <img
                src={ProfilePicture}
                alt="Profile - Aris"
                className="aspect-square h-full w-full object-cover"
              />
            </div>

            <div className="flex flex-col justify-center p-6 sm:p-12">
              <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
                I'm Aris Sopian
              </h1>
              <p className="mt-5 text-lg font-medium sm:text-xl">
                Aspiring Full Stack Developer & Creative Problem Solver
              </p>
              <p className="muted mt-4 max-w-xl leading-relaxed sm:text-lg">
                I'm a passionate learner who enjoys turning ideas into interactive, user-focused
                digital products. I'm currently developing my skills in web development, mobile app
                development, and 3D design, combining creativity with logical problem-solving.
              </p>
              <p className="muted mt-4 hidden max-w-xl leading-relaxed sm:block sm:text-lg">
                Even though I'm still early in my journey, I love experimenting, building, and
                improving with every project. My goal is to create meaningful solutions that are
                functional, visually appealing, and impactful.
              </p>
              <div className="mt-8">
                <a href="/resume.pdf" download className="btn-solid">
                  <Download size={14} /> Download CV
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 02 TECH STACK */}
        <section>
          <SectionHead n={2} title="Tech stack" meta={`${techStack.length} tools`} />
          <div className="border-t hair py-4 sm:py-6">
            <MarqueeRow items={techStack.slice(0, 8)} className="animate-marquee-reverse" />
            <MarqueeRow items={techStack.slice(8)} className="animate-marquee" />
          </div>
        </section>

        {/* 03 EXPERIENCE */}
        <section>
          <SectionHead n={3} title="Experience" />
          <div className="border-t hair p-6 sm:px-12 sm:py-10">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">My experience</h2>
            <p className="muted mt-3 max-w-2xl leading-relaxed">
              Building digital products and leading teams across various companies and projects
            </p>
          </div>
          {experienceData.experiences.slice().reverse().map((exp, index) => (
            <article key={exp.id} className="grid border-t hair md:grid-cols-[220px_1fr]">
              <div className="flex items-baseline gap-4 px-6 pt-6 sm:px-12 md:block md:border-r hair md:py-8">
                <span className="label">{pad(index + 1)}</span>
                <p className="accent font-mono text-sm md:mt-2">{exp.year}</p>
              </div>
              <div className="p-6 sm:p-8">
                <h3 className="font-display text-xl font-semibold sm:text-2xl">{exp.position}</h3>
                <p className="muted mt-1 text-sm sm:text-base">{exp.company} · {exp.duration}</p>
                <p className="mt-4 max-w-2xl leading-relaxed">{exp.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {exp.technologies.map((tech, i) => (
                    <span key={i} className="label border hair px-2 py-1">{tech}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* 04 PROCESS */}
        <section>
          <SectionHead n={4} title="Process" />
          <div className="border-t hair p-6 sm:px-12 sm:py-10">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">How I work</h2>
            <p className="muted mt-3 max-w-2xl leading-relaxed">
              My systematic approach to bringing your ideas to life
            </p>
          </div>
          <div className="grid border-t hair sm:grid-cols-2 lg:grid-cols-5">
            {workProcess.map((step, i) => (
              <div key={step.id} className="border-b hair p-6 sm:border-r sm:even:border-r-0 lg:border-b-0 lg:even:border-r lg:last:border-r-0">
                <div className="flex items-center justify-between">
                  <span className="grid h-10 w-10 place-items-center border hair accent">
                    <step.icon size={18} />
                  </span>
                  <span className="label">{pad(i + 1)}</span>
                </div>
                <h3 className="mt-6 font-display text-xl font-semibold">{step.title}</h3>
                <p className="muted mt-2 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}

export default About