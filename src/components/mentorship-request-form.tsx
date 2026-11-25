"use client";

import { useState, useTransition } from "react";
import { z } from "zod";
import { Send } from "lucide-react";
import {
  submitMentorshipRequest,
  type TutoringActionState,
} from "@/app/actions/tutoring";
import { useLocale } from "@/components/locale-provider";
import { emailSchema, firstZodError, nameSchema } from "@/lib/validation";
import { cn } from "@/lib/utils";

const initial: TutoringActionState = { ok: false, message: "" };

type FieldErrors = Partial<
  Record<"name" | "email" | "topic" | "preferredTimes" | "message", string>
>;

export function MentorshipRequestForm({
  className,
  onSuccessClose,
  compact,
}: {
  className?: string;
  onSuccessClose?: () => void;
  compact?: boolean;
}) {
  const { t, locale } = useLocale();
  const [state, setState] = useState(initial);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [pending, startTransition] = useTransition();

  const schema = z.object({
    name: nameSchema(locale),
    email: emailSchema(locale),
    topic: z.string().trim().max(120).optional(),
    preferredTimes: z
      .string()
      .trim()
      .min(2, t.validation.preferredTimes)
      .max(240),
    message: z
      .string()
      .trim()
      .min(10, t.validation.tellMore)
      .max(1200),
  });

  function validate(formData: FormData) {
    const parsed = schema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      topic: String(formData.get("topic") ?? "") || undefined,
      preferredTimes: formData.get("preferredTimes"),
      message: formData.get("message"),
    });

    if (parsed.success) {
      setFieldErrors({});
      return true;
    }

    const next: FieldErrors = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (
        key === "name" ||
        key === "email" ||
        key === "topic" ||
        key === "preferredTimes" ||
        key === "message"
      ) {
        if (!next[key]) next[key] = issue.message;
      }
    }
    setFieldErrors(next);
    setState({
      ok: false,
      message: firstZodError(parsed.error, locale),
    });
    return false;
  }

  return state.ok ? (
    <div className={cn(compact ? "mt-6" : "mt-8", className)}>
      <p className="font-display text-3xl text-parchment">{t.request.sent}</p>
      <p className="mt-3 text-sm text-smoke">{state.message}</p>
      {onSuccessClose ? (
        <button
          type="button"
          onClick={onSuccessClose}
          className="mt-8 cursor-pointer bg-parchment px-5 py-3 text-[0.65rem] uppercase tracking-[0.2em] text-ink"
        >
          {t.close}
        </button>
      ) : null}
    </div>
  ) : (
    <form
      className={cn("space-y-4", className)}
      noValidate
      action={(formData) => {
        if (!validate(formData)) return;
        startTransition(async () => {
          const result = await submitMentorshipRequest(initial, formData);
          setState(result);
          if (!result.ok) {
            setFieldErrors({});
          }
        });
      }}
    >
      <Field
        label={t.request.name}
        name="name"
        required
        error={fieldErrors.name}
        autoComplete="name"
      />
      <Field
        label={t.request.email}
        name="email"
        type="email"
        required
        error={fieldErrors.email}
        autoComplete="email"
        inputMode="email"
      />
      <Field
        label={t.request.topic}
        name="topic"
        placeholder={t.request.topicPlaceholder}
        error={fieldErrors.topic}
      />
      <Field
        label={t.request.preferredTimes}
        name="preferredTimes"
        required
        placeholder={t.request.preferredPlaceholder}
        error={fieldErrors.preferredTimes}
      />
      <label className="block">
        <span className="text-[0.65rem] uppercase tracking-[0.2em] text-smoke">
          {t.request.message}
        </span>
        <textarea
          name="message"
          required
          rows={compact ? 3 : 4}
          placeholder={t.request.messagePlaceholder}
          className={cn(
            "mt-2 w-full border bg-ink px-3 py-2.5 text-base text-parchment outline-none focus:border-amber",
            fieldErrors.message ? "border-amber-bright" : "border-line",
          )}
        />
        {fieldErrors.message ? (
          <span className="mt-1.5 block text-xs text-amber-bright">
            {fieldErrors.message}
          </span>
        ) : null}
      </label>

      {state.message && !state.ok ? (
        <p className="text-sm text-amber-bright">{state.message}</p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="relative z-10 inline-flex w-full cursor-pointer items-center justify-center gap-2 bg-amber py-3.5 text-[0.7rem] uppercase tracking-[0.2em] text-ink transition hover:bg-amber-bright disabled:opacity-50"
      >
        <Send className="h-3.5 w-3.5" />
        {pending ? t.request.sending : t.request.send}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  error,
  autoComplete,
  inputMode,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  error?: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  return (
    <label className="block">
      <span className="text-[0.65rem] uppercase tracking-[0.2em] text-smoke">
        {label}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        className={cn(
          "mt-2 w-full border-b bg-transparent py-2.5 text-base text-parchment outline-none focus:border-amber",
          error ? "border-amber-bright" : "border-line",
        )}
      />
      {error ? (
        <span className="mt-1.5 block text-xs text-amber-bright">{error}</span>
      ) : null}
    </label>
  );
}
