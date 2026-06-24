import { appConfig } from "@/shared/config/env";
import { getAccessToken } from "@/shared/auth/supabaseClient";

export type ApiRequestOptions = {
  path: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  authenticated?: boolean;
  headers?: HeadersInit;
};

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly payload?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export type ApiDataResponse<TData> = {
  data: TData;
};

export type ApiPage = {
  limit: number;
  offset: number;
  total?: number;
  nextOffset: number | null;
  hasNextPage: boolean;
};

export type ApiPaginatedResponse<TData> = {
  data: TData[];
  page: ApiPage;
};

export async function apiRequest<TResponse>({
  authenticated = true,
  body,
  headers,
  method = "GET",
  path,
}: ApiRequestOptions): Promise<TResponse> {
  const requestHeaders = new Headers(headers);

  if (body !== undefined && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  if (authenticated) {
    const token = await getAccessToken();

    if (token) {
      requestHeaders.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(`${appConfig.apiBaseUrl}${path}`, {
    body: body === undefined ? undefined : JSON.stringify(body),
    headers: requestHeaders,
    method,
  });

  const contentType = response.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json") ? await response.json() : await response.text();

  if (!response.ok) {
    throw new ApiError(`API request failed with status ${response.status}`, response.status, payload);
  }

  return payload as TResponse;
}

export async function getAuthMethods() {
  return apiRequest<{
    methods: string[];
    emailVerificationRequired: boolean;
    approvalRequiredForSignup: boolean;
    inviteRequiresPasswordSetup: boolean;
    passwordRecoveryEnabled: boolean;
  }>({
    authenticated: false,
    path: "/auth/methods",
  });
}

export async function requestPasswordRecovery(email: string) {
  return apiRequest<{
    status: string;
    message: string;
  }>({
    authenticated: false,
    body: { email },
    method: "POST",
    path: "/auth/password-recovery",
  });
}
