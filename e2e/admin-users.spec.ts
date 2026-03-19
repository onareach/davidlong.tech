import { test, expect } from "@playwright/test";

const ADMIN_USER = {
  id: 1,
  email: "onareach@yahoo.com",
  display_name: "Owner",
  is_admin: true,
  is_active: true,
};

test.describe("Studio admin users table", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/api/auth/me", (route) =>
      route.fulfill({ json: { user: ADMIN_USER } })
    );
    await page.route("**/api/admin/users", (route) =>
      route.fulfill({
        json: {
          users: [
            ADMIN_USER,
            {
              id: 2,
              email: "member@example.com",
              display_name: "Member",
              is_admin: false,
              is_active: true,
            },
            {
              id: 3,
              email: "inactive@example.com",
              display_name: null,
              is_admin: false,
              is_active: false,
            },
          ],
        },
      })
    );
  });

  test("shows Admin and Active Yes/No values", async ({ page }) => {
    await page.goto("/studio/admin");
    await expect(page.getByRole("columnheader", { name: "Admin" })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "Active" })).toBeVisible();

    const adminRow = page.locator("tr", { hasText: "onareach@yahoo.com" });
    await expect(adminRow).toContainText("Yes");
    await expect(adminRow.getByRole("button", { name: "Inactivate" })).toBeDisabled();

    const memberRow = page.locator("tr", { hasText: "member@example.com" });
    await expect(memberRow).toContainText("No");
    await expect(memberRow).toContainText("Yes");

    const inactiveRow = page.locator("tr", { hasText: "inactive@example.com" });
    await expect(inactiveRow).toContainText("No");
    await expect(inactiveRow).toContainText("No");
    await expect(inactiveRow.getByRole("button", { name: "Activate" })).toBeVisible();
  });
});
