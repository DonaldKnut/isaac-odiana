"use server";

import { z } from "zod";
import { sendNewsletterWelcomeEmail } from "@/lib/mail";
import { notifyAdmin } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";
import { getRequestLocale, tServer } from "@/lib/i18n/server";
import {
  emailSchema,
  firstZodError,
  optionalNameSchema,
} from "@/lib/validation";

export type NewsletterState = {
  ok: boolean;
  message: string;
};

export async function subscribeNewsletter(
  _prev: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  const locale = await getRequestLocale();
  const t = await tServer();

  const schema = z.object({
    email: emailSchema(locale),
    name: optionalNameSchema(locale),
  });

  const parsed = schema.safeParse({
    email: formData.get("email"),
    name: String(formData.get("name") ?? "") || undefined,
  });

  if (!parsed.success) {
    return { ok: false, message: firstZodError(parsed.error, locale) };
  }

  const email = parsed.data.email.toLowerCase();
  const name = parsed.data.name || undefined;

  const existing = await prisma.newsletterSubscriber.findUnique({
    where: { email },
  });

  if (existing?.active) {
    return { ok: true, message: t.messages.alreadySubscribed };
  }

  await prisma.newsletterSubscriber.upsert({
    where: { email },
    update: {
      active: true,
      name,
      source: "popup",
    },
    create: {
      email,
      name,
      source: "popup",
      active: true,
    },
  });

  await sendNewsletterWelcomeEmail({ email, name });

  await notifyAdmin({
    kind: "NEWSLETTER",
    title: "New newsletter subscriber",
    body: `${email} joined the broadcast list.`,
    href: "/admin/notifications",
    emailSubject: `Newsletter · ${email}`,
  });

  return { ok: true, message: t.messages.subscribed };
}
