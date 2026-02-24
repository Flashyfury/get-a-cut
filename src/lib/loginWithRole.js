import { supabase } from "./supabase";

/**
 * Login user and return role + user
 */
export async function loginWithRole(email, password) {
  // 1️⃣ login
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  const user = data.user;

  // 2️⃣ get role from profiles table
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError) throw profileError;

  return {
    user,
    role: profile.role, // "customer" or "owner"
  };
}
