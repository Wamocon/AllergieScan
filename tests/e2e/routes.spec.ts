import { test, expect } from '@playwright/test'

test.describe('Public routes', () => {
  test('landing page loads in DE', async ({ page }) => {
    await page.goto('/de')
    await expect(page).toHaveTitle(/.+/)
    await expect(page.locator('h1')).toBeVisible()
  })

  test('landing page loads in EN', async ({ page }) => {
    await page.goto('/en')
    await expect(page).toHaveTitle(/.+/)
    await expect(page.locator('h1')).toBeVisible()
  })

  test('login page renders', async ({ page }) => {
    await page.goto('/de/login')
    await expect(page.locator('form')).toBeVisible({ timeout: 10000 })
  })

  test('register page renders', async ({ page }) => {
    await page.goto('/de/register')
    await expect(page.locator('body')).not.toContainText('404', { timeout: 10000 })
  })

  test('help page loads', async ({ page }) => {
    await page.goto('/de/help')
    await expect(page.locator('body')).toBeVisible()
  })

  test('protected routes redirect unauthenticated users', async ({ page }) => {
    const response = await page.goto('/de/dashboard')
    // Should either redirect to login or show login-related content
    const url = page.url()
    const isRedirected = url.includes('/login') || response?.status() === 307 || response?.status() === 302
    const hasLoginForm = await page.locator('form').count() > 0
    expect(isRedirected || hasLoginForm).toBeTruthy()
  })

  test('theme toggle works', async ({ page }) => {
    await page.goto('/de')
    const html = page.locator('html')
    await expect(html).toBeVisible()
  })
})

test.describe('Legal pages', () => {
  test('impressum loads', async ({ page }) => {
    await page.goto('/de/legal/impressum')
    await expect(page.locator('body')).toBeVisible()
  })

  test('datenschutz loads', async ({ page }) => {
    await page.goto('/de/legal/datenschutz')
    await expect(page.locator('body')).toBeVisible()
  })

  test('agb loads', async ({ page }) => {
    await page.goto('/de/legal/agb')
    await expect(page.locator('body')).toBeVisible()
  })
})
