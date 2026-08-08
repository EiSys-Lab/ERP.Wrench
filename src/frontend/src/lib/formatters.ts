/**
 * Wrench — Formatadores pt-BR.
 * Todos os valores monetários devem usar `brl` + classe `.tabular` no elemento.
 */

/** Formata valor como moeda BRL: 1280 → "R$ 1.280,00". */
export function brl(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

/** Compacto: 1280 → "R$ 1,3k", 1250000 → "R$ 1,3M". */
export function compactBrl(value: number): string {
  const formatted = new Intl.NumberFormat("pt-BR", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
  return `R$ ${formatted}`;
}

/** Número inteiro com separador de milhar: 1280 → "1.280". */
export function num(value: number): string {
  return new Intl.NumberFormat("pt-BR").format(value);
}

/** Compacto: 1280 → "1,3k". */
export function compactNum(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

/** Percentual: 0.12 → "12%", ou com casas 0.1234 → "12,3%". */
export function pct(value: number, fractionDigits = 0): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "percent",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

/** Extrai só dígitos de uma string. */
export function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

/** Placa: "rfx0h93" → "RFX0H93" (Mercosul antigo). */
export function formatPlaca(value: string): string {
  const cleaned = onlyDigits(value).length ? value : value;
  return cleaned.toUpperCase().replace(/([A-Z]{3})(\d{1}[A-Z]\d{2})/, "$1-$2");
}

/** CNPJ: "35371875000184" → "35.371.875/0001-84". */
export function formatCnpj(value: string): string {
  const d = onlyDigits(value).padStart(14, "0").slice(0, 14);
  return d.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
}

/** CPF: "12345678901" → "123.456.789-01". */
export function formatCpf(value: string): string {
  const d = onlyDigits(value).slice(0, 11);
  return d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

/** Documento auto: CPF se 11 dígitos, CNPJ se 14. */
export function formatDocumento(value: string): string {
  const d = onlyDigits(value);
  if (d.length <= 11) return formatCpf(d);
  return formatCnpj(d);
}

/** CEP: "88001000" → "88001-000". */
export function formatCep(value: string): string {
  const d = onlyDigits(value).slice(0, 8);
  return d.replace(/(\d{5})(\d{3})/, "$1-$2");
}

/** Telefone: 10 dígitos → "(48) 3224-1000", 11 → "(48) 98828-9083". */
export function formatPhone(value: string): string {
  const d = onlyDigits(value).slice(0, 11);
  if (d.length === 11) return d.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  if (d.length === 10) return d.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  return value;
}

/** Data ISO → "08/08/2026". */
export function formatDate(iso: string | Date): string {
  const date = typeof iso === "string" ? new Date(iso) : iso;
  return new Intl.DateTimeFormat("pt-BR").format(date);
}

/** Data ISO → "08/08/2026 14:30". */
export function formatDateTime(iso: string | Date): string {
  const date = typeof iso === "string" ? new Date(iso) : iso;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
