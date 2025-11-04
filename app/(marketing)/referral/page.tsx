import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Gift, Users, DollarSign, Trophy, Share2, Mail, MessageSquare, Linkedin } from "lucide-react"

export default function ReferralPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-white/20 mb-6">
            <Gift className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Referral Program
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Refer Friends, Earn Rewards
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Share Nino360 with your network and earn up to $500 for every successful referral. Help others transform
            their HR operations while earning rewards.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Start Referring
            </Button>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Three simple steps to start earning rewards</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                icon: Share2,
                title: "Share Your Link",
                description: "Get your unique referral link and share it with friends, colleagues, or on social media.",
              },
              {
                step: "2",
                icon: Users,
                title: "They Sign Up",
                description: "Your referral signs up for Nino360 using your link and becomes a paying customer.",
              },
              {
                step: "3",
                icon: DollarSign,
                title: "Earn Rewards",
                description: "Receive up to $500 in rewards once your referral completes their first payment.",
              },
            ].map((item) => (
              <Card
                key={item.step}
                className="p-8 bg-white/60 backdrop-blur-sm border-white/20 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                    {item.step}
                  </div>
                  <item.icon className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Reward Tiers */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Reward Tiers</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Earn more as you refer more customers</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                tier: "Starter",
                referrals: "1-5 Referrals",
                reward: "$200",
                color: "from-blue-500 to-cyan-500",
                features: ["$200 per referral", "Email support", "Referral dashboard", "Monthly payouts"],
              },
              {
                tier: "Pro",
                referrals: "6-15 Referrals",
                reward: "$350",
                color: "from-purple-500 to-pink-500",
                features: ["$350 per referral", "Priority support", "Advanced analytics", "Bi-weekly payouts"],
              },
              {
                tier: "Elite",
                referrals: "16+ Referrals",
                reward: "$500",
                color: "from-orange-500 to-red-500",
                features: ["$500 per referral", "Dedicated manager", "Custom materials", "Weekly payouts"],
              },
            ].map((tier) => (
              <Card
                key={tier.tier}
                className="p-8 bg-white/60 backdrop-blur-sm border-white/20 hover:shadow-xl transition-shadow"
              >
                <div
                  className={`w-16 h-16 rounded-2xl bg-linear-to-br ${tier.color} flex items-center justify-center mb-6`}
                >
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">{tier.tier}</h3>
                <p className="text-gray-600 mb-4">{tier.referrals}</p>
                <div className="text-4xl font-bold mb-6 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {tier.reward}
                </div>
                <ul className="space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Share Options */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Share Your Referral Link</h2>
            <p className="text-gray-600">Choose your preferred way to share</p>
          </div>

          <Card className="p-8 bg-white/60 backdrop-blur-sm border-white/20 mb-8">
            <label className="block text-sm font-medium mb-2">Your Referral Link</label>
            <div className="flex gap-2">
              <Input readOnly value="https://nino360.com/ref/YOUR-CODE" className="bg-white/80" />
              <Button>Copy Link</Button>
            </div>
          </Card>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Mail, label: "Email", color: "from-blue-500 to-cyan-500" },
              { icon: MessageSquare, label: "SMS", color: "from-green-500 to-emerald-500" },
              { icon: Linkedin, label: "LinkedIn", color: "from-blue-600 to-blue-700" },
              { icon: Share2, label: "More", color: "from-purple-500 to-pink-500" },
            ].map((option) => (
              <Button
                key={option.label}
                variant="outline"
                className="h-24 flex-col gap-2 bg-white/60 backdrop-blur-sm hover:bg-white/80"
              >
                <div
                  className={`w-12 h-12 rounded-full bg-linear-to-br ${option.color} flex items-center justify-center`}
                >
                  <option.icon className="h-6 w-6 text-white" />
                </div>
                <span>{option.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Program Stats */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { value: "$2.5M+", label: "Rewards Paid" },
              { value: "5,000+", label: "Active Referrers" },
              { value: "15,000+", label: "Successful Referrals" },
              { value: "4.9/5", label: "Program Rating" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold mb-2 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="p-12 bg-linear-to-br from-blue-600 via-purple-600 to-pink-600 border-0 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Earning?</h2>
            <p className="text-xl mb-8 text-white/90">Join thousands of referrers earning rewards by sharing Nino360</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                Get Your Referral Link
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
                View Terms & Conditions
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}
