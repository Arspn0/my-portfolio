import React from 'react'
import { Github, Linkedin, Mail, ChevronDown, Section } from 'lucide-react'
import { Link } from 'react-router-dom'

function Home() {
  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section 
      id="home" 
      className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 pt-16"
    >
      
        {/* Animated Background Circles - Solid Color */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute w-96 h-96 bg-primary/10 dark:bg-primary/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
            <div className="absolute w-96 h-96 bg-secondary/10 rounded-full blur-3xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute w-96 h-96 bg-accent/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto">
            <div className="mb-8 space-y-6">
                {/* Greeting */}
                <div className="animate-fade-in">
                    <p className="text-primary text-lg font-medium mb-2">
                    Hi, my name is
                    </p>
                </div>

            {/* Name & Title */}
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-4 text-primary">
                Your Name
                </h1>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-light-text dark:text-slate-300 mb-6">
                Full Stack Developer
                </h2>
            </div>

            {/* Description */}
            <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <p className="text-lg sm:text-xl text-light-textSecondary dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                Saya membuat aplikasi web yang inovatif dan user-friendly dengan teknologi modern. 
                Passionate dalam crafting beautiful digital experiences.
                </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-4 justify-center flex-wrap animate-fade-in" style={{ animationDelay: '0.6s' }}>
                <button
                onClick={() => scrollToSection('projects')}
                className="px-8 py-3 bg-primary text-white dark:text-dark-bg rounded-lg font-semibold hover:bg-accent hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 hover:scale-105 active:scale-95"
                >
                View My Work
                </button>
                <button
                onClick={() => scrollToSection('contact')}
                className="px-8 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/10 transition-all duration-300 hover:scale-105 active:scale-95"
                >
                Get in Touch
                </button>
            </div>
            </div>
        </div>

        {/* Scroll Indicator */}
        <button
          onClick={() => scrollToSection('about')}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-primary hover:text-accent transition-colors duration-300"
          aria-label="Scroll down"
        >
          <ChevronDown size={32} />
        </button>
    </section>
  )
}

export default Home