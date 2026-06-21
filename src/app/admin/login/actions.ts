"use server";

import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";

export type LoginState = { error?: string } | undefined;

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const callbackUrl = (formData.get("callbackUrl") as string) || "/admin";
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: callbackUrl,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid email or password." };
    }
    throw error; // re-throw the redirect signal
  }
  return undefined;
}
