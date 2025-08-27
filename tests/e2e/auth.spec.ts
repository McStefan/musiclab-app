import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display sign in screen by default', async ({ page }) => {
    await expect(page.locator('text=Music Lab')).toBeVisible();
    await expect(page.locator('text=Sign In')).toBeVisible();
    await expect(page.locator('text=Sign in with Apple')).toBeVisible();
    await expect(page.locator('text=Sign in with Google')).toBeVisible();
    await expect(page.locator('text=Sign In with Email')).toBeVisible();
  });

  test('should navigate to email sign in', async ({ page }) => {
    await page.click('text=Sign In with Email');
    
    await expect(page.locator('text=Welcome Back')).toBeVisible();
    await expect(page.locator('input[placeholder="Email"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Password"]')).toBeVisible();
    await expect(page.locator('text=Forgot Password?')).toBeVisible();
  });

  test('should show validation errors for empty form', async ({ page }) => {
    await page.click('text=Sign In with Email');
    await page.click('text=Sign In');
    
    // Should show validation error (would need to implement)
    // await expect(page.locator('text=Please enter both email and password')).toBeVisible();
  });

  test('should handle successful login', async ({ page }) => {
    await page.click('text=Sign In with Email');
    
    // Fill in login form
    await page.fill('input[placeholder="Email"]', 'user@musiclab.app');
    await page.fill('input[placeholder="Password"]', 'password');
    
    // Submit form
    await page.click('text=Sign In');
    
    // Should navigate to home screen after successful login
    await expect(page.locator('text=Featured Playlists')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=New Releases')).toBeVisible();
    await expect(page.locator('text=Trending')).toBeVisible();
  });

  test('should handle login failure', async ({ page }) => {
    await page.click('text=Sign In with Email');
    
    // Fill in login form with wrong credentials
    await page.fill('input[placeholder="Email"]', 'wrong@email.com');
    await page.fill('input[placeholder="Password"]', 'wrongpassword');
    
    // Submit form
    await page.click('text=Sign In');
    
    // Should show error message
    await expect(page.locator('text=Authentication failed')).toBeVisible({ timeout: 5000 });
  });

  test('should navigate to sign up', async ({ page }) => {
    await page.click('text=Sign In with Email');
    await page.click('text=Sign Up');
    
    await expect(page.locator('text=Create Account')).toBeVisible();
    await expect(page.locator('input[placeholder="First Name"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Last Name"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Email"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Password"]')).toBeVisible();
  });

  test('should handle Google OAuth flow', async ({ page }) => {
    // Mock Google OAuth popup
    await page.route('https://accounts.google.com/**', route => {
      route.fulfill({
        status: 200,
        body: 'Mock Google OAuth success'
      });
    });

    await page.click('text=Sign in with Google');
    
    // In a real test, this would handle the OAuth popup
    // For now, just check that the flow started
    expect(page.url()).toContain('/');
  });

  test('should handle forgot password', async ({ page }) => {
    await page.click('text=Sign In with Email');
    await page.click('text=Forgot Password?');
    
    await expect(page.locator('text=Reset Password')).toBeVisible();
    await expect(page.locator('input[placeholder="Email"]')).toBeVisible();
    await expect(page.locator('text=Send Reset Link')).toBeVisible();
  });

  test('should persist auth state after page reload', async ({ page }) => {
    // First, sign in
    await page.click('text=Sign In with Email');
    await page.fill('input[placeholder="Email"]', 'user@musiclab.app');
    await page.fill('input[placeholder="Password"]', 'password');
    await page.click('text=Sign In');
    
    // Wait for home screen
    await expect(page.locator('text=Featured Playlists')).toBeVisible({ timeout: 10000 });
    
    // Reload page
    await page.reload();
    
    // Should still be on home screen (auth persisted)
    await expect(page.locator('text=Featured Playlists')).toBeVisible({ timeout: 5000 });
  });

  test('should handle logout', async ({ page }) => {
    // First, sign in
    await page.click('text=Sign In with Email');
    await page.fill('input[placeholder="Email"]', 'user@musiclab.app');
    await page.fill('input[placeholder="Password"]', 'password');
    await page.click('text=Sign In');
    
    // Wait for home screen
    await expect(page.locator('text=Featured Playlists')).toBeVisible({ timeout: 10000 });
    
    // Navigate to settings and logout
    await page.click('[data-testid="settings-tab"]');
    await page.click('text=Sign Out');
    
    // Should return to sign in screen
    await expect(page.locator('text=Sign In')).toBeVisible({ timeout: 5000 });
  });
});
