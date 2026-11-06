import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Check, Wallet } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Choose a new password | Nawazi Labs" },
      { name: "description", content: "Set a new password for your Nawazi Labs account." },
      { property: "og:title", content: "Choose a new password | Nawazi Labs" },
      { property: "og:description", content: "Set a new password for your Nawazi Labs account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const router = useRouter();
  const [isRecovery, setIsRecovery] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ text: string; kind: "error" | "success" } | null>(null);

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    setIsRecovery(hash.get("type") === "recovery");
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") ?? "");
    const confirmPassword = String(form.get("confirmPassword") ?? "");
    if (password !== confirmPassword) {
      setMessage({ text: "Those passwords don’t match. Please try again.", kind: "error" });
      return;
    }

    setBusy(true);
    setMessage(null);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) {
      setMessage({ text: error.message || "We couldn’t update your password. Request a new reset link and try again.", kind: "error" });
      return;
    }
    setMessage({ text: "Your password has been updated. You can now sign in with it.", kind: "success" });
  }

  return (
    <main className="auth-page">
      <div className="auth-wrap">
        <div className="auth-brand" aria-label="Nawazi Labs">
          <span className="auth-brand-mark"><Wallet aria-hidden="true" /></span>
          <span className="auth-brand-name"><strong>Nawazi Labs</strong><span>Your everyday payments</span></span>
        </div>
        <section className="auth-panel">
          {message?.kind === "success" ? (
            <div className="auth-confirm-mark"><Check aria-hidden="true" /></div>
          ) : null}
          <h1>Choose a new password</h1>
          <p className="auth-intro">Set a new password for your account.</p>
          {isRecovery ? (
            <form className="auth-form" onSubmit={handleSubmit}>
              <label className="auth-field">
                New password
                <input name="password" type="password" autoComplete="new-password" minLength={6} required />
              </label>
              <label className="auth-field">
                Confirm new password
                <input name="confirmPassword" type="password" autoComplete="new-password" minLength={6} required />
              </label>
              <Button className="auth-submit" type="submit" disabled={busy}>{busy ? "Updating…" : "Update password"}</Button>
            </form>
          ) : (
            <p className="auth-message" role="status">This reset link is missing or has expired. Request a new one from the sign-in page.</p>
          )}
          {message ? <p className="auth-message" data-kind={message.kind} role={message.kind === "error" ? "alert" : "status"}>{message.text}</p> : null}
          <p className="auth-switch">
            <Button type="button" variant="link" onClick={() => router.navigate({ to: "/auth" })}>Back to sign in</Button>
          </p>
        </section>
      </div>
    </main>
  );
}