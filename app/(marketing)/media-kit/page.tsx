import type { Metadata } from "next"
import { Download, ImageIcon, FileText, Palette, Video, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Media Kit | Nino360",
  description: "Download Nino360 logos, brand assets, screenshots, and media resources.",
}

export default function MediaKitPage() {
  const logoAssets = [
    { name: "Primary Logo (SVG)", size: "24 KB", format: "SVG" },
    { name: "Primary Logo (PNG)", size: "156 KB", format: "PNG" },
    { name: "Logo Mark Only", size: "18 KB", format: "SVG" },
    { name: "White Logo", size: "22 KB", format: "SVG" },
    { name: "Black Logo", size: "22 KB", format: "SVG" },
  ]

  const screenshots = [
    { name: "Dashboard Overview", size: "2.4 MB", format: "PNG" },
    { name: "Talent Management", size: "2.1 MB", format: "PNG" },
    { name: "Analytics Dashboard", size: "2.3 MB", format: "PNG" },
    { name: "Mobile App", size: "1.8 MB", format: "PNG" },
  ]

  const documents = [
    { name: "Company Overview", size: "1.2 MB", format: "PDF" },
    { name: "Product Fact Sheet", size: "856 KB", format: "PDF" },
    { name: "Executive Bios", size: "645 KB", format: "PDF" },
    { name: "Press Release Template", size: "234 KB", format: "DOCX" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Media Kit
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Download our logos, brand assets, screenshots, and media resources for press and marketing use.
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Download className="mr-2 h-5 w-5" />
            Download Complete Kit
          </Button>
        </div>
      </section>

      {/* Brand Guidelines */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="backdrop-blur-sm bg-white/70 rounded-2xl p-8 border border-white/20 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500">
                <Palette className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold">Brand Guidelines</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Primary Colors</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-blue-600"></div>
                    <span className="text-sm text-gray-600">#2563EB</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-purple-600"></div>
                    <span className="text-sm text-gray-600">#9333EA</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-pink-600"></div>
                    <span className="text-sm text-gray-600">#DB2777</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Typography</h3>
                <p className="text-gray-600 mb-2">Primary: Inter</p>
                <p className="text-gray-600">Secondary: System UI</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Logo Usage</h3>
                <ul className="text-gray-600 space-y-1 text-sm">
                  <li>• Minimum size: 120px width</li>
                  <li>• Clear space: 20px all sides</li>
                  <li>• Do not modify colors</li>
                  <li>• Do not distort proportions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logo Assets */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
              <ImageIcon className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold">Logo Assets</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {logoAssets.map((asset, index) => (
              <div
                key={index}
                className="backdrop-blur-sm bg-white/70 rounded-xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold mb-1">{asset.name}</h3>
                    <p className="text-sm text-gray-600">{asset.size}</p>
                  </div>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">{asset.format}</span>
                </div>
                <Button variant="outline" className="w-full bg-transparent">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshots */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500">
              <Video className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold">Product Screenshots</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {screenshots.map((screenshot, index) => (
              <div
                key={index}
                className="backdrop-blur-sm bg-white/70 rounded-xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold mb-1">{screenshot.name}</h3>
                    <p className="text-sm text-gray-600">{screenshot.size}</p>
                  </div>
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                    {screenshot.format}
                  </span>
                </div>
                <Button variant="outline" className="w-full bg-transparent">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Documents */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold">Documents & Resources</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc, index) => (
              <div
                key={index}
                className="backdrop-blur-sm bg-white/70 rounded-xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold mb-1">{doc.name}</h3>
                    <p className="text-sm text-gray-600">{doc.size}</p>
                  </div>
                  <span className="px-2 py-1 bg-pink-100 text-pink-700 text-xs rounded-full">{doc.format}</span>
                </div>
                <Button variant="outline" className="w-full bg-transparent">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Contact */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="backdrop-blur-sm bg-white/70 rounded-2xl p-12 border border-white/20 shadow-xl text-center">
            <Mail className="h-12 w-12 mx-auto mb-4 text-purple-600" />
            <h2 className="text-3xl font-bold mb-4">Media Inquiries</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              For press inquiries, interview requests, or additional media resources, please contact our media relations
              team.
            </p>
            <div className="space-y-2 mb-6">
              <p className="text-gray-700">
                <strong>Email:</strong> press@nino360.com
              </p>
              <p className="text-gray-700">
                <strong>Phone:</strong> +1 (555) 123-4567
              </p>
            </div>
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Contact Media Team
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
