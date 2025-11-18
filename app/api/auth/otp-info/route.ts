import { NextResponse } from "next/server";
import { authenticator } from "otplib";

export async function GET() {
  const secret = (process.env.OTP_GOOGLE || process.env.TOTP_SECRET || "JBSWY3DPEHPK3PXP").trim();
  const label = "CEPALAB:TOTP-User";
  const issuer = "CEPALAB";
  const otpauth = `otpauth://totp/${encodeURIComponent(label)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`;

  return NextResponse.json({ secret, otpauth });
}