import type { SignUpWithPasswordCredentials } from "@supabase/supabase-js";

export function getEmailSignupCredentials(
  email: string,
  password: string,
  emailRedirectTo: string,
): SignUpWithPasswordCredentials {
  return { email, password, options: { emailRedirectTo } };
}