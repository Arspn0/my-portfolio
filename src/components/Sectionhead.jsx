import React from 'react'

const pad = (n) => String(n).padStart(2, '0')

function SectionHead({ n, title, meta }) {
  return (
    <div className="label flex items-center justify-between border-t hair px-4 py-3 sm:px-8">
      <span>{pad(n)} / {title}</span>
      {meta && <span className="hidden sm:inline">{meta}</span>}
    </div>
  )
}

export default SectionHead