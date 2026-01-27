import React from 'react'
import Navbar from './components/Navbar'
import Home from './Pages/Home'
import About from './Pages/About'
import Projects from './Pages/Projects'
import Contact from './Pages/Contact'
import Footer from './components/Footer'

import { ThemeProvider } from './context/ThemeContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="bg-light-bg dark:bg-dark-bg min-h-screen transition-colors duration-300">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App