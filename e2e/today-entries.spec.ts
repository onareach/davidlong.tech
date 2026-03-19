/**
 * Today and Entries feature tests — Functional Spec: prompt controls, add branch/mystery
 * Sources: FEATURE_ADDITIONS.md, FUNCTIONAL_SPEC_TESTS.md
 *
 * These tests mock the API so that the Today and Entries pages render with the
 * expected controls (Replace prompt, Edit, New prompt; Add branch, Add mystery).
 */

import { test, expect } from "@playwright/test";

const MOCK_USER = {
  id: 1,
  email: "test@example.com",
  display_name: "Test User",
  is_admin: false,
};

const MOCK_TODAY_RESPONSE = {
  entry: null,
  prompt: {
    id: 1,
    text: "What idea from yesterday wants to be extended?",
    is_fallback: true,
  },
};

const MOCK_ENTRY = {
  id: 1,
  user_id: 1,
  research_prompt_id: 1,
  title: "Test entry",
  raw_text: "Some draft text.",
  edited_text: null,
  summary: null,
  why_it_matters: null,
  research_branch_id: null,
  research_mystery_id: null,
  status: "raw",
  created_at: "2026-01-15T12:00:00Z",
  updated_at: "2026-01-15T12:00:00Z",
};

test.describe("Today page: prompt controls", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/api/auth/me", (route) =>
      route.fulfill({ json: { user: MOCK_USER } })
    );
    await page.route("**/api/entries/today", (route) =>
      route.fulfill({ json: MOCK_TODAY_RESPONSE })
    );
  });

  test("shows Today's prompt section when prompt is loaded", async ({ page }) => {
    await page.goto("/studio/today");
    await expect(page.getByRole("heading", { name: "Today" })).toBeVisible();
    await expect(
      page.getByText("Today's prompt", { exact: false })
    ).toBeVisible();
    await expect(
      page.getByText("What idea from yesterday wants to be extended?")
    ).toBeVisible();
  });

  test("has Replace prompt link under the prompt", async ({ page }) => {
    await page.goto("/studio/today");
    await expect(page.getByRole("button", { name: "Replace prompt" })).toBeVisible();
  });

  test("has Edit link under the prompt", async ({ page }) => {
    await page.goto("/studio/today");
    await expect(page.getByRole("button", { name: "Edit" })).toBeVisible();
  });

  test("has New prompt link next to the Today heading", async ({ page }) => {
    await page.goto("/studio/today");
    await expect(page.getByRole("button", { name: "New prompt" })).toBeVisible();
  });

  test("Replace prompt opens dialog with prompt list", async ({ page }) => {
    await page.route("**/api/prompts**", (route) => {
      const url = route.request().url();
      if (url.includes("/today")) {
        return route.fulfill({
          json: {
            prompt: {
              id: 2,
              text: "Another prompt",
              is_fallback: true,
            },
          },
        });
      }
      return route.fulfill({
        json: {
          prompts: [
            { id: 1, text: "First prompt", is_fallback: true },
            { id: 2, text: "Another prompt", is_fallback: true },
          ],
        },
      });
    });
    await page.goto("/studio/today");
    await page.getByRole("button", { name: "Replace prompt" }).click();
    await expect(
      page.getByRole("heading", { name: "Replace prompt" })
    ).toBeVisible();
  });

  test("Edit opens dialog with prompt text", async ({ page }) => {
    await page.goto("/studio/today");
    await page.getByRole("button", { name: "Edit" }).click();
    await expect(
      page.getByRole("heading", { name: "Edit prompt" })
    ).toBeVisible();
    await expect(
      page.getByPlaceholder("Prompt text")
    ).toHaveValue("What idea from yesterday wants to be extended?");
  });
});

test.describe("Entries page: Add branch / Add mystery", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/api/auth/me", (route) =>
      route.fulfill({ json: { user: MOCK_USER } })
    );
    await page.route("**/api/entries**", (route) => {
      const url = route.request().url();
      if (url.endsWith("/entries") && route.request().method() === "GET") {
        return route.fulfill({
          json: { entries: [MOCK_ENTRY] },
        });
      }
      if (url.includes("/entries/") && !url.includes("/today")) {
        return route.fulfill({ json: { entry: MOCK_ENTRY } });
      }
      return route.continue();
    });
    await page.route("**/api/branches", (route) =>
      route.fulfill({ json: { branches: [] } })
    );
    await page.route("**/api/mysteries", (route) =>
      route.fulfill({ json: { mysteries: [] } })
    );
  });

  test("shows Add branch when an entry is selected", async ({ page }) => {
    await page.goto("/studio/entries?id=1");
    await expect(page.getByRole("heading", { name: "Entries" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Add branch" })).toBeVisible();
  });

  test("shows Add mystery when an entry is selected", async ({ page }) => {
    await page.goto("/studio/entries?id=1");
    await expect(page.getByRole("heading", { name: "Entries" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Add mystery" })).toBeVisible();
  });
});
