import { apiRequest } from "./client";
import type { AuthResponse, LoginPayload, RegisterPayload } from "@/types/auth";

export interface UserProfile {
  id: number | string;
  name: string;
  email: string;
  phone: string | null;
  posted_by: "Owner" | "Dealer" | "Builder" | null;
  builder_name: string | null;
  created_at: string;
}

export const authApi = {
  register(payload: RegisterPayload) {
    return apiRequest<AuthResponse>("/auth/register", { method: "POST", body: JSON.stringify(payload) });
  },
  login(payload: LoginPayload) {
    return apiRequest<AuthResponse>("/auth/login", { method: "POST", body: JSON.stringify(payload) });
  },
  refresh() {
    return apiRequest<AuthResponse>("/auth/refresh", { method: "POST" });
  },
  logout() {
    return apiRequest<{ message: string }>("/auth/logout", { method: "POST" });
  },
  getMe() {
    return apiRequest<{ user: UserProfile }>("/auth/me", { method: "GET" });
  },
  updateMe(payload: { phone?: string | null; posted_by?: string | null; builder_name?: string | null }) {
    return apiRequest<{ user: UserProfile }>("/auth/me", { method: "PATCH", body: JSON.stringify(payload) });
  },
};
