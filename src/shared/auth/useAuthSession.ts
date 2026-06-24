import type { Session, User } from "@supabase/supabase-js";
import { useEffect, useMemo, useState } from "react";

import { isSupabaseConfigured, supabase } from "@/shared/auth/supabaseClient";
import { appConfig, isDeveloperAuthBypassEnabled } from "@/shared/config/env";

export type DeveloperBypassUser = {
  id: string;
  email: string;
  user_metadata: {
    name: string;
  };
  app_metadata: {
    provider: "developer-bypass";
  };
};

export type AuthSessionUser = User | DeveloperBypassUser;

export type AuthViewState = {
  isConfigured: boolean;
  isDeveloperBypass: boolean;
  isLoading: boolean;
  session: Session | null;
  user: AuthSessionUser | null;
};

export function useAuthSession(): AuthViewState {
  const developerBypassUser: DeveloperBypassUser | null = useMemo(
    () =>
      isDeveloperAuthBypassEnabled
        ? {
            id: "developer-bypass",
            email: appConfig.devAuthBypassEmail,
            user_metadata: {
              name: appConfig.devAuthBypassName,
            },
            app_metadata: {
              provider: "developer-bypass",
            },
          }
        : null,
    [],
  );

  const [state, setState] = useState<AuthViewState>({
    isConfigured: isSupabaseConfigured || isDeveloperAuthBypassEnabled,
    isDeveloperBypass: isDeveloperAuthBypassEnabled,
    isLoading: isSupabaseConfigured && !isDeveloperAuthBypassEnabled,
    session: null,
    user: developerBypassUser,
  });

  useEffect(() => {
    if (developerBypassUser) {
      setState({
        isConfigured: true,
        isDeveloperBypass: true,
        isLoading: false,
        session: null,
        user: developerBypassUser,
      });
      return;
    }

    if (!supabase) {
      return;
    }

    let isMounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) {
        return;
      }

      setState({
        isConfigured: true,
        isDeveloperBypass: false,
        isLoading: false,
        session: data.session,
        user: data.session?.user ?? null,
      });
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setState({
        isConfigured: true,
        isDeveloperBypass: false,
        isLoading: false,
        session,
        user: session?.user ?? null,
      });
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [developerBypassUser]);

  return state;
}
