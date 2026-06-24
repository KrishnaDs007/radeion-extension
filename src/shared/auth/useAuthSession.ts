import type { Session, User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

import { isSupabaseConfigured, supabase } from "@/shared/auth/supabaseClient";

export type AuthViewState = {
  isConfigured: boolean;
  isLoading: boolean;
  session: Session | null;
  user: User | null;
};

export function useAuthSession(): AuthViewState {
  const [state, setState] = useState<AuthViewState>({
    isConfigured: isSupabaseConfigured,
    isLoading: isSupabaseConfigured,
    session: null,
    user: null,
  });

  useEffect(() => {
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
        isLoading: false,
        session,
        user: session?.user ?? null,
      });
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return state;
}
