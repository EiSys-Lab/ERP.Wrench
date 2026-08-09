import { test, expect } from "@playwright/test";

/**
 * E2E: Catálogo — ver lista de Peças e Serviços.
 *
 * Pré-requisito: logado + API com seed (16 peças, 8 serviços).
 */
test.describe("Catálogo", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[type="email"]', "admin@wrench.com.br");
    await page.fill('input[type="password"]', "Admin@123");
    await page.click('button[type="submit"]');
    await page.waitForURL("**/workspace", { timeout: 10_000 });
  });

  test("lista de pecas carrega dados do banco", async ({ page }) => {
    await page.goto("/catalogo/pecas");

    // Aguarda tabela carregar (skeleton → dados)
    await page.waitForTimeout(2000);

    // Pelo menos uma peça do seed visível (H4 ou outra)
    const tabela = page.locator("table");
    await expect(tabela).toBeVisible({ timeout: 10_000 });

    // Código de alguma peça aparece (ex: H4-12 ou PING-24)
    const celulas = page.locator("table td");
    await expect(celulas.first()).toBeVisible({ timeout: 10_000 });
  });

  test("lista de servicos carrega dados do banco", async ({ page }) => {
    await page.goto("/catalogo/servicos");

    await page.waitForTimeout(2000);

    const tabela = page.locator("table");
    await expect(tabela).toBeVisible({ timeout: 10_000 });
  });

  test("pagina de clientes carrega", async ({ page }) => {
    await page.goto("/clientes");

    await page.waitForTimeout(2000);

    // KPI "Clientes" visível
    await expect(page.getByText("Clientes").first()).toBeVisible({ timeout: 10_000 });
  });
});
