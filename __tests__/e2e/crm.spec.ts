import { test, expect } from "@playwright/test"

test.describe("CRM Module", () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto("/login")
    await page.fill('input[name="email"]', "test@example.com")
    await page.fill('input[name="password"]', "password123")
    await page.click('button[type="submit"]')
    await page.waitForURL("/dashboard")
  })

  test("should create a new lead", async ({ page }) => {
    await page.goto("/crm/leads")

    await page.click('button:has-text("Create Lead")')
    await page.fill('input[name="name"]', "Test Lead")
    await page.fill('input[name="email"]', "lead@example.com")
    await page.fill('input[name="company"]', "Test Company")
    await page.click('button[type="submit"]')

    await expect(page.locator("text=Lead created successfully")).toBeVisible()
    await expect(page.locator("text=Test Lead")).toBeVisible()
  })

  test("should filter leads", async ({ page }) => {
    await page.goto("/crm/leads")

    await page.fill('input[placeholder="Search leads..."]', "Test")
    await page.waitForTimeout(500) // Debounce

    const rows = page.locator("table tbody tr")
    await expect(rows).toHaveCount(1)
  })

  test("should export leads", async ({ page }) => {
    await page.goto("/crm/leads")

    const downloadPromise = page.waitForEvent("download")
    await page.click('button:has-text("Export")')
    const download = await downloadPromise

    expect(download.suggestedFilename()).toContain("leads")
    expect(download.suggestedFilename()).toContain(".csv")
  })
})
