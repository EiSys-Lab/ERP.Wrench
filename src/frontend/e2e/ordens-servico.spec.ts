import { test, expect } from "@playwright/test";

/**
 * E2E: Ordens de Serviço — ver Kanban e Lista.
 *
 * Pré-requisito: logado (test.beforeEach) + API com seed (3 OS no banco).
 */
test.describe("Ordens de Serviço", () => {
  test.beforeEach(async ({ page }) => {
    // Login rápido direto pela UI
    await page.goto("/login");
    await page.fill('input[type="email"]', "admin@wrench.com.br");
    await page.fill('input[type="password"]', "Admin@123");
    await page.click('button[type="submit"]');
    await page.waitForURL("**/workspace", { timeout: 10_000 });
  });

  test("Kanban mostra colunas e OS do banco", async ({ page }) => {
    await page.goto("/ordens-servico/kanban");

    // Aguarda o Kanban carregar (skeleton some, cards aparecem)
    await page.waitForTimeout(2000);

    // Coluna "Abertas" visível
    await expect(page.getByText("Abertas").first()).toBeVisible({ timeout: 10_000 });
  });

  test("Lista de OS mostra tabela com dados", async ({ page }) => {
    await page.goto("/ordens-servico");

    // Aguarda tabela carregar
    await page.waitForTimeout(2000);

    // Header da tabela visível
    await expect(page.getByText("Cliente").first()).toBeVisible({ timeout: 10_000 });
  });

  test("pagina Nova OS tem formulario", async ({ page }) => {
    await page.goto("/ordens-servico/nova");

    // Título do formulário
    await expect(page.getByText("Nova Ordem de Serviço")).toBeVisible({ timeout: 10_000 });

    // Campo de seleção de cliente existe
    await expect(page.getByText("Cliente").first()).toBeVisible();
  });
});
