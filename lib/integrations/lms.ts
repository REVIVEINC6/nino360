"use server"

// LMS integration stubs

export async function enrollCourse(employeeId: string, courseKey: string, dueAt: string) {
  // Stub: would call actual LMS API
  console.log(`[v0] Enrolling employee ${employeeId} in course ${courseKey}, due ${dueAt}`)
  return { success: true, enrollmentId: `lms-${Date.now()}` }
}

export async function unenrollCourse(enrollmentId: string) {
  // Stub: would call actual LMS API
  console.log(`[v0] Unenrolling ${enrollmentId}`)
  return { success: true }
}

export async function getCourseStatus(enrollmentId: string) {
  // Stub: would call actual LMS API
  console.log(`[v0] Getting course status for ${enrollmentId}`)
  return { success: true, status: "IN_PROGRESS", progress: 50 }
}
