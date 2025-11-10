import { describe, it, expect } from "vitest"
import { getKpis } from "../../app/(dashboard)/dashboard/actions"

describe("getKpis server action", () => {
  it("returns KPIs with expected keys and numeric values", async () => {
    const kpis = await getKpis()

    expect(kpis).toBeDefined()
    expect(kpis.finance).toBeDefined()
    expect(typeof kpis.finance?.arBalance).toBe("number")
    expect(typeof kpis.bench?.activeAllocations).toBe("number")
    expect(typeof kpis.ats?.openJobs).toBe("number")
    expect(typeof kpis.hrms?.activeEmployees).toBe("number")
  })
})
