import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const from =
  process.env.RESEND_FROM_EMAIL ?? "Isaac Odiana <onboarding@resend.dev>";
const adminInbox = process.env.ADMIN_EMAIL ?? "admin@isaacodiana.com";

export function isMailConfigured() {
  return Boolean(resend);
}

async function sendMail({
  to,
  subject,
  html,
}: {
  to: string | string[];
  subject: string;
  html: string;
}) {
  if (!resend) {
    console.info("[mail:skipped]", subject, to);
    return { skipped: true as const };
  }

  await resend.emails.send({ from, to, subject, html });
  return { skipped: false as const };
}

export async function sendBookingConfirmationEmail(input: {
  guestName: string;
  guestEmail: string;
  sessionTitle: string;
  slotLabel: string;
  bookingId: string;
}) {
  const guestHtml = `
    <div style="font-family:Georgia,serif;background:#0b0a09;color:#f2ebe1;padding:32px">
      <p style="letter-spacing:0.2em;text-transform:uppercase;color:#c6a15b;font-size:12px">Isaac Odiana Studio</p>
      <h1 style="font-weight:400;font-size:28px">Session reserved</h1>
      <p>Hi ${input.guestName},</p>
      <p>Your private session <strong>${input.sessionTitle}</strong> is reserved for <strong>${input.slotLabel}</strong>.</p>
      <p>Reference: ${input.bookingId}</p>
      <p style="color:#8b8074">Meeting link follows after payment confirmation.</p>
    </div>
  `;

  const adminHtml = `
    <div style="font-family:sans-serif;padding:24px">
      <h2>New tutoring booking</h2>
      <p><strong>${input.guestName}</strong> (${input.guestEmail})</p>
      <p>${input.sessionTitle}</p>
      <p>${input.slotLabel}</p>
      <p>ID: ${input.bookingId}</p>
    </div>
  `;

  await Promise.all([
    sendMail({
      to: input.guestEmail,
      subject: `Session reserved · ${input.sessionTitle}`,
      html: guestHtml,
    }),
    sendMail({
      to: adminInbox,
      subject: `New booking · ${input.sessionTitle}`,
      html: adminHtml,
    }),
  ]);
}

export async function sendMentorshipRequestEmail(input: {
  name: string;
  email: string;
  topic?: string;
  preferredTimes?: string;
  message: string;
}) {
  await sendMail({
    to: adminInbox,
    subject: `Mentorship request · ${input.name}`,
    html: `
      <div style="font-family:sans-serif;padding:24px">
        <h2>New mentorship request</h2>
        <p><strong>${input.name}</strong> (${input.email})</p>
        <p>Topic: ${input.topic ?? "—"}</p>
        <p>Preferred: ${input.preferredTimes ?? "—"}</p>
        <p>${input.message}</p>
      </div>
    `,
  });

  await sendMail({
    to: input.email,
    subject: "We received your mentorship request",
    html: `
      <div style="font-family:Georgia,serif;background:#0b0a09;color:#f2ebe1;padding:32px">
        <h1 style="font-weight:400">Request received</h1>
        <p>Hi ${input.name}, thanks for reaching out. The studio will follow up by email.</p>
      </div>
    `,
  });
}

export async function sendOrderPaidEmail(input: {
  email: string;
  orderId: string;
  totalLabel: string;
}) {
  await sendMail({
    to: input.email,
    subject: `Order confirmed · ${input.orderId}`,
    html: `
      <div style="font-family:Georgia,serif;background:#0b0a09;color:#f2ebe1;padding:32px">
        <h1 style="font-weight:400">Thank you</h1>
        <p>Your order <strong>${input.orderId}</strong> totaling ${input.totalLabel} is confirmed.</p>
      </div>
    `,
  });
}

export async function sendNewsletterWelcomeEmail(input: {
  email: string;
  name?: string;
}) {
  await sendMail({
    to: input.email,
    subject: "You’re on the studio list",
    html: `
      <div style="font-family:Georgia,serif;background:#0b0a09;color:#f2ebe1;padding:32px">
        <h1 style="font-weight:400">Welcome</h1>
        <p>Hi ${input.name ?? "there"}, you’ll receive releases, drops and session notes from Isaac Odiana.</p>
      </div>
    `,
  });
}

export async function sendStudioReplyEmail(input: {
  to: string;
  name: string;
  subject: string;
  message: string;
}) {
  await sendMail({
    to: input.to,
    subject: input.subject,
    html: `
      <div style="font-family:Georgia,serif;background:#0b0a09;color:#f2ebe1;padding:32px">
        <p style="letter-spacing:0.2em;text-transform:uppercase;color:#c6a15b;font-size:12px">Isaac Odiana Studio</p>
        <h1 style="font-weight:400;font-size:28px">Studio reply</h1>
        <p>Hi ${input.name},</p>
        <p style="white-space:pre-wrap;line-height:1.6">${input.message}</p>
        <p style="margin-top:24px;color:#8b8074">You can reply directly to this email.</p>
      </div>
    `,
  });
}

export async function sendAdminAlertEmail(input: {
  subject: string;
  title: string;
  body: string;
  href?: string;
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const link = input.href ? `${appUrl}${input.href}` : `${appUrl}/admin`;

  await sendMail({
    to: adminInbox,
    subject: input.subject,
    html: `
      <div style="font-family:sans-serif;padding:24px;background:#0b0a09;color:#f2ebe1">
        <p style="letter-spacing:0.2em;text-transform:uppercase;color:#c6a15b;font-size:12px">Studio alert</p>
        <h2 style="font-weight:400">${input.title}</h2>
        <p>${input.body}</p>
        <p><a href="${link}" style="color:#e0c48a">Open admin</a></p>
      </div>
    `,
  });
}

