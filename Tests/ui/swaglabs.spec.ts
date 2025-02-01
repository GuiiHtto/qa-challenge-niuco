// @ts-check
import { test, expect } from '@playwright/test';

test('Swag Labs login test', async ({ page }) => {
    // Navigate to the Swag Labs login page
    await page.goto('https://www.saucedemo.com/');

    // Enter username
    await page.fill('#user-name', 'standard_user');

    // Enter password
    await page.fill('#password', 'secret_sauce');

    // Click the login button
    await page.click('#login-button');

    // Verify that the user is redirected to the inventory page
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

    // Verify that the inventory page contains the expected elements
    await expect(page.locator('.inventory_list')).toBeVisible();
});
 
test('Swag Labs login failure test', async ({ page }) => {
    // Navigate to the Swag Labs login page
    await page.goto('https://www.saucedemo.com/');

    // Enter invalid username
    await page.fill('#user-name', 'invalid_user');

    // Enter invalid password
    await page.fill('#password', 'invalid_sauce');

    // Click the login button
    await page.click('#login-button');

    // Verify that the user is not redirected to the inventory page
    await expect(page).not.toHaveURL('https://www.saucedemo.com/inventory.html');

    // Verify that an error message is displayed
    await expect(page.locator('.error-message-container')).toBeVisible();
});

test('Swag Labs add items to cart test', async ({ page }) => {
    // Navigate to the Swag Labs login page
    await page.goto('https://www.saucedemo.com/');

    // Enter username
    await page.fill('#user-name', 'standard_user');

    // Enter password
    await page.fill('#password', 'secret_sauce');

    // Click the login button
    await page.click('#login-button');

    // Verify that the user is redirected to the inventory page
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

    // Add first item to the cart
    await page.click('.inventory_item:nth-child(1) .btn_inventory');

    // Verify that the cart badge showed 1 item added
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1', { timeout: 5000 });

    // Add second item to the cart
    await page.click('.inventory_item:nth-child(2) .btn_inventory');

    // Verify that the cart badge showed 2 items added
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2', { timeout: 5000 });

    // Add third item to the cart
    await page.click('.inventory_item:nth-child(3) .btn_inventory');

    // Verify that the cart badge showed 3 items added
    await expect(page.locator('.shopping_cart_badge')).toHaveText('3', { timeout: 5000 });

    // Remove first item from the cart
    await page.click('.inventory_item:nth-child(1) .btn_inventory');

    // Verify that the cart badge showed 1 item removed
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2', { timeout: 5000 });
    
    // Remove second item from the cart
    await page.click('.inventory_item:nth-child(2) .btn_inventory');

    // Verify that the cart badge showed 1 item removed
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1', { timeout: 5000 });
    
});

test('Swag Labs purchase without providing user information', async ({ page }) => {
    // Navigate to the Swag Labs login page
    await page.goto('https://www.saucedemo.com/');

    // Enter username
    await page.fill('#user-name', 'standard_user');

    // Enter password
    await page.fill('#password', 'secret_sauce');

    // Click the login button
    await page.click('#login-button');

    // Verify that the user is redirected to the inventory page
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

    // Add an item to the cart
    await page.click('.inventory_item:nth-child(1) .btn_inventory');

    // Click on the cart icon to go to the cart page
    await page.click('.shopping_cart_link');

    // Click on the checkout button
    await page.click('#checkout');

    // Attempt to continue without filling in user information
    await page.click('#continue');

    // Verify that an error message is displayed
    await expect(page.locator('.error-message-container')).toBeVisible();
});
