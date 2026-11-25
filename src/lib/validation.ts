import { z } from "zod";
import type { Locale } from "@/lib/cms/types";
import { getUiDictionary } from "@/lib/i18n/dictionary";

export function validationMessages(locale: Locale = "en") {
  return getUiDictionary(locale).validation;
}

export function emailSchema(locale: Locale = "en") {
  return z.string().trim().email(validationMessages(locale).email);
}

export function nameSchema(locale: Locale = "en") {
  const m = validationMessages(locale);
  return z.string().trim().min(2, m.nameShort).max(80, m.nameLong);
}

export function optionalNameSchema(locale: Locale = "en") {
  return z
    .string()
    .trim()
    .max(80)
    .optional()
    .or(z.literal(""));
}

export function slugSchema(locale: Locale = "en") {
  return z
    .string()
    .trim()
    .min(2)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, validationMessages(locale).slug);
}

export function urlSchema(locale: Locale = "en") {
  return z.string().trim().url(validationMessages(locale).url);
}

export function optionalUrlSchema(locale: Locale = "en") {
  return z
    .string()
    .trim()
    .url(validationMessages(locale).url)
    .optional()
    .or(z.literal(""));
}

export const positiveIntSchema = z.coerce.number().int().positive();
export const nonNegativeIntSchema = z.coerce.number().int().nonnegative();

export function firstZodError(error: z.ZodError, locale: Locale = "en") {
  return error.issues[0]?.message ?? validationMessages(locale).formCheck;
}
