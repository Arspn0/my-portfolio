import React, { useState } from 'react'
import { Mail, Github, Linkedin, Twitter, Send, Check, ChevronDown } from 'lucide-react'
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
    <div className="bg-neo-light-bg dark:bg-neo-dark-bg min-h-screen transition-colors duration-300 py-10 sm:py-20">
      
      <section className="px-4 sm:px-6 lg:px-8 mt-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">

            {/* --- LEFT SIDE: CONTACT FORM --- */}
            <div className="lg:col-span-3 w-full">
              
              {/* Header */}
              <div className="mb-8 sm:mb-10 text-left">
                <div className="rounded-2xl inline-block bg-neo-pink dark:bg-neo-cyan border-4 border-neo-light-border dark:border-neo-dark-border px-4 sm:px-6 py-2 shadow-neo-sm mb-4 transform hover:-rotate-2 transition-transform">
                  <span className="text-base sm:text-lg font-black text-neo-light-bg dark:text-neo-dark-bg font-neo uppercase">
                    Get in Touch
                  </span>
                </div>
                
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-neo-light-text dark:text-neo-dark-text font-neo uppercase mb-4 leading-tight">
                  Connect with Me
                </h1>
                
                <div className="w-24 sm:w-32 h-2 bg-neo-yellow dark:bg-neo-green mb-4 mx-0"></div>
                
                <p className="text-lg sm:text-xl font-bold text-neo-light-text dark:text-neo-dark-text font-neo">
                  Let's work together and make beautiful things
                </p>
              </div>

              {/* Contact Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Full Name */}
                <div>
                  <label 
                    htmlFor="fullName" 
                    className="block text-base font-black text-neo-light-text dark:text-neo-dark-text font-neo uppercase mb-2"
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
                    className="rounded-2xl w-full px-5 py-3 bg-neo-light-card dark:bg-neo-dark-card border-4 border-neo-light-border dark:border-neo-dark-border text-neo-light-text dark:text-neo-dark-text font-neo font-bold text-base placeholder-neo-light-text/50 dark:placeholder-neo-dark-text/50 focus:outline-none focus:border-neo-cyan dark:focus:border-neo-pink transition-all duration-200 shadow-neo-sm focus:shadow-neo hover:shadow-neo-sm"
                    placeholder="Your Name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label 
                    htmlFor="email" 
                    className="block text-base font-black text-neo-light-text dark:text-neo-dark-text font-neo uppercase mb-2"
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
                    className="rounded-2xl w-full px-5 py-3 text-base bg-neo-light-card dark:bg-neo-dark-card border-4 border-neo-light-border dark:border-neo-dark-border text-neo-light-text dark:text-neo-dark-text font-neo font-bold placeholder-neo-light-text/50 dark:placeholder-neo-dark-text/50 focus:outline-none focus:border-neo-cyan dark:focus:border-neo-pink transition-all duration-200 shadow-neo-sm focus:shadow-neo hover:shadow-neo-sm"
                    placeholder="your@email.com"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label 
                    htmlFor="subject" 
                    className="block text-base font-black text-neo-light-text dark:text-neo-dark-text font-neo uppercase mb-2"
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
                      className="rounded-2xl w-full px-5 py-3 text-base bg-neo-light-card dark:bg-neo-dark-card border-4 border-neo-light-border dark:border-neo-dark-border text-neo-light-text dark:text-neo-dark-text font-neo font-bold focus:outline-none focus:border-neo-cyan dark:focus:border-neo-pink transition-all duration-200 appearance-none cursor-pointer shadow-neo-sm focus:shadow-neo hover:shadow-neo-sm"
                    >
                      {subjectOptions.map((option, index) => (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    {/* Custom Arrow */}
                    <div className="absolute right-5 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <div className="w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-neo-light-text dark:border-t-neo-dark-text"></div>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label 
                    htmlFor="message" 
                    className="block text-base font-black text-neo-light-text dark:text-neo-dark-text font-neo uppercase mb-2"
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
                    className="rounded-2xl w-full px-5 py-3 text-base bg-neo-light-card dark:bg-neo-dark-card border-4 border-neo-light-border dark:border-neo-dark-border text-neo-light-text dark:text-neo-dark-text font-neo font-bold placeholder-neo-light-text/50 dark:placeholder-neo-dark-text/50 focus:outline-none focus:border-neo-cyan dark:focus:border-neo-pink transition-all duration-200 resize-none shadow-neo-sm focus:shadow-neo hover:shadow-neo-sm"
                    placeholder="Tell me about your project..."
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={formStatus.loading}
                  className={`rounded-2xl w-full sm:w-auto px-8 py-4 text-lg border-4 border-neo-light-border dark:border-neo-dark-border font-black uppercase font-neo transition-all duration-200 flex items-center justify-center gap-3 ${
                    formStatus.loading
                      ? 'bg-neo-light-card dark:bg-neo-dark-card text-neo-light-text/50 dark:text-neo-dark-text/50 cursor-not-allowed'
                      : formStatus.submitted
                      ? 'bg-neo-green text-neo-light-border dark:text-neo-dark-bg shadow-neo'
                      : 'bg-neo-yellow dark:bg-neo-pink text-neo-light-border dark:text-neo-dark-bg shadow-neo hover:shadow-neo-hover hover:translate-x-1 hover:translate-y-1 active:translate-x-2 active:translate-y-2'
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
                  <div className="bg-neo-green/20 border-4 border-neo-green p-6 rounded-2xl animate-fade-in">
                    <p className="text-lg font-black text-neo-light-text dark:text-neo-dark-text font-neo text-center">
                      Thank you! I'll get back to you soon. 🚀
                    </p>
                  </div>
                )}
              </form>
            </div>
            
            {/* --- RIGHT SIDE: PROFILE CARD --- */}
            <div className="lg:col-span-2 w-full mt-8 lg:mt-0">
              <div className="h-full">
                <div className="rounded-3xl bg-neo-light-card dark:bg-neo-dark-card border-4 border-neo-light-border dark:border-neo-dark-border shadow-neo p-6 md:p-8">
                  <div className="flex flex-col md:flex-row lg:flex-col gap-6 md:gap-8 lg:gap-6 items-center md:items-start lg:items-center">
                    
                    {/* BAGIAN FOTO & STATUS */}
                    <div className="w-full md:w-1/3 lg:w-full flex flex-col items-center">
                      {/* Available Badge */}
                      <div className="mb-5 w-full flex justify-center">
                        <div className="rounded-2xl inline-flex items-center gap-2 sm:gap-3 bg-neo-green dark:bg-neo-green border-4 border-neo-light-border dark:border-neo-dark-border px-4 py-2 sm:px-6 sm:py-3 shadow-neo-sm whitespace-nowrap">
                          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-neo-light-border dark:bg-neo-dark-bg rounded-full animate-pulse"></div>
                          <span className="text-sm sm:text-base font-black text-neo-light-border dark:text-neo-dark-bg font-neo uppercase">
                            Available for Work
                          </span>
                        </div>
                      </div>

                      {/* Profile Photo */}
                      <div className="relative inline-block w-48 sm:w-56 md:w-full lg:w-full max-w-[250px]">
                        <div className="border-4 border-neo-light-border dark:border-neo-dark-border bg-neo-light-bg dark:bg-neo-dark-bg p-2 sm:p-3 rounded-3xl transform transition-transform duration-300">
                          <img 
                            src={ProfilePicture}
                            alt="Profile"
                            className="w-full aspect-square object-cover border-2 sm:border-3 border-neo-light-border dark:border-neo-dark-border rounded-2xl"
                          />
                        </div>
                      </div>
                    </div>

                    {/* BAGIAN TEKS & SOSMED */}
                    <div className="w-full md:w-2/3 lg:w-full flex flex-col justify-center h-full">
                      
                      {/* Message Box */}
                      <div className="rounded-3xl mb-6 bg-neo-light-bg dark:bg-neo-dark-bg border-2 border-neo-light-border/10 dark:border-neo-dark-border/10 p-5 sm:p-6 text-center md:text-left lg:text-center">
                        <h3 className="text-lg sm:text-xl font-black text-neo-light-text dark:text-neo-dark-text font-neo uppercase mb-2">
                          Open for Messages
                        </h3>
                        <p className="text-sm sm:text-base text-neo-light-text dark:text-neo-dark-text font-neo leading-relaxed">
                          Feel free to reach out for collaborations, projects, or just a friendly chat. I usually respond within 24 hours!
                        </p>
                      </div>

                      {/* Social Media Icons */}
                      <div className="flex flex-wrap justify-center md:justify-start lg:justify-center gap-3 sm:gap-4">
                        {socialMediaLinks.map((social, index) => (
                          <a
                            key={index}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`rounded-xl sm:rounded-2xl w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-${social.color} border-4 border-neo-light-border dark:border-neo-dark-border shadow-neo hover:shadow-neo-hover hover:-translate-y-1 active:translate-y-0 transition-all duration-200`}
                            aria-label={social.label}
                          >
                            <social.icon className="w-5 h-5 sm:w-7 sm:h-7 text-neo-light-border dark:text-neo-dark-bg" strokeWidth={3} />
                          </a>
                        ))}
                      </div>

                    </div>
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