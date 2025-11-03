import type { Metadata } from "next"
import Link from "next/link"
import { Building2, Users, Globe, Award, TrendingUp, Heart } from "lucide-react"

export const metadata: Metadata = {
  title: "Company - Nino360",
  description: "Learn about Nino360, our mission, values, and the team building the future of HR technology.",
}

export default function CompanyPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-linear-to-br from-primary/5 via-background to-secondary/5 px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h1 className="text-balance text-5xl font-bold tracking-tight sm:text-7xl">
              Building the Future of{" "}
              <span className="bg-linear-to-r from-primary via-purple-500 to-secondary bg-clip-text text-transparent">
                HR Technology
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
              We're on a mission to transform how organizations manage their most valuable asset: their people.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Users, label: "Team Members", value: "150+" },
              { icon: Globe, label: "Countries", value: "25+" },
              { icon: Building2, label: "Customers", value: "500+" },
              { icon: TrendingUp, label: "Growth Rate", value: "300%" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="group relative overflow-hidden rounded-2xl border bg-card/50 p-8 backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-lg"
              >
                <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-secondary/5 opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative">
                  <stat.icon className="mb-4 h-8 w-8 text-primary" />
                  <div className="text-4xl font-bold">{stat.value}</div>
                  <div className="mt-2 text-sm text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Our Mission</h2>
              <p className="mt-6 text-pretty text-lg text-muted-foreground">
                To empower organizations with intelligent, integrated HR technology that simplifies complexity and
                amplifies human potential.
              </p>
              <p className="mt-4 text-pretty text-muted-foreground">
                We believe that when HR teams have the right tools, they can focus on what truly matters: building
                thriving cultures, developing talent, and driving business success.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Our Vision</h2>
              <p className="mt-6 text-pretty text-lg text-muted-foreground">
                To be the world's most trusted platform for human capital management, where AI and automation work
                seamlessly with human expertise.
              </p>
              <p className="mt-4 text-pretty text-muted-foreground">
                We're building a future where every organization, regardless of size, has access to enterprise-grade HR
                technology that's intuitive, powerful, and affordable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="border-y bg-muted/30 px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Our Values</h2>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground">
              The principles that guide everything we do
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Heart,
                title: "People First",
                description: "We put people at the center of everything we build, from our product to our culture.",
              },
              {
                icon: Award,
                title: "Excellence",
                description: "We strive for excellence in every detail, delivering quality that exceeds expectations.",
              },
              {
                icon: Users,
                title: "Collaboration",
                description: "We believe the best solutions come from diverse perspectives working together.",
              },
              {
                icon: TrendingUp,
                title: "Innovation",
                description: "We continuously push boundaries, exploring new technologies and approaches.",
              },
              {
                icon: Globe,
                title: "Inclusivity",
                description: "We build products and foster a culture that welcomes and celebrates diversity.",
              },
              {
                icon: Building2,
                title: "Integrity",
                description: "We operate with transparency, honesty, and accountability in all our relationships.",
              },
            ].map((value) => (
              <div
                key={value.title}
                className="group relative overflow-hidden rounded-2xl border bg-card/50 p-8 backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-lg"
              >
                <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-secondary/5 opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative">
                  <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{value.title}</h3>
                  <p className="mt-2 text-pretty text-sm text-muted-foreground">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Our Journey</h2>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground">
              Key milestones in our growth story
            </p>
          </div>

          <div className="mt-12 space-y-8">
            {[
              {
                year: "2020",
                title: "Founded",
                description: "Nino360 was founded with a vision to revolutionize HR technology.",
              },
              {
                year: "2021",
                title: "Series A",
                description: "Raised $10M in Series A funding to accelerate product development.",
              },
              {
                year: "2022",
                title: "100 Customers",
                description: "Reached 100 enterprise customers across 15 countries.",
              },
              {
                year: "2023",
                title: "AI Launch",
                description: "Launched AI-powered features including predictive analytics and automation.",
              },
              {
                year: "2024",
                title: "Global Expansion",
                description: "Expanded to 25+ countries with 500+ customers and 150+ team members.",
              },
            ].map((milestone, index) => (
              <div key={milestone.year} className="relative flex gap-8">
                <div className="flex flex-col items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary bg-background font-bold text-primary">
                    {index + 1}
                  </div>
                  {index < 4 && <div className="mt-2 h-full w-0.5 bg-border" />}
                </div>
                <div className="flex-1 pb-8">
                  <div className="rounded-2xl border bg-card/50 p-6 backdrop-blur-sm">
                    <div className="text-sm font-semibold text-primary">{milestone.year}</div>
                    <h3 className="mt-2 text-xl font-semibold">{milestone.title}</h3>
                    <p className="mt-2 text-pretty text-muted-foreground">{milestone.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-linear-to-br from-primary/5 via-background to-secondary/5 px-6 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Join Our Journey</h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
            We're always looking for talented people who share our passion for building great products.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/careers"
              className="inline-flex items-center justify-center rounded-xl bg-primary px-8 py-3 font-semibold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl"
            >
              View Open Positions
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl border border-primary bg-background px-8 py-3 font-semibold text-primary transition-all hover:bg-primary/5"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
