"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_SESSION_COOKIE,
  signAdminSession,
  validateAdminCredentials,
} from "@/lib/admin-auth";
import { tServer } from "@/lib/i18n/server";

export type LoginState = {
  ok: boolean;
  message: string;
};

export async function loginAdmin(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const t = await tServer();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { ok: false, message: t.messages.enterCredentials };
  }

  if (!validateAdminCredentials(email, password)) {
    return { ok: false, message: t.messages.invalidCredentials };
  }

  const jar = await cookies();
  jar.set(ADMIN_SESSION_COOKIE, signAdminSession(email), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/admin");
}

export async function logoutAdmin() {
  const jar = await cookies();
  jar.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  redirect("/admin/login");
}
