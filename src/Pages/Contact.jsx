import React, { useState } from 'react'
import { Mail, Github, Linkedin, Twitter, Send, Check } from 'lucide-react'
import ProfilePicture from '../assets/profile/profile-picture.png'
import { socialMediaLinks } from '../data/SocialMediaData'

function Contact() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  })

  const [formStatus, setFormStatus] = useState({
    submitted: false,
    loading: false
  })

  const socialLinks = [
    { 
      icon: Github, 
      href: 'https://github.com/yourusername',
      label: 'GitHub',
      color: 'neo-cyan'
    },
    { 
      icon: Linkedin, 
      href: 'https://linkedin.com/in/yourusername',
      label: 'LinkedIn',
      color: 'neo-pink'
    },
    { 
      icon: Twitter, 
      href: 'https://twitter.com/yourusername',
      label: 'Twitter',
      color: 'neo-yellow'
    },
    { 
      icon: Mail, 
      href: 'mailto:your.email@example.com',
      label: 'Email',
      color: 'neo-green'
    }
  ]

  const subjectOptions = [
    'General Inquiry',
    'Project Collaboration',
    'Job Opportunity',
    'Freelance Work',
    'Just Saying Hi'
  ]

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setFormStatus({ loading: true, submitted: false })

    // Simulate form submission
    setTimeout(() => {
      setFormStatus({ loading: false, submitted: true })
      setFormData({ fullName: '', email: '', subject: 'General Inquiry', message: '' })
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setFormStatus({ loading: false, submitted: false })
      }, 3000)
    }, 1500)
  }

  return (
    <div className="bg-neo-light-bg dark:bg-neo-dark-bg min-h-screen transition-colors duration-300 py-20">
      
      <section className="py-12 px-4 sm:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-12 items-start">

            {/* Left SIDE: CONTACT FORM */}
            <div className="lg:col-span-3">
              
              {/* Header */}
              <div className="mb-10">
                <div className="rounded-2xl inline-block bg-neo-pink dark:bg-neo-cyan border-4 border-neo-light-border dark:border-neo-dark-border px-6 py-2 shadow-neo-sm mb-4">
                  <span className="text-lg font-black text-neo-light-bg dark:text-neo-dark-bg font-neo uppercase">
                    Get in Touch
                  </span>
                </div>
                
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-neo-light-text dark:text-neo-dark-text font-neo uppercase mb-4 leading-tight">
                  Connect with Me
                </h1>
                
                <div className="w-32 h-2 bg-neo-yellow dark:bg-neo-green mb-4"></div>
                
                <p className="text-xl font-bold text-neo-light-text dark:text-neo-dark-text font-neo">
                  Let's work together and make beautiful things
                </p>
              </div>

              {/* Contact Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Full Name */}
                <div>
                  <label 
                    htmlFor="fullName" 
                    className="block text-base font-black text-neo-light-text dark:text-neo-dark-text font-neo uppercase mb-3"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="rounded-2xl w-11/12 px-5 py-3 bg-neo-light-card dark:bg-neo-dark-card border-4 border-neo-light-border dark:border-neo-dark-border text-neo-light-text dark:text-neo-dark-text font-neo font-bold text-base placeholder-neo-light-text/50 dark:placeholder-neo-dark-text/50 focus:outline-none focus:border-neo-cyan dark:focus:border-neo-pink transition-all duration-200"
                    placeholder="Your Name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label 
                    htmlFor="email" 
                    className="block text-base font-black text-neo-light-text dark:text-neo-dark-text font-neo uppercase mb-3"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="rounded-2xl w-11/12 px-5 py-3 text-base bg-neo-light-card dark:bg-neo-dark-card border-4 border-neo-light-border dark:border-neo-dark-border text-neo-light-text dark:text-neo-dark-text font-neo font-bold placeholder-neo-light-text/50 dark:placeholder-neo-dark-text/50 focus:outline-none focus:border-neo-cyan dark:focus:border-neo-pink transition-all duration-200"
                    placeholder="your@email.com"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label 
                    htmlFor="subject" 
                    className="block text-base font-black text-neo-light-text dark:text-neo-dark-text font-neo uppercase mb-3"
                  >
                    Subject
                  </label>
                  <div className="relative">
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="rounded-2xl w-11/12 px-5 py-3 text-base bg-neo-light-card dark:bg-neo-dark-card border-4 border-neo-light-border dark:border-neo-dark-border text-neo-light-text dark:text-neo-dark-text font-neo font-bold focus:outline-none focus:border-neo-cyan dark:focus:border-neo-pink transition-all duration-200 appearance-none cursor-pointer"
                    >
                      {subjectOptions.map((option, index) => (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    {/* Custom Arrow */}
                    <div className="absolute right-20 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <div className="w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-neo-light-text dark:border-t-neo-dark-text"></div>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label 
                    htmlFor="message" 
                    className="block text-base font-black text-neo-light-text dark:text-neo-dark-text font-neo uppercase mb-3"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="4"
                    className="rounded-2xl w-11/12 px-5 py-3 text-base bg-neo-light-card dark:bg-neo-dark-card border-4 border-neo-light-border dark:border-neo-dark-border text-neo-light-text dark:text-neo-dark-text font-neo font-bold placeholder-neo-light-text/50 dark:placeholder-neo-dark-text/50 focus:outline-none focus:border-neo-cyan dark:focus:border-neo-pink transition-all duration-200 resize-none"
                    placeholder="Tell me about your project..."
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={formStatus.loading}
                  className={`rounded-2xl w-1/4 px-8 py-4 text-lg border-4 border-neo-light-border dark:border-neo-dark-border font-black uppercase font-neo transition-all duration-200 flex items-center justify-center gap-3 ${
                    formStatus.loading
                      ? 'bg-neo-light-card dark:bg-neo-dark-card text-neo-light-text/50 dark:text-neo-dark-text/50 cursor-not-allowed'
                      : formStatus.submitted
                      ? 'bg-neo-green text-neo-light-border dark:text-neo-dark-bg shadow-neo'
                      : 'bg-neo-yellow dark:bg-neo-pink text-neo-light-border dark:text-neo-dark-bg shadow-neo hover:shadow-neo-hover hover:translate-x-2 hover:translate-y-2 active:translate-x-3 active:translate-y-3'
                  }`}
                >
                  {formStatus.loading ? (
                    <>
                      <div className="w-6 h-6 border-4 border-neo-light-text/30 dark:border-neo-dark-text/30 border-t-neo-light-text dark:border-t-neo-dark-text rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : formStatus.submitted ? (
                    <>
                      <Check size={28} strokeWidth={3} />
                      Message Sent!
                    </>
                  ) : (
                    <>
                      <Send size={28} strokeWidth={3} />
                      Submit
                    </>
                  )}
                </button>

                {/* Success Message */}
                {formStatus.submitted && (
                  <div className="bg-neo-green/20 border-4 border-neo-green p-6 animate-fade-in">
                    <p className="text-lg font-black text-neo-light-text dark:text-neo-dark-text font-neo text-center">
                      Thank you! I'll get back to you soon. 🚀
                    </p>
                  </div>
                )}
              </form>

            </div>
            
            {/* Right SIDE: PROFILE CARD */}
            <div className="lg:col-span-2">
              <div className="p-5 sm:p-6 ">
                <div className="rounded-3xl bg-neo-light-card dark:bg-neo-dark-card border-4 border-neo-light-border dark:border-neo-dark-border shadow-neo p-8">
                  
                  {/* Available Badge */}
                  <div className="mb-5">
                    <div className="rounded-2xl inline-flex items-center gap-3 bg-neo-green dark:bg-neo-green border-4 border-neo-light-border dark:border-neo-dark-border px-6 py-3 shadow-neo-sm">
                      <div className="w-3 h-3 bg-neo-light-border dark:bg-neo-dark-bg rounded-full animate-pulse"></div>
                      <span className="text-lg font-black text-neo-light-border dark:text-neo-dark-bg font-neo uppercase">
                        Available for Work
                      </span>
                    </div>
                  </div>

                  {/* Profile Photo with Rounded Border */}
                  <div className="mb-4">
                    <div className="relative inline-block w-full">
                      <div className="border-4 border-neo-light-border dark:border-neo-dark-border bg-neo-light-bg dark:bg-neo-dark-bg p-3 rounded-3xl">
                        <img 
                          src={ProfilePicture}
                          alt="Profile"
                          className="w-full h-full object-cover border-2 sm:border-3 border-neo-light-border dark:border-neo-dark-border rounded-2xl"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Open for Messages */}
                  <div className="rounded-3xl mb-8 bg-neo-light-bg dark:bg-neo-dark-bg b p-6">
                    <h3 className="text-xl font-black text-neo-light-text dark:text-neo-dark-text font-neo uppercase mb-3">
                      Open for Messages
                    </h3>
                    <p className="text-neo-light-text dark:text-neo-dark-text font-neo leading-relaxed">
                      Feel free to reach out for collaborations, projects, or just a friendly chat. I usually respond within 24 hours!
                    </p>
                  </div>

                  {/* Social Media Icons */}
                  <div className="grid grid-cols-4 gap-3">
                    {socialMediaLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`rounded-2xl aspect-square flex items-center justify-center bg-${social.color} border-4 border-neo-light-border dark:border-neo-dark-border shadow-neo hover:shadow-neo-hover hover:translate-x-1 hover:translate-y-1 active:translate-x-2 active:translate-y-2 transition-all duration-200`}
                        aria-label={social.label}
                      >
                        <social.icon size={28} strokeWidth={3} className="text-neo-light-border dark:text-neo-dark-bg" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

export default Contact