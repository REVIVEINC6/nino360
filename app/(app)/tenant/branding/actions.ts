export { saveBranding as updateBranding, getBranding as getBranding } from "@/app/(dashboard)/tenant/actions/branding"

export async function uploadLogo(file: File) {
  // Placeholder: components expect uploadLogo; actual storage upload lives elsewhere. Return a dummy url.
  return { ok: true, url: "" }
}
