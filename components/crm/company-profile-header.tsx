"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Building2, MapPin, Users, DollarSign, Pin, Edit, Share, Bot } from "lucide-react"

interface Company {
  id: string
  name: string
  industry: string
  revenue: string
  employees: string
  hqCity: string
  hqCountry: string
  status: "customer" | "prospect" | "strategic" | "partner"
  logo: string
  isPinned: boolean
  description: string
  totalValue: string
  dealCount: number
  contactCount: number
  engagementScore: number
}

interface CompanyProfileHeaderProps {
  company: Company
  onEdit?: () => void
  onShare?: () => void
  onAIInsights?: () => void
}

export function CompanyProfileHeader({ company, onEdit, onShare, onAIInsights }: CompanyProfileHeaderProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "customer":
        return "bg-green-100 text-green-800 border-green-200"
      case "prospect":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "strategic":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "partner":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getEngagementColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
            <AvatarImage src={company.logo || "/nino360-primary.png"} alt={company.name} />
            <AvatarFallback className="text-2xl font-bold">
              {company.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900">{company.name}</h1>
              {company.isPinned && <Pin className="h-5 w-5 text-yellow-500" />}
              <Badge className={getStatusColor(company.status)}>{company.status}</Badge>
            </div>
            <p className="text-gray-600 max-w-2xl">{company.description}</p>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Building2 className="h-4 w-4" />
                {company.industry}
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {company.employees} employees
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                {company.revenue} revenue
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {company.hqCity}, {company.hqCountry}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onShare}>
            <Share className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-500" onClick={onAIInsights}>
            <Bot className="mr-2 h-4 w-4" />
            AI Insights
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4 mt-6">
        <Card className="bg-white/60 backdrop-blur-sm border-white/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{company.totalValue}</div>
            <div className="text-sm text-gray-600">Total Value</div>
          </CardContent>
        </Card>
        <Card className="bg-white/60 backdrop-blur-sm border-white/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{company.dealCount}</div>
            <div className="text-sm text-gray-600">Active Deals</div>
          </CardContent>
        </Card>
        <Card className="bg-white/60 backdrop-blur-sm border-white/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{company.contactCount}</div>
            <div className="text-sm text-gray-600">Contacts</div>
          </CardContent>
        </Card>
        <Card className="bg-white/60 backdrop-blur-sm border-white/20">
          <CardContent className="p-4 text-center">
            <div className={`text-2xl font-bold ${getEngagementColor(company.engagementScore)}`}>
              {company.engagementScore}%
            </div>
            <div className="text-sm text-gray-600">Engagement</div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
