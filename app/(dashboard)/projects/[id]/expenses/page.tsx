import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProjectExpensesPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Expenses</h2>
      <Card>
        <CardHeader>
          <CardTitle>Project Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Expense tracking integration with Finance module coming soon...</p>
        </CardContent>
      </Card>
    </div>
  )
}
