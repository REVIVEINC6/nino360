"use client"

import type React from "react"

export const dynamic = 'force-dynamic'

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  User,
  MapPin,
  Shield,
  Save,
  Settings,
  Sparkles,
  Target,
  Zap,
  MessageSquare,
  Lightbulb,
  Mic,
  MicOff,
  Volume2,
  Wand2,
  Star,
  Trophy,
  Headphones,
  Plus,
  X,
  Trash2,
  Users,
  CheckCircle,
  Circle,
  Clock,
  Coffee,
  BookOpen,
  AlertCircle,
  Camera,
  Download,
  Brain,
  Bot,
  RefreshCw,
  BarChart3,
  Briefcase,
  GraduationCap,
  Mail,
  Phone,
  Key,
  Eye,
  EyeOff,
  Activity,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { DualSidebarLayout } from "@/components/layout/dual-sidebar-layout"
import { AIChatInterface } from "@/components/ai/ai-chat-interface"
import { useToast } from "@/hooks/use-toast"

// AI-powered profile insights and recommendations
interface AIInsight {
  id: string
  type: "recommendation" | "insight" | "warning" | "achievement"
  title: string
  description: string
  confidence: number
  priority: "low" | "medium" | "high"
  category: "productivity" | "wellness" | "career" | "security" | "engagement"
  actionable: boolean
  actions?: string[]
  timestamp: Date
}

interface AIPersonalityProfile {
  workStyle: {
    type: "analytical" | "creative" | "collaborative" | "independent"
    score: number
    traits: string[]
  }
  communicationStyle: {
    type: "direct" | "diplomatic" | "supportive" | "expressive"
    score: number
    preferences: string[]
  }
  learningStyle: {
    type: "visual" | "auditory" | "kinesthetic" | "reading"
    score: number
    methods: string[]
  }
  stressIndicators: {
    level: "low" | "medium" | "high"
    triggers: string[]
    recommendations: string[]
  }
  productivityPatterns: {
    peakHours: string[]
    focusTime: number
    breakFrequency: number
    distractionFactors: string[]
  }
}

interface AIGoal {
  id: string
  title: string
  description: string
  category: "career" | "skill" | "wellness" | "productivity"
  priority: "low" | "medium" | "high"
  progress: number
  deadline: Date
  aiGenerated: boolean
  milestones: {
    id: string
    title: string
    completed: boolean
    dueDate: Date
  }[]
  recommendations: string[]
}

interface VoiceSettings {
  enabled: boolean
  autoSpeak: boolean
  voice: string
  rate: number
  pitch: number
  volume: number
  language: string
  accent: string
}

interface AIPreferences {
  personalityInsights: boolean
  behaviorAnalysis: boolean
  productivityTracking: boolean
  wellnessMonitoring: boolean
  careerGuidance: boolean
  skillRecommendations: boolean
  automatedGoals: boolean
  predictiveAnalytics: boolean
  contextualHelp: boolean
  proactiveNotifications: boolean
  learningPathOptimization: boolean
  workflowAutomation: boolean
}

export default function ProfilePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const speechSynthRef = useRef<SpeechSynthesis | null>(null)
  const speechRecognitionRef = useRef<any>(null)

  // Basic profile state
  const [profile, setProfile] = useState({
    firstName: "John",
    lastName: "Doe",
    email: user?.email || "john.doe@company.com",
    phone: "+1 (555) 123-4567",
    jobTitle: "Senior Manager",
    department: "Human Resources",
    location: "New York, NY",
    bio: "Experienced HR professional with over 8 years in talent management and organizational development.",
    timezone: "America/New_York",
    language: "en",
    dateFormat: "MM/DD/YYYY",
  avatar: "/nino360-primary.png?height=100&width=100",
    skills: ["Leadership", "Team Management", "Strategic Planning", "Data Analysis", "Communication"],
    interests: ["Technology", "Innovation", "Sustainability", "Mentoring", "Continuous Learning"],
    workPreferences: {
      remoteWork: true,
      flexibleHours: true,
      collaborationStyle: "hybrid",
      meetingPreference: "video",
    },
  })

  // AI-enhanced preferences
  const [aiPreferences, setAiPreferences] = useState<AIPreferences>({
    personalityInsights: true,
    behaviorAnalysis: true,
    productivityTracking: true,
    wellnessMonitoring: true,
    careerGuidance: true,
    skillRecommendations: true,
    automatedGoals: true,
    predictiveAnalytics: true,
    contextualHelp: true,
    proactiveNotifications: false,
    learningPathOptimization: true,
    workflowAutomation: false,
  })

  // Voice and accessibility settings
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    enabled: true,
    autoSpeak: false,
    voice: "default",
    rate: 1.0,
    pitch: 1.0,
    volume: 0.8,
    language: "en-US",
    accent: "neutral",
  })

  // AI insights and recommendations
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([
    {
      id: "1",
      type: "recommendation",
      title: "Optimize Your Morning Routine",
      description:
        "Based on your productivity patterns, you're most focused between 9-11 AM. Consider scheduling important tasks during this window.",
      confidence: 87,
      priority: "high",
      category: "productivity",
      actionable: true,
      actions: ["Block calendar 9-11 AM for deep work", "Set up focus mode notifications"],
      timestamp: new Date(),
    },
    {
      id: "2",
      type: "insight",
      title: "Communication Style Analysis",
      description:
        "Your communication style is 73% collaborative and 27% direct. This balance works well in cross-functional teams.",
      confidence: 92,
      priority: "medium",
      category: "engagement",
      actionable: false,
      timestamp: new Date(),
    },
    {
      id: "3",
      type: "achievement",
      title: "Skill Development Milestone",
      description:
        "You've completed 5 data analysis courses this quarter, showing strong commitment to analytical skills development.",
      confidence: 100,
      priority: "low",
      category: "career",
      actionable: false,
      timestamp: new Date(),
    },
    {
      id: "4",
      type: "warning",
      title: "Stress Level Indicator",
      description: "Your activity patterns suggest increased stress levels. Consider taking breaks more frequently.",
      confidence: 78,
      priority: "high",
      category: "wellness",
      actionable: true,
      actions: ["Schedule 15-minute breaks every 2 hours", "Try the breathing exercise feature"],
      timestamp: new Date(),
    },
  ])

  // AI personality profile
  const [personalityProfile, setPersonalityProfile] = useState<AIPersonalityProfile>({
    workStyle: {
      type: "analytical",
      score: 85,
      traits: ["Detail-oriented", "Data-driven", "Systematic", "Thorough"],
    },
    communicationStyle: {
      // "collaborative" isn't part of the declared union for communicationStyle.type
      // map the intent to an allowed value that best matches collaborative -> "supportive"
      type: "supportive",
      score: 73,
      preferences: ["Team meetings", "Brainstorming sessions", "Peer feedback", "Open discussions"],
    },
    learningStyle: {
      type: "visual",
      score: 68,
      methods: ["Diagrams", "Charts", "Video tutorials", "Interactive demos"],
    },
    stressIndicators: {
      level: "medium",
      triggers: ["Tight deadlines", "Unclear requirements", "Technical issues"],
      recommendations: ["Time blocking", "Regular breaks", "Stress management techniques"],
    },
    productivityPatterns: {
      peakHours: ["9:00 AM", "10:00 AM", "2:00 PM", "3:00 PM"],
      focusTime: 45,
      breakFrequency: 90,
      distractionFactors: ["Email notifications", "Slack messages", "Phone calls"],
    },
  })

  // AI-generated goals
  const [aiGoals, setAiGoals] = useState<AIGoal[]>([
    {
      id: "1",
      title: "Master Advanced Data Analytics",
      description:
        "Develop expertise in advanced analytics tools and techniques to enhance decision-making capabilities.",
      category: "skill",
      priority: "high",
      progress: 65,
      deadline: new Date("2024-06-30"),
      aiGenerated: true,
      milestones: [
        {
          id: "1a",
          title: "Complete Python for Data Analysis course",
          completed: true,
          dueDate: new Date("2024-02-15"),
        },
        { id: "1b", title: "Build first dashboard using Tableau", completed: true, dueDate: new Date("2024-03-01") },
        { id: "1c", title: "Analyze HR metrics for Q1 report", completed: false, dueDate: new Date("2024-04-15") },
        { id: "1d", title: "Present insights to leadership team", completed: false, dueDate: new Date("2024-05-30") },
      ],
      recommendations: [
        "Focus on statistical analysis techniques",
        "Practice with real HR datasets",
        "Join data analytics community",
      ],
    },
    {
      id: "2",
      title: "Improve Work-Life Balance",
      description: "Establish better boundaries and wellness practices to maintain sustainable productivity.",
      category: "wellness",
      priority: "medium",
      progress: 40,
      deadline: new Date("2024-05-15"),
      aiGenerated: true,
      milestones: [
        { id: "2a", title: "Set up dedicated workspace at home", completed: true, dueDate: new Date("2024-01-30") },
        { id: "2b", title: "Establish morning routine", completed: false, dueDate: new Date("2024-03-15") },
        { id: "2c", title: "Implement evening wind-down ritual", completed: false, dueDate: new Date("2024-04-01") },
      ],
      recommendations: [
        "Use time-blocking for personal activities",
        "Set boundaries on work communications",
        "Practice mindfulness techniques",
      ],
    },
  ])

  // UI state
  const [showAIChat, setShowAIChat] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [show2FADialog, setShow2FADialog] = useState(false)
  const [showSkillDialog, setShowSkillDialog] = useState(false)
  const [showGoalDialog, setShowGoalDialog] = useState(false)
  const [newSkill, setNewSkill] = useState("")
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    category: "skill" as const,
    priority: "medium" as const,
    deadline: "",
  })

  // Loading states
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false)
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [isExportingData, setIsExportingData] = useState(false)
  const [isDeletingProfile, setIsDeletingProfile] = useState(false)
  const [isTestingVoice, setIsTestingVoice] = useState(false)

  // Initialize speech synthesis and recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      speechSynthRef.current = window.speechSynthesis

      if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
        speechRecognitionRef.current = new SpeechRecognition()
        speechRecognitionRef.current.continuous = false
        speechRecognitionRef.current.interimResults = false
        speechRecognitionRef.current.lang = voiceSettings.language

        speechRecognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript
          toast({
            title: "Voice Input Received",
            description: `You said: "${transcript}"`,
          })
          setIsListening(false)
        }

        speechRecognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error)
          setIsListening(false)
          toast({
            title: "Voice Input Error",
            description: "Could not process voice input. Please try again.",
            variant: "destructive",
          })
        }

        speechRecognitionRef.current.onend = () => {
          setIsListening(false)
        }
      }
    }
  }, [voiceSettings.language, toast])

  // Avatar upload functionality
  const handleAvatarUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid File Type",
        description: "Please select an image file.",
        variant: "destructive",
      })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive",
      })
      return
    }

    setIsUploadingAvatar(true)
    try {
      // Simulate file upload
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const reader = new FileReader()
      reader.onload = (e) => {
        setProfile({ ...profile, avatar: e.target?.result as string })
        toast({
          title: "Avatar Updated",
          description: "Your profile picture has been updated successfully.",
        })
      }
      reader.readAsDataURL(file)
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload avatar. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  // AI insight generation
  const handleGenerateInsights = async () => {
    setIsGeneratingInsights(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000))

      const insightTypes = ["recommendation", "insight", "warning", "achievement"] as const
      const categories = ["productivity", "wellness", "career", "security", "engagement"] as const
      const priorities = ["low", "medium", "high"] as const

      const newInsights = [
        {
          id: Date.now().toString(),
          // ensure the picked value is typed as the AIInsight.type union
          type: insightTypes[Math.floor(Math.random() * insightTypes.length)] as AIInsight['type'],
          title: "New AI-Generated Insight",
          description:
            "Based on your recent activity patterns and performance metrics, we've identified new optimization opportunities.",
          confidence: Math.floor(Math.random() * 30) + 70,
          priority: priorities[Math.floor(Math.random() * priorities.length)],
          category: categories[Math.floor(Math.random() * categories.length)] as AIInsight['category'],
          actionable: Math.random() > 0.5,
          actions: ["Review suggested changes", "Implement recommendations", "Track progress"],
          timestamp: new Date(),
        },
        {
          id: (Date.now() + 1).toString(),
          type: "recommendation",
          title: "Skill Development Opportunity",
          description: "Your learning pattern suggests you're ready for advanced topics in your field.",
          confidence: 89,
          priority: "medium",
          category: "career",
          actionable: true,
          actions: ["Explore advanced courses", "Join professional communities", "Seek mentorship"],
          timestamp: new Date(),
        },
      ]

  // cast the generated objects to AIInsight[] so the setter receives the correct type
  setAiInsights((prev) => [...(newInsights as AIInsight[]), ...prev])
      toast({
        title: "AI Insights Generated",
        description: `${newInsights.length} new insights have been added to your profile.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate AI insights. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingInsights(false)
    }
  }

  // Voice functionality
  const handleVoiceInput = () => {
    if (!speechRecognitionRef.current) {
      toast({
        title: "Voice Input Not Supported",
        description: "Your browser doesn't support voice input.",
        variant: "destructive",
      })
      return
    }

    if (isListening) {
      speechRecognitionRef.current.stop()
      setIsListening(false)
    } else {
      setIsListening(true)
      speechRecognitionRef.current.start()
    }
  }

  const handleTestVoice = async () => {
    if (!speechSynthRef.current) {
      toast({
        title: "Voice Output Not Supported",
        description: "Your browser doesn't support voice output.",
        variant: "destructive",
      })
      return
    }

    setIsTestingVoice(true)
    try {
      speechSynthRef.current.cancel()

      const utterance = new SpeechSynthesisUtterance("Hello! This is a test of your voice settings. How do I sound?")
      utterance.rate = voiceSettings.rate
      utterance.pitch = voiceSettings.pitch
      utterance.volume = voiceSettings.volume
      utterance.lang = voiceSettings.language

      utterance.onend = () => {
        setIsTestingVoice(false)
      }

      utterance.onerror = () => {
        setIsTestingVoice(false)
        toast({
          title: "Voice Test Failed",
          description: "Could not test voice output. Please check your settings.",
          variant: "destructive",
        })
      }

      speechSynthRef.current.speak(utterance)
    } catch (error) {
      setIsTestingVoice(false)
      toast({
        title: "Voice Test Error",
        description: "An error occurred while testing voice output.",
        variant: "destructive",
      })
    }
  }

  // Profile save functionality
  const handleSaveProfile = async () => {
    setIsSavingProfile(true)
    try {
      // Validate required fields
      if (!profile.firstName || !profile.lastName || !profile.email) {
        throw new Error("Please fill in all required fields.")
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Profile Saved",
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSavingProfile(false)
    }
  }

  // Skills management
  const handleAddSkill = () => {
    if (!newSkill.trim()) return

    if (profile.skills.includes(newSkill.trim())) {
      toast({
        title: "Skill Already Exists",
        description: "This skill is already in your profile.",
        variant: "destructive",
      })
      return
    }

    setProfile({
      ...profile,
      skills: [...profile.skills, newSkill.trim()],
    })
    setNewSkill("")
    setShowSkillDialog(false)
    toast({
      title: "Skill Added",
      description: `"${newSkill.trim()}" has been added to your skills.`,
    })
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter((skill) => skill !== skillToRemove),
    })
    toast({
      title: "Skill Removed",
      description: `"${skillToRemove}" has been removed from your skills.`,
    })
  }

  const handleSuggestSkills = async () => {
    try {
      // Simulate AI skill suggestion
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const suggestedSkills = [
        "Machine Learning",
        "Project Management",
        "Business Intelligence",
        "Change Management",
        "Digital Transformation",
      ]

      const newSkills = suggestedSkills.filter((skill) => !profile.skills.includes(skill))

      if (newSkills.length > 0) {
        setProfile({
          ...profile,
          skills: [...profile.skills, ...newSkills.slice(0, 3)],
        })
        toast({
          title: "Skills Suggested",
          description: `Added ${newSkills.slice(0, 3).length} AI-recommended skills to your profile.`,
        })
      } else {
        toast({
          title: "No New Skills",
          description: "All suggested skills are already in your profile.",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to suggest skills. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Goal management
  const handleCreateGoal = async () => {
    if (!newGoal.title.trim() || !newGoal.description.trim() || !newGoal.deadline) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      const goal: AIGoal = {
        id: Date.now().toString(),
        title: newGoal.title.trim(),
        description: newGoal.description.trim(),
        category: newGoal.category,
        priority: newGoal.priority,
        progress: 0,
        deadline: new Date(newGoal.deadline),
        aiGenerated: false,
        milestones: [
          {
            id: "m1",
            title: "Get started",
            completed: false,
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
          },
          {
            id: "m2",
            title: "Reach 50% completion",
            completed: false,
            dueDate: new Date((Date.now() + new Date(newGoal.deadline).getTime()) / 2),
          },
          {
            id: "m3",
            title: "Final review and completion",
            completed: false,
            dueDate: new Date(newGoal.deadline),
          },
        ],
        recommendations: ["Break down into smaller tasks", "Set regular check-ins", "Track progress weekly"],
      }

      setAiGoals((prev) => [goal, ...prev])
      setNewGoal({
        title: "",
        description: "",
        category: "skill",
        priority: "medium",
        deadline: "",
      })
      setShowGoalDialog(false)
      toast({
        title: "Goal Created",
        description: `"${goal.title}" has been added to your goals.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create goal. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleGenerateGoal = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const aiGeneratedGoals = [
        {
          title: "Enhance Leadership Skills",
          description: "Develop advanced leadership capabilities through targeted training and practical application.",
          category: "career" as const,
          priority: "high" as const,
        },
        {
          title: "Master Data Visualization",
          description: "Learn advanced data visualization techniques to better communicate insights.",
          category: "skill" as const,
          priority: "medium" as const,
        },
        {
          title: "Improve Team Collaboration",
          description: "Implement strategies to enhance team collaboration and communication.",
          category: "productivity" as const,
          priority: "medium" as const,
        },
      ]

      const randomGoal = aiGeneratedGoals[Math.floor(Math.random() * aiGeneratedGoals.length)]
      const deadline = new Date()
      deadline.setMonth(deadline.getMonth() + 3) // 3 months from now

      const goal: AIGoal = {
        id: Date.now().toString(),
        ...randomGoal,
        progress: 0,
        deadline,
        aiGenerated: true,
        milestones: [
          {
            id: "ai-m1",
            title: "Initial assessment and planning",
            completed: false,
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          },
          {
            id: "ai-m2",
            title: "Mid-point evaluation",
            completed: false,
            dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
          },
          {
            id: "ai-m3",
            title: "Final implementation",
            completed: false,
            dueDate: deadline,
          },
        ],
        recommendations: [
          "Start with foundational concepts",
          "Practice regularly",
          "Seek feedback from peers",
          "Document your progress",
        ],
      }

      setAiGoals((prev) => [goal, ...prev])
      toast({
        title: "AI Goal Generated",
        description: `"${goal.title}" has been created based on your profile analysis.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate AI goal. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Goal progress and milestone management
  const handleUpdateGoalProgress = (goalId: string, progress: number) => {
    setAiGoals((prev) =>
      prev.map((goal) => {
        if (goal.id === goalId) {
          // Auto-complete milestones based on progress
          const updatedMilestones = goal.milestones.map((milestone, index) => {
            const milestoneThreshold = ((index + 1) / goal.milestones.length) * 100
            return {
              ...milestone,
              completed: progress >= milestoneThreshold,
            }
          })
          return { ...goal, progress, milestones: updatedMilestones }
        }
        return goal
      }),
    )

    toast({
      title: "Progress Updated",
      description: `Goal progress updated to ${progress}%.`,
    })
  }

  const handleToggleMilestone = (goalId: string, milestoneId: string) => {
    setAiGoals((prev) =>
      prev.map((goal) =>
        goal.id === goalId
          ? {
              ...goal,
              milestones: goal.milestones.map((milestone) =>
                milestone.id === milestoneId ? { ...milestone, completed: !milestone.completed } : milestone,
              ),
            }
          : goal,
      ),
    )
  }

  // Data export functionality
  const handleExportData = async () => {
    setIsExportingData(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const exportData = {
        profile,
        aiInsights,
        aiGoals,
        personalityProfile,
        aiPreferences,
        voiceSettings,
        exportDate: new Date().toISOString(),
      }

      const dataStr = JSON.stringify(exportData, null, 2)
      const dataBlob = new Blob([dataStr], { type: "application/json" })
      const url = URL.createObjectURL(dataBlob)

      const link = document.createElement("a")
      link.href = url
      link.download = `profile-data-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast({
        title: "Data Exported",
        description: "Your profile data has been exported successfully.",
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsExportingData(false)
    }
  }

  // Profile deletion functionality
  const handleDeleteProfile = async () => {
    setIsDeletingProfile(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Reset all AI-related data
      setAiInsights([])
      setAiGoals([])
      setPersonalityProfile({
        workStyle: { type: "analytical", score: 0, traits: [] },
        communicationStyle: { type: "direct", score: 0, preferences: [] },
        learningStyle: { type: "visual", score: 0, methods: [] },
        stressIndicators: { level: "low", triggers: [], recommendations: [] },
        productivityPatterns: { peakHours: [], focusTime: 0, breakFrequency: 0, distractionFactors: [] },
      })

      toast({
        title: "AI Profile Deleted",
        description: "Your AI profile data has been permanently deleted.",
      })
    } catch (error) {
      toast({
        title: "Deletion Failed",
        description: "Failed to delete AI profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeletingProfile(false)
    }
  }

  // Password change functionality
  const handleChangePassword = () => {
    setShowPasswordDialog(true)
  }

  // 2FA management
  const handleManage2FA = () => {
    setShow2FADialog(true)
  }

  return (
    <DualSidebarLayout title="AI-Enhanced Profile" subtitle="Intelligent profile management with personalized insights">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Hidden file input for avatar upload */}
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="ai-insights" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              AI Insights
            </TabsTrigger>
            <TabsTrigger value="personality" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Personality
            </TabsTrigger>
            <TabsTrigger value="goals" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              AI Goals
            </TabsTrigger>
            <TabsTrigger value="ai-preferences" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              AI Settings
            </TabsTrigger>
            <TabsTrigger value="voice" className="flex items-center gap-2">
              <Mic className="h-4 w-4" />
              Voice & AI
            </TabsTrigger>
          </TabsList>

          {/* Enhanced Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Profile Card */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <User className="h-5 w-5" />
                          Profile Information
                        </CardTitle>
                        <CardDescription>AI-enhanced profile with intelligent recommendations</CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAIChat(true)}
                        className="flex items-center gap-2"
                      >
                        <Bot className="h-4 w-4" />
                        AI Assistant
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Avatar and Basic Info */}
                    <div className="flex items-start gap-6">
                      <div className="relative">
                        <Avatar className="h-32 w-32">
                          <AvatarImage src={profile.avatar || "/nino360-primary.png"} />
                          <AvatarFallback className="text-2xl">
                            {profile.firstName[0]}
                            {profile.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <Button
                          size="sm"
                          variant="outline"
                          className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full p-0 bg-transparent"
                          onClick={handleAvatarUpload}
                          disabled={isUploadingAvatar}
                        >
                          {isUploadingAvatar ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            <Camera className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <div className="flex-1 space-y-4">
                        <div>
                          <h3 className="text-2xl font-bold">
                            {profile.firstName} {profile.lastName}
                          </h3>
                          <p className="text-lg text-muted-foreground">{profile.jobTitle}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary">{profile.department}</Badge>
                            <Badge variant="outline" className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {profile.location}
                            </Badge>
                          </div>
                        </div>

                        {/* AI-Generated Profile Summary */}
                        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-900">AI Profile Summary</span>
                          </div>
                          <p className="text-sm text-blue-800">
                            Analytical leader with strong collaborative skills. Excels in data-driven decision making
                            and team development. Shows consistent growth in technical competencies with high engagement
                            in learning initiatives.
                          </p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Enhanced Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={profile.firstName}
                          onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={profile.lastName}
                          onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            value={profile.email}
                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            type="tel"
                            value={profile.phone}
                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="jobTitle">Job Title</Label>
                        <Input
                          id="jobTitle"
                          value={profile.jobTitle}
                          onChange={(e) => setProfile({ ...profile, jobTitle: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Select
                          value={profile.department}
                          onValueChange={(value) => setProfile({ ...profile, department: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Human Resources">Human Resources</SelectItem>
                            <SelectItem value="Engineering">Engineering</SelectItem>
                            <SelectItem value="Sales">Sales</SelectItem>
                            <SelectItem value="Marketing">Marketing</SelectItem>
                            <SelectItem value="Finance">Finance</SelectItem>
                            <SelectItem value="Operations">Operations</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="location"
                          value={profile.location}
                          onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={profile.bio}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        placeholder="Tell us about yourself..."
                        rows={4}
                      />
                    </div>

                    {/* Skills Section with AI Recommendations */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-base font-medium">Skills</Label>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleSuggestSkills}
                            className="flex items-center gap-2 bg-transparent"
                          >
                            <Wand2 className="h-4 w-4" />
                            AI Suggest
                          </Button>
                          <Dialog open={showSkillDialog} onOpenChange={setShowSkillDialog}>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="bg-transparent">
                                <Plus className="h-4 w-4 mr-1" />
                                Add Skill
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Add New Skill</DialogTitle>
                                <DialogDescription>
                                  Add a new skill to your profile to showcase your expertise.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor="newSkill">Skill Name</Label>
                                  <Input
                                    id="newSkill"
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    placeholder="e.g., Project Management"
                                    onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
                                  />
                                </div>
                                <div className="flex justify-end gap-2">
                                  <Button variant="outline" onClick={() => setShowSkillDialog(false)}>
                                    Cancel
                                  </Button>
                                  <Button onClick={handleAddSkill} disabled={!newSkill.trim()}>
                                    Add Skill
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {profile.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {skill}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0 hover:bg-transparent"
                              onClick={() => handleRemoveSkill(skill)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Work Preferences */}
                    <div className="space-y-4">
                      <Label className="text-base font-medium">Work Preferences</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Remote Work</span>
                          <Switch
                            checked={profile.workPreferences.remoteWork}
                            onCheckedChange={(checked) =>
                              setProfile({
                                ...profile,
                                workPreferences: { ...profile.workPreferences, remoteWork: checked },
                              })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Flexible Hours</span>
                          <Switch
                            checked={profile.workPreferences.flexibleHours}
                            onCheckedChange={(checked) =>
                              setProfile({
                                ...profile,
                                workPreferences: { ...profile.workPreferences, flexibleHours: checked },
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={handleGenerateInsights} disabled={isGeneratingInsights}>
                        {isGeneratingInsights ? (
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Brain className="h-4 w-4 mr-2" />
                        )}
                        Generate AI Insights
                      </Button>
                      <Button onClick={handleSaveProfile} disabled={isSavingProfile}>
                        {isSavingProfile ? (
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4 mr-2" />
                        )}
                        Save Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* AI Quick Stats */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <BarChart3 className="h-5 w-5" />
                      AI Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Profile Completeness</span>
                        <span>87%</span>
                      </div>
                      <Progress value={87} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>AI Confidence</span>
                        <span>92%</span>
                      </div>
                      <Progress value={92} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Engagement Score</span>
                        <span>78%</span>
                      </div>
                      <Progress value={78} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Trophy className="h-5 w-5" />
                      Recent Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-100 rounded-full">
                        <Star className="h-4 w-4 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Skill Master</p>
                        <p className="text-xs text-muted-foreground">Completed 5 courses</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-full">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Goal Achiever</p>
                        <p className="text-xs text-muted-foreground">Met Q1 objectives</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <Users className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Team Player</p>
                        <p className="text-xs text-muted-foreground">High collaboration score</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="ai-insights" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">AI Insights & Recommendations</h3>
                <p className="text-muted-foreground">Personalized insights powered by artificial intelligence</p>
              </div>
              <Button onClick={handleGenerateInsights} disabled={isGeneratingInsights}>
                {isGeneratingInsights ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                Generate New Insights
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {aiInsights.map((insight) => (
                <Card
                  key={insight.id}
                  className={`border-l-4 ${
                    insight.type === "recommendation"
                      ? "border-l-blue-500"
                      : insight.type === "warning"
                        ? "border-l-red-500"
                        : insight.type === "achievement"
                          ? "border-l-green-500"
                          : "border-l-purple-500"
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {insight.type === "recommendation" && <Lightbulb className="h-5 w-5 text-blue-500" />}
                        {insight.type === "warning" && <AlertCircle className="h-5 w-5 text-red-500" />}
                        {insight.type === "achievement" && <Trophy className="h-5 w-5 text-green-500" />}
                        {insight.type === "insight" && <Brain className="h-5 w-5 text-purple-500" />}
                        <CardTitle className="text-lg">{insight.title}</CardTitle>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            insight.priority === "high"
                              ? "destructive"
                              : insight.priority === "medium"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {insight.priority}
                        </Badge>
                        <Badge variant="outline">{insight.confidence}% confidence</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{insight.description}</p>
                    {insight.actionable && insight.actions && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Recommended Actions:</p>
                        <ul className="space-y-1">
                          {insight.actions.map((action, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <span className="text-xs text-muted-foreground">{insight.timestamp.toLocaleDateString()}</span>
                      <Badge variant="outline" className="text-xs">
                        {insight.category}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Personality Analysis Tab */}
          <TabsContent value="personality" className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold">AI Personality Analysis</h3>
              <p className="text-muted-foreground">Deep insights into your work style and preferences</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Work Style */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Work Style Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {personalityProfile.workStyle.type.charAt(0).toUpperCase() +
                        personalityProfile.workStyle.type.slice(1)}
                    </div>
                    <div className="text-lg text-muted-foreground mb-4">
                      {personalityProfile.workStyle.score}% match
                    </div>
                    <Progress value={personalityProfile.workStyle.score} className="h-3" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Key Traits:</p>
                    <div className="flex flex-wrap gap-2">
                      {personalityProfile.workStyle.traits.map((trait, index) => (
                        <Badge key={index} variant="secondary">
                          {trait}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Communication Style */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Communication Style
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {personalityProfile.communicationStyle.type.charAt(0).toUpperCase() +
                        personalityProfile.communicationStyle.type.slice(1)}
                    </div>
                    <div className="text-lg text-muted-foreground mb-4">
                      {personalityProfile.communicationStyle.score}% match
                    </div>
                    <Progress value={personalityProfile.communicationStyle.score} className="h-3" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Preferences:</p>
                    <div className="space-y-1">
                      {personalityProfile.communicationStyle.preferences.map((pref, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          {pref}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Learning Style */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Learning Style
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {personalityProfile.learningStyle.type.charAt(0).toUpperCase() +
                        personalityProfile.learningStyle.type.slice(1)}
                    </div>
                    <div className="text-lg text-muted-foreground mb-4">
                      {personalityProfile.learningStyle.score}% match
                    </div>
                    <Progress value={personalityProfile.learningStyle.score} className="h-3" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Effective Methods:</p>
                    <div className="space-y-1">
                      {personalityProfile.learningStyle.methods.map((method, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <BookOpen className="h-4 w-4 text-purple-500" />
                          {method}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Productivity Patterns */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Productivity Patterns
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium mb-2">Peak Performance Hours:</p>
                      <div className="flex flex-wrap gap-2">
                        {personalityProfile.productivityPatterns.peakHours.map((hour, index) => (
                          <Badge key={index} variant="outline">
                            {hour}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">Focus Duration:</p>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">{personalityProfile.productivityPatterns.focusTime} minutes</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">Break Frequency:</p>
                      <div className="flex items-center gap-2">
                        <Coffee className="h-4 w-4 text-orange-500" />
                        <span className="text-sm">
                          Every {personalityProfile.productivityPatterns.breakFrequency} minutes
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* AI Goals Tab */}
          <TabsContent value="goals" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">AI-Generated Goals</h3>
                <p className="text-muted-foreground">Personalized goals based on your profile and performance</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleGenerateGoal} className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  AI Generate Goal
                </Button>
                <Dialog open={showGoalDialog} onOpenChange={setShowGoalDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                      <Plus className="h-4 w-4" />
                      Create Goal
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Create New Goal</DialogTitle>
                      <DialogDescription>
                        Create a personalized goal to track your progress and achievements.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="goalTitle">Goal Title *</Label>
                        <Input
                          id="goalTitle"
                          value={newGoal.title}
                          onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                          placeholder="e.g., Learn Machine Learning"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="goalDescription">Description *</Label>
                        <Textarea
                          id="goalDescription"
                          value={newGoal.description}
                          onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                          placeholder="Describe your goal and what you want to achieve..."
                          rows={3}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="goalCategory">Category</Label>
                          <Select
                            value={newGoal.category}
                            onValueChange={(value: any) => setNewGoal({ ...newGoal, category: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="career">Career</SelectItem>
                              <SelectItem value="skill">Skill</SelectItem>
                              <SelectItem value="wellness">Wellness</SelectItem>
                              <SelectItem value="productivity">Productivity</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="goalPriority">Priority</Label>
                          <Select
                            value={newGoal.priority}
                            onValueChange={(value: any) => setNewGoal({ ...newGoal, priority: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="goalDeadline">Target Deadline *</Label>
                        <Input
                          id="goalDeadline"
                          type="date"
                          value={newGoal.deadline}
                          onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowGoalDialog(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleCreateGoal}>Create Goal</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {aiGoals.map((goal) => (
                <Card key={goal.id} className="relative">
                  {goal.aiGenerated && (
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Sparkles className="h-3 w-3" />
                        AI Generated
                      </Badge>
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{goal.title}</CardTitle>
                        <CardDescription>{goal.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge
                        variant={
                          goal.priority === "high"
                            ? "destructive"
                            : goal.priority === "medium"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {goal.priority}
                      </Badge>
                      <Badge variant="outline">{goal.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{goal.progress}%</span>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                      <div className="flex justify-center">
                        <Slider
                          value={[goal.progress]}
                          onValueChange={(value) => handleUpdateGoalProgress(goal.id, value[0])}
                          max={100}
                          step={5}
                          className="w-full"
                        />
                      </div>
                    </div>

                    {/* Milestones */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Milestones:</p>
                      <div className="space-y-2">
                        {goal.milestones.map((milestone) => (
                          <div key={milestone.id} className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => handleToggleMilestone(goal.id, milestone.id)}
                            >
                              {milestone.completed ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <Circle className="h-4 w-4 text-muted-foreground" />
                              )}
                            </Button>
                            <span
                              className={`text-sm ${milestone.completed ? "line-through text-muted-foreground" : ""}`}
                            >
                              {milestone.title}
                            </span>
                            <span className="text-xs text-muted-foreground ml-auto">
                              {milestone.dueDate.toLocaleDateString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* AI Recommendations */}
                    {goal.recommendations.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">AI Recommendations:</p>
                        <div className="space-y-1">
                          {goal.recommendations.map((rec, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <Lightbulb className="h-4 w-4 text-yellow-500" />
                              {rec}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-xs text-muted-foreground">Due: {goal.deadline.toLocaleDateString()}</span>
                      <div className="flex items-center gap-1">
                        <Activity className="h-4 w-4 text-blue-500" />
                        <span className="text-xs text-muted-foreground">
                          {goal.milestones.filter((m) => m.completed).length}/{goal.milestones.length} milestones
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* AI Preferences Tab */}
          <TabsContent value="ai-preferences" className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold">AI Preferences & Settings</h3>
              <p className="text-muted-foreground">Configure how AI assists you throughout the platform</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    AI Analysis Features
                  </CardTitle>
                  <CardDescription>Control which AI features analyze your behavior and performance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Personality Insights</p>
                        <p className="text-xs text-muted-foreground">Analyze work style and communication patterns</p>
                      </div>
                      <Switch
                        checked={aiPreferences.personalityInsights}
                        onCheckedChange={(checked) =>
                          setAiPreferences({ ...aiPreferences, personalityInsights: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Behavior Analysis</p>
                        <p className="text-xs text-muted-foreground">Track patterns in your daily activities</p>
                      </div>
                      <Switch
                        checked={aiPreferences.behaviorAnalysis}
                        onCheckedChange={(checked) => setAiPreferences({ ...aiPreferences, behaviorAnalysis: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Productivity Tracking</p>
                        <p className="text-xs text-muted-foreground">Monitor and optimize your productivity patterns</p>
                      </div>
                      <Switch
                        checked={aiPreferences.productivityTracking}
                        onCheckedChange={(checked) =>
                          setAiPreferences({ ...aiPreferences, productivityTracking: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Wellness Monitoring</p>
                        <p className="text-xs text-muted-foreground">Track stress levels and work-life balance</p>
                      </div>
                      <Switch
                        checked={aiPreferences.wellnessMonitoring}
                        onCheckedChange={(checked) =>
                          setAiPreferences({ ...aiPreferences, wellnessMonitoring: checked })
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    AI Assistance Features
                  </CardTitle>
                  <CardDescription>Configure how AI provides recommendations and assistance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Career Guidance</p>
                        <p className="text-xs text-muted-foreground">Receive AI-powered career recommendations</p>
                      </div>
                      <Switch
                        checked={aiPreferences.careerGuidance}
                        onCheckedChange={(checked) => setAiPreferences({ ...aiPreferences, careerGuidance: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Skill Recommendations</p>
                        <p className="text-xs text-muted-foreground">Get suggestions for skill development</p>
                      </div>
                      <Switch
                        checked={aiPreferences.skillRecommendations}
                        onCheckedChange={(checked) =>
                          setAiPreferences({ ...aiPreferences, skillRecommendations: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Automated Goals</p>
                        <p className="text-xs text-muted-foreground">Allow AI to create goals based on your profile</p>
                      </div>
                      <Switch
                        checked={aiPreferences.automatedGoals}
                        onCheckedChange={(checked) => setAiPreferences({ ...aiPreferences, automatedGoals: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Contextual Help</p>
                        <p className="text-xs text-muted-foreground">Show relevant tips and suggestions</p>
                      </div>
                      <Switch
                        checked={aiPreferences.contextualHelp}
                        onCheckedChange={(checked) => setAiPreferences({ ...aiPreferences, contextualHelp: checked })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Advanced AI Features
                  </CardTitle>
                  <CardDescription>Enable advanced AI capabilities for enhanced experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Predictive Analytics</p>
                        <p className="text-xs text-muted-foreground">Predict future trends and outcomes</p>
                      </div>
                      <Switch
                        checked={aiPreferences.predictiveAnalytics}
                        onCheckedChange={(checked) =>
                          setAiPreferences({ ...aiPreferences, predictiveAnalytics: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Proactive Notifications</p>
                        <p className="text-xs text-muted-foreground">Receive AI-triggered alerts and reminders</p>
                      </div>
                      <Switch
                        checked={aiPreferences.proactiveNotifications}
                        onCheckedChange={(checked) =>
                          setAiPreferences({ ...aiPreferences, proactiveNotifications: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Learning Path Optimization</p>
                        <p className="text-xs text-muted-foreground">Optimize your learning journey with AI</p>
                      </div>
                      <Switch
                        checked={aiPreferences.learningPathOptimization}
                        onCheckedChange={(checked) =>
                          setAiPreferences({ ...aiPreferences, learningPathOptimization: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Workflow Automation</p>
                        <p className="text-xs text-muted-foreground">Automate repetitive tasks with AI</p>
                      </div>
                      <Switch
                        checked={aiPreferences.workflowAutomation}
                        onCheckedChange={(checked) =>
                          setAiPreferences({ ...aiPreferences, workflowAutomation: checked })
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Privacy & Security
                  </CardTitle>
                  <CardDescription>Manage your data privacy and security settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <Button
                      variant="outline"
                      onClick={handleExportData}
                      disabled={isExportingData}
                      className="w-full bg-transparent"
                    >
                      {isExportingData ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4 mr-2" />
                      )}
                      Export AI Data
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDeleteProfile}
                      disabled={isDeletingProfile}
                      className="w-full"
                    >
                      {isDeletingProfile ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 mr-2" />
                      )}
                      Delete AI Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Voice & AI Tab */}
          <TabsContent value="voice" className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold">Voice & AI Interaction</h3>
              <p className="text-muted-foreground">Configure voice input/output and AI interaction preferences</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mic className="h-5 w-5" />
                    Voice Input Settings
                  </CardTitle>
                  <CardDescription>Configure voice recognition and input preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Enable Voice Input</p>
                      <p className="text-xs text-muted-foreground">Allow voice commands and dictation</p>
                    </div>
                    <Switch
                      checked={voiceSettings.enabled}
                      onCheckedChange={(checked) => setVoiceSettings({ ...voiceSettings, enabled: checked })}
                    />
                  </div>

                  {voiceSettings.enabled && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="voiceLanguage">Language</Label>
                        <Select
                          value={voiceSettings.language}
                          onValueChange={(value) => setVoiceSettings({ ...voiceSettings, language: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en-US">English (US)</SelectItem>
                            <SelectItem value="en-GB">English (UK)</SelectItem>
                            <SelectItem value="es-ES">Spanish</SelectItem>
                            <SelectItem value="fr-FR">French</SelectItem>
                            <SelectItem value="de-DE">German</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center gap-4">
                        <Button
                          variant={isListening ? "destructive" : "default"}
                          onClick={handleVoiceInput}
                          className="flex items-center gap-2"
                        >
                          {isListening ? (
                            <>
                              <MicOff className="h-4 w-4" />
                              Stop Listening
                            </>
                          ) : (
                            <>
                              <Mic className="h-4 w-4" />
                              Start Voice Input
                            </>
                          )}
                        </Button>
                        {isListening && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            Listening...
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Volume2 className="h-5 w-5" />
                    Voice Output Settings
                  </CardTitle>
                  <CardDescription>Configure text-to-speech and voice feedback</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Auto-Speak Responses</p>
                      <p className="text-xs text-muted-foreground">Automatically read AI responses aloud</p>
                    </div>
                    <Switch
                      checked={voiceSettings.autoSpeak}
                      onCheckedChange={(checked) => setVoiceSettings({ ...voiceSettings, autoSpeak: checked })}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Speech Rate: {voiceSettings.rate.toFixed(1)}x</Label>
                      <Slider
                        value={[voiceSettings.rate]}
                        onValueChange={(value) => setVoiceSettings({ ...voiceSettings, rate: value[0] })}
                        min={0.5}
                        max={2.0}
                        step={0.1}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Pitch: {voiceSettings.pitch.toFixed(1)}</Label>
                      <Slider
                        value={[voiceSettings.pitch]}
                        onValueChange={(value) => setVoiceSettings({ ...voiceSettings, pitch: value[0] })}
                        min={0.5}
                        max={2.0}
                        step={0.1}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Volume: {Math.round(voiceSettings.volume * 100)}%</Label>
                      <Slider
                        value={[voiceSettings.volume]}
                        onValueChange={(value) => setVoiceSettings({ ...voiceSettings, volume: value[0] })}
                        min={0}
                        max={1}
                        step={0.1}
                        className="w-full"
                      />
                    </div>

                    <Button
                      variant="outline"
                      onClick={handleTestVoice}
                      disabled={isTestingVoice}
                      className="w-full flex items-center gap-2 bg-transparent"
                    >
                      {isTestingVoice ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <Headphones className="h-4 w-4" />
                      )}
                      Test Voice Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5" />
                    AI Chat Interface
                  </CardTitle>
                  <CardDescription>Interact with your personal AI assistant</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-96 border rounded-lg">
                    <AIChatInterface
                      context={{
                        userProfile: profile,
                        aiInsights: aiInsights,
                        personalityProfile: personalityProfile,
                        goals: aiGoals,
                      }}
                      voiceEnabled={voiceSettings.enabled}
                      autoSpeak={voiceSettings.autoSpeak}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Security Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security & Account Management
            </CardTitle>
            <CardDescription>Manage your account security and authentication settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button
                variant="outline"
                onClick={handleChangePassword}
                className="flex items-center gap-2 bg-transparent"
              >
                <Key className="h-4 w-4" />
                Change Password
              </Button>
              <Button variant="outline" onClick={handleManage2FA} className="flex items-center gap-2 bg-transparent">
                <Shield className="h-4 w-4" />
                Manage 2FA
              </Button>
              <Button
                variant="outline"
                onClick={handleExportData}
                disabled={isExportingData}
                className="flex items-center gap-2 bg-transparent"
              >
                {isExportingData ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                Export Data
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Password Change Dialog */}
        <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change Password</DialogTitle>
              <DialogDescription>Enter your current password and choose a new secure password.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input id="currentPassword" type="password" />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input id="newPassword" type="password" />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  >
                    <EyeOff className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setShowPasswordDialog(false)
                    toast({
                      title: "Password Changed",
                      description: "Your password has been updated successfully.",
                    })
                  }}
                >
                  Change Password
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* 2FA Management Dialog */}
        <Dialog open={show2FADialog} onOpenChange={setShow2FADialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Two-Factor Authentication</DialogTitle>
              <DialogDescription>Enhance your account security with two-factor authentication.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">SMS Authentication</p>
                  <p className="text-sm text-muted-foreground">Receive codes via text message</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Authenticator App</p>
                  <p className="text-sm text-muted-foreground">Use Google Authenticator or similar apps</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Email Authentication</p>
                  <p className="text-sm text-muted-foreground">Receive codes via email</p>
                </div>
                <Switch />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShow2FADialog(false)}>
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setShow2FADialog(false)
                    toast({
                      title: "2FA Settings Updated",
                      description: "Your two-factor authentication settings have been saved.",
                    })
                  }}
                >
                  Save Settings
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DualSidebarLayout>
  )
}
