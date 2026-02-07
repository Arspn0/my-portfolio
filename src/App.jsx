import React from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import About from './pages/About'
import Projects from './pages/Projects'
import Contact from './pages/Contact'
import Footer from './components/Footer'
import PageTitle from './components/PageTitle'
import ProjectDetail from './pages/ProjectsDetail'
import ScrollToTop from './components/ScrollTop'

import { ThemeProvider } from './context/ThemeContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="bg-light-bg dark:bg-dark-bg min-h-screen transition-colors duration-300">
          <Navbar />
          <PageTitle />
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:slug" element={<ProjectDetail />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App