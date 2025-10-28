import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Download, Palette, Type, ImageIcon, Layout, CheckCircle2 } from "lucide-react"

export const metadata: Metadata = {
  title: "Brand Guidelines | Nino360",
  description: "Official brand guidelines, logos, and assets for Nino360 HRMS platform.",
}

export default function BrandGuidelinesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <section className="border-b bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Brand Guidelines
            </h1>
            <p className="text-lg text-muted-foreground">
              Official guidelines for using the Nino360 brand, including logos, colors, typography, and visual assets.
            </p>
          </div>
        </div>
      </section>

      {/* Download Assets */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-8 border shadow-lg mb-12">
            <h2 className="text-2xl font-bold mb-4">Download Brand Assets</h2>
            <p className="text-muted-foreground mb-6">
              Get our complete brand kit including logos, icons, and templates.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600">
                <Download className="mr-2 h-5 w-5" />
                Download Full Brand Kit
              </Button>
              <Button size="lg" variant="outline">
                <Download className="mr-2 h-5 w-5" />
                Logos Only
              </Button>
            </div>
          </div>

          {/* Logo Usage */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-8 border shadow-lg mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <ImageIcon className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold">Logo Usage</h2>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-3">Primary Logo</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white border rounded-lg p-8 flex items-center justify-center">
                    <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Nino360
                    </div>
                  </div>
                  <div className="bg-gray-900 border rounded-lg p-8 flex items-center justify-center">
                    <div className="text-4xl font-bold text-white">Nino360</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">Logo Guidelines</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Maintain minimum clear space of 20px around the logo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Use approved color variations only</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Minimum size: 120px width for digital, 1 inch for print</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Do not distort, rotate, or modify the logo</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Color Palette */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-8 border shadow-lg mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Palette className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold">Color Palette</h2>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-3">Primary Colors</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="h-24 rounded-lg bg-blue-600 mb-2"></div>
                    <p className="font-mono text-sm">Blue</p>
                    <p className="font-mono text-xs text-muted-foreground">#2563EB</p>
                  </div>
                  <div>
                    <div className="h-24 rounded-lg bg-purple-600 mb-2"></div>
                    <p className="font-mono text-sm">Purple</p>
                    <p className="font-mono text-xs text-muted-foreground">#9333EA</p>
                  </div>
                  <div>
                    <div className="h-24 rounded-lg bg-pink-600 mb-2"></div>
                    <p className="font-mono text-sm">Pink</p>
                    <p className="font-mono text-xs text-muted-foreground">#DB2777</p>
                  </div>
                  <div>
                    <div className="h-24 rounded-lg bg-gray-900 mb-2"></div>
                    <p className="font-mono text-sm">Dark</p>
                    <p className="font-mono text-xs text-muted-foreground">#111827</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">Neutral Colors</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="h-24 rounded-lg bg-gray-100 border mb-2"></div>
                    <p className="font-mono text-sm">Gray 100</p>
                    <p className="font-mono text-xs text-muted-foreground">#F3F4F6</p>
                  </div>
                  <div>
                    <div className="h-24 rounded-lg bg-gray-300 mb-2"></div>
                    <p className="font-mono text-sm">Gray 300</p>
                    <p className="font-mono text-xs text-muted-foreground">#D1D5DB</p>
                  </div>
                  <div>
                    <div className="h-24 rounded-lg bg-gray-600 mb-2"></div>
                    <p className="font-mono text-sm">Gray 600</p>
                    <p className="font-mono text-xs text-muted-foreground">#4B5563</p>
                  </div>
                  <div>
                    <div className="h-24 rounded-lg bg-white border mb-2"></div>
                    <p className="font-mono text-sm">White</p>
                    <p className="font-mono text-xs text-muted-foreground">#FFFFFF</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Typography */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-8 border shadow-lg mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center">
                <Type className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold">Typography</h2>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-3">Primary Typeface</h3>
                <div className="space-y-4">
                  <div className="border rounded-lg p-6 bg-white">
                    <p className="text-4xl font-bold mb-2">Inter</p>
                    <p className="text-muted-foreground">Headings, UI elements, and body text</p>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="border rounded-lg p-4 bg-white">
                      <p className="text-2xl font-light mb-1">Light</p>
                      <p className="text-xs text-muted-foreground">Weight: 300</p>
                    </div>
                    <div className="border rounded-lg p-4 bg-white">
                      <p className="text-2xl font-normal mb-1">Regular</p>
                      <p className="text-xs text-muted-foreground">Weight: 400</p>
                    </div>
                    <div className="border rounded-lg p-4 bg-white">
                      <p className="text-2xl font-semibold mb-1">Semibold</p>
                      <p className="text-xs text-muted-foreground">Weight: 600</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">Monospace Typeface</h3>
                <div className="border rounded-lg p-6 bg-white">
                  <p className="text-3xl font-mono mb-2">JetBrains Mono</p>
                  <p className="text-muted-foreground">Code snippets and technical content</p>
                </div>
              </div>
            </div>
          </div>

          {/* Design Principles */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-8 border shadow-lg mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                <Layout className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold">Design Principles</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Modern & Clean</h3>
                <p className="text-sm text-muted-foreground">
                  Use glassmorphism effects, subtle gradients, and ample white space for a contemporary look.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Accessible</h3>
                <p className="text-sm text-muted-foreground">
                  Maintain WCAG 2.1 AA standards with proper contrast ratios and readable typography.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Consistent</h3>
                <p className="text-sm text-muted-foreground">
                  Apply design tokens and components uniformly across all touchpoints.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Responsive</h3>
                <p className="text-sm text-muted-foreground">
                  Design mobile-first with fluid layouts that adapt to all screen sizes.
                </p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Need Help with Brand Assets?</h2>
            <p className="mb-6 text-white/90">Contact our marketing team for custom assets or brand usage questions.</p>
            <Button size="lg" variant="secondary">
              Contact Marketing Team
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
