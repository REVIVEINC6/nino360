export interface SubscriptionPlan {
  id: string
  name: string
  description: string
  price_monthly: number
  price_quarterly: number
  price_annual: number
  currency: string
  features: string[]
  modules: string[]
  user_limit: number
  storage_limit: number
  api_limit: number
  support_level: "basic" | "premium" | "enterprise"
  trial_days: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface BillingAccount {
  id: string
  tenant_id: string
  tenant_name: string
  plan_id: string
  plan_name: string
  status: "trial" | "active" | "past_due" | "canceled" | "suspended"
  billing_cycle: "monthly" | "quarterly" | "annual"
  current_period_start: string
  current_period_end: string
  trial_end?: string
  mrr: number
  arr: number
  usage_limit: number
  usage_current: number
  credit_balance: number
  last_payment_date?: string
  last_payment_amount?: number
  next_billing_date: string
  payment_method?: string
  gateway: "stripe" | "razorpay" | "manual"
  gateway_customer_id?: string
  modules: string[]
  created_at: string
  updated_at: string
}

export interface Invoice {
  id: string
  tenant_id: string
  tenant_name: string
  invoice_number: string
  amount: number
  tax_amount: number
  total_amount: number
  currency: string
  status: "draft" | "sent" | "paid" | "overdue" | "canceled"
  due_date: string
  paid_date?: string
  items: InvoiceItem[]
  payment_method?: string
  gateway_invoice_id?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface InvoiceItem {
  description: string
  quantity: number
  unit_price: number
  total: number
}

export interface UsageMetric {
  id: string
  tenant_id: string
  module: string
  metric_type: string
  value: number
  unit: string
  period_start: string
  period_end: string
  created_at: string
}

export interface PaymentTransaction {
  id: string
  tenant_id: string
  invoice_id?: string
  amount: number
  currency: string
  status: "pending" | "completed" | "failed" | "refunded"
  gateway: string
  gateway_transaction_id?: string
  payment_method: string
  failure_reason?: string
  created_at: string
  updated_at: string
}

export interface BillingStats {
  total_mrr: number
  total_arr: number
  active_tenants: number
  trial_tenants: number
  overdue_invoices: number
  trial_expiring_today: number
  revenue_growth: number
  churn_rate: number
  average_revenue_per_user: number
  total_outstanding: number
}

export interface RevenueProjection {
  month: string
  projected_mrr: number
  projected_arr: number
  confidence_score: number
  factors: string[]
}

export interface ChurnRiskTenant {
  tenant_id: string
  tenant_name: string
  risk_score: number
  risk_level: "low" | "medium" | "high" | "critical"
  factors: string[]
  recommendations: string[]
  last_activity: string
  plan_name: string
  mrr: number
}

export interface BillingCopilotQuery {
  query: string
  response: string
  data?: any
  timestamp: string
}
