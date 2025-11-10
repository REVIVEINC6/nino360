import { generatePermutations } from './email/permutator'
import { checkMx } from './email/mxCache'
import { normalizePhone } from './phone/normalize'

async function main() {
  console.log('[worker] starting...')
  // Placeholder: poll DB queue rpa_jobs
  // For now, just run a quick self-test
  const emails = generatePermutations('Jane', 'Doe', 'example.com')
  const hasMx = await checkMx('example.com')
  const phone = normalizePhone('+1 415 555 2671')
  console.log({ emails, hasMx, phone })
}

main().catch((e) => {
  console.error('[worker] fatal', e)
  process.exit(1)
})
