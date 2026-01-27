import { test, expect } from '@playwright/test';

test.describe('Collaborative Development Documentation Exhibits', () => {
    test('should load the main collaborative-development-docs post', async ({ page }) => {
        await page.goto('/posts/collaborative-development-docs/');

        // Verify the main post loads
        await expect(page).toHaveTitle(/collaborative development documentation/i);
        await expect(page.locator('h1').filter({ hasText: /Collaborative Diagnostic Documentation/ })).toBeVisible();
    });

    test('should navigate to Exhibit A from appendices link', async ({ page }) => {
        await page.goto('/posts/collaborative-development-docs/');

        // Find and click the Exhibit A link
        const exhibitALink = page.getByRole('link', { name: /Exhibit A.*Bedrock Input Error Handling/i });
        await expect(exhibitALink).toBeVisible();

        await exhibitALink.click();

        // Verify we're on the Exhibit A page
        await expect(page).toHaveURL(/collaborative-development-docs-exhibit-1/);

        // Check for the page title
        const pageTitle = await page.title();
        expect(pageTitle.toLowerCase()).toContain('bedrock');

        // Check for exhibit content
        await expect(page.locator('body')).toContainText(/diagnostic investigation/i);
        await expect(page.getByRole('heading', { name: /Prompt.*explore/i })).toBeVisible();
    });

    test('should navigate to Exhibit B from appendices link', async ({ page }) => {
        await page.goto('/posts/collaborative-development-docs/');

        // Find and click the Exhibit B link
        const exhibitBLink = page.getByRole('link', { name: /Exhibit B.*Take 2/i });
        await expect(exhibitBLink).toBeVisible();

        await exhibitBLink.click();

        // Verify we're on the Exhibit B page
        await expect(page).toHaveURL(/collaborative-development-docs-exhibit-2/);

        // Check for continuation indicator
        await expect(page.locator('body')).toContainText(/continuation/i);

        // Check for exhibit-specific content
        await expect(page.getByRole('heading', { name: /summarize.*bedrock-input-error/i })).toBeVisible();
    });

    test('should have working links in Appendices section', async ({ page }) => {
        await page.goto('/posts/collaborative-development-docs/');

        // Scroll to Appendices section
        const appendicesHeading = page.getByRole('heading', { name: 'Appendices' });
        await expect(appendicesHeading).toBeVisible();

        // Verify both exhibit links are present
        const exhibitALink = page.getByRole('link', { name: /Exhibit A/i });
        const exhibitBLink = page.getByRole('link', { name: /Exhibit B/i });

        await expect(exhibitALink).toBeVisible();
        await expect(exhibitBLink).toBeVisible();

        // Check that links have proper href attributes
        await expect(exhibitALink).toHaveAttribute('href', /collaborative-development-docs-exhibit-1/);
        await expect(exhibitBLink).toHaveAttribute('href', /collaborative-development-docs-exhibit-2/);
    });

    test('should directly access Exhibit A URL', async ({ page }) => {
        const response = await page.goto('/posts/collaborative-development-docs-exhibit-1/');

        // Should not be a 404
        expect(response?.status()).not.toBe(404);
        expect(response?.status()).toBe(200);

        // Should show content
        await expect(page.locator('body')).toContainText(/Bedrock/i);
    });

    test('should directly access Exhibit B URL', async ({ page }) => {
        const response = await page.goto('/posts/collaborative-development-docs-exhibit-2/');

        // Should not be a 404
        expect(response?.status()).not.toBe(404);
        expect(response?.status()).toBe(200);

        // Should show content
        await expect(page.locator('body')).toContainText(/continuation/i);
    });
});
