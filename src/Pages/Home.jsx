import React, { useState, useEffect } from 'react'
import { Github, Linkedin, Instagram, ArrowRight, ExternalLink, ChevronDown } from 'lucide-react'
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
      <section className="flex flex-col items-center px-6 sm:px-10 md:px-16 pt-20 pb-20">
        <div className="w-full max-w-7xl">

          {/* Greeting (tetap rata kiri) */}
          <div className="mb-8">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-neo-light-text dark:text-neo-dark-text mb-4 font-neo uppercase tracking-tight">
              HAI, IT'S ME ARIS
            </h1>
          </div>

          {/* Description dengan scaling, tetap rata kiri */}
          <div className="origin-top-left transform scale-100 md:scale-100 sm:scale-95 xs:scale-85 transition-transform duration-300">
            <div className="
              rounded-3xl mb-8 bg-neo-light-card dark:bg-neo-dark-card 
              border-4 border-neo-light-border dark:border-neo-dark-border p-6
            ">
              <p className="text-2xl xs:text-xl sm:text-3xl md:text-4xl font-bold text-neo-light-text dark:text-neo-dark-text font-neo">
                Crafting thoughtful digital experiences, one step at a time.
              </p>
              <p className="text-xl xs:text-lg sm:text-2xl text-neo-light-text dark:text-neo-dark-text opacity-80 mt-2 font-neo">
                I’m exploring the world of design & development — building websites, mobile apps, and 3D concepts while continuing to learn, grow, and find opportunities to contribute.
              </p>
            </div>
          </div>

          {/* Social + CTA */}
          <div className="flex items-center justify-between mb-8 w-full">

            {/* Social Links */}
            <div className="hidden sm:flex gap-4">
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

            {/* Tombol About: tetap ukuran sama, geser kiri jika social hilang */}
            <div className="w-full sm:w-auto flex sm:block justify-start">
              <Link
                to="/about"
                className="
                  rounded-full inline-flex items-center gap-3 
                  px-8 py-4 bg-neo-dark-text text-neo-dark-bg 
                  border-4 border-neo-dark-border shadow-neo 
                  hover:shadow-neo-hover hover:translate-y-1 hover:translate-x-1 
                  transition-all duration-200 font-black text-xl uppercase
                "
              >
                About Me
                <ArrowRight size={24} />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 2: MARQUEE + SHORT ABOUT */}
      <section className="py-10 sm:py-16 border-y-2 sm:border-t-4 sm:border-b-4 border-neo-light-border dark:border-neo-dark-border">
        
        {/* Marquee Text */}
        <div className="overflow-hidden bg-neo-yellow dark:bg-neo-green py-3 sm:py-6 mb-8 sm:mb-12 border-b-2 sm:border-b-4 border-neo-light-border dark:border-neo-dark-border">
          <div className="flex animate-marquee whitespace-nowrap">
            {/* Array untuk looping mulus di layar lebar */}
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center">
                {/* Font size dikecilkan di mobile (text-2xl) */}
                <span className="text-2xl sm:text-5xl md:text-6xl font-black text-neo-light-border dark:text-neo-dark-bg mx-4 sm:mx-8 font-neo uppercase">
                  Mobile
                </span>
                <span className="text-xl sm:text-4xl mx-2 sm:mx-8">★</span>
                <span className="text-2xl sm:text-5xl md:text-6xl font-black text-neo-light-border dark:text-neo-dark-bg mx-4 sm:mx-8 font-neo uppercase">
                  Website
                </span>
                <span className="text-xl sm:text-4xl mx-2 sm:mx-8">★</span>
                <span className="text-2xl sm:text-5xl md:text-6xl font-black text-neo-light-border dark:text-neo-dark-bg mx-4 sm:mx-8 font-neo uppercase">
                  3D Design
                </span>
                <span className="text-xl sm:text-4xl mx-2 sm:mx-8">★</span>
              </div>
            ))}
          </div>
        </div>

        {/* Short About */}
        <div className="flex justify-center px-4 sm:px-8">
          <div className="max-w-5xl w-full">
            <div className="rounded-2xl sm:rounded-3xl bg-neo-light-card dark:bg-neo-dark-card border-2 sm:border-4 border-neo-light-border dark:border-neo-dark-border p-6 sm:p-12 shadow-neo">
              <h3 className="text-center text-xl sm:text-4xl font-black text-neo-light-text dark:text-neo-dark-text mb-3 sm:mb-6 font-neo uppercase">
                About Me
              </h3>
              <p className="text-center text-sm sm:text-2xl md:text-3xl text-neo-light-text dark:text-neo-dark-text leading-relaxed font-neo">
                I’m currently growing my skills in web development, mobile apps, and 3D design. Although I don’t have professional experience yet, I’m actively building projects, improving my craft, and looking for opportunities to apply what I’ve learned.
                I’m also open to roles in IT support, administration, customer service, or other fields where I can contribute while continuing my journey in tech.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: MY WORK */}
      <section className="py-20 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Title */}
          <div className="mb-12">
            <div className="rounded-3xl inline-block px-8 py-4 shadow-neo mb-8 bg-neo-cyan dark:bg-neo-pink border-4 border-neo-light-border dark:border-neo-dark-border">
              <h2 className="text-3xl sm:text-5xl font-black text-neo-light-text dark:text-neo-dark-text font-neo uppercase">
                My Work
              </h2>
            </div>
          </div>

          {/* Projects Grid */}
          {/* PERUBAHAN 1: grid-cols-2 diterapkan langsung tanpa 'sm:' agar selalu 2 kolom */}
          {/* Gap diperkecil di mobile (gap-4) dan besar di desktop (sm:gap-8) */}
          <div className="grid grid-cols-2 gap-4 sm:gap-8 mb-12">
            {featuredProjects.map((project) => (
              <div
                key={project.id}
                // PERUBAHAN 2: 'aspect-square' membuat kotak 1:1
                // Flex layout digunakan untuk menata isi di dalam kotak
                className="aspect-square flex flex-col rounded-2xl sm:rounded-3xl bg-neo-light-card dark:bg-neo-dark-card border-2 sm:border-4 border-neo-light-border dark:border-neo-dark-border shadow-neo hover:shadow-neo-hover hover:translate-x-1 hover:translate-y-1 sm:hover:translate-x-2 sm:hover:translate-y-2 transition-all duration-200 overflow-hidden group relative"
              >
                {/* Image Section - Mengambil 50-60% tinggi kotak */}
                <div className="h-[55%] w-full overflow-hidden border-b-2 sm:border-b-4 border-neo-light-border dark:border-neo-dark-border relative z-0">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                {/* Content Section - Mengambil sisa ruang */}
                <div className="flex-1 p-3 sm:p-6 flex flex-col justify-between overflow-hidden">
                  <div>
                    {/* Judul responsif: Kecil di mobile, besar di desktop */}
                    <h3 className="text-sm sm:text-2xl font-black text-neo-light-text dark:text-neo-dark-text mb-1 sm:mb-3 font-neo uppercase leading-tight line-clamp-2">
                      {project.title}
                    </h3>
                    
                    {/* Deskripsi: Disembunyikan di layar sangat kecil jika perlu, atau dilimit barisnya */}
                    <p className="text-[10px] sm:text-base text-neo-light-text dark:text-neo-dark-text opacity-80 font-neo line-clamp-2 sm:line-clamp-3 leading-snug">
                      {project.shortDescription}
                    </p>
                  </div>
                  
                  {/* Tech Stack: Ukuran disesuaikan agar muat di kotak kecil */}
                  <div className="flex flex-wrap gap-1 sm:gap-2 mt-2">
                    {project.tech.slice(0, 2).map((tech, index) => ( // Di-slice jadi 2 agar tidak penuh
                      <span
                        key={index}
                        className="rounded-lg sm:rounded-xl px-2 py-0.5 sm:px-3 sm:py-1 bg-neo-light-bg dark:bg-neo-dark-bg border sm:border-2 border-neo-light-border dark:border-neo-dark-border text-neo-light-text dark:text-neo-dark-text text-[8px] sm:text-sm font-neo font-bold uppercase whitespace-nowrap"
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
              className="rounded-full inline-flex items-center gap-2 sm:gap-3 px-6 py-3 sm:px-10 sm:py-5 bg-neo-dark-text text-neo-dark-bg border-4 border-neo-dark-border shadow-neo hover:shadow-neo-hover hover:translate-x-2 hover:translate-y-2 transition-all duration-200 font-black text-sm sm:text-xl uppercase"
            >
              View All Projects
              <ArrowRight size={20} className="sm:w-6 sm:h-6" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 4: SPECIALITY */}
      <section className="py-10 sm:py-20 px-2 sm:px-8 border-t-2 sm:border-t-4 border-neo-light-border dark:border-neo-dark-border">
        <div className="max-w-7xl mx-auto">
          {/* Section Title */}
          <div className="mb-8 sm:mb-12">
            <div className="rounded-2xl sm:rounded-3xl inline-block px-6 py-3 sm:px-8 sm:py-4 shadow-neo bg-neo-pink dark:bg-neo-cyan border-2 sm:border-4 border-neo-light-border dark:border-neo-dark-border">
              <h2 className="text-2xl sm:text-5xl font-black text-neo-light-bg dark:text-neo-dark-bg font-neo uppercase">
                Speciality
              </h2>
            </div>
          </div>

          {/* Speciality Content */}
          <div className="grid grid-cols-2 gap-3 sm:gap-8 mb-10 sm:mb-16 items-start">
            
            {/* Left: Accordion List */}
            <div className="space-y-3 sm:space-y-4">
              {specialities.map((spec) => {
                const isActive = activeSpeciality === spec.id;
                
                return (
                  <div
                    key={spec.id}
                    className={`rounded-xl sm:rounded-3xl overflow-hidden border-2 sm:border-4 border-neo-light-border dark:border-neo-dark-border font-neo shadow-neo transition-all duration-200 ${
                      isActive
                        ? 'bg-neo-yellow dark:bg-neo-green translate-x-1 translate-y-1 shadow-none' // Shadow hilang saat aktif agar terasa "ditekan"
                        : 'bg-neo-light-card dark:bg-neo-dark-card hover:translate-x-1 hover:translate-y-1'
                    }`}
                  >
                    {/* Accordion Header (Tombol) */}
                    <button
                      onClick={() => setActiveSpeciality(spec.id)}
                      className="w-full text-left p-3 sm:p-6 flex justify-between items-center gap-2"
                    >
                      <h3 className="text-xs sm:text-3xl font-black text-neo-light-text dark:text-neo-dark-text uppercase leading-tight">
                        {spec.title}
                      </h3>
                      
                      {/* Arrow Icon */}
                      <ChevronDown 
                        className={`w-4 h-4 sm:w-8 sm:h-8 text-neo-light-text dark:text-neo-dark-text transition-transform duration-300 ${
                          isActive ? 'rotate-180' : 'rotate-0'
                        }`}
                      />
                    </button>

                    {/* Accordion Body */}
                    <div 
                      className={`transition-all duration-300 ease-in-out overflow-hidden ${
                        isActive ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="p-3 sm:p-6 pt-0 sm:pt-0">
                        <p className={`text-[10px] sm:text-lg leading-snug ${
                          isActive
                            ? 'text-neo-light-border dark:text-neo-dark-bg font-bold'
                            : 'text-neo-light-text dark:text-neo-dark-text'
                        }`}>
                          {spec.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right: Image */}
            <div className="relative h-full">
              <div className="sticky top-24">
                <div className="rounded-xl sm:rounded-3xl border-2 sm:border-4 border-neo-light-border dark:border-neo-dark-border shadow-neo overflow-hidden bg-white dark:bg-black aspect-[3/4] sm:aspect-auto">
                  <img 
                    src={specialities.find(s => s.id === activeSpeciality)?.image}
                    alt={specialities.find(s => s.id === activeSpeciality)?.title}
                    className="w-full h-full sm:h-[500px] object-cover transition-opacity duration-300"
                  />
                </div>
              </div>
            </div>
            
          </div>

          {/* Tech Stack Marquee */}
          <div className="overflow-hidden bg-neo-light-card dark:bg-neo-dark-card border-2 sm:border-4 border-neo-light-border dark:border-neo-dark-border py-4 sm:py-8 sm:rounded-none">
            <div className="flex animate-marquee-reverse whitespace-nowrap">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center">
                  {techStack.map((tech, index) => (
                    <React.Fragment key={index}>
                      <span className="text-lg sm:text-3xl font-black text-neo-light-text dark:text-neo-dark-text mx-3 sm:mx-6 font-neo uppercase">
                        {tech}
                      </span>
                      <span className="text-lg sm:text-2xl mx-3 sm:mx-6 text-neo-light-text dark:text-neo-dark-text">●</span>
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