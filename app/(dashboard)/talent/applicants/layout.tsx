import { ReactNode } from "react"
import { ApplicantsSidebar } from "@/components/talent-applicants/applicants-sidebar"
import { getContext } from "./actions"

export default async function ApplicantsLayout({ children }: { children: ReactNode }) {
  const context = await getContext()
  return <>{children}</>
}
