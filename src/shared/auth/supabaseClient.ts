import { createClient } from "@supabase/supabase-js";

import { appConfig } from "@/shared/config/env";

export const isSupabaseConfigured =
  appConfig.supabaseUrl.length > 0 && appConfig.supabasePublishableKey.length > 0;

export const supabase = isSupabaseConfigured
  ? createClient(appConfig.supabaseUrl, appConfig.supabasePublishableKey, {
      auth: {
        detectSessionInUrl: true,
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

export async function getAccessToken() {
  if (!supabase) {
    return null;
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session?.access_token ?? null;
}
