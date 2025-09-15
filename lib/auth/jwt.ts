import jwt from "jsonwebtoken"
import type { NextRequest } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/client"

export interface JWTPayload {
  userId: string
  email: string
  role: string
  tenant_id: string
  iat: number
  exp: number
}

export async function validateJWT(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return { success: false, error: "No valid token provided" }
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload

    // Verify user still exists and is active
    const { data: user, error } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("id", decoded.userId)
      .eq("is_active", true)
      .single()

    if (error || !user) {
      return { success: false, error: "Invalid user" }
    }

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        tenant_id: user.tenant_id,
      },
    }
  } catch (error) {
    return { success: false, error: "Invalid token" }
  }
}

export function generateJWT(user: any): string {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
      tenant_id: user.tenant_id,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "24h" },
  )
}
