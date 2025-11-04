import type { Metadata } from "next"
import { Calendar, Clock, MapPin, Users, Video, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Events & Webinars | Nino360",
  description: "Join our upcoming webinars, workshops, and events to learn about HRMS, AI, and workforce management.",
}

const upcomingEvents = [
  {
    id: 1,
    title: "AI-Powered Recruitment: Best Practices for 2025",
    type: "Webinar",
    date: "March 15, 2025",
    time: "2:00 PM EST",
    duration: "60 minutes",
    location: "Online",
    attendees: 245,
    description:
      "Learn how to leverage AI and machine learning to streamline your recruitment process and find top talent faster.",
    speakers: ["Sarah Johnson", "Michael Chen"],
    category: "Recruitment",
  },
  {
    id: 2,
    title: "Nino360 Platform Deep Dive",
    type: "Workshop",
    date: "March 22, 2025",
    time: "11:00 AM EST",
    duration: "90 minutes",
    location: "Online",
    attendees: 180,
    description: "Hands-on workshop covering advanced features, integrations, and automation workflows in Nino360.",
    speakers: ["David Park", "Emily Rodriguez"],
    category: "Product",
  },
  {
    id: 3,
    title: "Future of Work: HR Tech Trends",
    type: "Conference",
    date: "April 5, 2025",
    time: "9:00 AM EST",
    duration: "8 hours",
    location: "San Francisco, CA",
    attendees: 500,
    description:
      "Annual conference bringing together HR leaders, tech innovators, and industry experts to discuss the future of work.",
    speakers: ["Multiple Speakers"],
    category: "Industry",
  },
  {
    id: 4,
    title: "Compliance & Security in HRMS",
    type: "Webinar",
    date: "April 12, 2025",
    time: "3:00 PM EST",
    duration: "45 minutes",
    location: "Online",
    attendees: 320,
    description: "Understanding GDPR, SOC 2, and data security best practices for HR systems.",
    speakers: ["Jennifer Lee", "Robert Taylor"],
    category: "Compliance",
  },
]

const pastEvents = [
  {
    id: 5,
    title: "Getting Started with Nino360",
    type: "Webinar",
    date: "February 28, 2025",
    recording: true,
    views: 1250,
  },
  {
    id: 6,
    title: "Advanced Automation Workflows",
    type: "Workshop",
    date: "February 15, 2025",
    recording: true,
    views: 890,
  },
  {
    id: 7,
    title: "Year-End HR Analytics Review",
    type: "Webinar",
    date: "January 30, 2025",
    recording: true,
    views: 2100,
  },
]

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-background via-background to-muted/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-linear-to-br from-primary/5 via-background to-background py-20">
        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-balance bg-linear-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-5xl font-bold tracking-tight text-transparent">
              Events & Webinars
            </h1>
            <p className="text-balance text-xl text-muted-foreground">
              Join our community events, webinars, and workshops to learn, network, and stay ahead in HR technology.
            </p>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h2 className="mb-4 text-3xl font-bold">Upcoming Events</h2>
            <p className="text-lg text-muted-foreground">Register for our upcoming events and webinars</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="group relative overflow-hidden rounded-xl border bg-card/50 backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-lg"
              >
                <div className="p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                      {event.type === "Webinar" && <Video className="h-4 w-4" />}
                      {event.type === "Workshop" && <Users className="h-4 w-4" />}
                      {event.type === "Conference" && <Calendar className="h-4 w-4" />}
                      {event.type}
                    </span>
                    <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">{event.category}</span>
                  </div>

                  <h3 className="mb-3 text-xl font-semibold group-hover:text-primary">{event.title}</h3>

                  <p className="mb-4 text-sm text-muted-foreground">{event.description}</p>

                  <div className="mb-4 space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>
                        {event.time} • {event.duration}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{event.attendees} registered</span>
                    </div>
                  </div>

                  <div className="mb-4 border-t pt-4">
                    <p className="mb-2 text-xs font-medium text-muted-foreground">Speakers</p>
                    <p className="text-sm">{event.speakers.join(", ")}</p>
                  </div>

                  <Button className="w-full">
                    Register Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Past Events */}
      <section className="border-t bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h2 className="mb-4 text-3xl font-bold">Past Events</h2>
            <p className="text-lg text-muted-foreground">Watch recordings of our previous events</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {pastEvents.map((event) => (
              <div
                key={event.id}
                className="group overflow-hidden rounded-xl border bg-card/50 backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-lg"
              >
                <div className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm font-medium">
                      <Video className="h-4 w-4" />
                      {event.type}
                    </span>
                    {event.recording && (
                      <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-600">
                        Recording Available
                      </span>
                    )}
                  </div>

                  <h3 className="mb-2 text-lg font-semibold group-hover:text-primary">{event.title}</h3>

                  <div className="mb-4 space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{event.views} views</span>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full bg-transparent">
                    Watch Recording
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl rounded-2xl border bg-linear-to-br from-primary/10 via-primary/5 to-background p-12 text-center backdrop-blur-sm">
            <h2 className="mb-4 text-3xl font-bold">Never Miss an Event</h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Subscribe to our newsletter to get notified about upcoming events, webinars, and workshops.
            </p>
            <div className="mx-auto flex max-w-md gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-lg border bg-background px-4 py-2"
              />
              <Button>Subscribe</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
