import { z } from "zod"

export const roleKeySchema = z
  .string()
  .regex(/^[a-z0-9_-]{3,32}$/, "Role key must be 3-32 characters, lowercase alphanumeric with _ or -")

export const createRoleSchema = z.object({
  key: roleKeySchema,
  name: z.string().min(2).max(48),
  description: z.string().max(500).optional(),
})

export const updateRoleSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2).max(48).optional(),
  description: z.string().max(500).optional(),
})

export const assignRoleSchema = z.object({
  userId: z.string().uuid(),
  roleKey: z.string(),
})

export const setPermissionSchema = z.object({
  roleId: z.string().uuid(),
  permissionKey: z.string(),
  allowed: z.boolean(),
})

export const setFlagsSchema = z.object({
  flags: z.record(z.string().regex(/^[a-z0-9._-]+$/), z.boolean()),
})

export const saveScopeSchema = z.object({
  roleId: z.string().uuid(),
  resource: z.string().min(1).max(100),
  rule: z
    .object({
      where: z.string().max(500).optional(),
      fields: z
        .object({
          allow: z.array(z.string()).max(100).optional(),
          deny: z.array(z.string()).max(100).optional(),
        })
        .optional(),
    })
    .refine((rule) => JSON.stringify(rule).length <= 10240, "Rule size must be ≤ 10KB"),
})

export const simulateSchema = z.object({
  userId: z.string().uuid().optional(),
  roleKey: z.string().optional(),
  action: z.string(),
  resource: z.string(),
  sample: z.record(z.any()).optional(),
})
