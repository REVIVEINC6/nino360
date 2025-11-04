import { z } from "zod"

export const emailSchema = z.string().email().toLowerCase().trim()

export const roleSchema = z.enum(["tenant_admin", "manager", "member", "viewer"])

export const statusSchema = z.enum(["active", "invited", "suspended"])

export const inviteSchema = z.object({
  invites: z
    .array(
      z.object({
        email: emailSchema,
        role: roleSchema,
      }),
    )
    .min(1, "At least one invite required")
    .max(200, "Maximum 200 invites per batch"),
})

export const setRoleSchema = z.object({
  userId: z.string().uuid(),
  role: roleSchema,
})

export const setStatusSchema = z.object({
  userId: z.string().uuid(),
  status: z.enum(["active", "suspended"]),
})

export const revokeInviteSchema = z.object({
  email: emailSchema,
})

export const resendInviteSchema = z.object({
  email: emailSchema,
})

export const listMembersSchema = z.object({
  q: z.string().optional(),
  role: roleSchema.optional(),
  status: statusSchema.optional(),
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().max(100).default(20),
  sort: z.enum(["name", "role", "last_seen", "created_at"]).default("created_at"),
  dir: z.enum(["asc", "desc"]).default("desc"),
})

export type InviteInput = z.infer<typeof inviteSchema>
export type SetRoleInput = z.infer<typeof setRoleSchema>
export type SetStatusInput = z.infer<typeof setStatusSchema>
export type RevokeInviteInput = z.infer<typeof revokeInviteSchema>
export type ResendInviteInput = z.infer<typeof resendInviteSchema>
export type ListMembersInput = z.infer<typeof listMembersSchema>
