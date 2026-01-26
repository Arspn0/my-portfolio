import React, { useState } from 'react'
import { Mail, MapPin, Phone, Send, Github, Linkedin, Twitter, Instagram } from 'lucide-react'

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const [formStatus, setFormStatus] = useState({
    submitted: false,
    loading: false
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setFormStatus({ loading: true, submitted: false })

    // Simulasi pengiriman form (ganti dengan actual API call)
    setTimeout(() => {
      setFormStatus({ loading: false, submitted: true })
      setFormData({ name: '', email: '', subject: '', message: '' })
      
      // Reset status setelah 3 detik
      setTimeout(() => {
        setFormStatus({ loading: false, submitted: false })
      }, 3000)
    }, 1500)
  }

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "your.email@example.com",
      link: "mailto:your.email@example.com"
    },
    {
      icon: Phone,
      title: "Phone",
      value: "+62 812-3456-7890",
      link: "tel:+6281234567890"
    },
    {
      icon: MapPin,
      title: "Location",
      value: "Jakarta, Indonesia",
      link: "#"
    }
  ]

  const socialMedia = [
    { icon: Github, link: "https://github.com/yourusername", label: "GitHub" },
    { icon: Linkedin, link: "https://linkedin.com/in/yourusername", label: "LinkedIn" },
    { icon: Twitter, link: "https://twitter.com/yourusername", label: "Twitter" },
    { icon: Instagram, link: "https://instagram.com/yourusername", label: "Instagram" }
  ]

  return (
    <section id="contact" className="py-20 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Get In Touch
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Punya project atau ide menarik? Mari kita diskusikan dan wujudkan bersama!
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left: Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Cards */}
            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <a
                  key={index}
                  href={info.link}
                  className="block bg-dark-card border border-dark-border rounded-xl p-6 hover:border-primary/30 transition-all duration-300 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg text-primary group-hover:scale-110 transition-transform duration-300">
                      <info.icon size={24} />
                    </div>
                    <div>
                      <h3 className="text-slate-400 text-sm mb-1">{info.title}</h3>
                      <p className="text-slate-200 font-medium">{info.value}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {/* Social Media */}
            <div className="bg-dark-card border border-dark-border rounded-xl p-6">
              <h3 className="text-slate-200 font-semibold mb-4">Follow Me</h3>
              <div className="flex gap-3">
                {socialMedia.map((social, index) => (
                  <a
                    key={index}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-dark-bg rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-all duration-300 hover:scale-110"
                    aria-label={social.label}
                  >
                    <social.icon size={20} />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Info */}
            <div className="bg-dark-card border border-dark-border rounded-xl p-6">
              <h3 className="text-slate-200 font-semibold mb-3">Availability</h3>
              <div className="flex items-center gap-2 text-slate-400">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                <span className="text-sm">Available for freelance projects</span>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="bg-dark-card border border-dark-border rounded-2xl p-8">
              <div className="space-y-6">
                {/* Name & Email */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-slate-300 font-medium mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-slate-200 placeholder-slate-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-slate-300 font-medium mb-2">
                      Your Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-slate-200 placeholder-slate-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-slate-300 font-medium mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-slate-200 placeholder-slate-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                    placeholder="Project Discussion"
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-slate-300 font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-slate-200 placeholder-slate-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300 resize-none"
                    placeholder="Tell me about your project..."
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={formStatus.loading}
                  className={`w-full px-8 py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                    formStatus.loading
                      ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                      : formStatus.submitted
                      ? 'bg-accent text-dark-bg'
                      : 'bg-primary text-dark-bg hover:bg-accent hover:shadow-lg hover:shadow-primary/30 hover:scale-105 active:scale-95'
                  }`}
                >
                  {formStatus.loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : formStatus.submitted ? (
                    <>
                      ✓ Message Sent!
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Send Message
                    </>
                  )}
                </button>

                {/* Success Message */}
                {formStatus.submitted && (
                  <div className="p-4 bg-accent/10 border border-accent/30 rounded-lg text-accent text-center animate-fade-in">
                    Thank you! I'll get back to you soon.
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact