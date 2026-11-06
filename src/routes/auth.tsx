import { createFileRoute, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Eye, EyeOff, Wallet } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { getEmailSignupCredentials } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in or create an account | Nawazi Labs" },
      { name: "description", content: "Sign in or create a Nawazi Labs account to continue to payments." },
      { property: "og:title", content: "Sign in or create an account | Nawazi Labs" },
      { property: "og:description", content: "Sign in or create a Nawazi Labs account to continue to payments." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

type Mode = "signin" | "signup" | "forgot";

function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ text: string; kind: "error" | "success" } | null>(null);

  function changeMode(nextMode: Mode) {
    setMode(nextMode);
    setMessage(null);
    setShowPassword(false);
  }

  async function handleSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    setBusy(true);
    setMessage(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      await router.navigate({ to: "/" });
    } catch (error) {
      setMessage({ text: getAuthError(error, "sign in"), kind: "error" });
    } finally {
      setBusy(false);
    }
  }

  async function handleSignUp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    setBusy(true);
    setMessage(null);
    try {
      const { data, error } = await supabase.auth.signUp(
        getEmailSignupCredentials(email, password, window.location.origin),
      );
      if (error) throw error;
      if (data.session) {
        await router.navigate({ to: "/" });
      } else {
        setMessage({ text: "Check your email to confirm your account, then come back to sign in.", kind: "success" });
      }
    } catch (error) {
      setMessage({ text: getAuthError(error, "create your account"), kind: "error" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-wrap">
        <div className="auth-brand" aria-label="Nawazi Labs">
          <span className="auth-brand-mark"><Wallet aria-hidden="true" /></span>
          <span className="auth-brand-name"><strong>Nawazi Labs</strong><span>Your everyday payments</span></span>
        </div>
        <section className="auth-panel">
          {mode === "forgot" ? (
            <ForgotPasswordForm
              busy={busy}
              message={message}
              onBack={() => changeMode("signin")}
              onSubmit={async (email) => {
                setBusy(true);
                setMessage(null);
                try {
                  const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${window.location.origin}/reset-password`,
                  });
                  if (error) throw error;
                  setMessage({ text: "If an account exists for that email, a password reset link is on its way.", kind: "success" });
                } catch (error) {
                  setMessage({ text: getAuthError(error, "send a reset link"), kind: "error" });
                } finally {
                  setBusy(false);
                }
              }}
            />
          ) : (
            <>
              <h1>{mode === "signup" ? "Create your account" : "Welcome back"}</h1>
              <p className="auth-intro">
                {mode === "signup" ? "Start with your email and a secure password." : "Sign in to continue to your payments."}
              </p>
              <form className="auth-form" onSubmit={mode === "signup" ? handleSignUp : handleSignIn}>
                {mode === "signup" ? (
                  <label className="auth-field">
                    Name
                    <input name="name" type="text" autoComplete="name" placeholder="Your name" required />
                  </label>
                ) : null}
                <label className="auth-field">
                  Email address
                  <input name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
                </label>
                <label className="auth-field">
                  Password
                  <span className="auth-password-wrap">
                    <input name="password" type={showPassword ? "text" : "password"} autoComplete={mode === "signup" ? "new-password" : "current-password"} minLength={6} required />
                    <Button
                      className="auth-password-toggle"
                      variant="ghost"
                      size="icon"
                      type="button"
                      title={showPassword ? "Hide password" : "Show password"}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowPassword((visible) => !visible)}
                    >
                      {showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
                    </Button>
                  </span>
                </label>
                {mode === "signin" ? (
                  <div className="auth-help-row">
                    <Button type="button" variant="link" onClick={() => changeMode("forgot")}>Forgot password?</Button>
                  </div>
                ) : null}
                <Button className="auth-submit" type="submit" disabled={busy}>
                  {busy ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
                </Button>
              </form>
              {message ? <p className="auth-message" data-kind={message.kind} role={message.kind === "error" ? "alert" : "status"}>{message.text}</p> : null}
              <p className="auth-switch">
                {mode === "signup" ? "Already have an account?" : "Don't have an account?"}
                <Button type="button" variant="link" onClick={() => changeMode(mode === "signup" ? "signin" : "signup")}>
                  {mode === "signup" ? "Sign in" : "Sign up"}
                </Button>
              </p>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

function ForgotPasswordForm({
  busy,
  message,
  onBack,
  onSubmit,
}: {
  busy: boolean;
  message: { text: string; kind: "error" | "success" } | null;
  onBack: () => void;
  onSubmit: (email: string) => Promise<void>;
}) {
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await onSubmit(String(form.get("email") ?? "").trim());
  }

  return (
    <>
      <Button className="auth-back" type="button" variant="ghost" onClick={onBack}><ArrowLeft aria-hidden="true" /> Back to sign in</Button>
      <h1>Reset your password</h1>
      <p className="auth-intro">Enter your email and we’ll send you a link to choose a new password.</p>
      <form className="auth-form" onSubmit={submit}>
        <label className="auth-field">
          Email address
          <input name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
        </label>
        <Button className="auth-submit" type="submit" disabled={busy}>{busy ? "Sending…" : "Send reset link"}</Button>
      </form>
      {message ? <p className="auth-message" data-kind={message.kind} role={message.kind === "error" ? "alert" : "status"}>{message.text}</p> : null}
    </>
  );
}

function getAuthError(error: unknown, action: string) {
  const message = error instanceof Error ? error.message : "";
  if (message.toLowerCase().includes("invalid login credentials")) return "That email and password don’t match. Please try again.";
  if (message.toLowerCase().includes("already registered")) return "An account already exists for this email. Try signing in instead.";
  return message || `We couldn’t ${action}. Please try again.`;
}