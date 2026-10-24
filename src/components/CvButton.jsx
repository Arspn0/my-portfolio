import React from 'react'
import { Download } from 'lucide-react'
import siteData from '../data/siteData.json'

// URL CV berasal dari tabel site_settings di Supabase (kunci cv_url), lewat `npm run content`.
// Browser mengabaikan atribut `download` untuk file dari domain lain, jadi unduhan dipaksa
// lewat parameter ?download=<nama-file> milik Supabase Storage.
const { cvUrl, cvFilename } = siteData.settings ?? {}

function CvButton() {
  if (cvUrl) {
    const href = `${cvUrl}${cvUrl.includes('?') ? '&' : '?'}download=${encodeURIComponent(cvFilename || 'CV.pdf')}`
    return (
      <a href={href} className="btn-solid">
        <Download size={14} /> Download My CV
      </a>
    )
  }

  return (
    <button
      type="button"
      disabled
      title="My CV will be available soon"
      className="btn-solid cursor-not-allowed opacity-60"
    >
      <Download size={14} /> CV coming soon
    </button>
  )
}

export default CvButton