import { defineConfig, devices } from "@playwright/test";

/**
 * Wrench — Config do Playwright (testes E2E).
 *
 * Pré-requisitos: backend rodando (:5012) + frontend rodando (:3000).
 * Os testes assumem que o seed já populou o banco.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false, // sequencial — compartilham estado de auth
  retries: 0,
  reporter: [["html", { open: "never" }], ["list"]],
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
