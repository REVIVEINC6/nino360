import Link from "next/link"
import { Search, BookOpen, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function GlossaryPage() {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

  const terms = [
    {
      letter: "A",
      term: "Applicant Tracking System (ATS)",
      definition:
        "Software application that enables the electronic handling of recruitment and hiring needs. An ATS can be implemented or accessed online at enterprise or small business levels.",
    },
    {
      letter: "A",
      term: "Artificial Intelligence (AI)",
      definition:
        "The simulation of human intelligence processes by machines, especially computer systems, used in HR for candidate screening, chatbots, and predictive analytics.",
    },
    {
      letter: "B",
      term: "Bench Management",
      definition:
        "The process of managing consultants who are between projects or assignments, ensuring they remain productive and billable.",
    },
    {
      letter: "B",
      term: "Boolean Search",
      definition:
        "A type of search allowing users to combine keywords with operators such as AND, NOT, and OR to produce more relevant results in candidate sourcing.",
    },
    {
      letter: "C",
      term: "Candidate Experience",
      definition:
        "The overall perception and feelings a job seeker has about an employer's hiring process, from initial contact through onboarding.",
    },
    {
      letter: "C",
      term: "Compliance",
      definition:
        "Adherence to laws, regulations, guidelines and specifications relevant to business operations, particularly important in HR and employment practices.",
    },
    {
      letter: "D",
      term: "Diversity & Inclusion (D&I)",
      definition:
        "Organizational efforts to create a workplace that respects and values individual differences and ensures all employees feel welcomed and valued.",
    },
    {
      letter: "E",
      term: "Employee Engagement",
      definition:
        "The emotional commitment an employee has to the organization and its goals, resulting in discretionary effort and improved performance.",
    },
    {
      letter: "E",
      term: "Employee Self-Service (ESS)",
      definition:
        "A feature that allows employees to access and manage their own HR-related information and tasks without HR intervention.",
    },
    {
      letter: "H",
      term: "HRMS (Human Resource Management System)",
      definition:
        "A comprehensive software solution that combines multiple systems and processes to ensure easy management of human resources, business processes, and data.",
    },
    {
      letter: "I",
      term: "I-9 Verification",
      definition:
        "The process of verifying the identity and employment authorization of individuals hired for employment in the United States.",
    },
    {
      letter: "K",
      term: "Key Performance Indicator (KPI)",
      definition:
        "A measurable value that demonstrates how effectively a company is achieving key business objectives.",
    },
    {
      letter: "O",
      term: "Onboarding",
      definition:
        "The process of integrating a new employee into an organization, including orientation, training, and socialization.",
    },
    {
      letter: "P",
      term: "Performance Management",
      definition:
        "The continuous process of setting objectives, assessing progress, and providing ongoing coaching and feedback to ensure employees are meeting their objectives.",
    },
    {
      letter: "R",
      term: "Recruitment Marketing",
      definition: "The strategies and tactics used to attract, engage, and nurture talent before they apply for a job.",
    },
    {
      letter: "R",
      term: "Retention Rate",
      definition: "The percentage of employees who remain with an organization over a specific period of time.",
    },
    {
      letter: "S",
      term: "Sourcing",
      definition: "The proactive searching for qualified job candidates for current or planned open positions.",
    },
    {
      letter: "T",
      term: "Talent Pipeline",
      definition:
        "A pool of candidates who are ready to fill a position, developed through proactive recruiting and relationship building.",
    },
    {
      letter: "T",
      term: "Time-to-Fill",
      definition:
        "The number of days between when a job requisition is approved and when an offer is accepted by a candidate.",
    },
    {
      letter: "V",
      term: "Vendor Management System (VMS)",
      definition:
        "A web-based application that acts as a mechanism for business to manage and procure staffing services.",
    },
  ]

  const groupedTerms = terms.reduce(
    (acc, term) => {
      if (!acc[term.letter]) {
        acc[term.letter] = []
      }
      acc[term.letter].push(term)
      return acc
    },
    {} as Record<string, typeof terms>,
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-white/20 mb-6">
            <BookOpen className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              HR & Recruitment Glossary
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Industry Terms & Definitions
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Your comprehensive guide to HR, recruitment, and workforce management terminology
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for a term..."
                className="pl-12 h-14 text-lg bg-white/60 backdrop-blur-sm border-white/20"
              />
            </div>
          </div>

          {/* Alphabet Navigation */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {alphabet.map((letter) => (
              <a
                key={letter}
                href={`#${letter}`}
                className={`w-10 h-10 flex items-center justify-center rounded-lg font-semibold transition-all ${
                  groupedTerms[letter]
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg"
                    : "bg-white/40 text-gray-400 cursor-not-allowed"
                }`}
              >
                {letter}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Terms Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {Object.entries(groupedTerms).map(([letter, letterTerms]) => (
            <div key={letter} id={letter} className="mb-12 scroll-mt-24">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">{letter}</span>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent" />
              </div>

              <div className="space-y-6">
                {letterTerms.map((term, index) => (
                  <div
                    key={index}
                    className="group p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/20 hover:shadow-lg transition-all"
                  >
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all">
                      {term.term}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{term.definition}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-12 text-center">
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Can't Find What You're Looking For?</h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Our support team is here to help answer any questions about HR and recruitment terminology
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/contact">
                    Contact Support
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  asChild
                >
                  <Link href="/faq">View FAQ</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
