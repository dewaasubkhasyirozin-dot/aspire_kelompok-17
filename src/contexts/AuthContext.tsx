"use client";

// ============================================================
// AUTH CONTEXT — LANGKAH.ID
// ============================================================

import React, { createContext, useContext, useEffect, useReducer, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";
import type { Profile } from "@/types";
import type { Session, User } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

type AuthAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_SESSION"; payload: { user: User; session: Session } | null }
  | { type: "SET_PROFILE"; payload: Profile | null }
  | { type: "CLEAR" };

const initialState: AuthState = {
  user: null,
  profile: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_SESSION":
      if (action.payload === null) {
        return { ...state, user: null, session: null, isAuthenticated: false, isLoading: false };
      }
      return {
        ...state,
        user: action.payload.user,
        session: action.payload.session,
        isAuthenticated: true,
        isLoading: false,
      };
    case "SET_PROFILE":
      return { ...state, profile: action.payload };
    case "CLEAR":
      return { ...initialState, isLoading: false };
    default:
      return state;
  }
}

interface AuthContextType extends AuthState {
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const router = useRouter();
  const supabase = createClient();

  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    dispatch({ type: "SET_PROFILE", payload: data as Profile | null });
  }, [supabase]);

  const refreshProfile = useCallback(async () => {
    if (state.user) await fetchProfile(state.user.id);
  }, [state.user, fetchProfile]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    dispatch({ type: "CLEAR" });
    router.push("/");
    router.refresh();
  }, [supabase, router]);

  useEffect(() => {
    dispatch({ type: "SET_LOADING", payload: true });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        dispatch({ type: "SET_SESSION", payload: { user: session.user, session } });
        fetchProfile(session.user.id);
      } else {
        dispatch({ type: "SET_SESSION", payload: null });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        dispatch({ type: "SET_SESSION", payload: { user: session.user, session } });
        fetchProfile(session.user.id);
      } else {
        dispatch({ type: "SET_SESSION", payload: null });
      }
    });

    return () => { subscription.unsubscribe(); };
  }, [supabase, fetchProfile]);

  return (
    <AuthContext.Provider value={{ ...state, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext harus digunakan di dalam AuthProvider");
  }
  return context;
}