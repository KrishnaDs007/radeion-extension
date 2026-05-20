const fallbackApiBaseUrl = "https://api.example.com";

export const appConfig = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? fallbackApiBaseUrl,
  environment: import.meta.env.VITE_EXTENSION_ENVIRONMENT ?? "local",
};
