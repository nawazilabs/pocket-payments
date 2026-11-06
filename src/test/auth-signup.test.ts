import { describe, expect, it } from "vitest";
import { getEmailSignupCredentials } from "@/lib/auth";

describe("email signup credentials", () => {
  it("sends only the email, password, and confirmation redirect (not the temporary name)", () => {
    const credentials = getEmailSignupCredentials("person@example.com", "safe-pass-123", "https://nawazi.example");

    expect(credentials).toEqual({
      email: "person@example.com",
      password: "safe-pass-123",
      options: { emailRedirectTo: "https://nawazi.example" },
    });
  });
});