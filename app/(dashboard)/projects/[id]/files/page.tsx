import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"

export default function ProjectFilesPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Files</h2>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload File
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Project Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">File storage integration coming soon...</p>
        </CardContent>
      </Card>
    </div>
  )
}
