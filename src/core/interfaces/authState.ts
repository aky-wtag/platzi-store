import type { User } from "./user";

export interface AuthState {
  token: string | null;
  user: User | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: string | null;
}
