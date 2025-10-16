"use client"

export function Marquee() {
  const items = [
    "1200+ Enterprises",
    "30+ Countries",
    "24/7 Automations",
    "Verifiable Blockchain Audit",
    "99.9% Uptime",
    "SOC 2 Certified",
  ]

  return (
    <div className="relative overflow-hidden py-4 glass-card">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <div key={i} className="mx-8 text-white/60 text-sm font-medium">
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}
