import { appConfig } from "@/shared/config/env";

export type ApiRequestOptions = {
  path: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
};

export async function apiRequest<TResponse>(_options: ApiRequestOptions): Promise<TResponse> {
  throw new Error(
    `Backend API integration is intentionally not implemented yet. Configure ${appConfig.apiBaseUrl} when backend work begins.`,
  );
}
