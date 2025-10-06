const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

// Files under public/ that are heavy; we'll process common image types
const PUBLIC_DIR = path.join(__dirname, '..', 'public')
const OUT_DIR = path.join(PUBLIC_DIR, 'optimized')

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true })

// List of candidate files to optimize - if present
const candidates = [
  'microsoft-logo.png',
  'slack-logo.png',
  'aws-logo.png',
  'salesforce-logo.png',
  'google-cloud.png',
  'talent-integrations-diagram.png',
  'modern-hr-dashboard-interface-with-ai-analytics-an.jpg',
  'modern-hr-dashboard-with-ai-analytics--workforce-i.jpg',
  'modern-payroll-automation-dashboard-with-global-co.jpg',
]

async function optimizeFile(file) {
  const src = path.join(PUBLIC_DIR, file)
  if (!fs.existsSync(src)) {
    console.log(`Skipped missing: ${file}`)
    return
  }

  const ext = path.extname(file).toLowerCase()
  const base = path.basename(file, ext)
  const out = path.join(OUT_DIR, `${base}.webp`)

  try {
    await sharp(src)
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(out)
    console.log(`Optimized ${file} -> optimized/${base}.webp`)
  } catch (err) {
    console.error(`Failed to optimize ${file}:`, err.message || err)
  }
}

;(async () => {
  for (const f of candidates) {
    await optimizeFile(f)
  }
  console.log('Image optimization complete. Review public/optimized for results.')
})()
