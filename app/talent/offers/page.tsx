"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, DollarSign, Calendar, CheckCircle, Clock, XCircle, FileText, Send } from "lucide-react"

const mockOffers = [
  {
    id: "offer-001",
    candidateName: "Sarah Johnson",
  candidateAvatar: "/nino360-primary.png?height=40&width=40",
    jobTitle: "Senior Software Engineer",
    salary: 160000,
    status: "Pending",
    sentDate: "2024-01-22",
    expiryDate: "2024-01-29",
    benefits: ["Health Insurance", "401k", "Remote Work"],
  },
  {
    id: "offer-002",
    candidateName: "Emily Rodriguez",
  candidateAvatar: "/nino360-primary.png?height=40&width=40",
    jobTitle: "UX Designer",
    salary: 110000,
    status: "Accepted",
    sentDate: "2024-01-20",
    acceptedDate: "2024-01-21",
    benefits: ["Health Insurance", "Learning Budget", "Flexible Hours"],
  },
]

export default function OfferManagement() {
  const [offers] = useState(mockOffers)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Accepted":
        return "bg-green-100 text-green-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Rejected":
        return "bg-red-100 text-red-800"
      case "Expired":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Offer Management</h1>
          <p className="text-gray-600">Manage job offers and negotiations</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Plus className="h-4 w-4 mr-2" />
          Create Offer
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Offers</p>
                <p className="text-2xl font-bold">23</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Accepted</p>
                <p className="text-2xl font-bold">15</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-100">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold">6</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-2xl font-bold">2</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Offers */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {offers.map((offer) => (
          <Card key={offer.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={offer.candidateAvatar || "/nino360-primary.png"} alt={offer.candidateName} />
                    <AvatarFallback>
                      {offer.candidateName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{offer.candidateName}</CardTitle>
                    <p className="text-sm text-gray-600">{offer.jobTitle}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(offer.status)}>{offer.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gray-400" />
                <span className="text-lg font-bold">${offer.salary.toLocaleString()}</span>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Benefits</p>
                <div className="flex flex-wrap gap-1">
                  {offer.benefits.map((benefit) => (
                    <Badge key={benefit} variant="secondary" className="text-xs">
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>Sent: {new Date(offer.sentDate).toLocaleDateString()}</span>
                </div>
                {offer.expiryDate && (
                  <span className="text-red-600">Expires: {new Date(offer.expiryDate).toLocaleDateString()}</span>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  View Details
                </Button>
                {offer.status === "Pending" && (
                  <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600">
                    <Send className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
