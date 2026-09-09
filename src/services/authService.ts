import { supabase } from "../lib/supabase";
import { UserProfile } from "../types/database";
import type { User, Session, AuthChangeEvent } from "@supabase/supabase-js";

export async function signUpUser(email: string, password: string, fullName: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        name: fullName,
      },
    },
  });

  if (error) {
    throw error;
  }

  // Try creating profile record if profiles table exists
  if (data.user) {
    try {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        email: data.user.email,
        full_name: fullName,
        updated_at: new Date().toISOString(),
      });
    } catch {
      // Non-blocking if profiles table hasn't been created in Supabase yet
    }
  }

  return data;
}

export async function signInUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function signOutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.warn("SignOut error:", error.message);
  }
}

export async function getSession(): Promise<Session | null> {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  } catch (err) {
    console.error("Error getting auth session:", err);
    return null;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data } = await supabase.auth.getUser();
    return data.user;
  } catch (err) {
    console.error("Error getting auth user:", err);
    return null;
  }
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (!error && data) {
      return data as UserProfile;
    }
  } catch {
    // If profiles table not ready yet
  }

  // Fallback to user metadata
  const user = await getCurrentUser();
  if (user && user.id === userId) {
    return {
      id: user.id,
      email: user.email || "",
      full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0],
    };
  }

  return null;
}

export function onAuthStateChange(
  callback: (event: AuthChangeEvent, session: Session | null) => void
) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
  return subscription;
}
