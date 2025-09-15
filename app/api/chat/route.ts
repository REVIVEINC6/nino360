import { type NextRequest, NextResponse } from "next/server"

// Types
interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  type?: "text" | "voice" | "system"
}

interface ChatContext {
  module?: string
  userId?: string
  tenantId?: string
  currentPage?: string
}

interface ChatRequest {
  messages: ChatMessage[]
  context?: ChatContext
  module?: string
}

// System prompts for different modules
const getSystemPrompt = (module = "general", context: ChatContext = {}) => {
  const basePrompt = `You are an AI assistant for an Enterprise Resource Planning (ERP) platform called Nino360. You are knowledgeable, helpful, and professional. You provide insights, analytics, and assistance across various business modules.`

  const modulePrompts = {
    general: `${basePrompt} You help with general platform navigation and provide cross-module insights.`,

    crm: `${basePrompt} You specialize in Customer Relationship Management. You help with:
    - Lead management and pipeline analysis
    - Customer engagement strategies
    - Sales forecasting and reporting
    - Campaign performance optimization
    - Customer satisfaction analysis`,

    hrms: `${basePrompt} You specialize in Human Resource Management. You help with:
    - Employee performance analysis
    - Attendance and time tracking
    - Recruitment and talent acquisition
    - Training and development planning
    - Payroll and benefits management
    - Organizational analytics`,

    talent: `${basePrompt} You specialize in Talent Management. You help with:
    - Candidate sourcing and screening
    - Interview scheduling and management
    - Skills assessment and matching
    - Onboarding process optimization
    - Employee engagement and retention
    - Career development planning`,

    finance: `${basePrompt} You specialize in Financial Management. You help with:
    - Budget planning and analysis
    - Expense tracking and reporting
    - Revenue forecasting
    - Financial compliance
    - Cost optimization strategies
    - Investment analysis`,

    tenant: `${basePrompt} You specialize in Tenant Management for multi-tenant environments. You help with:
    - Tenant configuration and setup
    - User access management
    - Billing and subscription management
    - Performance monitoring
    - Integration management
    - Compliance and security`,
  }

  return modulePrompts[module as keyof typeof modulePrompts] || modulePrompts.general
}

// Generate contextual suggestions based on module and conversation
const generateSuggestions = (module: string, lastMessage: string): string[] => {
  const suggestions = {
    crm: [
      "Show me the sales pipeline status",
      "What are the top performing campaigns?",
      "Analyze customer satisfaction trends",
      "Generate a lead conversion report",
    ],
    hrms: [
      "Show today's attendance summary",
      "What are the key HR metrics?",
      "Analyze employee performance trends",
      "Review pending leave requests",
    ],
    talent: [
      "Show active job postings",
      "What's the current hiring pipeline?",
      "Analyze candidate quality metrics",
      "Review interview feedback",
    ],
    finance: [
      "Show budget vs actual spending",
      "What are the key financial KPIs?",
      "Analyze expense trends",
      "Generate financial forecast",
    ],
    tenant: [
      "Show tenant usage analytics",
      "What are the system health metrics?",
      "Review user activity patterns",
      "Analyze billing trends",
    ],
  }

  const moduleSuggestions = suggestions[module as keyof typeof suggestions] || [
    "Show me the dashboard overview",
    "What are the key metrics?",
    "Analyze recent trends",
    "Generate a summary report",
  ]

  // Return 3 random suggestions
  return moduleSuggestions.sort(() => 0.5 - Math.random()).slice(0, 3)
}

// Mock data responses for different queries
const getMockResponse = (query: string, module: string): string => {
  const lowerQuery = query.toLowerCase()

  // Attendance related queries
  if (lowerQuery.includes("attendance") || lowerQuery.includes("present") || lowerQuery.includes("absent")) {
    return `Based on today's attendance data:
    
📊 **Attendance Summary**
- Total Employees: 234
- Present Today: 198 (84.6%)
- Remote Workers: 45 (19.2%)
- On Leave: 12 (5.1%)
- Late Arrivals: 8 (3.4%)

🔍 **Key Insights:**
- Attendance rate is 2.3% higher than last week
- Remote work adoption has increased by 15% this month
- Engineering team has the highest attendance rate (92%)
- Friday typically sees 8% lower attendance

Would you like me to drill down into specific departments or generate a detailed report?`
  }

  // Performance related queries
  if (lowerQuery.includes("performance") || lowerQuery.includes("metrics") || lowerQuery.includes("kpi")) {
    return `Here's your performance overview:

📈 **Key Performance Indicators**
- Employee Satisfaction: 87% (↑5% from last quarter)
- Productivity Index: 94.2 (↑2.1 points)
- Customer Satisfaction: 4.6/5.0 (↓0.2 from last month)
- Revenue Growth: 12.5% YoY

🎯 **Performance Highlights:**
- Q3 targets exceeded by 8%
- Employee engagement scores at all-time high
- Customer response time improved by 23%
- Cost per acquisition reduced by 15%

⚠️ **Areas for Attention:**
- Customer satisfaction slight decline needs investigation
- Sales team performance varies significantly by region

Would you like detailed analysis on any specific metric?`
  }

  // Sales/CRM related queries
  if (
    lowerQuery.includes("sales") ||
    lowerQuery.includes("pipeline") ||
    lowerQuery.includes("leads") ||
    lowerQuery.includes("crm")
  ) {
    return `Here's your sales pipeline overview:

💰 **Sales Pipeline Status**
- Total Pipeline Value: $2.4M
- Qualified Leads: 156 (↑23% this month)
- Active Opportunities: 89
- Expected Close This Quarter: $890K

🎯 **Conversion Metrics:**
- Lead to Opportunity: 34.2%
- Opportunity to Close: 28.7%
- Average Deal Size: $15,400
- Sales Cycle: 45 days average

🏆 **Top Performers:**
- Sarah Johnson: $125K closed this month
- Michael Chen: 23 new qualified leads
- Emily Rodriguez: 92% close rate

📊 **Trends:**
- Enterprise deals up 45% QoQ
- SMB segment showing strong growth
- Referral leads have highest conversion rate

Need specific analysis on any segment or rep performance?`
  }

  // HR/Talent related queries
  if (
    lowerQuery.includes("hr") ||
    lowerQuery.includes("employee") ||
    lowerQuery.includes("talent") ||
    lowerQuery.includes("recruitment")
  ) {
    return `Here's your HR & Talent overview:

👥 **Workforce Analytics**
- Total Employees: 234 (↑12 this quarter)
- Active Recruitments: 18 positions
- Employee Turnover: 8.2% (industry avg: 12%)
- Time to Fill: 28 days average

📋 **Recruitment Pipeline:**
- Applications Received: 1,247 this month
- Interviews Scheduled: 89
- Offers Extended: 12
- Offers Accepted: 10 (83% acceptance rate)

🎓 **Learning & Development:**
- Training Completion Rate: 94%
- Skill Certifications: 45 completed this quarter
- Internal Promotions: 8 this quarter
- Leadership Program Participants: 23

💡 **Key Insights:**
- Engineering roles take longest to fill (42 days avg)
- Employee referrals have highest success rate
- Remote work satisfaction at 91%
- Diversity hiring up 34% YoY

What specific HR area would you like to explore further?`
  }

  // Financial queries
  if (
    lowerQuery.includes("finance") ||
    lowerQuery.includes("budget") ||
    lowerQuery.includes("revenue") ||
    lowerQuery.includes("cost")
  ) {
    return `Here's your financial overview:

💰 **Financial Performance**
- Monthly Revenue: $1.2M (↑8.5% MoM)
- Operating Expenses: $890K
- Net Profit Margin: 25.8%
- Cash Flow: Positive $2.1M

📊 **Budget Analysis:**
- YTD Budget Utilization: 73%
- Remaining Budget: $450K
- Largest Expense Categories:
  - Personnel: 65% of budget
  - Technology: 18% of budget
  - Marketing: 12% of budget

📈 **Growth Metrics:**
- Revenue Growth: 23% YoY
- Customer Acquisition Cost: $245 (↓12%)
- Customer Lifetime Value: $4,200
- Payback Period: 8.2 months

⚠️ **Budget Alerts:**
- Marketing spend 15% over budget this month
- Travel expenses trending high
- Software licenses up for renewal next quarter

Would you like detailed analysis of any financial area?`
  }

  // Default response with module-specific context
  const moduleContext = {
    crm: "I can help you with customer relationship management, sales pipeline analysis, lead tracking, and campaign performance.",
    hrms: "I can assist with employee management, attendance tracking, performance reviews, and HR analytics.",
    talent: "I can help with recruitment, candidate screening, interview management, and talent analytics.",
    finance: "I can assist with budget analysis, financial reporting, expense tracking, and revenue forecasting.",
    tenant: "I can help with tenant management, user administration, billing, and system analytics.",
  }

  const context =
    moduleContext[module as keyof typeof moduleContext] ||
    "I can help you with various aspects of your business operations."

  return `I understand you're asking about "${query}". ${context}

Here are some things I can help you with:

🔍 **Analytics & Insights**
- Generate detailed reports and dashboards
- Analyze trends and patterns in your data
- Provide predictive insights and forecasts

📊 **Data Analysis**
- Performance metrics and KPIs
- Comparative analysis across time periods
- Identify opportunities for improvement

🤖 **Automation Suggestions**
- Workflow optimization recommendations
- Process automation opportunities
- Efficiency improvement strategies

💡 **Strategic Recommendations**
- Best practices for your industry
- Benchmarking against industry standards
- Growth and optimization strategies

Could you be more specific about what you'd like to know? For example:
- "Show me this month's performance metrics"
- "Analyze trends in customer satisfaction"
- "What are the top opportunities for improvement?"

I'm here to provide detailed, actionable insights for your business!`
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    // Simple mock response - replace with actual AI integration
    const response = {
      message: `I received your message: "${message}". This is a mock response. To implement actual AI chat, integrate with your preferred AI service.`,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Failed to process chat message" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    status: "Chat API is running",
    endpoints: ["POST /api/chat"],
  })
}
