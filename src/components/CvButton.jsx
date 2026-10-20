import React, { useEffect, useState } from 'react'
import { Download } from 'lucide-react'
import cvUrl from '../assets/cv/Aris-Sopian-CV-2.pdf'

const CV_URL = cvUrl

function CvButton() {
  const [state, setState] = useState('checking') // checking | ready | missing

  useEffect(() => {
    let alive = true
    fetch(CV_URL, { method: 'HEAD' })
      .then((res) => {
        const type = res.headers.get('content-type') || ''
        // alamat yang tidak ada dijawab server dengan halaman HTML; selain itu dianggap file sungguhan
        const found = res.ok && !type.includes('text/html')
        if (!found) console.warn(`CV tidak ditemukan di ${CV_URL} (status ${res.status}, content-type: ${type || 'kosong'})`)
        if (alive) setState(found ? 'ready' : 'missing')
      })
      .catch(() => alive && setState('missing'))
    return () => {
      alive = false
    }
  }, [])

  if (state === 'ready') {
    return (
      <a href={CV_URL} download="Aris-Sopian-CV-2.pdf" className="btn-solid">
        <Download size={14} /> Download My CV
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