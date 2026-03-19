/**
 * Route tests — Functional Spec: MVP Routes, Public Routes, Redirects
 * Sources: 00_RESEARCH_STUDIO_SPEC.md, ARCHITECTURE.md
 */

import { test, expect } from "@playwright/test";

const MOCK_USER = {
  id: 1,
  email: "test@example.com",
  display_name: "Test User",
  is_admin: false,
};

test.describe("Public routes", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/api/auth/me", (route) =>
      route.fulfill({ json: { user: null } })
    );
  });

  test("/ redirects to /about", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/about/);
  });

  test("/about is accessible", async ({ page }) => {
    const response = await page.goto("/about");
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { name: "About" })).toBeVisible();
  });

  test("/philosophy (teaching) is accessible", async ({ page }) => {
    const response = await page.goto("/philosophy");
    expect(response?.status()).toBe(200);
    await expect(
      page.getByRole("heading", { name: /Teaching Philosophy/i })
    ).toBeVisible();
  });

  test("/implementation (teaching) is accessible", async ({ page }) => {
    const response = await page.goto("/implementation");
    expect(response?.status()).toBe(200);
    await expect(
      page.getByRole("heading", { name: /Teaching with Technology/i })
    ).toBeVisible();
  });
});

test.describe("Studio routes (authenticated)", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/api/auth/me", (route) =>
      route.fulfill({ json: { user: MOCK_USER } })
    );
  });

  test("/studio redirects to /studio/today", async ({ page }) => {
    await page.goto("/studio");
    await expect(page).toHaveURL(/\/studio\/today/);
  });

  test("/studio/today renders when authenticated", async ({ page }) => {
    const response = await page.goto("/studio/today");
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { name: "Today" })).toBeVisible();
  });

  test("/studio/entries renders when authenticated", async ({ page }) => {
    const response = await page.goto("/studio/entries");
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { name: "Entries" })).toBeVisible();
  });

  test("/studio/branches renders when authenticated", async ({ page }) => {
    const response = await page.goto("/studio/branches");
    expect(response?.status()).toBe(200);
    await expect(
      page.getByRole("heading", { name: "Branches" })
    ).toBeVisible();
  });

  test("/studio/mysteries renders when authenticated", async ({ page }) => {
    const response = await page.goto("/studio/mysteries");
    expect(response?.status()).toBe(200);
    await expect(
      page.getByRole("heading", { name: "Mysteries" })
    ).toBeVisible();
  });

  test("/studio/account renders when authenticated", async ({ page }) => {
    const response = await page.goto("/studio/account");
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { name: "Account" })).toBeVisible();
  });
});

test.describe("Studio admin (non-admin user)", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/api/auth/me", (route) =>
      route.fulfill({ json: { user: MOCK_USER } })
    );
  });

  test("/studio/admin redirects away for non-admin", async ({ page }) => {
    await page.goto("/studio/admin");
    await expect(page).toHaveURL(/\/studio\/today/);
  });
});
