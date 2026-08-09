/**
 * Wrench — Tipos de Auth (batem com LoginResponse do backend C#).
 * JSON camelCase sempre.
 */

export type AuthUser = {
  userId: string;
  email: string;
  nome: string;
  tenantId: string;
};

export type LoginResponse = {
  token: string;
  expiresAt: string;
  user: AuthUser;
};

export type LoginRequest = {
  email: string;
  password: string;
};
