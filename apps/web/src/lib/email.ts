import "server-only";

// Outbound transactional email.
//
// Sent over Resend's HTTP API rather than SMTP: this deploys to Vercel, and
// outbound SMTP from a serverless function is unreliable at best (blocked
// ports, connections that outlive the invocation). One fetch, no dependency
// to install, and the failure mode is an HTTP status we can read.
//
// Unconfigured is a supported state, not an error. Sites run fine without
// email — the owner still sees every request in the dashboard — so a missing
// key logs and returns { sent: false } instead of throwing. Nothing in the
// booking path may fail because a notification could not go out.

export type Mail = {
  to: string;
  subject: string;
  /** Plain text. Deliverability is better than a bare HTML mail, and these
   *  messages are four lines long. */
  text: string;
  replyTo?: string;
};

export type MailResult = { sent: boolean; reason?: string };

const ENDPOINT = "https://api.resend.com/emails";

export function emailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.MAIL_FROM);
}

export async function sendMail(mail: Mail): Promise<MailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM;

  if (!apiKey || !from) {
    console.info("[email] non configuré, message non envoyé:", mail.subject, "->", mail.to);
    return { sent: false, reason: "not_configured" };
  }
  if (!mail.to.includes("@")) {
    return { sent: false, reason: "bad_address" };
  }

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [mail.to],
        subject: mail.subject,
        text: mail.text,
        ...(mail.replyTo ? { reply_to: mail.replyTo } : {}),
      }),
    });

    if (!res.ok) {
      console.error("[email] envoi refusé", res.status, await res.text().catch(() => ""));
      return { sent: false, reason: `http_${res.status}` };
    }
    return { sent: true };
  } catch (error) {
    console.error("[email] envoi impossible", error);
    return { sent: false, reason: "network" };
  }
}

/** Fire-and-forget: a notification must never break the booking it announces. */
export async function sendMailQuietly(mail: Mail): Promise<void> {
  await sendMail(mail).catch(() => undefined);
}
