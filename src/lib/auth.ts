import { supabase } from "@/integrations/supabase/client";

export async function signUp(username: string, password: string) {
  const email = `${username.toLowerCase()}@scatywend.app`;
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;

  if (data.user) {
    const { error: profileError } = await supabase.from("profiles").insert({
      id: data.user.id,
      username: username.toLowerCase(),
      display_name: username,
    });
    if (profileError) throw profileError;
  }

  return data;
}

export async function signIn(username: string, password: string) {
  const email = `${username.toLowerCase()}@scatywend.app`;
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function deleteAccount() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  
  // Delete profile (cascades to posts, follows, etc.)
  const { error } = await supabase.from("profiles").delete().eq("id", user.id);
  if (error) throw error;
  
  await supabase.auth.signOut();
}
