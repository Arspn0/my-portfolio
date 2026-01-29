import React from 'react'
import { Download, FileText, Lightbulb, Code, Rocket, CheckCircle, PenBox } from 'lucide-react'
import experienceData from '../data/experienceData.json'

function About() {

  // Tech Stack
  const techStack = [
    { name: 'React', icon: '⚛️' },
    { name: 'Next.js', icon: '▲' },
    { name: 'TypeScript', icon: '📘' },
    { name: 'Node.js', icon: '🟢' },
    { name: 'Python', icon: '🐍' },
    { name: 'MongoDB', icon: '🍃' },
    { name: 'PostgreSQL', icon: '🐘' },
    { name: 'Tailwind CSS', icon: '💨' },
    { name: 'React Native', icon: '📱' },
    { name: 'Flutter', icon: '🎯' },
    { name: 'Three.js', icon: '🎮' },
    { name: 'Blender', icon: '🎨' },
    { name: 'Figma', icon: '🎭' },
    { name: 'Git', icon: '🔀' },
    { name: 'Docker', icon: '🐳' },
    { name: 'AWS', icon: '☁️' },
  ]

  // Work Process
  const workProcess = [
    {
      id: 1,
      title: 'Discovery',
      icon: Lightbulb,
      description: 'Understanding your needs, goals, and target audience to create the perfect strategy',
      color: 'neo-yellow'
    },
    {
      id: 2,
      title: 'Design',
      icon: Code,
      description: 'Crafting beautiful and functional designs that align with your brand identity',
      color: 'neo-cyan'
    },
    {
      id: 3,
      title: 'Development',
      icon: Rocket,
      description: 'Building robust and scalable solutions using modern technologies and best practices',
      color: 'neo-pink'
    },
    {
      id: 4,
      title: 'Delivery',
      icon: CheckCircle,
      description: 'Launching your product with ongoing support and maintenance for success',
      color: 'neo-green'
    },
    {
      id: 5,
      title: 'Revision',
      icon: PenBox,
      description: 'Revision the work for the best experience',
      color: 'neo-cyan'
    }
  ]

  return (
    <div className="bg-neo-light-bg dark:bg-neo-dark-bg min-h-screen py-20 px-4 transition-colors duration-300">
      
      {/* SECTION 1: PROFILE + INTRO */}
      <section className="min-h-screen flex items-center px-4 sm:px-8 lg:px-16 pt-24 pb-16">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left: Photo with Unique Frame */}
            <div className="relative">
              <div className="relative inline-block">
                {/* Main Photo */}
                <div className="relative z-10 border-8 border-neo-light-border dark:border-neo-dark-border shadow-neo bg-neo-light-card dark:bg-neo-dark-card p-4">
                  <img 
                    src="https://i.pinimg.com/1200x/40/42/2f/40422f207beffab521842104974ad15b.jpg"
                    alt="Profile - Killua"
                    className="w-full aspect-square object-cover border-4 border-neo-light-border dark:border-neo-dark-border"
                  />
                </div>
                
                {/* Decorative Corner Elements */}
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-neo-yellow dark:bg-neo-green border-4 border-neo-light-border dark:border-neo-dark-border"></div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-neo-cyan dark:bg-neo-pink border-4 border-neo-light-border dark:border-neo-dark-border"></div>
                
                {/* Decorative Lines */}
                <div className="absolute top-1/4 -right-12 w-20 h-2 bg-neo-pink dark:bg-neo-yellow"></div>
                <div className="absolute bottom-1/3 -left-12 w-16 h-2 bg-neo-green dark:bg-neo-cyan"></div>
              </div>
            </div>

            {/* Right: Text Content */}
            <div className="space-y-6">
              {/* Title */}
              <div>
                <div className="inline-block bg-neo-cyan dark:bg-neo-pink border-4 border-neo-light-border dark:border-neo-dark-border px-6 py-2 shadow-neo-sm mb-6">
                  <h2 className="text-2xl font-black text-neo-light-border dark:text-neo-dark-bg font-neo uppercase">
                    Who Am I?
                  </h2>
                </div>
                
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-neo-light-text dark:text-neo-dark-text font-neo uppercase mb-4">
                  I'M ARIS
                </h1>
                
                <div className="w-32 h-2 bg-neo-yellow dark:bg-neo-green mb-6"></div>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <p className="text-xl font-bold text-neo-light-text dark:text-neo-dark-text font-neo">
                  Full Stack Developer & Creative Problem Solver
                </p>
                <p className="text-lg text-neo-light-text dark:text-neo-dark-text opacity-80 font-neo leading-relaxed">
                  I build digital products that combine beautiful design with powerful functionality. With expertise in web development, mobile apps, and 3D design, I transform ideas into reality through code and creativity.
                </p>
                <p className="text-lg text-neo-light-text dark:text-neo-dark-text opacity-80 font-neo leading-relaxed">
                  Passionate about creating user-centric solutions that make a difference. Always learning, always building, always pushing boundaries.
                </p>
              </div>

              {/* Resume Button */}
              <div className="flex gap-4 pt-4">
                <a
                  href="/resume.pdf"
                  download
                  className="inline-flex items-center gap-3 px-8 py-4 bg-neo-yellow dark:bg-neo-green border-4 border-neo-light-border dark:border-neo-dark-border text-neo-light-border dark:text-neo-dark-bg shadow-neo hover:shadow-neo-hover hover:translate-x-2 hover:translate-y-2 active:translate-x-3 active:translate-y-3 transition-all duration-200 font-black text-lg uppercase"
                >
                  <Download size={24} strokeWidth={3} />
                  Download CV
                </a>
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-neo-light-card dark:bg-neo-dark-card border-4 border-neo-light-border dark:border-neo-dark-border text-neo-light-text dark:text-neo-dark-text shadow-neo hover:shadow-neo-hover hover:translate-x-2 hover:translate-y-2 active:translate-x-3 active:translate-y-3 transition-all duration-200 font-black text-lg uppercase"
                >
                  <FileText size={24} strokeWidth={3} />
                  View Resume
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: TECH STACK MARQUEE */}
      <section className="py-16 border-t-4 border-b-4 border-neo-light-border dark:border-neo-dark-border bg-neo-light-card dark:bg-neo-dark-card">
        <div className="mb-8 text-center">
          <div className="inline-block bg-neo-pink dark:bg-neo-cyan border-4 border-neo-light-border dark:border-neo-dark-border px-8 py-3 shadow-neo">
            <h2 className="text-3xl sm:text-4xl font-black text-neo-light-bg dark:text-neo-dark-bg font-neo uppercase">
              Tech Stack
            </h2>
          </div>
        </div>

        {/* Marquee Row 1 - Left to Right */}
        <div className="overflow-hidden py-4 mb-4">
          <div className="flex animate-marquee-reverse whitespace-nowrap">
            {[...Array(2)].map((_, arrayIndex) => (
              <div key={arrayIndex} className="flex items-center">
                {techStack.slice(0, 8).map((tech, index) => (
                  <div
                    key={index}
                    className="mx-4 bg-neo-light-bg dark:bg-neo-dark-bg border-4 border-neo-light-border dark:border-neo-dark-border px-8 py-4 flex items-center gap-4"
                  >
                    <span className="text-4xl">{tech.icon}</span>
                    <span className="text-2xl font-black text-neo-light-text dark:text-neo-dark-text font-neo uppercase">
                      {tech.name}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Marquee Row 2 - Right to Left */}
        <div className="overflow-hidden py-4">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...Array(2)].map((_, arrayIndex) => (
              <div key={arrayIndex} className="flex items-center">
                {techStack.slice(8).map((tech, index) => (
                  <div
                    key={index}
                    className="mx-4 bg-neo-light-bg dark:bg-neo-dark-bg border-4 border-neo-light-border dark:border-neo-dark-border px-8 py-4 flex items-center gap-4"
                  >
                    <span className="text-4xl">{tech.icon}</span>
                    <span className="text-2xl font-black text-neo-light-text dark:text-neo-dark-text font-neo uppercase">
                      {tech.name}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: WORK EXPERIENCE */}
      <section className="py-20 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="mb-16">
            <div className="inline-block bg-neo-yellow dark:bg-neo-green border-4 border-neo-light-border dark:border-neo-dark-border px-8 py-3 shadow-neo mb-6">
              <h2 className="text-4xl sm:text-5xl font-black text-neo-light-border dark:text-neo-dark-bg font-neo uppercase">
                My Work Experience
              </h2>
            </div>
            <p className="text-xl text-neo-light-text dark:text-neo-dark-text font-neo font-bold max-w-2xl">
              Building digital products and leading teams across various companies and projects
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-neo-light-border dark:border-neo-dark-border"></div>

            {/* Experience Items */}
            <div className="space-y-12">
              {experienceData.experiences.map((exp, index) => (
                <div key={exp.id} className="relative pl-24">
                  {/* Timeline Dot */}
                  <div className="absolute left-0 top-6 w-16 h-16 bg-neo-cyan dark:bg-neo-pink border-4 border-neo-light-border dark:border-neo-dark-border shadow-neo flex items-center justify-center">
                    <span className="text-2xl font-black text-neo-light-border dark:text-neo-dark-bg font-neo">
                      {index + 1}
                    </span>
                  </div>

                  {/* Content Card */}
                  <div className="bg-neo-light-card dark:bg-neo-dark-card border-4 border-neo-light-border dark:border-neo-dark-border p-6 sm:p-8 shadow-neo hover:shadow-neo-hover hover:translate-x-2 hover:translate-y-2 transition-all duration-200">
                    {/* Year Badge */}
                    <div className="inline-block bg-neo-yellow dark:bg-neo-green border-2 border-neo-light-border dark:border-neo-dark-border px-4 py-1 mb-4">
                      <span className="text-sm font-black text-neo-light-border dark:text-neo-dark-bg font-neo uppercase">
                        {exp.year}
                      </span>
                    </div>

                    {/* Position & Company */}
                    <h3 className="text-2xl sm:text-3xl font-black text-neo-light-text dark:text-neo-dark-text font-neo uppercase mb-2">
                      {exp.position}
                    </h3>
                    <p className="text-xl font-bold text-neo-light-text dark:text-neo-dark-text opacity-70 font-neo mb-4">
                      {exp.company} • {exp.duration}
                    </p>

                    {/* Description */}
                    <p className="text-neo-light-text dark:text-neo-dark-text font-neo mb-4 leading-relaxed">
                      {exp.description}
                    </p>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-neo-light-bg dark:bg-neo-dark-bg border-2 border-neo-light-border dark:border-neo-dark-border text-sm font-bold uppercase font-neo"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: WORK PROCESS */}
      <section className="py-20 px-4 sm:px-8 border-t-4 border-neo-light-border dark:border-neo-dark-border bg-neo-light-card dark:bg-neo-dark-card overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="mb-16 text-center">
            <div className="inline-block bg-neo-pink dark:bg-neo-cyan border-4 border-neo-light-border dark:border-neo-dark-border px-8 py-3 shadow-neo mb-6">
              <h2 className="text-4xl sm:text-5xl font-black text-neo-light-bg dark:text-neo-dark-bg font-neo uppercase">
                How I Work
              </h2>
            </div>
            <p className="text-xl text-neo-light-text dark:text-neo-dark-text font-neo font-bold max-w-2xl mx-auto">
              My systematic approach to bringing your ideas to life
            </p>
          </div>

          {/* Process Cards - Always Horizontal Scroll */}
          <div className="relative">
            {/* Scroll Container */}
            <div className="overflow-x-auto overflow-y-hidden pb-6 -mx-4 px-4 scrollbar-custom">
              <div className="flex gap-6 w-max">
                {workProcess.map((process, index) => (
                  <div
                    key={process.id}
                    className="flex-shrink-0 w-80 bg-neo-light-bg dark:bg-neo-dark-bg border-4 border-neo-light-border dark:border-neo-dark-border p-6 shadow-neo hover:shadow-neo-hover hover:translate-x-2 hover:translate-y-2 transition-all duration-200 group"
                  >
                    {/* Number Badge & Icon */}
                    <div className="flex items-start justify-between mb-6">
                      <div className={`p-4 bg-${process.color} border-4 border-neo-light-border dark:border-neo-dark-border shadow-neo-sm group-hover:shadow-neo-sm-hover group-hover:translate-x-1 group-hover:translate-y-1 transition-all duration-200`}>
                        <process.icon size={32} strokeWidth={3} className="text-neo-light-border dark:text-neo-dark-bg" />
                      </div>
                      <div className="w-12 h-12 bg-neo-light-card dark:bg-neo-dark-card border-4 border-neo-light-border dark:border-neo-dark-border flex items-center justify-center shadow-neo-sm">
                        <span className="text-2xl font-black text-neo-light-text dark:text-neo-dark-text font-neo">
                          {index + 1}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-black text-neo-light-text dark:text-neo-dark-text font-neo uppercase mb-4">
                      {process.title}
                    </h3>

                    {/* Description */}
                    <p className="text-neo-light-text dark:text-neo-dark-text font-neo leading-relaxed min-h-[120px]">
                      {process.description}
                    </p>

                    {/* Decorative Line */}
                    <div className={`mt-6 h-2 bg-${process.color} w-20`}></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Scroll Indicator */}
            <div className="text-center mt-8">
              <div className="inline-flex items-center gap-2 bg-neo-light-bg dark:bg-neo-dark-bg border-4 border-neo-light-border dark:border-neo-dark-border px-6 py-3 shadow-neo-sm">
                <div className="flex gap-2">
                  {workProcess.map((_, index) => (
                    <div
                      key={index}
                      className="w-3 h-3 bg-neo-light-text dark:bg-neo-dark-text border-2 border-neo-light-border dark:border-neo-dark-border"
                    ></div>
                  ))}
                </div>
                <span className="text-sm font-bold text-neo-light-text dark:text-neo-dark-text font-neo uppercase ml-2">
                  Scroll to see all →
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

export default About