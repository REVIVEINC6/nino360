"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Briefcase, FileText, Users, UserCheck } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

const actions = [
  {
    label: "New Job",
    href: "/talent/jobs?new=1",
    icon: <Briefcase className="h-4 w-4" />,
    feature: "talent.jobs",
  },
  {
    label: "Upload Invoice",
    href: "/finance/accounts-receivable?upload=1",
    icon: <FileText className="h-4 w-4" />,
    feature: "finance.ar",
  },
  {
    label: "Add Employee",
    href: "/hrms/employees?new=1",
    icon: <Users className="h-4 w-4" />,
    feature: "hrms.employees",
  },
  {
    label: "Add Bench Consultant",
    href: "/bench/tracking?new=1",
    icon: <UserCheck className="h-4 w-4" />,
    feature: "bench.tracking",
  },
]

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks to get you started</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {actions.map((action, index) => (
            <Link key={action.href} href={action.href}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="outline" className="w-full justify-start gap-2 h-auto py-3 bg-transparent">
                  {action.icon}
                  <span className="text-sm">{action.label}</span>
                </Button>
              </motion.div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
