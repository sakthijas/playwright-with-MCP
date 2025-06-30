import { test, expect } from '@playwright/test';

test.describe('Sauce Demo Login Tests', () => {
  test('should login successfully with valid credentials', async ({ page }) => {
    // Navigate to the login page
    await page.goto('https://www.saucedemo.com/');

    // Enter valid credentials
    await page.fill('[data-test="username"]', 'standard_user');
    await page.fill('[data-test="password"]', 'secret_sauce');

    // Click login button
    await page.click('[data-test="login-button"]');

    // Verify successful login by checking if we're on the inventory page
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    
    // Additional verification that we're logged in by checking for inventory container
    await expect(page.locator('#inventory_container')).toBeVisible();
    await expect(page.locator('.shopping_cart_link')).toBeVisible();
  });

  test('should show error with invalid username', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    // Enter invalid username with valid password
    await page.fill('[data-test="username"]', 'invalid_user');
    await page.fill('[data-test="password"]', 'secret_sauce');
    
    // Click login button
    await page.click('[data-test="login-button"]');
    
    // Verify error message
    const errorMessage = await page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText('Epic sadface: Username and password do not match any user in this service');
  });

  test('should show error with invalid password', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    // Enter valid username with invalid password
    await page.fill('[data-test="username"]', 'standard_user');
    await page.fill('[data-test="password"]', 'wrong_password');
    
    // Click login button
    await page.click('[data-test="login-button"]');
    
    // Verify error message
    const errorMessage = await page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText('Epic sadface: Username and password do not match any user in this service');
  });

  test('should show error with empty credentials', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    // Click login button without entering credentials
    await page.click('[data-test="login-button"]');
    
    // Verify error message
    const errorMessage = await page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText('Epic sadface: Username is required');
  });

  test('should show error for locked out user', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    // Try to login with locked out user
    await page.fill('[data-test="username"]', 'locked_out_user');
    await page.fill('[data-test="password"]', 'secret_sauce');
    
    // Click login button
    await page.click('[data-test="login-button"]');
    
    // Verify error message
    const errorMessage = await page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText('Epic sadface: Sorry, this user has been locked out.');
  });
});
