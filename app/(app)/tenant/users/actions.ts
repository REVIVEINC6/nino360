export async function inviteUser(email: string, role: string) {
  // Map to inviteUsers in dashboard users actions
  const m = await import("@/app/(dashboard)/tenant/users/actions")
  const res = await m.inviteUsers({ invites: [{ email, role }] })
  return { success: res.success, error: res.error }
}

export async function updateUserRole(userId: string, role: string) {
  const m = await import("@/app/(dashboard)/tenant/users/actions")
  return await m.setRole({ userId, role })
}

export async function deactivateUser(userId: string) {
  const m = await import("@/app/(dashboard)/tenant/users/actions")
  return await m.setStatus({ userId, status: "inactive" })
}

// Shim: components expect inviteUser/updateUserRole/deactivateUser from the (app) tenant users path; map to dashboard implementations.
