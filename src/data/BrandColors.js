const BRANDS = [
  { match: ['github'], light: '#24292F', dark: '#F0F6FC' },
  { match: ['linkedin'], light: '#0A66C2', dark: '#4C9AE6' },
  { match: ['instagram'], light: '#E4405F', dark: '#F0627C' },
  { match: ['twitter', 'x.com'], light: '#0F1419', dark: '#E7E9EA' },
  { match: ['facebook', 'fb.com'], light: '#1877F2', dark: '#4C9AFF' },
  { match: ['youtube', 'youtu.be'], light: '#E00000', dark: '#FF4D4D' },
  { match: ['tiktok'], light: '#FE2C55', dark: '#FE2C55' },
  { match: ['whatsapp', 'wa.me'], light: '#1FAF54', dark: '#25D366' },
  { match: ['discord'], light: '#5865F2', dark: '#8C96FF' },
  { match: ['telegram', 't.me'], light: '#229ED9', dark: '#4FC0F0' },
  { match: ['threads'], light: '#101010', dark: '#F2F2F2' },
  { match: ['behance'], light: '#1769FF', dark: '#5B93FF' },
  { match: ['dribbble'], light: '#EA4C89', dark: '#F27BA8' },
  { match: ['twitch'], light: '#9146FF', dark: '#B07CFF' },
  { match: ['spotify'], light: '#1DB954', dark: '#1ED760' },
  { match: ['reddit'], light: '#FF4500', dark: '#FF6A33' },
  { match: ['medium'], light: '#101010', dark: '#F2F2F2' },
  { match: ['mailto', 'email', 'gmail'], light: '#EA4335', dark: '#F26B5E' },
]

export function brandStyle(social) {
  const hay = `${social?.label ?? ''} ${social?.href ?? social?.link ?? ''}`.toLowerCase()
  const brand = BRANDS.find((b) => b.match.some((m) => hay.includes(m)))
  return brand ? { '--brand': brand.light, '--brand-dark': brand.dark } : undefined
}