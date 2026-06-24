const fallbackApiBaseUrl = "/api";

export const appConfig = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? fallbackApiBaseUrl,
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL ?? "",
  supabasePublishableKey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? "",
  environment: import.meta.env.VITE_EXTENSION_ENVIRONMENT ?? "local",
};
