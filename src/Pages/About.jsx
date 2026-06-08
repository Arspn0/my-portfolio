import React from 'react'
import { Download, FileText, Lightbulb, Code, Rocket, CheckCircle, PenBox } from 'lucide-react'
import experienceData from '../data/experienceData.json'
import ProfilePicture from '../assets/profile/profile-picture.png'

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
    <div className="bg-neo-light-bg dark:bg-neo-dark-bg min-h-screen py-10 sm:py-20 px-0 sm:px-4 transition-colors duration-300 overflow-x-hidden">
      
      {/* SECTION 1: PROFILE + INTRO */}
      <section className="flex flex-col items-center px-6 sm:px-16 pt-10 sm:pt-20 pb-10 sm:pb-20">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-10 sm:gap-20 items-center">
            
            {/* Left: Photo with Unique Frame */}
            <div className="relative flex justify-center lg:justify-center order-1 lg:order-none">
              <div className="relative inline-block w-48 sm:w-64 md:w-80 lg:w-[30rem] aspect-square">
                {/* Main frame */}
                <div className="rounded-3xl absolute inset-0 z-10 border-4 sm:border-6 border-neo-light-border dark:border-neo-dark-border bg-neo-light-card dark:bg-neo-dark-card p-2 sm:p-4">
                  {/* Image follows frame */}
                  <img 
                    src={ProfilePicture}
                    alt="Profile - Aris"
                    className="rounded-2xl w-full h-full object-cover border-2 sm:border-3 border-neo-light-border dark:border-neo-dark-border"
                  />
                </div>

                {/* Corner Decor */}
                <div className="rounded-ss-3xl absolute -top-2 -left-2 sm:-top-4 sm:-left-4 w-10 h-10 sm:w-16 sm:h-16 bg-neo-yellow dark:bg-neo-green border-2 sm:border-3 border-neo-light-border dark:border-neo-dark-border"></div>
                <div className="rounded-ee-3xl absolute -bottom-2 -right-2 sm:-bottom-4 sm:-right-4 w-12 h-12 sm:w-20 sm:h-20 bg-neo-cyan dark:bg-neo-pink border-2 sm:border-3 border-neo-light-border dark:border-neo-dark-border"></div>

                {/* Side Lines */}
                <div className="absolute top-1/4 -right-4 sm:-right-8 w-8 sm:w-14 h-1 sm:h-1.5 bg-neo-pink dark:bg-neo-yellow"></div>
                <div className="absolute bottom-1/3 -left-4 sm:-left-8 w-6 sm:w-12 h-1 sm:h-1.5 bg-neo-green dark:bg-neo-cyan"></div>
              </div>
            </div>

            {/* Right: Text Content */}
            <div className="space-y-4 text-center lg:text-left order-2 lg:order-none mt-8 lg:mt-0">
              <div>
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-neo-light-text dark:text-neo-dark-text font-neo uppercase mb-4 leading-tight">
                  I'M ARIS SOPIAN
                </h1>
                <div className="w-20 sm:w-32 h-2 bg-neo-yellow dark:bg-neo-green mb-6 mx-auto lg:mx-0"></div>
              </div>

              {/* Description */}
              <div className="space-y-4 px-2 sm:px-0">
                <p className="text-lg sm:text-xl font-bold text-neo-light-text dark:text-neo-dark-text font-neo">
                  Aspiring Full Stack Developer & Creative Problem Solver
                </p>
                <p className="text-base sm:text-lg text-neo-light-text dark:text-neo-dark-text opacity-80 font-neo leading-relaxed">
                  I’m a passionate learner who enjoys turning ideas into interactive, user-focused digital products. I’m currently developing my skills in web development, mobile app development, and 3D design — combining creativity with logical problem-solving.
                </p>
                <p className="text-base sm:text-lg text-neo-light-text dark:text-neo-dark-text opacity-80 font-neo leading-relaxed hidden sm:block">
                  Even though I’m still early in my journey, I love experimenting, building, and improving with every project. My goal is to create meaningful solutions that are functional, visually appealing, and impactful.
                </p>
              </div>

              {/* Resume Button */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
                <a
                  href="/resume.pdf"
                  download
                  className="rounded-full sm:rounded-full inline-flex items-center justify-center gap-3 px-6 py-3 sm:px-8 sm:py-4 bg-neo-yellow dark:bg-neo-green border-4 border-neo-light-border dark:border-neo-dark-border text-neo-light-border dark:text-neo-dark-bg shadow-neo hover:shadow-neo-hover hover:translate-x-1 hover:translate-y-1 sm:hover:translate-x-2 sm:hover:translate-y-2 transition-all duration-200 font-black text-base sm:text-lg uppercase"
                >
                  <Download size={20} strokeWidth={3} className="sm:w-6 sm:h-6" />
                  Download CV
                </a>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: TECH STACK MARQUEE */}
      <section className="py-10 sm:py-16 border-t-4 border-b-4 border-neo-light-border dark:border-neo-dark-border bg-neo-light-card dark:bg-neo-dark-card overflow-hidden">
        <div className="mb-8 text-center px-4">
          <div className="rounded-3xl inline-block bg-neo-pink dark:bg-neo-cyan border-4 border-neo-light-border dark:border-neo-dark-border px-6 py-2 sm:px-8 sm:py-3 shadow-neo">
            <h2 className="text-2xl sm:text-4xl font-black text-neo-light-bg dark:text-neo-dark-bg font-neo uppercase">
              Tech Stack
            </h2>
          </div>
        </div>

        {/* Marquee Row 1 */}
        <div className="overflow-hidden py-2 sm:py-4 mb-2 sm:mb-4">
          <div className="flex animate-marquee-reverse whitespace-nowrap">
            {[...Array(2)].map((_, arrayIndex) => (
              <div key={arrayIndex} className="flex items-center">
                {techStack.slice(0, 8).map((tech, index) => (
                  <div
                    key={index}
                    className="rounded-full mx-2 sm:mx-4 bg-neo-light-bg dark:bg-neo-dark-bg border-2 sm:border-4 border-neo-light-border dark:border-neo-dark-border px-4 py-2 sm:px-8 sm:py-4 flex items-center gap-2 sm:gap-4"
                  >
                    <span className="text-2xl sm:text-4xl">{tech.icon}</span>
                    <span className="text-lg sm:text-2xl font-black text-neo-light-text dark:text-neo-dark-text font-neo uppercase">
                      {tech.name}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Marquee Row 2 */}
        <div className="overflow-hidden py-2 sm:py-4">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...Array(2)].map((_, arrayIndex) => (
              <div key={arrayIndex} className="flex items-center">
                {techStack.slice(8).map((tech, index) => (
                  <div
                    key={index}
                    className="rounded-full mx-2 sm:mx-4 bg-neo-light-bg dark:bg-neo-dark-bg border-2 sm:border-4 border-neo-light-border dark:border-neo-dark-border px-4 py-2 sm:px-8 sm:py-4 flex items-center gap-2 sm:gap-4"
                  >
                    <span className="text-2xl sm:text-4xl">{tech.icon}</span>
                    <span className="text-lg sm:text-2xl font-black text-neo-light-text dark:text-neo-dark-text font-neo uppercase">
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
      <section className="py-10 sm:py-20 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="mb-10 sm:mb-16 text-center sm:text-left">
            <div className="rounded-2xl sm:rounded-3xl inline-block bg-neo-yellow dark:bg-neo-green border-4 border-neo-light-border dark:border-neo-dark-border px-6 py-2 sm:px-8 sm:py-3 shadow-neo mb-4 sm:mb-6">
              <h2 className="text-2xl sm:text-5xl font-black text-neo-light-border dark:text-neo-dark-bg font-neo uppercase">
                My Experience
              </h2>
            </div>
            <p className="text-lg sm:text-xl text-neo-light-text dark:text-neo-dark-text font-neo font-bold max-w-2xl mx-auto sm:mx-0">
              Building digital products and leading teams across various companies and projects
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical Line */}
            <div className="hidden sm:block absolute left-8 top-0 bottom-0 w-1 bg-neo-light-border dark:border-neo-dark-border"></div>

            {/* Experience Items */}
            <div className="space-y-8 sm:space-y-12">
              {experienceData.experiences.slice().reverse().map((exp, index) => (
                <div key={exp.id} className="relative pl-0 sm:pl-24">
                  
                  {/* Timeline Dot */}
                  <div className="hidden sm:flex rounded-2xl absolute left-0 top-6 w-16 h-16 bg-neo-cyan dark:bg-neo-pink border-4 border-neo-light-border dark:border-neo-dark-border items-center justify-center">
                    <span className="text-2xl font-black text-neo-light-border dark:text-neo-dark-bg font-neo">
                      {index + 1}
                    </span>
                  </div>

                  {/* Content Card */}
                  <div className="rounded-2xl sm:rounded-3xl bg-neo-light-card dark:bg-neo-dark-card border-2 sm:border-4 border-neo-light-border dark:border-neo-dark-border p-5 sm:p-8 shadow-neo hover:shadow-neo-hover hover:translate-x-1 hover:translate-y-1 sm:hover:translate-x-2 sm:hover:translate-y-2 transition-all duration-200">
                    
                    {/* Mobile Only Header */}
                    <div className="flex sm:hidden justify-between items-center mb-4">
                       <div className="rounded-lg bg-neo-cyan dark:bg-neo-pink border-2 border-neo-light-border dark:border-neo-dark-border w-8 h-8 flex items-center justify-center">
                          <span className="font-black text-neo-light-border dark:text-neo-dark-bg">{index + 1}</span>
                       </div>
                       <div className="rounded-lg bg-neo-yellow dark:bg-neo-green border-2 border-neo-light-border dark:border-neo-dark-border px-3 py-1">
                        <span className="text-xs font-black text-neo-light-border dark:text-neo-dark-bg font-neo uppercase">
                          {exp.year}
                        </span>
                      </div>
                    </div>

                    {/* Desktop Year Badge */}
                    <div className="hidden sm:inline-block rounded-xl bg-neo-yellow dark:bg-neo-green border-2 border-neo-light-border dark:border-neo-dark-border px-4 py-1 mb-4">
                      <span className="text-sm font-black text-neo-light-border dark:text-neo-dark-bg font-neo uppercase">
                        {exp.year}
                      </span>
                    </div>

                    {/* Position & Company */}
                    <h3 className="text-xl sm:text-3xl font-black text-neo-light-text dark:text-neo-dark-text font-neo uppercase mb-1 sm:mb-2">
                      {exp.position}
                    </h3>
                    <p className="text-sm sm:text-xl font-bold text-neo-light-text dark:text-neo-dark-text opacity-70 font-neo mb-3 sm:mb-4">
                      {exp.company} • {exp.duration}
                    </p>

                    {/* Description */}
                    <p className="text-sm sm:text-base text-neo-light-text dark:text-neo-dark-text font-neo mb-4 leading-relaxed">
                      {exp.description}
                    </p>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {exp.technologies.map((tech, i) => (
                        <span
                          key={i}
                          className="rounded-lg sm:rounded-xl px-2 py-1 sm:px-3 sm:py-1 bg-neo-light-bg dark:bg-neo-dark-bg border sm:border-2 border-neo-light-border dark:border-neo-dark-border text-neo-light-text dark:text-neo-dark-text text-[10px] sm:text-sm mt-1 sm:mt-2 font-neo font-bold uppercase"
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
      <section className="py-10 sm:py-20 px-4 sm:px-8 border-t-4 border-neo-light-border dark:border-neo-dark-border bg-neo-light-card dark:bg-neo-dark-card overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="mb-10 sm:mb-16 text-center">
            <div className="rounded-2xl sm:rounded-3xl inline-block bg-neo-pink dark:bg-neo-cyan border-4 border-neo-light-border dark:border-neo-dark-border px-6 py-2 sm:px-8 sm:py-3 shadow-neo mb-4 sm:mb-6">
              <h2 className="text-2xl sm:text-5xl font-black text-neo-light-bg dark:text-neo-dark-bg font-neo uppercase">
                How I Work
              </h2>
            </div>
            <p className="text-lg sm:text-xl text-neo-light-text dark:text-neo-dark-text font-neo font-bold max-w-2xl mx-auto">
              My systematic approach to bringing your ideas to life
            </p>
          </div>

          {/* Process Cards - Always Horizontal Scroll */}
          <div className="relative">
            {/* Scroll Container */}
            <div className="overflow-x-auto overflow-y-hidden pb-6 -mx-4 px-4 scrollbar-custom">
              <div className="flex gap-4 sm:gap-6 w-max">
                {workProcess.map((process, index) => (
                  <div
                    key={process.id}
                    // PERBAIKAN 6: Ukuran card sedikit dikecilkan di mobile (w-72)
                    className="rounded-3xl flex-shrink-0 w-72 sm:w-80 bg-neo-light-bg dark:bg-neo-dark-bg border-4 border-neo-light-border dark:border-neo-dark-border p-5 sm:p-6 shadow-neo hover:shadow-neo-hover hover:translate-x-2 hover:translate-y-2 transition-all duration-200 group"
                  >
                    {/* Number Badge & Icon */}
                    <div className="flex items-start justify-between mb-4 sm:mb-6">
                      <div className={`rounded-2xl p-3 sm:p-4 bg-${process.color} border-4 border-neo-light-border dark:border-neo-dark-border shadow-neo-sm group-hover:shadow-neo-sm-hover group-hover:translate-x-1 group-hover:translate-y-1 transition-all duration-200`}>
                        <process.icon size={24} strokeWidth={3} className="text-neo-light-border dark:text-neo-dark-bg sm:w-8 sm:h-8" />
                      </div>
                      <div className="rounded-xl w-10 h-10 sm:w-12 sm:h-12 bg-neo-light-card dark:bg-neo-dark-card border-4 border-neo-light-border dark:border-neo-dark-border flex items-center justify-center">
                        <span className="text-xl sm:text-2xl font-black text-neo-light-text dark:text-neo-dark-text font-neo">
                          {index + 1}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl sm:text-2xl font-black text-neo-light-text dark:text-neo-dark-text font-neo uppercase mb-2 sm:mb-4">
                      {process.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm sm:text-base text-neo-light-text dark:text-neo-dark-text font-neo leading-relaxed min-h-[100px] sm:min-h-[120px]">
                      {process.description}
                    </p>

                    {/* Decorative Line */}
                    <div className={`mt-4 sm:mt-6 h-2 bg-${process.color} w-20`}></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
)
}

export default About