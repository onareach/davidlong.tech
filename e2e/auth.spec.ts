/**
 * Authentication tests — Functional Spec: Studio Routes Protected
 * "Routes beginning with /studio must be protected."
 * Source: ARCHITECTURE.md
 */

import { test, expect } from "@playwright/test";

const MOCK_USER = {
  id: 1,
  email: "test@example.com",
  display_name: "Test User",
  is_admin: false,
};

const STUDIO_ROUTES = [
  "/studio",
  "/studio/today",
  "/studio/entries",
  "/studio/branches",
  "/studio/mysteries",
  "/studio/account",
  "/studio/admin",
];

test.describe("Studio route protection (unauthenticated)", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/api/auth/me", (route) =>
      route.fulfill({ json: { user: null } })
    );
  });

  for (const route of STUDIO_ROUTES) {
    test(`${route} redirects to sign-in`, async ({ page }) => {
      const response = await page.goto(route);
      await expect(page).toHaveURL(/\/sign-in/);
      await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
    });
  }
});

test.describe("Sign out returns to public site", () => {
  test("after sign out, user sees public nav with About and Sign in", async ({
    page,
  }) => {
    // First /api/auth/me returns user (studio loads); after sign out, next returns null
    let meCallCount = 0;
    await page.route("**/api/auth/me", (route) => {
      meCallCount++;
      route.fulfill({
        json: { user: meCallCount <= 1 ? MOCK_USER : null },
      });
    });
    await page.route("**/api/auth/logout", (route) =>
      route.fulfill({ status: 200, json: {} })
    );

    await page.goto("/studio/today");
    await expect(page.getByRole("link", { name: "Sign out" })).toBeVisible();

    await page.getByRole("link", { name: "Sign out" }).click();
    await expect(page).toHaveURL(/\/(about)?$/);
    await expect(page.getByRole("link", { name: "Sign in" })).toBeVisible();
    await expect(page.getByRole("link", { name: "About" })).toBeVisible();
  });
});
