import { test, expect } from '@playwright/test';

test.describe('Memory Numbers Game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the application successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/memory-numbers/);
    await expect(page.locator('h1')).toHaveText('Game: Open Numbers in Order');
  });

  test('should display scoreboard with mistakes and time', async ({ page }) => {
    await expect(page.locator('.scoreboard')).toBeVisible();
    await expect(page.locator('text=Mistakes: 0')).toBeVisible();
    await expect(page.locator('text=Time:')).toBeVisible();
  });

  test('should open cards when clicked', async ({ page }) => {
    // Find all card containers
    const cardContainers = page.locator('[data-testid="card-container"]');
    const cardCount = await cardContainers.count();
    
    expect(cardCount).toBeGreaterThan(0);
    
    // Click on the first card
    await cardContainers.first().click();
    
    // Card should be flipped
    const flippedCard = page.locator('.card.is-flipped').or(page.locator('.card.is-matched'));
    await expect(flippedCard).toBeVisible();
  });

  test('should track mistakes when wrong number is selected', async ({ page }) => {
    // Get initial mistakes count
    const mistakesLocator = page.locator('text=Mistakes:');
    const initialText = await mistakesLocator.textContent();
    const initialMistakes = parseInt(initialText?.match(/\d+/)?.[0] || '0', 10);
    
    // Find and click card with number 1 (correct)
    // Click on the container that contains the number 1
    const cardWithOne = page.locator('[data-testid="card-container"]:has-text("1")').first();
    await cardWithOne.click();
    await page.waitForTimeout(300);
    
    // Find a card that is NOT number 2 and click it (wrong)
    const allCards = page.locator('[data-testid="card-container"]');
    const cardCount = await allCards.count();
    
    for (let i = 0; i < cardCount; i++) {
      const card = allCards.nth(i);
      const cardText = await card.textContent();
      
      // Check if card contains 1 or 2
      if (!cardText?.includes('1') && !cardText?.includes('2')) {
        await card.click();
        break;
      }
    }
    
    // Wait for mistakes counter to update
    await page.waitForTimeout(1200);
    
    const updatedText = await mistakesLocator.textContent();
    const updatedMistakes = parseInt(updatedText?.match(/\d+/)?.[0] || '0', 10);
    
    expect(updatedMistakes).toBeGreaterThan(initialMistakes);
  });

  test('should complete level 2x2 by clicking numbers in order', async ({ page }) => {
    // For a 2x2 grid, we need to click 1, 2, 3, 4 in order
    for (let num = 1; num <= 4; num++) {
      // Find and click the card container with the current number
      const card = page.locator(`[data-testid="card-container"]:has-text("${num}")`).first();
      await card.click();
      await page.waitForTimeout(300);
    }
    
    // Game Over modal should appear after completing the level
    await expect(page.locator('.modal-overlay')).toBeVisible({ timeout: 5000 });
  });

  test('should show Game Over modal with statistics', async ({ page }) => {
    // Complete the 2x2 level
    for (let num = 1; num <= 4; num++) {
      const card = page.locator(`[data-testid="card-container"]:has-text("${num}")`).first();
      await card.click();
      await page.waitForTimeout(300);
    }
    
    // Wait for modal
    await expect(page.locator('.modal-overlay')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('.modal-content h2')).toHaveText('Game Over!');
    
    // Check modal contains time and mistakes info
    await expect(page.locator('text=Your Time:')).toBeVisible();
    await expect(page.locator('text=Your Mistakes:')).toBeVisible();
  });

  test('should proceed to next level after clicking Next Level button', async ({ page }) => {
    // Complete the 2x2 level
    for (let num = 1; num <= 4; num++) {
      const card = page.locator(`[data-testid="card-container"]:has-text("${num}")`).first();
      await card.click();
      await page.waitForTimeout(300);
    }
    
    // Wait for modal and click Next Level button
    const nextLevelButton = page.locator('.modal-content button:has-text("Next Level")');
    await expect(nextLevelButton).toBeVisible({ timeout: 5000 });
    await nextLevelButton.click();
    
    // Wait for new game to start
    await page.waitForTimeout(500);
    
    // Should have a larger grid now (3x3 = 9 cards)
    const cards = page.locator('[data-testid="card-container"]');
    const cardCount = await cards.count();
    
    // 3x3 grid should have 9 cards
    expect(cardCount).toBe(9);
  });

  test('should increment timer while playing', async ({ page }) => {
    // Get initial time
    const timeLocator = page.locator('text=Time:');
    const initialText = await timeLocator.textContent();
    // Parse time in MM:SS format
    const initialTimeMatch = initialText?.match(/Time:\s*(\d+):(\d+)/);
    const initialTime = initialTimeMatch ? parseInt(initialTimeMatch[1], 10) * 60 + parseInt(initialTimeMatch[2], 10) : 0;
    
    // Wait 4 seconds to ensure timer updates (accounting for browser differences)
    await page.waitForTimeout(4000);
    
    // Get updated time
    const updatedText = await timeLocator.textContent();
    const updatedTimeMatch = updatedText?.match(/Time:\s*(\d+):(\d+)/);
    const updatedTime = updatedTimeMatch ? parseInt(updatedTimeMatch[1], 10) * 60 + parseInt(updatedTimeMatch[2], 10) : 0;
    
    // Allow 2 seconds tolerance for browser startup delays
    expect(updatedTime).toBeGreaterThanOrEqual(initialTime + 2);
  });

  test('should reset progress when wrong number is clicked', async ({ page }) => {
    // Click number 1 (correct)
    const cardWithOne = page.locator('[data-testid="card-container"]:has-text("1")').first();
    await cardWithOne.click();
    await page.waitForTimeout(300);
    
    // Verify number 1 is matched
    const matchedCard = page.locator('.card.is-matched:has-text("1")');
    await expect(matchedCard).toBeVisible();
    
    // Click a wrong number (not 2 and not 1)
    const allCards = page.locator('[data-testid="card-container"]');
    const cardCount = await allCards.count();
    
    for (let i = 0; i < cardCount; i++) {
      const card = allCards.nth(i);
      const cardText = await card.textContent();
      
      // Find a card that is neither 1 nor 2
      if (!cardText?.includes('1') && !cardText?.includes('2')) {
        await card.click();
        break;
      }
    }
    
    // Wait for board to reset
    await page.waitForTimeout(1200);
    
    // Number 1 should no longer be matched (board reset)
    const resetMatchedCards = page.locator('.card.is-matched');
    const matchedCount = await resetMatchedCards.count();
    expect(matchedCount).toBe(0);
  });
});
