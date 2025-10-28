import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Code2,
  BookOpen,
  Zap,
  Shield,
  Blocks,
  Webhook,
  Key,
  FileCode,
  Terminal,
  GitBranch,
  Package,
  Cpu,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Developers - Nino360",
  description:
    "Build powerful integrations with Nino360 APIs. Access comprehensive documentation, SDKs, and developer tools.",
}

export default function DevelopersPage() {
  const features = [
    {
      icon: Code2,
      title: "RESTful APIs",
      description: "Clean, well-documented REST APIs with predictable resource-oriented URLs.",
    },
    {
      icon: Webhook,
      title: "Webhooks",
      description: "Real-time event notifications to keep your systems in sync.",
    },
    {
      icon: Key,
      title: "API Keys",
      description: "Secure authentication with API keys and OAuth 2.0 support.",
    },
    {
      icon: Shield,
      title: "Rate Limiting",
      description: "Fair usage policies with generous rate limits for all plans.",
    },
    {
      icon: Blocks,
      title: "SDKs",
      description: "Official SDKs for JavaScript, Python, Ruby, and more.",
    },
    {
      icon: Zap,
      title: "Fast & Reliable",
      description: "99.9% uptime SLA with sub-200ms average response times.",
    },
  ]

  const resources = [
    {
      icon: BookOpen,
      title: "API Reference",
      description: "Complete API documentation with examples and use cases.",
      link: "/docs/api",
    },
    {
      icon: FileCode,
      title: "Code Examples",
      description: "Sample code and integration patterns for common scenarios.",
      link: "/docs/examples",
    },
    {
      icon: Terminal,
      title: "CLI Tools",
      description: "Command-line tools for testing and managing your integrations.",
      link: "/docs/cli",
    },
    {
      icon: GitBranch,
      title: "Changelog",
      description: "Stay updated with the latest API changes and improvements.",
      link: "/changelog",
    },
  ]

  const sdks = [
    { name: "JavaScript/TypeScript", version: "v2.1.0", downloads: "50K+" },
    { name: "Python", version: "v1.8.0", downloads: "35K+" },
    { name: "Ruby", version: "v1.5.0", downloads: "15K+" },
    { name: "PHP", version: "v1.4.0", downloads: "12K+" },
    { name: "Java", version: "v1.3.0", downloads: "10K+" },
    { name: "Go", version: "v1.2.0", downloads: "8K+" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-purple-200 mb-6">
            <Code2 className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">Developer Platform</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Build with Nino360
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Powerful APIs and developer tools to integrate Nino360 into your applications. Build custom workflows,
            automate processes, and create seamless experiences.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              View Documentation
            </Button>
            <Button size="lg" variant="outline">
              <Key className="mr-2 h-5 w-5" />
              Get API Keys
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Developer Features
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-xl bg-white/60 backdrop-blur-sm border border-purple-200 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Start Code Example */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/40 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Quick Start
          </h2>
          <p className="text-center text-gray-600 mb-8">Get started with Nino360 API in minutes</p>

          <div className="rounded-xl bg-gray-900 p-6 overflow-x-auto">
            <div className="flex items-center gap-2 mb-4">
              <Terminal className="h-4 w-4 text-green-400" />
              <span className="text-sm text-gray-400">Install SDK</span>
            </div>
            <pre className="text-green-400 font-mono text-sm">
              <code>{`npm install @nino360/sdk

import { Nino360 } from '@nino360/sdk';

const client = new Nino360({
  apiKey: process.env.NINO360_API_KEY
});

// Fetch employees
const employees = await client.employees.list();

// Create a new candidate
const candidate = await client.candidates.create({
  name: 'John Doe',
  email: 'john@example.com',
  position: 'Software Engineer'
});`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* SDKs Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Official SDKs
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Use our official libraries in your favorite programming language
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sdks.map((sdk, index) => (
              <div
                key={index}
                className="p-6 rounded-xl bg-white/60 backdrop-blur-sm border border-purple-200 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <Package className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">{sdk.version}</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{sdk.name}</h3>
                <p className="text-sm text-gray-600">{sdk.downloads} downloads</p>
                <Button variant="outline" size="sm" className="w-full mt-4 bg-transparent">
                  View Documentation
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Developer Resources
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resources.map((resource, index) => (
              <Link
                key={index}
                href={resource.link}
                className="p-6 rounded-xl bg-white/60 backdrop-blur-sm border border-purple-200 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <resource.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{resource.title}</h3>
                <p className="text-sm text-gray-600">{resource.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white">
            <Cpu className="h-16 w-16 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Ready to Start Building?</h2>
            <p className="text-xl mb-8 text-white/90">Join thousands of developers building with Nino360 APIs</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" variant="secondary">
                <BookOpen className="mr-2 h-5 w-5" />
                Read Documentation
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Key className="mr-2 h-5 w-5" />
                Get API Keys
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
