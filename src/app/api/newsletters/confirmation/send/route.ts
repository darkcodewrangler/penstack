import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { NewsletterConfirmationTemplate } from "@/src/app/components/Emails/Newsletter/Confirmation";
import { db } from "@/src/db";
import { newsletters } from "@/src/db/schemas/newsletter.sql";
import { addHours } from "date-fns";
import crypto from "crypto";
import { sendEmail } from "@/src/lib/send-email";
import { getSettings } from "@/src/lib/settings";

export async function POST(req: NextRequest) {
  const { email, name } = await req.json();

  const verificationToken = crypto.randomBytes(32).toString("hex");
  const tokenExpiry = addHours(new Date(), 24);
  if (!email) {
    return NextResponse.json({
      error: "email is required",
    });
  }
  const { origin } = new URL(req.url);
  const appUrl = `${origin}`;
  const confirmationUrl = `${appUrl}/newsletter/confirm?token=${verificationToken}`;

  await db.insert(newsletters).values({
    email,
    name,
    verification_token: verificationToken,
    verification_token_expires: tokenExpiry,
  });

  const siteSettings = await getSettings();
  await sendEmail({
    from: `${siteSettings?.siteName?.value} Newsletter <${siteSettings?.newsletterEmailFrom?.value || siteSettings?.emailFrom?.value}>`,
    to: email,
    subject: "Confirm your newsletter subscription",
    react: NewsletterConfirmationTemplate({
      confirmationUrl,
      recipientEmail: email,
    }),
  });

  return NextResponse.json({
    message: "Please check your email to confirm subscription",
  });
}
