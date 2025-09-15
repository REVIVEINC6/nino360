export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: "master_admin" | "super_admin" | "admin" | "recruitment_manager" | "hr_manager" | "recruiter"
          tenant_id: string
          avatar_url?: string
          created_at: string
          updated_at: string
          last_login?: string
          is_active: boolean
          metadata: Record<string, any>
        }
        Insert: Omit<Database["public"]["Tables"]["users"]["Row"], "id" | "created_at" | "updated_at">
        Update: Partial<Database["public"]["Tables"]["users"]["Insert"]>
      }
      tenants: {
        Row: {
          id: string
          name: string
          domain: string
          status: "active" | "inactive" | "suspended"
          plan: "starter" | "professional" | "enterprise"
          settings: Record<string, any>
          created_at: string
          updated_at: string
          subscription_ends_at?: string
        }
        Insert: Omit<Database["public"]["Tables"]["tenants"]["Row"], "id" | "created_at" | "updated_at">
        Update: Partial<Database["public"]["Tables"]["tenants"]["Insert"]>
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string
          tenant_id: string
          action: string
          resource_type: string
          resource_id: string
          old_values?: Record<string, any>
          new_values?: Record<string, any>
          ip_address: string
          user_agent: string
          created_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["audit_logs"]["Row"], "id" | "created_at">
        Update: never
      }
      ai_insights: {
        Row: {
          id: string
          tenant_id: string
          type: "optimization" | "prediction" | "recommendation" | "alert"
          title: string
          description: string
          confidence: number
          impact: "low" | "medium" | "high" | "critical"
          status: "active" | "dismissed" | "implemented"
          metadata: Record<string, any>
          created_at: string
          expires_at?: string
        }
        Insert: Omit<Database["public"]["Tables"]["ai_insights"]["Row"], "id" | "created_at">
        Update: Partial<Database["public"]["Tables"]["ai_insights"]["Insert"]>
      }
      system_metrics: {
        Row: {
          id: string
          tenant_id?: string
          metric_type: string
          value: number
          metadata: Record<string, any>
          recorded_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["system_metrics"]["Row"], "id">
        Update: never
      }
    }
    Views: {
      tenant_analytics: {
        Row: {
          tenant_id: string
          total_users: number
          active_users: number
          revenue: number
          growth_rate: number
          health_score: number
        }
      }
    }
    Functions: {
      get_tenant_metrics: {
        Args: { tenant_id: string; time_range: string }
        Returns: Record<string, any>
      }
      generate_ai_insights: {
        Args: { tenant_id: string }
        Returns: Database["public"]["Tables"]["ai_insights"]["Row"][]
      }
    }
  }
}
