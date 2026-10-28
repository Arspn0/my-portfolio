import socialData from '../data/socialData.json'
import { iconFor } from './BrandColors' // sesuaikan path jika brandColors.js ada di folder lain

// Data (nama platform dan tautan) berasal dari Supabase lewat socialData.json; ikon dipilih di brandColors.js.
// Bentuk ekspor sama seperti sebelumnya, jadi komponen yang memakainya tidak perlu diubah.
export const socialMediaLinks = socialData.socials.map((s) => ({ ...s, icon: iconFor(s) }))