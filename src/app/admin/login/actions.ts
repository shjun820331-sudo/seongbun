"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE, getSessionToken } from "@/lib/auth";

export interface LoginState {
  error?: string;
}

export async function login(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");

  const expectedPassword = process.env.ADMIN_PASSWORD;
  const token = await getSessionToken();

  if (!expectedPassword || !token) {
    return {
      error:
        "관리자 비밀번호가 설정되지 않았어요. ADMIN_PASSWORD, ADMIN_SESSION_SECRET 환경변수를 확인해주세요.",
    };
  }

  if (password !== expectedPassword) {
    return { error: "비밀번호가 올바르지 않아요." };
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
  redirect("/admin/login");
}
