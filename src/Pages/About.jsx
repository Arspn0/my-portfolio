import React from 'react'
import { Code, Database, Zap } from 'lucide-react'

function About() {
  const skills = [
    {
      category: "Frontend Development",
      icon: Code,
      color: "primary",
      items: [
        "React & Next.js",
        "TypeScript",
        "Tailwind CSS",
        "Responsive Design"
      ]
    },
    {
      category: "Backend Development",
      icon: Database,
      color: "secondary",
      items: [
        "Node.js & Express",
        "Python & Django",
        "PostgreSQL & MongoDB",
        "REST API & GraphQL"
      ]
    },
    {
      category: "Tools & Others",
      icon: Zap,
      color: "accent",
      items: [
        "Git & GitHub",
        "Docker",
        "AWS & Vercel",
        "Figma & UI/UX"
      ]
    }
  ]

  const stats = [
    { number: "3+", label: "Years Experience" },
    { number: "50+", label: "Projects Completed" },
    { number: "30+", label: "Happy Clients" },
    { number: "100%", label: "Commitment" }
  ]

  return (
    <section className="min-h-screen py-20 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-20 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl"></div>

      <div className="max-w-6xl mx-auto relative z-10 pt-16">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            About Me
          </h2>
          <p className="text-light-textSecondary dark:text-slate-400 text-lg max-w-2xl mx-auto">
            Passionate developer dengan fokus pada pembuatan aplikasi web modern dan scalable
          </p>
        </div>

        {/* Main Content - Profile & Description */}
        <div className="grid lg:grid-cols-5 gap-8 mb-16">
          {/* Left: Profile Picture */}
          <div className="lg:col-span-2">
            <div className="sticky top-24">
              <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-2xl p-6 hover:border-primary/30 transition-all duration-300">
                {/* Profile Image */}
                <div className="relative mb-6 group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                  <img 
                    src="https://i.pinimg.com/1200x/40/42/2f/40422f207beffab521842104974ad15b.jpg"
                    alt="Profile - Killua"
                    className="relative w-full aspect-square object-cover rounded-2xl border-4 border-light-border dark:border-dark-border group-hover:border-primary/50 transition-all duration-300"
                  />
                </div>

                {/* Quick Info */}
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-light-text dark:text-slate-200">
                    Aris Sopian
                  </h3>
                  <p className="text-primary font-medium">
                    Full Stack Developer
                  </p>
                  <div className="flex items-center gap-2 text-light-textSecondary dark:text-slate-400 text-sm">
                    <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                    <span>Available for freelance</span>
                  </div>
                </div>

                {/* Stats Mini */}
                <div className="grid grid-cols-2 gap-3 mt-6">
                  {stats.map((stat, index) => (
                    <div 
                      key={index}
                      className="bg-light-bg dark:bg-dark-bg rounded-lg p-3 text-center border border-light-border dark:border-dark-border"
                    >
                      <div className="text-2xl font-bold text-primary">
                        {stat.number}
                      </div>
                      <div className="text-light-textSecondary dark:text-slate-400 text-xs">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Description & Skills */}
          <div className="lg:col-span-3 space-y-6">
            {/* Description Card */}
            <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-2xl p-8 hover:border-primary/30 transition-all duration-300">
              <h3 className="text-2xl font-bold text-light-text dark:text-slate-200 mb-4">
                Hello! I'm a Full Stack Developer
              </h3>
              <div className="space-y-4 text-light-textSecondary dark:text-slate-400 leading-relaxed">
                <p>
                  Saya adalah seorang Full Stack Developer dengan passion dalam menciptakan 
                  aplikasi web yang inovatif dan user-friendly. Dengan pengalaman dalam berbagai 
                  teknologi modern, saya fokus pada pengembangan solusi yang scalable dan performant.
                </p>
                <p>
                  Saya percaya bahwa kombinasi antara design yang baik dan code yang clean adalah 
                  kunci untuk menciptakan produk digital yang exceptional. Selalu eager to learn 
                  teknologi baru dan best practices dalam development.
                </p>
                <p>
                  Fast-forward to today, saya telah bekerja pada berbagai project mulai dari 
                  e-commerce platforms, web applications, hingga mobile-responsive websites. 
                  Setiap project adalah kesempatan untuk belajar dan berkembang.
                </p>
              </div>
            </div>

            {/* Skills Cards */}
            <div className="space-y-4">
              {skills.map((skill, index) => (
                <div 
                  key={index}
                  className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-2xl p-6 hover:border-primary/30 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-3 rounded-lg bg-${skill.color}/10 text-${skill.color} group-hover:scale-110 transition-transform duration-300`}>
                      <skill.icon size={24} />
                    </div>
                    <h3 className="text-xl font-semibold text-light-text dark:text-slate-200">
                      {skill.category}
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {skill.items.map((item, i) => (
                      <div 
                        key={i}
                        className="flex items-center gap-2 text-light-textSecondary dark:text-slate-400 text-sm"
                      >
                        <div className={`w-1.5 h-1.5 rounded-full bg-${skill.color}`}></div>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About