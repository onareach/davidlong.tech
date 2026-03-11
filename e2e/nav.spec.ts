/**
 * Navigation tests — Functional Spec: Site Integration
 * "The private studio should not appear in the public navigation."
 * Source: 00_RESEARCH_STUDIO_SPEC.md
 */

import { test, expect } from "@playwright/test";

const MOCK_USER = {
  id: 1,
  email: "test@example.com",
  display_name: "Test User",
};

test.describe("Public navigation (logged out)", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/api/auth/me", (route) =>
      route.fulfill({ json: { user: null } })
    );
    await page.goto("/about");
  });

  test("shows About, Teaching Philosophy, Teaching with Technology Example, Sign in", async ({
    page,
  }) => {
    const nav = page.getByRole("navigation", { name: "Main navigation" });
    await expect(nav.getByRole("link", { name: "Sign in" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "About" })).toBeVisible();
    await expect(
      nav.getByRole("link", { name: "Teaching Philosophy" })
    ).toBeVisible();
    await expect(
      nav.getByRole("link", { name: "Teaching with Technology Example" })
    ).toBeVisible();
  });

  test("does NOT show Today, Entries, Branches, Mysteries", async ({
    page,
  }) => {
    await expect(page.getByRole("link", { name: "Today" })).not.toBeVisible();
    await expect(page.getByRole("link", { name: "Entries" })).not.toBeVisible();
    await expect(page.getByRole("link", { name: "Branches" })).not.toBeVisible();
    await expect(page.getByRole("link", { name: "Mysteries" })).not.toBeVisible();
  });
});

test.describe("Studio navigation (logged in)", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/api/auth/me", (route) =>
      route.fulfill({ json: { user: MOCK_USER } })
    );
    await page.goto("/studio/today");
  });

  test("shows Today, Entries, Branches, Mysteries, Sign out", async ({
    page,
  }) => {
    await expect(page.getByRole("link", { name: "Today" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Entries" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Branches" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Mysteries" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Sign out" })).toBeVisible();
  });

  test("does NOT show About, Teaching Philosophy, Teaching with Technology Example in main nav", async ({
    page,
  }) => {
    const nav = page.getByRole("navigation", { name: "Main navigation" });
    await expect(nav.getByRole("link", { name: "About" })).not.toBeVisible();
    await expect(
      nav.getByRole("link", { name: "Teaching Philosophy" })
    ).not.toBeVisible();
    await expect(
      nav.getByRole("link", { name: "Teaching with Technology Example" })
    ).not.toBeVisible();
  });
});
