import React, { useEffect, useState } from 'react'
import { Download } from 'lucide-react'

const CV_URL = '../assets/cv/Aris-Sopian-CV-2.pdf'

function CvButton() {
  const [state, setState] = useState('checking') // checking | ready | missing

  useEffect(() => {
    let alive = true
    fetch(CV_URL, { method: 'HEAD' })
      .then((res) => {
        const type = res.headers.get('content-type') || ''
        if (alive) setState(res.ok && type.includes('pdf') ? 'ready' : 'missing')
      })
      .catch(() => alive && setState('missing'))
    return () => {
      alive = false
    }
  }, [])

  if (state === 'ready') {
    return (
      <a href={CV_URL} download="Aris-Sopian-CV.pdf" className="btn-solid">
        <Download size={14} /> Download CV
      </a>
    )
  }

  return (
    <button
      type="button"
      disabled
      title={state === 'missing' ? 'My CV will be available soon' : undefined}
      className="btn-solid cursor-not-allowed opacity-60"
    >
      <Download size={14} /> {state === 'missing' ? 'CV coming soon' : 'Download CV'}
    </button>
  )
}

export default CvButton