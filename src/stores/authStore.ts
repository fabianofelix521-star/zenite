import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import type { User, Session } from "@supabase/supabase-js";

interface AuthStore {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  initialize: () => Promise<void>;
  signInWithEmail: (
    email: string,
    password: string,
  ) => Promise<{ error: string | null }>;
  signUpWithEmail: (
    email: string,
    password: string,
    name?: string,
  ) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const ADMIN_EMAIL = "fabianofelix521@gmail.com";

export const useAuthStore = create<AuthStore>()((set, get) => ({
  user: null,
  session: null,
  loading: true,
  isAdmin: false,

  initialize: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    set({
      user: session?.user ?? null,
      session,
      isAdmin: session?.user?.email === ADMIN_EMAIL,
      loading: false,
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      set({
        user: session?.user ?? null,
        session,
        isAdmin: session?.user?.email === ADMIN_EMAIL,
      });
    });
  },

  signInWithEmail: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return { error: error.message };
    return { error: null };
  },

  signUpWithEmail: async (email, password, name) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    if (error) return { error: error.message };
    return { error: null };
  },

  signInWithGoogle: async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}`,
      },
    });
    if (error) return { error: error.message };
    return { error: null };
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null, isAdmin: false });
  },
}));
