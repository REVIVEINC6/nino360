import { test, expect } from "@playwright/test"

test.describe("Authentication Flow", () => {
  test("should login successfully", async ({ page }) => {
    await page.goto("/login")

    await page.fill('input[name="email"]', "test@example.com")
    await page.fill('input[name="password"]', "password123")
    await page.click('button[type="submit"]')

    await expect(page).toHaveURL("/dashboard")
    await expect(page.locator("text=Dashboard")).toBeVisible()
  })

  test("should show error for invalid credentials", async ({ page }) => {
    await page.goto("/login")

    await page.fill('input[name="email"]', "invalid@example.com")
    await page.fill('input[name="password"]', "wrongpassword")
    await page.click('button[type="submit"]')

    await expect(page.locator("text=Invalid credentials")).toBeVisible()
  })

  test("should logout successfully", async ({ page }) => {
    // Login first
    await page.goto("/login")
    await page.fill('input[name="email"]', "test@example.com")
    await page.fill('input[name="password"]', "password123")
    await page.click('button[type="submit"]')

    // Logout
    await page.click('button[aria-label="User menu"]')
    await page.click("text=Logout")

    await expect(page).toHaveURL("/login")
  })
})
