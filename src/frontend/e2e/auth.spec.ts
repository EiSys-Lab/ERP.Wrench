import { test, expect } from "@playwright/test";

/**
 * E2E: Login — caminho crítico de autenticação.
 *
 * Pré-requisito: API rodando em :5012 com seed (admin@wrench.com.br).
 * Este teste faz login real (HTTP), recebe JWT, e valida redirect.
 */
test.describe("Login", () => {
  test("login com credenciais validas redireciona para workspace", async ({ page }) => {
    // Arrange + Act
    await page.goto("/login");

    await page.fill('input[type="email"]', "admin@wrench.com.br");
    await page.fill('input[type="password"]', "Admin@123");
    await page.click('button[type="submit"]');

    // Assert — redireciona para /workspace
    await page.waitForURL("**/workspace", { timeout: 10_000 });
    await expect(page).toHaveURL(/\/workspace/);

    // Sidebar visível (módulos)
    await expect(page.getByText("Workspace")).toBeVisible();
  });

  test("login com senha invalida mostra erro", async ({ page }) => {
    await page.goto("/login");

    await page.fill('input[type="email"]', "admin@wrench.com.br");
    await page.fill('input[type="password"]', "senha-errada");
    await page.click('button[type="submit"]');

    // Aguarda toast de erro
    await expect(page.locator("[data-sonner-toast]")).toBeVisible({ timeout: 5_000 });

    // Continua na página de login
    await expect(page).toHaveURL(/\/login/);
  });
});
