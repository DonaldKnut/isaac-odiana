"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { loginAdmin, type LoginState } from "@/app/actions/admin-auth";
import { useLocale } from "@/components/locale-provider";
import { useActionToast } from "@/components/toast-provider";
import { UiButton } from "@/components/ui-button";

const initial: LoginState = { ok: false, message: "" };

export function AdminLoginForm() {
  const [state, action, pending] = useActionState(loginAdmin, initial);
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useLocale();
  useActionToast(state, "Signed in", "Sign in failed");

  return (
    <form action={action} className="mt-8 space-y-5 min-[360px]:mt-10 min-[360px]:space-y-6">
      <label className="block">
        <span className="text-[0.65rem] uppercase tracking-[0.22em] text-smoke">
          {t.auth.email}
        </span>
        <input
          type="email"
          name="email"
          required
          autoComplete="username"
          inputMode="email"
          placeholder="admin@isaacodiana.com"
          className="mt-2 w-full min-w-0 border-b border-line bg-transparent py-3 text-base text-parchment outline-none transition placeholder:text-smoke/40 focus:border-amber min-[360px]:text-[1rem]"
        />
      </label>

      <label className="block">
        <span className="text-[0.65rem] uppercase tracking-[0.22em] text-smoke">
          {t.auth.password}
        </span>
        <div className="relative mt-2">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            className="w-full min-w-0 border-b border-line bg-transparent py-3 pr-12 text-base text-parchment outline-none transition placeholder:text-smoke/40 focus:border-amber min-[360px]:pr-16"
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute right-0 top-1/2 inline-flex -translate-y-1/2 cursor-pointer items-center gap-1 text-[0.65rem] uppercase tracking-[0.16em] text-smoke transition hover:text-amber-bright"
            aria-label={showPassword ? t.auth.hide : t.auth.show}
          >
            {showPassword ? (
              <EyeOff className="h-3.5 w-3.5" />
            ) : (
              <Eye className="h-3.5 w-3.5" />
            )}
            <span className="hidden min-[360px]:inline">
              {showPassword ? t.auth.hide : t.auth.show}
            </span>
          </button>
        </div>
      </label>

      <UiButton
        type="submit"
        tone="primary"
        className="mt-4 w-full"
        loading={pending}
        icon={LogIn}
      >
        {pending ? t.auth.submitting : t.auth.submit}
      </UiButton>
    </form>
  );
}
