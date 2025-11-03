import { test, expect } from "@playwright/test"

test.describe("Pay-on-Pay anchor flow (mock)", () => {
  test("create run → anchor → verify", async ({ request }) => {
    // Create
    const createRes = await request.post(`/api/pay-on-pay/settlements`, {
      data: { runDate: new Date().toISOString().slice(0, 10), linkagePolicy: { type: "auto", rules: [] } },
    })
    expect(createRes.ok()).toBeTruthy()
    const run = await createRes.json()
    expect(run.id).toBeTruthy()

    // Anchor
    const anchorRes = await request.post(`/api/pay-on-pay/anchor/${run.id}`)
    expect(anchorRes.ok()).toBeTruthy()
    const anchor = await anchorRes.json()
    expect(anchor.transaction_hash).toBeTruthy()

    // Verify
    const verifyRes = await request.get(`/api/pay-on-pay/verify-anchor/dummy?runId=${run.id}`)
    expect(verifyRes.ok()).toBeTruthy()
    const verified = await verifyRes.json()
    expect(verified.verified).toBeTruthy()
  })
})
