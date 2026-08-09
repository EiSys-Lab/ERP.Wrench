/**
 * Wrench — Auth API.
 * Chama o endpoint real do backend .NET.
 */
import { apiPost } from "@/lib/api-client";
import type { LoginRequest, LoginResponse } from "./types";

export async function login(req: LoginRequest): Promise<LoginResponse> {
  return apiPost<LoginRequest, LoginResponse>("/api/identity/login", req);
}
